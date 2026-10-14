import streamlit as st
import json
from pathlib import Path
import re

st.set_page_config(page_title="FAQ Assistant", page_icon="🤖")

st.title("🤖 FAQ Assistant")
st.write("Ask your question and I will try to help you.")

# Project folder
BASE_DIR = Path(__file__).parent

# FAQ file
faq_file = BASE_DIR / "data" / "faqs.json"

# Load FAQ data
with open(faq_file, "r", encoding="utf-8") as file:
    faqs = json.load(file)


# Categories
categories = sorted(set(faq["category"] for faq in faqs))

selected_category = st.selectbox(
    "Select a category:",
    ["All"] + categories
)


# Clean text
def clean_text(text):
    text = text.lower()
    text = re.sub(r"[^\w\s]", "", text)
    return text


# Find answer
def find_answer(question):
    user_text = clean_text(question)
    user_words = set(user_text.split())

    for faq in faqs:

        # Category filter
        if selected_category != "All" and faq["category"] != selected_category:
            continue

        faq_question = clean_text(faq["question"])
        faq_words = set(faq_question.split())

        # Exact / partial matching
        if user_text in faq_question or faq_question in user_text:
            return faq["answer"]

        # Keyword matching
        if len(user_words.intersection(faq_words)) >= 2:
            return faq["answer"]

    return None


# FAQ list
st.subheader("Frequently Asked Questions")

for faq in faqs:
    if selected_category == "All" or faq["category"] == selected_category:
        st.write("•", faq["question"])


# Question input
question = st.text_input("Enter your question:")

if question:
    answer = find_answer(question)

    if answer:
        st.success(answer)
    else:
        st.warning("Sorry, I couldn't find an answer to your question.")