import os
from anthropic import Anthropic
from datetime import datetime
import logging
from typing import Dict, List, Optional, Any
from typing import Dict, List, Optional, Any, TypedDict
from .tarot_cards import get_random_cards 
from .language_config import get_language_config
import time

class ColorDict(TypedDict):
    name: str
    value: str

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

color_insights = {
    'Cosmic Purple': {
        'energy': 'spiritual awareness, mystical connections, and divine insight',
        'traits': 'intuition, wisdom, and higher consciousness',
        'guidance': 'trust your inner wisdom and spiritual guidance'
    },
    'Mystic Blue': {
        'energy': 'truth, serenity, and deep communication',
        'traits': 'clarity, peace, and emotional depth',
        'guidance': 'express your truth and embrace inner peace'
    },
    'Celestial Pink': {
        'energy': 'unconditional love, compassion, and emotional healing',
        'traits': 'nurturing, tenderness, and heart-centered wisdom',
        'guidance': 'open your heart to love and gentle healing'
    },
    'Astral Gold': {
        'energy': 'divine success, abundance, and solar power',
        'traits': 'confidence, achievement, and personal strength',
        'guidance': 'shine your light and embrace your power'
    },
    'Ethereal Green': {
        'energy': 'growth, healing, and natural harmony',
        'traits': 'balance, renewal, and heart chakra energy',
        'guidance': 'nurture your growth and embrace renewal'
    },
    'Spiritual Orange': {
        'energy': 'creativity, joy, and sacral chakra power',
        'traits': 'enthusiasm, pleasure, and creative flow',
        'guidance': 'express your creativity and embrace joy'
    },
    'Divine Violet': {
        'energy': 'transformation, crown chakra connection, and spiritual mastery',
        'traits': 'enlightenment, divine connection, and psychic abilities',
        'guidance': 'embrace your spiritual gifts and highest path'
    },
    'Cosmic Teal': {
        'energy': 'emotional healing, intuitive flow, and throat chakra expression',
        'traits': 'communication, healing, and emotional clarity',
        'guidance': 'speak your truth with healing intention'
    },
    'Luna Silver': {
        'energy': 'moon magic, intuition, and divine feminine power',
        'traits': 'reflection, psychic ability, and emotional wisdom',
        'guidance': 'trust your intuitive lunar wisdom'
    },
    'Mars Red': {
        'energy': 'passion, courage, and root chakra strength',
        'traits': 'motivation, action, and vital force',
        'guidance': 'take courageous action aligned with your passion'
    },
    'Neptune Blue': {
        'energy': 'psychic vision, dreams, and spiritual insight',
        'traits': 'intuition, mystical awareness, and divine connection',
        'guidance': 'trust your dreams and psychic insights'
    },
    'Venus Rose': {
        'energy': 'love, beauty, and heart-centered harmony',
        'traits': 'romance, self-love, and artistic expression',
        'guidance': 'embrace love in all its forms'
    },
    'Jupiter Bronze': {
        'energy': 'expansion, abundance, and spiritual growth',
        'traits': 'wisdom, good fortune, and optimism',
        'guidance': 'expand into your highest potential'
    },
    'Saturn Lavender': {
        'energy': 'spiritual discipline, divine structure, and karmic wisdom',
        'traits': 'responsibility, mastery, and inner authority',
        'guidance': 'build strong foundations for spiritual growth'
    },
    'Mercury Gray': {
        'energy': 'communication balance, mental clarity, and wisdom',
        'traits': 'analysis, neutrality, and clear thinking',
        'guidance': 'find balance in thought and communication'
    },
    'Pluto Indigo': {
        'energy': 'transformation, third eye power, and rebirth',
        'traits': 'mystery, regeneration, and deep insight',
        'guidance': 'embrace transformation and spiritual depth'
    },
    'Eclipse Black': {
        'energy': 'mystery, protection, and void meditation',
        'traits': 'power, boundaries, and inner knowing',
        'guidance': 'explore the mysteries within'
    },
    'Aurora Green': {
        'energy': 'heart healing, nature connection, and new beginnings',
        'traits': 'growth, vitality, and fresh starts',
        'guidance': 'embrace new growth and possibilities'
    },
    'Stellar Yellow': {
        'energy': 'solar plexus power, joy, and personal confidence',
        'traits': 'optimism, personal power, and mental clarity',
        'guidance': 'shine your inner light confidently'
    },
    'Comet White': {
        'energy': 'purity, clarity, and divine light',
        'traits': 'truth, protection, and higher consciousness',
        'guidance': 'connect with pure divine light'
    },
    'Nebula Coral': {
        'energy': 'life force, vitality, and emotional warmth',
        'traits': 'nurturing, comfort, and gentle strength',
        'guidance': 'nurture your inner flame'
    },
    'Galactic Cyan': {
        'energy': 'healing flow, celestial connection, and clear vision',
        'traits': 'clarity, healing, and spiritual sight',
        'guidance': 'flow with healing cosmic energies'
    },
    'Orbit Orange': {
        'energy': 'motivation, pleasure, and creative power',
        'traits': 'enthusiasm, sensuality, and artistic expression',
        'guidance': 'express your creative passion'
    },
    'Asteroid Gray': {
        'energy': 'grounding, neutrality, and ancient wisdom',
        'traits': 'stability, balance, and solid foundations',
        'guidance': 'find strength in balance and wisdom'
    }
}

