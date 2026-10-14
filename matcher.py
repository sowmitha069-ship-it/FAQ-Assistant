import re


def clean_words(text):
    text = text.lower()
    text = re.sub(r"[^\w\s]", "", text)
    return set(text.split())


def find_best_answer(user_question, faqs):
    user_words = clean_words(user_question)

    best_match = None
    best_score = 0

    for faq in faqs:
        faq_words = clean_words(faq["question"])

        common_words = user_words.intersection(faq_words)
        score = len(common_words)

        if score > best_score:
            best_score = score
            best_match = faq

    if best_match and best_score >= 2:
        return best_match["answer"]

    return None