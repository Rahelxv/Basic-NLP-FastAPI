# 🚀 Basic NLP Evaluator

A basic Natural Language Processing (NLP) data-processing tool integrated with full-stack web development using FastAPI. This project was created to provide fast and automated analysis for large amounts of text data efficiently.

Even with fundamental NLP techniques, text processing can already deliver valuable insights, including sentiment analysis using VADER, keyword and phrase extraction with N-grams, and linguistic analysis with SpaCy. The project demonstrates how simple NLP pipelines can be transformed into practical analytical tools through modern web development integration.

---
 
## ✨ Key Features
 
| Feature | Description |
|---|---|
| 📊 **Text Statistics** | Total characters, words, sentences, average word/sentence length |
| 🔤 **N-Gram Analysis** | Top 10 Unigrams, Bigrams, and Trigrams from your text corpus |
| 💬 **Sentiment Analysis** | VADER-based scoring with positive/negative/neutral classification |
| 🏷️ **POS Tagging** | Top nouns, verbs, and adjectives extracted via spaCy |
| 🌍 **Named Entity Recognition (NER)** | Identifies people and places mentioned in the text |
| 📁 **CSV File Input** | Upload any single-column CSV of text reviews/documents |
 
---
 
## 🛠️ Tech Stack
 
### Backend
- **[FastAPI](https://fastapi.tiangolo.com/)** — High-performance Python API framework
- **[NLTK](https://www.nltk.org/)** — Tokenization, lemmatization, stopword removal, n-gram generation
- **[spaCy](https://spacy.io/)** (`en_core_web_sm`) — POS tagging and Named Entity Recognition
- **[VADER Sentiment](https://github.com/cjhutto/vaderSentiment)** — Rule-based sentiment analysis tuned for social media/review text
- **[Pandas](https://pandas.pydata.org/)** — Data wrangling and transformation
- **[Regex / `re`](https://docs.python.org/3/library/re.html)** — Custom noise removal and text cleaning
### Frontend
- **JavaScript** (69.3% of codebase) — Client-side logic and UI rendering
- **HTML/CSS** — Interface layout
---

 
## 🏗️ Project Architecture
 
```
Basic-NLP-FastAPI/
├── Backend/
│   ├── main.py              # FastAPI app & API route definitions
│   ├── processing/
│   │   ├── ngram.py         # N-gram analysis + text statistics
│   │   ├── sentiment.py     # VADER sentiment analysis & keyword extraction
│   │   └── spacy_ner.py     # POS tagging & NER via spaCy
│   └── requirements.txt
├── Client/
│   ├── index.html           # Main UI
│   ├── app.js               # API calls & frontend logic
│   └── style.css
└── .gitignore
```
 
**Flow:**
```
User uploads CSV  →  FastAPI receives file
        ↓
  Text Cleaning (regex noise removal)
        ↓
  ┌─────────────────────────────────┐
  │  N-Gram   │ Sentiment │  spaCy  │
  │  Analysis │  (VADER)  │ POS/NER │
  └─────────────────────────────────┘
        ↓
  JSON Response  →  Frontend renders charts & tables
```
 ## 🚀 Getting Started On your Local Computer

### Prerequisites
*   **Python 3.9+**
*   **Node.js** (for running the frontend client)

---

### ⚙️ Backend Setup (FastAPI)

Open your terminal and run the following commands to set up the NLP engine:
```bash
# 1. Clone the repository
git clone [https://github.com/Rahelxv/Basic-NLP-FastAPI.git](https://github.com/Rahelxv/Basic-NLP-FastAPI.git)
cd Basic-NLP-FastAPI

# 2. Create a virtual environment
python -m venv venv

# 3. Activate the virtual environment
# For Windows:
venv\Scripts\activate
# For macOS/Linux:
# source venv/bin/activate

# 4. Install backend dependencies
pip install -r requirements.txt

# 5. Download required NLP resources (NLTK & SpaCy)
python -c "import nltk; nltk.download('stopwords'); nltk.download('punkt'); nltk.download('punkt_tab'); nltk.download('wordnet')"
python -m spacy download en_core_web_sm

# 6. Run the API server
uvicorn main:app --reload
```
---
### 💻 Frontend Setup (Client)
```bash
# 1. Navigate to the client directory
cd client

# 2. Install Node dependencies
npm install

# 3. Start the development server
npm run dev   # (or npm start, depending on your package.json script)

```
---
## 🙋 Author
 
**Rahelxv** — [GitHub Profile](https://github.com/Rahelxv)

