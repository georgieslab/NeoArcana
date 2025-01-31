
import random
from .tarot_cards import cards

def get_three_cards(name, zodiac_sign, gender=None, interests=None, color_name=None, color_value=None):
    """Get three cards with their images and interpretations"""
    try:
        # Select three random cards
        selected_cards = random.sample(list(cards.keys()), 3)
        card_images = []
        combined_interpretation = []
        readings = []
        positions = ['Past', 'Present', 'Future']

        for i, card_name in enumerate(selected_cards):
            card_data = cards[card_name]
            position = positions[i]
            card_images.append(card_data["image"])

            # For now, create a simple interpretation without Claude
            # (we'll fix the Claude integration separately)
            reading = {
                "position": position,
                "cardName": card_name,
                "interpretation": f"""
                {position} Position - {card_name}:
                This card represents your {position.lower()} influences.
                Key themes: {', '.join(card_data['keywords'])}
                """
            }
            readings.append(reading)
            combined_interpretation.append(f"**{position} - {card_name}:**\n{reading['interpretation']}")

        result = {
            "cards": card_images,
            "cardNames": selected_cards,
            "interpretation": "\n\n".join(combined_interpretation),
            "affirmations": [
                "I embrace the wisdom of the past",
                "I am present in this moment",
                "I welcome the possibilities of the future"
            ],
            "readings": readings
        }

        print(f"Three card reading generated: {result}")
        return result

    except Exception as e:
        print(f"Error in get_three_cards: {e}")
        raise