interest_insights = {
    'Love': {
        'focus': 'romantic connections, relationships, and heart-centered growth',
        'guidance': 'understanding love patterns, attraction, and emotional bonds',
        'key_aspects': [
            'romantic relationships',
            'self-love practices',
            'healing past connections',
            'future partnership potential',
            'emotional boundaries',
            'relationship karma'
        ],
        'related_cards': ['The Lovers', 'Two of Cups', 'Ten of Cups', 'Ace of Cups']
    },

    'Career': {
        'focus': 'professional growth, ambitions, and life purpose',
        'guidance': 'career path clarity, success strategies, and professional development',
        'key_aspects': [
            'career opportunities',
            'professional goals',
            'work-life balance',
            'leadership potential',
            'financial prosperity',
            'professional relationships'
        ],
        'related_cards': ['The Emperor', 'King of Pentacles', 'Eight of Pentacles', 'The World']
    },

    'Spiritual Growth': {
        'focus': 'inner wisdom, divine connection, and soul purpose',
        'guidance': 'deepening spiritual awareness, intuitive development, and higher consciousness',
        'key_aspects': [
            'spiritual practices',
            'intuitive development',
            'karmic lessons',
            'divine guidance',
            'meditation insights',
            'soul purpose'
        ],
        'related_cards': ['The High Priestess', 'The Hierophant', 'The Star', 'The Moon']
    },

    'Personal Development': {
        'focus': 'self-improvement, growth mindset, and personal transformation',
        'guidance': 'personal growth strategies, overcoming challenges, and achieving goals',
        'key_aspects': [
            'self-improvement',
            'habit transformation',
            'personal challenges',
            'goal achievement',
            'confidence building',
            'life direction'
        ],
        'related_cards': ['The Magician', 'The Chariot', 'Strength', 'The Sun']
    },

    'Health': {
        'focus': 'well-being, vitality, and holistic health',
        'guidance': 'energy balance, wellness practices, and healing insights',
        'key_aspects': [
            'energy levels',
            'wellness practices',
            'stress management',
            'mind-body connection',
            'healing processes',
            'lifestyle choices'
        ],
        'related_cards': ['The Empress', 'Temperance', 'The Star', 'Nine of Pentacles']
    },

    'Family': {
        'focus': 'family bonds, domestic harmony, and generational healing',
        'guidance': 'family dynamics, home life, and nurturing connections',
        'key_aspects': [
            'family relationships',
            'home environment',
            'parenting insights',
            'family healing',
            'ancestral connections',
            'domestic harmony'
        ],
        'related_cards': ['Ten of Pentacles', 'Ten of Cups', 'The Empress', 'Six of Cups']
    },

    'Creativity': {
        'focus': 'artistic expression, creative flow, and inspiration',
        'guidance': 'creative projects, artistic development, and inspiration sources',
        'key_aspects': [
            'creative expression',
            'artistic projects',
            'inspiration sources',
            'creative blocks',
            'artistic vision',
            'creative success'
        ],
        'related_cards': ['The Empress', 'Three of Pentacles', 'Seven of Cups', 'Ace of Wands']
    },

    'Travel': {
        'focus': 'journeys, exploration, and life adventures',
        'guidance': 'travel opportunities, journey timing, and exploration insights',
        'key_aspects': [
            'upcoming journeys',
            'travel timing',
            'destination choices',
            'journey purposes',
            'travel experiences',
            'life adventures'
        ],
        'related_cards': ['The Fool', 'Eight of Wands', 'Six of Swords', 'The World']
    },

    'Education': {
        'focus': 'learning, knowledge acquisition, and academic success',
        'guidance': 'study paths, learning opportunities, and knowledge development',
        'key_aspects': [
            'study choices',
            'learning paths',
            'academic success',
            'knowledge areas',
            'skill development',
            'educational goals'
        ],
        'related_cards': ['The Hierophant', 'Page of Pentacles', 'Eight of Pentacles', 'Two of Pentacles']
    },

    'Finance': {
        'focus': 'financial abundance, wealth building, and prosperity',
        'guidance': 'money management, abundance attraction, and financial decisions',
        'key_aspects': [
            'financial opportunities',
            'money decisions',
            'abundance mindset',
            'wealth building',
            'financial security',
            'prosperity path'
        ],
        'related_cards': ['King of Pentacles', 'Nine of Pentacles', 'Ace of Pentacles', 'The Emperor']
    },

    'Social Life': {
        'focus': 'friendships, social connections, and community',
        'guidance': 'social relationships, community building, and networking',
        'key_aspects': [
            'friendship dynamics',
            'social circles',
            'community connections',
            'social opportunities',
            'group activities',
            'networking paths'
        ],
        'related_cards': ['Three of Cups', 'Four of Wands', 'Six of Cups', 'The Star']
    }
}

