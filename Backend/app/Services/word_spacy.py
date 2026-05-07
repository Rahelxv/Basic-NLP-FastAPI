import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import spacy
import re
import pandas as pd
import io 


###Function needed###
# Download resources yang diperlukan
nltk.download('stopwords')
nltk.download('punkt')
nltk.download('punkt_tab')
nltk.download('wordnet')




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


def Spacy_analysis(data):
    df = pd.read_csv(io.BytesIO(data))
    df = df.iloc[:, [0]].dropna()
    df.columns = ['Review']
    df['Review'] = df['Review'].astype(str)

    # Pembersihan Dasar
    df["Review_Cleaned"] = df["Review"].apply(custom_cleaner)
    df["Review_Lower"] = df["Review_Cleaned"].str.lower()
    df["Review_no_stopword"] = df["Review_Lower"].apply(
        lambda x: ' '.join([word for word in x.split() if word not in english_stopwords])
    )
    df["Review_Tokenization"] = df["Review_no_stopword"].apply(word_tokenize)
    df["Review_Lemmatization"] = df["Review_Tokenization"].apply(smart_processor)

    # Flatten list (lebih cepat dari sum(..., []))
    token_clean_list = [word for sublist in df["Review_Lemmatization"] for word in sublist]

    ### POS Tagging & NER Prep ###
    nlp = spacy.load('en_core_web_sm')
    # Gunakan join hanya jika kamu butuh konteks kalimat untuk NER/POS
    spacy_doc = nlp(' '.join(token_clean_list))

    # Optimasi POS Tagging: Gunakan list comprehension
    pos_data = [{'token': token.text, 'pos_tag': token.pos_} for token in spacy_doc]
    pos_df = pd.DataFrame(pos_data)
        
    # token frequency count
    pos_df_counts = pos_df.groupby(['token','pos_tag']).size().reset_index(name='counts').sort_values(by='counts', ascending=False)    
    
    nouns = pos_df_counts[pos_df_counts.pos_tag == "NOUN"].head(10)
    verbs = pos_df_counts[pos_df_counts.pos_tag == "VERB"].head(10)
    adj = pos_df_counts[pos_df_counts.pos_tag == "ADJ"].head(10)

    ## NER ##
    # Optimasi NER: Gunakan list comprehension
    ner_data = [{'token': ent.text, 'ner_tag': ent.label_} for ent in spacy_doc.ents]
    ner_df = pd.DataFrame(ner_data)
            
    if not ner_df.empty:
        ner_df_counts = ner_df.groupby(['token','ner_tag']).size().reset_index(name='counts').sort_values(by='counts', ascending=False)
        people = ner_df_counts[ner_df_counts.ner_tag == "PERSON"].head(10)
        places = ner_df_counts[ner_df_counts.ner_tag == "GPE"].head(10)
    else:
        people = places = pd.DataFrame()

    return nouns, verbs, adj, people, places