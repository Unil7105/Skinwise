# Skincare Product Recommendation API

A Flask-based API that provides personalized skincare product recommendations based on user preferences and skin concerns. The application uses LangChain with Google Generative AI for advanced natural language processing and vector similarity search to match users with the most suitable products.

## Features

- **Personalized Recommendations**: Suggests skincare products based on skin type, concerns, and preferences
- **Category-Based Matching**: Returns one best-matched product per category
- **Relevance Scoring**: Ranks products using both similarity search and LLM-based matching
- **Cross-Origin Support**: Configured with CORS for integration with web frontends

## Prerequisites

- Python 3.8 or higher
- Google Generative AI API key
- Excel file with skincare product data (format specified below)

## Installation

1. **Clone the repository**

```bash
git clone https://github.com/Unil7105/Skinwise.git
cd Skinwise
```

2. **Set up a virtual environment**

```bash
# On Windows
python -m venv venv
venv\Scripts\activate

# On macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

3. **Install dependencies**

```bash
pip install -r requirements.txt
```

4. **Create environment variables**

Create a `.env` file in the root directory with your Google API key:

```
GOOGLE_API_KEY=your_google_api_key_here
```

5. **Prepare your product data**

Place your product data Excel file at `excel/products.xlsx` with the following columns:
- Product Name
- Category
- Description
- Product Image Url

## Directory Structure

```
├── app.py                  # Main application file
├── requirements.txt        # Python dependencies
├── .env                    # Environment variables (create this)
├── excel/                  # Directory for Excel data
│   └── products.xlsx       # Product data file
└── db/                     # Directory for vector database
    └── chroma_db/          # Persistent Chroma database
```

## Running the Application

Start the API server with:

```bash
python app.py
```

The server will run at `http://localhost:5000` by default.

## API Endpoints

### Product Recommendations

**Endpoint**: `/search`  
**Method**: POST  
**Content-Type**: application/json

**Request Body**:
```json
{
  "skin-type": "dry",
  "skin-concerns": "aging, dark spots",
  "product-preferences": "fragrance-free, natural",
  "skin-description": "sensitive and flaky in winter",
  "spend-most-time": "indoors"
}
```

**Response**:
```json
{
  "status": "success",
  "results": [
    {
      "name": "Product Name",
      "category": "Cleanser",
      "description": "Product description",
      "image_url": "https://example.com/image.jpg",
      "match_score": 85.5
    },
    ...
  ]
}
```

## Customization

### Adding New Categories

The application automatically detects categories from your Excel file. To add new categories, simply include them in your product data.

### Adjusting Search Parameters

To modify how product matching works, you can adjust the following in `app.py`:

- The prompt template in `get_llm_score()` function
- The query construction in the `/search` endpoint
- The number of results per category (default is 1)

## Troubleshooting

- **Database Errors**: If you encounter database issues, try deleting the `db/chroma_db` directory and restarting the application to rebuild the database.
- **API Key**: Ensure your Google API key has access to the required Generative AI models.
- **Excel Format**: Verify your product data Excel file has the correct column names.

## License

[MIT License](LICENSE)

## Acknowledgements

- [Flask](https://flask.palletsprojects.com/) - Web framework
- [LangChain](https://www.langchain.com/) - LLM integration framework
- [Google Generative AI](https://ai.google.dev/) - Large language model provider
- [ChromaDB](https://www.trychroma.com/) - Vector database