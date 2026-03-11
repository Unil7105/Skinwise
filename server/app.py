from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import pandas as pd
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.documents import Document
import json
import re
from dotenv import load_dotenv


load_dotenv()
# Initialize Flask app and enable CORS
app = Flask(__name__)
CORS(app)  # Allows requests from all origins (adjust as needed)

# Set Google API key (replace with your actual key)
model = ChatGoogleGenerativeAI(model="gemini-2.5-flash", api_key=os.getenv("GOOGLE_API_KEY"))

# Define paths
current_dir = os.path.dirname(os.path.abspath(__file__))
file_path = os.path.join(current_dir, "excel", "products.xlsx")
persistent_directory = os.path.join(current_dir, "db", "chroma_db")

# Load unique categories from Excel
df = pd.read_excel(file_path)
categories = df['Category'].unique().tolist()

# Initialize embeddings for Chroma
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

# Initialize Chroma database with product data
def initialize_database():
    """Load product data from Excel and store in Chroma."""
    df = pd.read_excel(file_path)
    documents = df.fillna('').astype(str).to_dict(orient='records')
    text_documents = [Document(page_content=json.dumps(doc), metadata={"category": doc["Category"]}) for doc in documents]
    return Chroma.from_documents(text_documents, embeddings, persist_directory=persistent_directory)

if os.path.exists(persistent_directory) and os.listdir(persistent_directory):
    print("Loading existing Chroma database...")
    db = Chroma(persist_directory=persistent_directory, embedding_function=embeddings)
else:
    print("Creating new Chroma database...")
    db = initialize_database()

# Parse product content from JSON
def parse_document_content(content):
    """Convert JSON string to a dictionary with product details."""
    try:
        content_dict = json.loads(content)
        return {
            "name": content_dict.get("Product Name", ""),
            "category": content_dict.get("Category", ""),
            "description": content_dict.get("Description", ""),
            "image_url": content_dict.get("Product Image Url", "")
        }
    except Exception as e:
        print(f"Error parsing content: {str(e)}")
        return {"error": "Could not parse content"}

# Get LLM match score with robust parsing
def get_llm_score(user_query, product_content):
    """Evaluate product match using LLM and parse the score."""
    prompt = ChatPromptTemplate.from_template(
        "Given the user query '{query}' and product details '{product}', "
        "rate how well they match (0-100%). Respond with only the numerical score followed by '%':"
    )
    chain = prompt | model | StrOutputParser()
    try:
        response = chain.invoke({"query": user_query, "product": json.dumps(product_content)})
        match = re.search(r"(\d+(?:\.\d+)?)%", response)
        return float(match.group(1)) / 100 if match else 0.0
    except Exception as e:
        print(f"LLM error: {str(e)}")
        return 0.0

# Search endpoint to recommend one product per category
@app.route('/search', methods=['POST'])
def search():
    """Handle product recommendation requests, returning one product per category."""
    try:
        data = request.json
        user_query = (
            f"Find products for {data.get('skin-type', '')} skin with concerns: {data.get('skin-concerns', '')}, "
            f"preferences: {data.get('product-preferences', '')}, description: {data.get('skin-description', '')}, "
            f"mostly {data.get('spend-most-time', '')}."
        )
        
        final_results = []
        for category in categories:
            # Retrieve the top product for the category based on similarity
            category_results = db.similarity_search_with_relevance_scores(user_query, k=1, filter={"category": category})
            if category_results:  # Check if any results were returned
                best_doc, _ = category_results[0]
                parsed_content = parse_document_content(best_doc.page_content)
                if "error" not in parsed_content:
                    # Calculate LLM score but include the product regardless of the score
                    llm_score = get_llm_score(user_query, parsed_content)
                    parsed_content['match_score'] = llm_score * 100
                    final_results.append(parsed_content)
                    print(f"Added {parsed_content['name']} from {category} with score {llm_score * 100}%")
        
        # Sort results by match score in descending order
        final_results.sort(key=lambda x: x.get('match_score', 0), reverse=True)
        return jsonify({"status": "success", "results": final_results})
    except Exception as e:
        print(f"Search error: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500

# Ping endpoint to keep the server awake on free tiers
@app.route('/ping', methods=['GET'])
def ping():
    return jsonify({"status": "alive"}), 200

if __name__ == "__main__":
    # Use PORT environment variable if available, otherwise default to 5000
    port = int(os.environ.get("PORT", 5000))
    # Bind to 0.0.0.0 to allow external connections (required for Render)
    app.run(host="0.0.0.0", port=port, debug=True)