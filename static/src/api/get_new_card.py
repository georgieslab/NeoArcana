import random
from .tarot_gemini_api import get_interpretation  # Keep using Gemini for now
from .tarot_cards import cards

def get_new_card(name, zodiac_sign, gender=None, interests=None, color_name=None, color_value=None):
    card_name = random.choice(list(cards.keys()))
    card_data = cards[card_name]
    interpretation = get_interpretation(
        card_name=card_name,
        name=name,
        zodiac_sign=zodiac_sign,
        gender=gender,
        interests=interests,
        color_name=color_name,
        color_value=color_value
    )
    
    return {
        "cardName": card_name,
        "cardImage": card_data["image"],
        "interpretation": interpretation["interpretation"],
        "affirmations": interpretation["affirmations"]
    }