class ClaudeTarotAPI:
    def __init__(self, api_key: str):
        """Initialize Claude Tarot API handler"""
        try:
            if not api_key:
                raise ValueError("API key is required")
                
            self.client = Anthropic(api_key=api_key)
            self.model = "claude-3-5-sonnet-20241022"
            logger.info("Claude API initialized successfully")
        except Exception as e:
            logger.error(f"Error initializing Anthropic client: {e}")
            raise

    def get_language_config(iso_code: str) -> dict:
        """Get comprehensive language configuration.
        
        Args:
            iso_code (str): ISO language code (e.g. 'ka', 'ru', 'ko')
            
        Returns:
            dict: Language configuration including Claude name and validation settings
        """
        BASE_CONFIG = {
            'en': {
                'claude_name': 'English',
                'script_validation': None,
                'min_chars': 0,
                'name': 'English'
            },
            'ka': {
                'claude_name': 'Georgian', 
                'script_validation': 'georgian',
                'min_chars': 10,
                'name': 'ქართული'
            },
            'ru': {
                'claude_name': 'Russian',
                'script_validation': 'cyrillic',
                'min_chars': 10,
                'name': 'Русский'
            },
            'ko': {
                'claude_name': 'Korean',
                'script_validation': 'hangul',
                'min_chars': 10,
                'name': '한국어'
            },
            'zh': {
                'claude_name': 'Chinese',
                'script_validation': 'chinese',
                'min_chars': 5,
                'name': '中文'
            },
            'ja': {
                'claude_name': 'Japanese',
                'script_validation': 'japanese',
                'min_chars': 5,
                'name': '日本語'
            },
            'es': {
                'claude_name': 'Spanish',
                'script_validation': None,
                'min_chars': 0,
                'name': 'Español'
            },
            'fr': {
                'claude_name': 'French',
                'script_validation': None,
                'min_chars': 0,
                'name': 'Français'
            },
            'de': {
                'claude_name': 'German',
                'script_validation': None,
                'min_chars': 0,
                'name': 'Deutsch'
            }
        }

        # Unicode ranges for script validation
        SCRIPT_RANGES = {
            'georgian': [(0x10A0, 0x10FF)],  # Georgian
            'cyrillic': [(0x0400, 0x04FF)],  # Cyrillic
            'hangul': [(0xAC00, 0xD7AF)],    # Korean Hangul
            'chinese': [(0x4E00, 0x9FFF)],   # Chinese
            'japanese': [
                (0x3040, 0x309F),  # Hiragana
                (0x30A0, 0x30FF),  # Katakana
                (0x4E00, 0x9FFF)   # Kanji
            ]
        }

        def create_validation_set(script_type):
            """Create a set of valid characters for a given script"""
            if not script_type or script_type not in SCRIPT_RANGES:
                return None
                
            chars = set()
            for start, end in SCRIPT_RANGES[script_type]:
                chars.update(chr(i) for i in range(start, end + 1))
            return chars

        # Get base config or default to English
        config = BASE_CONFIG.get(iso_code.lower(), BASE_CONFIG['en'])
        
        # Add validation set if script validation is specified
        if config['script_validation']:
            config['script_validation'] = create_validation_set(config['script_validation'])

        return config

    def get_numerology_insight(self, numbers: Dict) -> str:
        """Generate numerology insight based on user's numbers"""
        try:
            prompt = f"""As a cosmic numerology expert, create a short, personalized insight combining the energies of these numbers:
            - Favorite Number: {numbers.get('favoriteNumber')}
            - Lucky Number: {numbers.get('luckyNumber')}
            - Guidance Number: {numbers.get('guidanceNumber')}

            Focus on the symbolic meaning and energy of these numbers in combination.
            Keep the response mystical but concise (max 2 sentences).
            Do not mention "favorite number", "lucky number", or "guidance number" in the response.
            Instead, weave their meanings together into a unified cosmic message."""

            response = self.client.messages.create(
                model=self.model,
                max_tokens=150,
                messages=[{"role": "user", "content": prompt}]
            )

            return response.content[0].text.strip()

        except Exception as e:
            logger.error(f"Error generating numerology insight: {e}")
            return "The cosmic numbers align to guide your path today."
        
    
    
    def _normalize_card_image(self, image_path: str) -> str:
        """Ensure consistent image path format"""
        if not image_path:
            return '/static/images/cards/card-back.jpg'
            
        # Strip any existing path and keep just the filename
        filename = image_path.split('/')[-1]
        return f'/static/images/cards/{filename}'
    
    def get_three_card_reading(
    self,
    name: str,
    zodiac_sign: str,
    language: str = 'en',
    color: Dict = None,
    interests: List[str] = None,
    gender: str = None,
    **kwargs
    ) -> Dict[str, Any]:
        """Get three-card spread interpretation"""
        try:
            from .tarot_cards import get_random_cards
            
            selected_cards = get_random_cards(3)
            card_images = [self._normalize_card_image(card['image']) for card in selected_cards]
            card_names = [card['name'] for card in selected_cards]
            
            cards_info = [
                f"{card['name']} ({', '.join(card['keywords'])})"
                for card in selected_cards
            ]

            # Build personal profile
            personal_profile = f"As a {zodiac_sign}"
            if gender:
                personal_profile += f" who identifies as {gender}"
            if color and color.get('name') in color_insights:
                color_data = color_insights[color['name']]
                personal_profile += f", your attraction to {color['name']} reveals your connection to {color_data['energy']}. This reflects your natural {color_data['traits']}, and suggests you should {color_data['guidance']}"

            # Build interests guidance
            interests_guidance = ""
            if interests:
                interest_sections = []
                for interest in interests:
                    if interest in interest_insights:
                        insight = interest_insights[interest]
                        interest_sections.append(f"""
                        Regarding {interest}:
                        - Focus on {insight['focus']}
                        - Consider {insight['guidance']}
                        - Key aspects: {', '.join(insight['key_aspects'][:3])}
                        """)
                if interest_sections:
                    interests_guidance = "\nPersonalized Interest Guidance:\n" + "\n".join(interest_sections)
            try:
                prompt = f"""You are creating a deeply personalized premium tarot reading experience for {name}.

                Personal Essence:
                {personal_profile}

                {interests_guidance if interests_guidance else ""}

                Important Instructions:
                1. ALWAYS use [SECTION_1], [SECTION_2], [SECTION_3] markers exactly as shown - DO NOT translate these markers
                2. Provide the reading content in {language} language
                3. Maintain a professional yet mystical tone
                4. Connect insights to the querent's specific interests and traits
                5. Weave their color affinity into metaphors and insights
                6. Provide actionable guidance aligned with their focus areas

                The cards revealed for {name}'s journey are:
                Timeline Positions:
                [SECTION_1] - Your Past Path: {cards_info[0]}
                [SECTION_2] - Your Present Moment: {cards_info[1]}
                [SECTION_3] - Your Emerging Future: {cards_info[2]}

                Create a premium reading that:
                - Honors {name}'s {zodiac_sign} nature
                {f'- Connects with their {color["name"]} energy' if color else ''}
                {f'- Addresses their interests in {", ".join(interests)}' if interests else ''}
                - Provides specific insights and practical guidance
                - Empowers and inspires positive action
                - Maintains professional mystical atmosphere

                Format using these EXACT markers:
                [SECTION_1]
                (Past interpretation with practical insights tailored to their profile)
                [/SECTION_1]
                [SECTION_2]
                (Present interpretation with actionable guidance aligned with their interests)
                [/SECTION_2]
                [SECTION_3]
                (Future interpretation with empowering direction focused on their goals)
                [/SECTION_3]

                End with a synthesis that:
                1. Connects all three cards
                2. Relates to their chosen color's energy
                3. Addresses their specific interests
                4. Provides final guidance aligned with their zodiac qualities"""

                response = self.client.messages.create(
                    model=self.model,
                    max_tokens=2048,
                    messages=[{"role": "user", "content": prompt}]
                )
                
                interpretation = response.content[0].text

            except Exception as e:
                logger.error(f"Claude interpretation failed: {e}")
                # Create fallback interpretation
                sections = []
                positions = ['SECTION_1', 'SECTION_2', 'SECTION_3']
                for pos, card in zip(positions, selected_cards):
                    sections.append(f"""
                    [{pos}]
                    The {card['name']} appears in your reading.
                    Key themes: {', '.join(card['keywords'])}
                    As a {zodiac_sign}, focus on {card['keywords'][0]} and {card['keywords'][1]}.
                    {f'Your {color["name"]} energy suggests: {color_insights.get(color["name"], {}).get("guidance", "")}' if color else ''}
                    [/{pos}]
                    """)
                interpretation = "\n".join(sections)

            # Generate personalized affirmations
            affirmations = [
                "I embrace the wisdom of my journey",
                "I am aligned with my present power",
                "I welcome the possibilities ahead"
            ]
            if color:
                affirmations.append(f"I channel the energy of {color['name']} in my path")
            if interests:
                for interest in interests[:2]:
                    affirmations.append(f"I am growing in my {interest.lower()} journey")

            result = {
                "cards": card_images,
                "cardNames": card_names,
                "interpretation": interpretation,
                "affirmations": affirmations
            }
            
            return result
            
        except Exception as e:
            logger.error(f"Error in get_three_card_reading: {e}")
            raise
        

    def get_single_card_reading(
        self,
        name: str,
        zodiac_sign: str,
        language: str = 'en',
        numbers: Dict = None,
        color: Dict = None,
        interests: List[str] = None,
        **kwargs
    ) -> Dict[str, Any]:
        """Get single card reading with proper language handling"""
        try:
            config = get_language_config(language)
            logger.info(f"Generating reading in {config['claude_name']} for {name}")
            
            selected_card = get_random_cards(1)[0]
            
            # Build the prompt with proper language instruction
            prompt = f"""Create a personalized daily tarot reading for {name}, who is a {zodiac_sign}.

            Critical Instructions:
            1. Respond ENTIRELY in {config['claude_name']} language
            2. Use proper grammar and natural phrasing for {config['claude_name']}
            3. Keep a mystical yet professional tone
            4. Connect with their zodiac energy
            
            The card drawn is: {selected_card['name']}
            Key themes: {', '.join(selected_card['keywords'])}
            """
            
            # Add numerology section if provided
            if numbers and all(numbers.values()):
                prompt += f"""
                
                Include these numerological influences in your reading:
                - {numbers.get('favoriteNumber')} 
                - {numbers.get('luckyNumber')}
                - {numbers.get('guidanceNumber')}
                """
                
            # Add color influence if provided
            if color and color.get('name'):
                prompt += f"\nConsider their connection to {color['name']} energy."
                
            # Add interests if provided
            if interests:
                prompt += f"\nFocus areas: {', '.join(interests)}"

            response = self.client.messages.create(
                model=self.model,
                max_tokens=1024,
                messages=[{"role": "user", "content": prompt}]
            )
            
            # Validate the response
            interpretation = self.validate_reading_response(
                response.content[0].text,
                language
            )
            
            # Generate affirmations in the same language
            affirmation_prompt = f"""Create a brief, empowering affirmation in {config['claude_name']} 
            that connects with the energy of {selected_card['name']}."""
            
            affirmation_response = self.client.messages.create(
                model=self.model,
                max_tokens=100,
                messages=[{"role": "user", "content": affirmation_prompt}]
            )
            
            affirmation = self.validate_reading_response(
                affirmation_response.content[0].text,
                language
            )

            return {
                "cardName": selected_card['name'],
                "cardImage": self._normalize_card_image(selected_card['image']),
                "interpretation": interpretation,
                "affirmations": [affirmation],
                "language": language
            }
            
        except Exception as e:
            logger.error(f"Error in single card reading: {e}")
            raise

    def validate_reading_response(self, text: str, language: str) -> str:
        """Enhanced validation with proper script checking"""
        if not text:
            logger.warning("Empty reading response received")
            raise ValueError("Empty reading response")
            
        config = get_language_config(language)
        logger.info(f"Validating {language} response with config: {config['claude_name']}")
        
        # Script validation for supported languages
        if config['script_validation']:
            text_chars = set(text.lower())
            matching_chars = config['script_validation'].intersection(text_chars)
            
            if len(matching_chars) < config['min_chars']:
                logger.warning(
                    f"Invalid {language} response detected - found only "
                    f"{len(matching_chars)} script characters, minimum required: {config['min_chars']}"
                )
                raise ValueError(f"Invalid {language} response - insufficient script characters")
        
        # Clean up any markdown or extra formatting
        text = text.strip()
        text = text.replace('```', '')
        
        return text

    def handle_error_response(self, error: Exception, name: str, zodiac_sign: str) -> str:
        """Generate fallback interpretation for error cases"""
        return f"""
        Dear {name},
        
        As a {zodiac_sign}, your reading suggests a time of reflection and insight.
        While we explore the deeper meanings, focus on your inner wisdom and trust your intuition.
        
        Key guidance: Stay open to the messages around you and trust your path forward.
        """

    def translate_section_titles(self, language: str) -> Dict[str, str]:
        """Get section titles in specified language"""
        translations = {
           
    'en': {
        'past': 'Past',
        'present': 'Present',
        'future': 'Future'
    },
    'ka': {
        'past': 'წარსული',
        'present': 'აწმყო',
        'future': 'მომავალი'
    },
    'es': {
        'past': 'Pasado',
        'present': 'Presente',
        'future': 'Futuro'
    },
    'fr': {
        'past': 'Passé',
        'present': 'Présent',
        'future': 'Futur'
    },
    'de': {
        'past': 'Vergangenheit',
        'present': 'Gegenwart',
        'future': 'Zukunft'
    },
    'it': {
        'past': 'Passato',
        'present': 'Presente',
        'future': 'Futuro'
    },
    'pt': {
        'past': 'Passado',
        'present': 'Presente',
        'future': 'Futuro'
    },
    'ru': {
        'past': 'Прошлое',
        'present': 'Настоящее',
        'future': 'Будущее'
    },
    'zh': {
        'past': '过去',
        'present': '现在',
        'future': '未来'
    },
    'ja': {
        'past': '過去',
        'present': '現在',
        'future': '未来'
    },
    'ko': {
        'past': '과거',
        'present': '현재',
        'future': '미래'
    },
    'hi': {
        'past': 'भूत',
        'present': 'वर्तमान',
        'future': 'भविष्य'
    },
    'ar': {
        'past': 'الماضي',
        'present': 'الحاضر',
        'future': 'المستقبل'
    }
}
        return translations.get(language, translations['en'])
       

def create_api_handler() -> Optional[ClaudeTarotAPI]:
    """Create and initialize Claude API handler"""
    try:
        api_key = os.getenv('ANTHROPIC_API_KEY')
        if not api_key:
            logger.error("ANTHROPIC_API_KEY environment variable not set")
            raise ValueError("Missing API key")
        return ClaudeTarotAPI(api_key)
    except Exception as e:
        logger.error(f"Error creating API handler: {e}")
        raise  # Re-raise the error instead of returning None
    
def create_api_handler() -> Optional[ClaudeTarotAPI]:
    """Create and initialize Claude API handler"""
    try:
        api_key = os.getenv('ANTHROPIC_API_KEY')
        if not api_key:
            logger.error("ANTHROPIC_API_KEY environment variable not set")
            raise ValueError("Missing API key")
        return ClaudeTarotAPI(api_key)
    except Exception as e:
        logger.error(f"Error creating API handler: {e}")
        raise


api_handler = create_api_handler()

__all__ = ['ClaudeTarotAPI', 'api_handler']