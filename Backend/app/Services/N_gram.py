import nltk
import pandas as pd
import re
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords
import io

# Download resources yang diperlukan
""" nltk.download('stopwords')
nltk.download('punkt')
nltk.download('punkt_tab')
nltk.download('wordnet')
 """



# Inisialisasi global (lebih efisien)
lemmatizer = WordNetLemmatizer()
english_stopwords = set(stopwords.words('english'))

# Noise Removal
def custom_cleaner(text):
    if not isinstance(text, str):
        return ""

    # 1. Hapus URL
    text = re.sub(r'https?://\S+|www\.\S+', ' ', text)

    # 2. Hapus karakter spesial kecuali spasi, /, -, '.', ',', dan angka/huruf
    text = re.sub(r"[^a-zA-Z0-9\s/\-']", ' ', text)

    # 3. Normalisasi spasi
    text = re.sub(r'\s+', ' ', text).strip()

    return text

# Lemmatization (English only)
def smart_processor(tokens):
    if not tokens:
        return []
    # Langsung lemmatize karena asumsi bahasa Inggris
    return [lemmatizer.lemmatize(y) for y in tokens]

### NGRAM PROCESSED ###
def NLP_basic_ngram(data):
    # 1. Baca data & Preprocessing Awal//perlu di io.BytesIO untuk mensimulasikan bahwa itu file biasa karena pandas cuman bisa baca file
    df = pd.read_csv(io.BytesIO(data))
    df = df.iloc[:, [0]].dropna()
    df.columns = ['Review']
    df['Review'] = df['Review'].astype(str)
    
    # 2. Pembersihan Dasar
    df["Review_Cleaned"] = df["Review"].apply(custom_cleaner)
    
    # --- HITUNG STATISTIK (Sebelum Stopwords/Lemmatization) ---
    
    # Total Karakter (Termasuk spasi)
    total_chars = df["Review_Cleaned"].str.len().sum()
    
    # List Kata per Baris .split() memisahkan berdasarkan spasi
    list_kata_per_baris = df["Review_Cleaned"].str.split()
    
    # Total Kata
    total_words = list_kata_per_baris.str.len().sum()
    
    # Total Kalimat (Menggunakan nltk.sent_tokenize)
    # Catatan: Karena custom_cleaner menghapus titik, kita hitung dari kolom 'Review' asli yang sudah di-dropna
    total_sentences = df["Review"].apply(lambda x: len(nltk.sent_tokenize(x))).sum()
    
    # Rata-rata Panjang Kata (Jumlah karakter tanpa spasi / Jumlah kata)(rata-rata panjang kata dalam suatu)
    total_chars_no_space = df["Review_Cleaned"].apply(lambda x: len(x.replace(" ", ""))).sum()
    avg_word_length = total_chars_no_space / total_words if total_words > 0 else 0
    
    # Rata-rata Panjang Kalimat (Jumlah kata / Jumlah kalimat)
    avg_sentence_length = total_words / total_sentences if total_sentences > 0 else 0

    # --- LANJUTKAN PROSES N-GRAM SEPERTI BIASA ---
    # (Lowercase, Stopwords, Lemmatization...)
    df["Review_Lower"] = df["Review_Cleaned"].str.lower()
    df["Review_no_stopword"] = df["Review_Lower"].apply(
        lambda x: ' '.join([word for word in x.split() if word not in english_stopwords])
    )
    df["Review_Tokenization"] = df["Review_no_stopword"].apply(word_tokenize)
    df["Review_Lemmatization"] = df["Review_Tokenization"].apply(smart_processor)
    
    # Flatten tokens
    tokens_clean = [word for sublist in df['Review_Lemmatization'] for word in sublist]
    
    # Kata paling sering muncul (Top 1 Unigram)
    unigrams_series = pd.Series(nltk.ngrams(tokens_clean, 1)).value_counts()
    most_frequent_word = unigrams_series.idxmax()[0] if not unigrams_series.empty else None

    # Masukkan ke dalam dictionary untuk dikirim ke client
    stats = {
        "total_karakter": int(total_chars),
        "total_kata": int(total_words),
        "total_kalimat": int(total_sentences),
        "avg_word_length": round(avg_word_length, 2),
        "avg_sentence_length": round(avg_sentence_length, 2),
        "kata_terbanyak": most_frequent_word
    }
    
    # Hasil N-Gram (Unigram, Bigram, Trigram)
    ngrams_result = []
    for n in range(1, 4):
        # Tambahkan .head(10) untuk mengambil 10 besar saja
        counts = pd.Series(nltk.ngrams(tokens_clean, n)).value_counts().head(10)
        
        as_list = [
        {"text": " ".join(k), "count": int(v)} 
        for k, v in counts.items()
    ]
        ngrams_result.append(as_list)
            
    return stats, ngrams_result
