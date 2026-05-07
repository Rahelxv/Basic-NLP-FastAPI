import pandas as pd
import re
import nltk
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import io
from collections import Counter

""" nltk.download('stopwords') """
##vader definition
vader_analyzer = SentimentIntensityAnalyzer()
english_stopwords = set(stopwords.words('english'))

# Noise Removal
def custom_cleaner(text):
    if not isinstance(text, str):
        return ""

    # 1. Hapus URL terlebih dahulu (http/https atau www)
    text = re.sub(r'https?://\S+|www\.\S+', ' ', text)

    # 2. Hapus semua KECUALI:
    # Huruf (a-zA-Z), Angka (0-9), Spasi (\s), Slash (/), Titik (.), Koma (,), dan Strip (-)
    # Catatan: Tanda '-' diletakkan di paling akhir agar tidak dianggap sebagai rentang (range) regex
    text = re.sub(r"[^a-zA-Z0-9\s/\-']", ' ', text)

    # 3. Ubah spasi yang berlebih menjadi satu spasi saja
    text = re.sub(r'\s+', ' ', text).strip()

    return text

def get_sentiment_insights(data):
    # 1. Load Data
    df = pd.read_csv(io.BytesIO(data))
    df = df.iloc[:, [0]].dropna()
    df.columns = ['Review']
    df['Review'] = df['Review'].astype(str)

    # 2. Preprocessing & Sentiment Scoring
    # Gunakan custom_cleaner yang sudah kamu buat sebelumnya
    df['Cleaned'] = df['Review'].apply(custom_cleaner)
    
    # Hitung skor VADER
    df['score'] = df['Cleaned'].apply(lambda x: vader_analyzer.polarity_scores(x)['compound'])
    
    # Pelabelan
    def label_sentiment(s):
        if s >= 0.05: return 'positive'
        elif s <= -0.05: return 'negative'
        return 'neutral'
    
    df['label'] = df['score'].apply(label_sentiment)

    # --- INSIGHT A: Ringkasan untuk Pie/Bar Chart ---
    summary = df['label'].value_counts().reset_index()
    summary.columns = ['label', 'count']
    sentiment_summary = summary.to_dict(orient="records")

    # --- INSIGHT D: Review Paling Ekstrem ---
    # Ambil 3 review paling positif dan 3 paling negatif
    top_pos_reviews = df.sort_values('score', ascending=False).head(3)['Review'].tolist()
    top_neg_reviews = df.sort_values('score', ascending=True).head(3)['Review'].tolist()

    # --- INSIGHT Tambahan: Top Keywords per Sentimen ---
    def get_top_words(reviews_list, n=10):
        # Flatten semua kata dari list review tertentu
        words = [word for txt in reviews_list for word in txt.lower().split() 
                 if word not in english_stopwords and len(word) > 2]
        return [{"text": w, "count": c} for w, c in Counter(words).most_common(n)]

    neg_keywords = get_top_words(df[df['label'] == 'negative']['Cleaned'])
    pos_keywords = get_top_words(df[df['label'] == 'positive']['Cleaned'])

    return {
        "summary": sentiment_summary,
        "keywords": {
            "positive": pos_keywords,
            "negative": neg_keywords
        },
        "extremes": {
            "positive_samples": top_pos_reviews,
            "negative_samples": top_neg_reviews
        }
    }