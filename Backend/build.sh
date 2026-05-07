#!/usr/bin/env bash
# exit on error
set -o errexit

# Instal library dari requirements.txt
pip install -r requirements.txt

# Download data NLTK agar tersimpan permanen di folder build
python -m nltk.downloader stopwords punkt punkt_tab wordnet