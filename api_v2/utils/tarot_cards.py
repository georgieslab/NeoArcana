import random
import logging
from typing import List, Dict, Optional

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Major Arcana Card Definitions
MAJOR_ARCANA = [
    {
        "name": "The Fool",
        "image": "fool.jpg",
        "keywords": ["New beginnings", "Spontaneity", "Adventure", "Faith"],
        "type": "major",
        "element": "Air",
        "number": 0
    },
    {
        "name": "The Magician",
        "image": "magician.jpg",
        "keywords": ["Manifestation", "Resourcefulness", "Power", "Action"],
        "type": "major",
        "element": "Air",
        "number": 1
    },
    {
        "name": "The High Priestess",
        "image": "high_priestess.jpg",
        "keywords": ["Intuition", "Mystery", "Inner voice", "Unconscious"],
        "type": "major",
        "element": "Water",
        "number": 2
    },
    {
        "name": "The Empress",
        "image": "empress.jpg",
        "keywords": ["Fertility", "Nurturing", "Abundance", "Nature"],
        "type": "major",
        "element": "Earth",
        "number": 3
    },
    {
        "name": "The Emperor",
        "image": "emperor.jpg",
        "keywords": ["Authority", "Structure", "Control", "Leadership"],
        "type": "major",
        "element": "Fire",
        "number": 4
    },
    {
        "name": "The Hierophant",
        "image": "hierophant.jpg",
        "keywords": ["Tradition", "Convention", "Education", "Spirituality"],
        "type": "major",
        "element": "Earth",
        "number": 5
    },
    {
        "name": "The Lovers",
        "image": "lovers.jpg",
        "keywords": ["Love", "Harmony", "Relationships", "Choices"],
        "type": "major",
        "element": "Air",
        "number": 6
    },
    {
        "name": "The Chariot",
        "image": "chariot.jpg",
        "keywords": ["Willpower", "Determination", "Victory", "Control"],
        "type": "major",
        "element": "Water",
        "number": 7
    },
    {
        "name": "Strength",
        "image": "strength.jpg",
        "keywords": ["Courage", "Patience", "Compassion", "Inner strength"],
        "type": "major",
        "element": "Fire",
        "number": 8
    },
    {
        "name": "The Hermit",
        "image": "hermit.jpg",
        "keywords": ["Introspection", "Solitude", "Guidance", "Inner wisdom"],
        "type": "major",
        "element": "Earth",
        "number": 9
    },
    {
        "name": "Wheel of Fortune",
        "image": "wheel_of_fortune.jpg",
        "keywords": ["Change", "Cycles", "Destiny", "Fortune"],
        "type": "major",
        "element": "Fire",
        "number": 10
    },
    {
        "name": "Justice",
        "image": "justice.jpg",
        "keywords": ["Justice", "Fairness", "Truth", "Karma"],
        "type": "major",
        "element": "Air",
        "number": 11
    },
    {
        "name": "The Hanged Man",
        "image": "hanged_man.jpg",
        "keywords": ["Surrender", "Letting go", "New perspective", "Sacrifice"],
        "type": "major",
        "element": "Water",
        "number": 12
    },
    {
        "name": "Death",
        "image": "death.jpg",
        "keywords": ["Transformation", "Endings", "Change", "Transition"],
        "type": "major",
        "element": "Water",
        "number": 13
    },
    {
        "name": "Temperance",
        "image": "temperance.jpg",
        "keywords": ["Balance", "Moderation", "Harmony", "Purpose"],
        "type": "major",
        "element": "Fire",
        "number": 14
    },
    {
        "name": "The Devil",
        "image": "devil.jpg",
        "keywords": ["Bondage", "Materialism", "Detachment", "Breaking free"],
        "type": "major",
        "element": "Earth",
        "number": 15
    },
    {
        "name": "The Tower",
        "image": "tower.jpg",
        "keywords": ["Sudden change", "Upheaval", "Revelation", "Awakening"],
        "type": "major",
        "element": "Fire",
        "number": 16
    },
    {
        "name": "The Star",
        "image": "star.jpg",
        "keywords": ["Hope", "Faith", "Renewal", "Spirituality"],
        "type": "major",
        "element": "Air",
        "number": 17
    },
    {
        "name": "The Moon",
        "image": "moon.jpg",
        "keywords": ["Illusion", "Intuition", "Dreams", "Subconscious"],
        "type": "major",
        "element": "Water",
        "number": 18
    },
    {
        "name": "The Sun",
        "image": "sun.jpg",
        "keywords": ["Joy", "Success", "Positivity", "Vitality"],
        "type": "major",
        "element": "Fire",
        "number": 19
    },
    {
        "name": "Judgement",
        "image": "judgement.jpg",
        "keywords": ["Rebirth", "Inner calling", "Awakening", "Purpose"],
        "type": "major",
        "element": "Fire",
        "number": 20
    },
    {
        "name": "The World",
        "image": "world.jpg",
        "keywords": ["Completion", "Integration", "Achievement", "Travel"],
        "type": "major",
        "element": "Earth",
        "number": 21
    }
]

class TarotDeck:
    def __init__(self):
        self.cards = MAJOR_ARCANA.copy()
        self.current_spread = []
        logger.info("Tarot deck initialized with %d cards", len(self.cards))

    def shuffle(self) -> None:
        random.shuffle(self.cards)
        logger.debug("Deck shuffled")

    def draw_cards(self, count: int = 1) -> List[Dict]:
        try:
            if count > len(self.cards):
                raise ValueError(f"Cannot draw {count} cards from a deck of {len(self.cards)} cards")
            
            self.shuffle()
            drawn_cards = self.cards[:count]
            self.current_spread = drawn_cards
            
            logger.info(f"Drew {count} cards: {[card['name'] for card in drawn_cards]}")
            return drawn_cards
            
        except Exception as e:
            logger.error(f"Error drawing cards: {e}")
            return self._get_default_cards(count)

    def get_card_by_name(self, name: str) -> Optional[Dict]:
        try:
            return next((card for card in self.cards 
                        if card["name"].lower() == name.lower()), None)
        except Exception as e:
            logger.error(f"Error finding card {name}: {e}")
            return None

    def _get_default_cards(self, count: int) -> List[Dict]:
        default_cards = [
            {
                "name": "The Star",
                "image": "star.jpg",
                "keywords": ["Hope", "Inspiration", "Renewal"],
                "type": "major",
                "element": "Air"
            }
        ] * count
        logger.warning(f"Returning {count} default cards")
        return default_cards

# Create global instance
deck = TarotDeck()

# Helper functions
def get_random_cards(count: int = 1) -> List[Dict]:
    return deck.draw_cards(count)

def get_card_image(card_name: str) -> str:
    card = deck.get_card_by_name(card_name)
    if card:
        return f"/static/images/cards/{card['image']}"
    return "/static/images/cards/card_back.jpg"

def format_card_data(card: Dict) -> Dict:
    return {
        "name": card["name"],
        "image": f"/static/images/cards/{card['image']}",
        "keywords": card["keywords"],
        "element": card.get("element", "Unknown")
    }

__all__ = [
    'MAJOR_ARCANA',
    'TarotDeck',
    'deck',
    'get_random_cards',
    'get_card_image',
    'format_card_data'
]