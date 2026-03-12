# Skinwise

**Skinwise** is a full-stack web application that provides personalized skincare product recommendations based on user preferences and skin concerns. The platform is built with a React frontend (`client`) and a Flask-based backend (`server`) powered by LangChain and Google Generative AI.

## Demo

<video src="https://github.com/Unil7105/Skinwise/raw/main/demo.mp4" controls muted playsinline>
  Your browser does not support the video tag.
</video>

## Project Structure

This repository is split into two main sections:

- **`client/`**: The frontend application built using **React** and **Vite**, styled with **Tailwind CSS**. 
- **`server/`**: The backend RESTful API built with **Flask**, integrating **ChromaDB** for vector similarity search and **Google Generative AI** for LLM-based matching.

## Getting Started

To get the application up and running locally, you'll need to run both the client and the server independently.

### 1. Starting the Backend (Server)

The server relies on Python and requires a Google Generative AI API Key.
1. Navigate to the `server` directory:  
   ```bash
   cd server
   ```
2. Create a virtual environment and activate it:  
   ```bash
   # On macOS/Linux
   python3 -m venv venv
   source venv/bin/activate

   # On Windows
   python -m venv venv
   venv\Scripts\activate
   ```
3. Install the dependencies:  
   ```bash
   pip install -r requirements.txt
   ```
4. Set your environment variables in a `.env` file (e.g., `GOOGLE_API_KEY=your_key`).
5. Start the Flask server:  
   ```bash
   python app.py
   ```

*For more details on endpoints or backend configuration, see the [Server README](./server/README.md).*

### 2. Starting the Frontend (Client)

The client is built with React + Vite.
1. Navigate to the `client` directory:  
   ```bash
   cd client
   ```
2. Install the dependencies:  
   ```bash
   npm install
   ```
3. Start the Vite development server:  
   ```bash
   npm run dev
   ```

*For more details on the frontend setup, see the [Client README](./client/README.md).*

## Features

- **Personalized Recommendations**: Analyzes skin type, concerns, and preferences to suggest a uniquely suited skincare routine.
- **Category-Based Matching**: Returns the best-matched products per category (e.g., Cleanser, Moisturizer, Serum).
- **Intelligent RAG**: LangChain orchestrates vector similarity searches using ChromaDB to match actual products.
- **Modern UI**: An intuitive, fast interface built using React, Radix UI components, and Tailwind styling.

## Technologies Used

### Frontend
- **Framework**: React 18, Vite
- **Styling**: Tailwind CSS, Class Variance Authority, Tailwind Merge, clsx
- **Components**: Radix UI Primitives, Lucide React Icons

### Backend
- **Framework**: Python 3.8+, Flask, Flask-CORS
- **AI & NLP**: LangChain, Google Generative AI, HuggingFace Embeddings
- **Database**: ChromaDB (Vector Database)
- **Data Loading**: Pandas (for parsing product data from Excel)

## License

[MIT License](LICENSE)
