"""
Reading service - Tarot reading generation with Claude API
"""
import logging
from datetime import datetime
from typing import Dict, List, Optional
from anthropic import AsyncAnthropic

from api_v2.utils.tarot_cards import get_random_cards, get_card_image
from api_v2.utils.cosmic_utils import (
    calculate_moon_phase,
    get_current_season,
    calculate_numerology_day,
    get_day_energy,
    getLanguageForClaude
)

logger = logging.getLogger(__name__)


class ReadingService:
    """Service for generating tarot readings"""
    
    def __init__(self, database):
        self.db = database
        # Initialize async Anthropic client using settings
        from api_v2.core.config import settings
        self.client = AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)
    
    async def generate_daily_reading(self, user_data: Dict) -> Dict:
        """
        Generate personalized daily tarot reading
        """
        try:
            # Extract user info
            name = user_data.get('name', 'Seeker')
            zodiac_sign = user_data.get('zodiacSign', 'Unknown')
            language = user_data.get('language', 'en')
            preferences = user_data.get('preferences', {})
            
            # Get cosmic context
            current_date = datetime.now()
            moon_phase = calculate_moon_phase(current_date)
            season = get_current_season(current_date)
            day_energy = get_day_energy(current_date)
            numerology_day = calculate_numerology_day(current_date)
            
            # Select random card
            cards = get_random_cards(1)
            card = cards[0]
            
            # Build personalized prompt
            prompt = self._build_reading_prompt(
                name=name,
                zodiac_sign=zodiac_sign,
                language=language,
                preferences=preferences,
                card=card,
                moon_phase=moon_phase,
                season=season,
                day_energy=day_energy,
                numerology_day=numerology_day
            )
            
            logger.info(f"Generating reading for {name} - Card: {card['name']}")
            
            # Call Claude API (ASYNC!)
            response = await self.client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=1500,
                messages=[{"role": "user", "content": prompt}]
            )
            
            interpretation = response.content[0].text
            
            result = {
                "cardName": card['name'],
                "cardImage": get_card_image(card['name']),
                "interpretation": interpretation,
                "moonPhase": moon_phase,
                "season": season,
                "dayEnergy": day_energy.get('energy', 'Unknown'),
                "numerologyDay": numerology_day,
                "cached": False
            }
            
            logger.info(f"✅ Reading generated successfully for {name}")
            
            return result
            
        except Exception as e:
            logger.error(f"Error generating reading: {e}")
            # Return fallback reading
            return self._get_fallback_reading()
    
    def _build_reading_prompt(
        self,
        name: str,
        zodiac_sign: str,
        language: str,
        preferences: Dict,
        card: Dict,
        moon_phase: str,
        season: str,
        day_energy: Dict,
        numerology_day: int
    ) -> str:
        """Build personalized prompt for Claude"""
        
        color_info = preferences.get('color', {})
        color_name = color_info.get('name', 'Cosmic Purple') if color_info else 'Cosmic Purple'
        interests = preferences.get('interests', ['spiritual growth'])
        interests_str = ', '.join(interests) if interests else 'spiritual growth'
        numbers = preferences.get('numbers', {})
        
        prompt = f"""Create a deeply personalized tarot reading for {name}, 
who is a {zodiac_sign} born under today's {moon_phase} moon in {season}.

Card Drawn: {card['name']}
Keywords: {', '.join(card['keywords'])}

Cosmic Timing:
- Moon Phase: {moon_phase}
- Season: {season}
- Day Energy: {day_energy.get('energy', 'balanced energy')} ({day_energy.get('planet', 'Cosmic')} Day)
- Numerological Day: {numerology_day}

Personal Energy:
- Color Connection: {color_name}
- Life Path Focus: {interests_str}
- Personal Numbers: {numbers}

Critical Instructions:
1. Respond ENTIRELY in {getLanguageForClaude(language)} language
2. Structure the reading with these EXACT markers:

[CARD_READING]
(Card interpretation connecting cosmic timing with personal path)
[/CARD_READING]

[NUMEROLOGY_INSIGHT]
(Brief insight connecting their personal numbers with today's {numerology_day} energy)
[/NUMEROLOGY_INSIGHT]

[DAILY_AFFIRMATION]
(Powerful affirmation drawing from their zodiac and current cosmic energy)
[/DAILY_AFFIRMATION]

Maintain a mystical yet practical tone throughout."""
        
        return prompt
    
    def _get_fallback_reading(self) -> Dict:
        """Get fallback reading when API fails"""
        return {
            "cardName": "The Star",
            "cardImage": "/static/images/cards/star.jpg",
            "interpretation": """[CARD_READING]
The Star shines upon your path, bringing hope and renewal. Trust that you are being guided toward healing and inspiration.
[/CARD_READING]

[NUMEROLOGY_INSIGHT]
Today's energy encourages reflection and spiritual connection. Listen to your inner wisdom.
[/NUMEROLOGY_INSIGHT]

[DAILY_AFFIRMATION]
I trust the path that unfolds before me and welcome divine guidance.
[/DAILY_AFFIRMATION]""",
            "moonPhase": "Unknown",
            "season": "Unknown",
            "dayEnergy": "Unknown",
            "numerologyDay": 0,
            "cached": False
        }
    
    async def save_reading(self, nfc_id: str, reading_data: Dict):
        """Save reading to Firebase"""
        try:
            reading_ref = self.db.collection('nfc_readings').document()
            reading_ref.set({
                'nfc_id': nfc_id,
                'reading_data': reading_data,
                'created_at': datetime.now(),
                'reading_type': 'daily'
            })
            logger.info(f"Reading saved for {nfc_id}")
        except Exception as e:
            logger.error(f"Error saving reading: {e}")
    
    async def generate_trial_three_card_reading(self, user_data: Optional[Dict] = None) -> Dict:
        """
        Generate AI-powered three-card reading for trial users
        Uses Claude Sonnet 4 for personalized, detailed interpretations!
        NOW WITH PERSONALIZATION! 🎉
        """
        try:
            logger.info("Generating AI-powered trial three-card reading")
            
            # Get cosmic context
            current_date = datetime.now()
            moon_phase = calculate_moon_phase(current_date)
            season = get_current_season(current_date)
            
            # Select three random cards
            cards = get_random_cards(3)
            
            card_names = [card['name'] for card in cards]
            
            # FIX: Ensure full path for images
            card_images = []
            for card in cards:
                img = card['image']
                # If image doesn't start with /static, add full path
                if not img.startswith('/static'):
                    # Remove any leading slashes and get just filename
                    filename = img.split('/')[-1] if '/' in img else img
                    img = f'/static/images/cards/{filename}'
                card_images.append(img)
            
            positions = ["Past", "Present", "Future"]
            
            logger.info(f"Selected cards for trial: {card_names}")
            
            # Get user info for personalization (if provided)
            name = "friend"
            zodiac_sign = ""
            if user_data:
                name = user_data.get('name', 'friend')
                zodiac_sign = user_data.get('zodiacSign', '')
            
            # BUILD AI PROMPT for detailed reading
            prompt = f"""You are a mystical tarot reader providing a deeply personalized three-card reading. 

CARDS DRAWN:
- PAST: {card_names[0]}
- PRESENT: {card_names[1]}  
- FUTURE: {card_names[2]}

COSMIC CONTEXT:
- Moon Phase: {moon_phase}
- Season: {season}
{f'- Zodiac Sign: {zodiac_sign}' if zodiac_sign else ''}

Create a comprehensive, meaningful three-card reading with these sections:

[PAST]
Write 3-4 paragraphs (150-200 words) about {card_names[0]} in the past position. Explain:
- What foundations this card reveals from their past
- How past experiences shaped who they are today
- What lessons and wisdom they've gained
- How this energy still influences them
Be specific, insightful, and empowering.

[PRESENT]
Write 3-4 paragraphs (150-200 words) about {card_names[1]} in the present position. Explain:
- What this card reveals about their current situation
- The energies and influences active right now
- Opportunities and challenges they're facing
- What they need to understand or embrace
Be direct, relevant, and actionable.

[FUTURE]
Write 3-4 paragraphs (150-200 words) about {card_names[2]} in the future position. Explain:
- What this card shows about the path ahead
- Potential outcomes and possibilities
- How current actions influence future results
- What to focus on moving forward
Be hopeful, inspiring, and empowering.

[INTEGRATION]
Write 2-3 paragraphs (100-150 words) weaving all three cards together. Show:
- How the journey flows from {card_names[0]} through {card_names[1]} to {card_names[2]}
- The overarching story these cards tell
- How the {moon_phase} moon and {season} season amplify this message
- A powerful concluding insight

TONE: Warm, wise, mystical yet grounded. Speak directly to the reader as "you". Be specific to the actual cards drawn, not generic. Make it feel deeply personal and meaningful.

LENGTH: Total of 600-800 words for a comprehensive, satisfying reading."""

            # Call Claude API
            logger.info("Calling Claude API for three-card interpretation...")
            
            response = await self.client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=2000,
                temperature=0.8,
                messages=[{
                    "role": "user",
                    "content": prompt
                }]
            )
            
            interpretation = response.content[0].text
            
            logger.info(f"AI interpretation generated: {len(interpretation)} characters")
            
            result = {
                "cards": card_images,
                "cardNames": card_names,
                "positions": positions,
                "interpretation": interpretation,
                "moonPhase": moon_phase,
                "season": season,
                "cached": False
            }
            
            logger.info("Trial three-card reading generated successfully with AI")
            return result
            
        except Exception as e:
            logger.error(f"Error generating trial three-card reading: {e}")
            raise
    
    async def generate_three_card_reading(self, nfc_id: str) -> Dict:
        """
        Generate three-card reading for NFC user (with saved preferences)
        """
        try:
            logger.info(f"Generating three-card reading for NFC user: {nfc_id}")
            
            # Get user from Firebase
            user_ref = self.db.collection('nfc_users').document(nfc_id)
            user_doc = user_ref.get()
            
            if not user_doc.exists:
                raise ValueError(f"User not found: {nfc_id}")
            
            user_data = user_doc.to_dict()
            
            # Check cache (one per day)
            today = datetime.now().strftime('%Y-%m-%d')
            cached_reading = await self._get_cached_three_card_reading(nfc_id, today)
            
            if cached_reading:
                logger.info(f"Returning cached three-card reading for {nfc_id}")
                cached_reading['cached'] = True
                return cached_reading
            
            # Extract user info
            name = user_data.get('name', 'Seeker')
            zodiac_sign = user_data.get('zodiacSign', 'Unknown')
            language = user_data.get('language', 'en')
            preferences = user_data.get('preferences', {})
            
            # Get cosmic context
            current_date = datetime.now()
            moon_phase = calculate_moon_phase(current_date)
            season = get_current_season(current_date)
            day_energy = get_day_energy(current_date)
            numerology_day = calculate_numerology_day(current_date)
            
            # Select three cards
            cards = get_random_cards(3)
            card_names = [card['name'] for card in cards]
            
            logger.info(f"Selected cards: {card_names}")
            
            # Build prompt for three-card reading
            prompt = self._build_three_card_prompt(
                name=name,
                zodiac_sign=zodiac_sign,
                language=language,
                preferences=preferences,
                cards=cards,
                moon_phase=moon_phase,
                season=season,
                day_energy=day_energy,
                numerology_day=numerology_day
            )
            
            # Call Claude API
            response = await self.client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=2000,
                temperature=0.8,
                messages=[{"role": "user", "content": prompt}]
            )
            
            interpretation = response.content[0].text
            
            result = {
                "cards": [get_card_image(card['name']) for card in cards],
                "cardNames": card_names,
                "positions": ["Past", "Present", "Future"],
                "interpretation": interpretation,
                "moonPhase": moon_phase,
                "season": season,
                "dayEnergy": day_energy.get('energy', 'Unknown'),
                "numerologyDay": numerology_day,
                "cached": False
            }
            
            # Cache the reading
            await self._cache_three_card_reading(nfc_id, today, result)
            
            logger.info(f"✅ Three-card reading generated for {name}")
            
            return result
            
        except ValueError as e:
            logger.error(f"Validation error: {e}")
            raise
        except Exception as e:
            logger.error(f"Error generating three-card reading: {e}")
            return self._get_fallback_three_card_reading()
    
    def _build_three_card_prompt(
        self,
        name: str,
        zodiac_sign: str,
        language: str,
        preferences: Dict,
        cards: List[Dict],
        moon_phase: str,
        season: str,
        day_energy: Dict,
        numerology_day: int
    ) -> str:
        """Build prompt for three-card reading"""
        
        positions = ["Past", "Present", "Future"]
        cards_info = [
            f"{pos}: {card['name']} ({', '.join(card['keywords'])})"
            for pos, card in zip(positions, cards)
        ]
        
        color_info = preferences.get('color', {})
        color_name = color_info.get('name', 'Cosmic Purple') if color_info else 'Cosmic Purple'
        interests = preferences.get('interests', ['spiritual growth'])
        interests_str = ', '.join(interests) if interests else 'spiritual growth'
        
        prompt = f"""Create a deeply personalized three-card tarot reading for {name}, 
a {zodiac_sign} born under today's {moon_phase} moon in {season}.

Cards Drawn:
{chr(10).join(cards_info)}

Cosmic Timing:
- Moon Phase: {moon_phase}
- Season: {season}
- Day Energy: {day_energy.get('energy', 'balanced energy')} ({day_energy.get('planet', 'Cosmic')} Day)
- Numerological Day: {numerology_day}

Personal Energy:
- Color Connection: {color_name}
- Life Path Focus: {interests_str}

Critical Instructions:
1. Respond ENTIRELY in {getLanguageForClaude(language)} language
2. Structure with these EXACT markers:

[PAST]
(Detailed interpretation of {cards[0]['name']} - foundations and lessons from the past. 3-4 paragraphs, 150-200 words)
[/PAST]

[PRESENT]
(Detailed interpretation of {cards[1]['name']} - current energies and situation. 3-4 paragraphs, 150-200 words)
[/PRESENT]

[FUTURE]
(Detailed interpretation of {cards[2]['name']} - path ahead and potential. 3-4 paragraphs, 150-200 words)
[/FUTURE]

[INTEGRATION]
(Weaving all three cards into a cohesive narrative. How do these cards tell a complete story? 2-3 paragraphs, 100-150 words)
[/INTEGRATION]

Maintain a mystical yet practical tone, deeply personalized to {name}'s journey."""
        
        return prompt
    
    async def _get_cached_three_card_reading(self, nfc_id: str, date: str) -> Optional[Dict]:
        """Get cached three-card reading if exists"""
        try:
            cache_ref = self.db.collection('three_card_cache').document(f"{nfc_id}_{date}")
            cache_doc = cache_ref.get()
            
            if cache_doc.exists:
                return cache_doc.to_dict()
            return None
            
        except Exception as e:
            logger.error(f"Error getting cached reading: {e}")
            return None
    
    async def _cache_three_card_reading(self, nfc_id: str, date: str, reading: Dict):
        """Cache three-card reading"""
        try:
            cache_ref = self.db.collection('three_card_cache').document(f"{nfc_id}_{date}")
            cache_ref.set(reading)
            logger.info(f"Three-card reading cached for {nfc_id}")
            
        except Exception as e:
            logger.error(f"Error caching reading: {e}")
    
    def _get_fallback_three_card_reading(self) -> Dict:
        """Get fallback three-card reading when API fails"""
        return {
            "cards": [
                "/static/images/cards/star.jpg",
                "/static/images/cards/sun.jpg",
                "/static/images/cards/world.jpg"
            ],
            "cardNames": ["The Star", "The Sun", "The World"],
            "positions": ["Past", "Present", "Future"],
            "interpretation": """[PAST]
The Star reveals the foundations of hope and renewal in your past.

[PRESENT]
The Sun illuminates your current journey with clarity and joy.

[FUTURE]
The World shows completion and fulfillment ahead.

[INTEGRATION]
Together, these cards tell a story of transformation and achievement.""",
            "moonPhase": "Unknown",
            "season": "Unknown",
            "cached": False
        }
    
    async def generate_weekly_reading(self, nfc_id: str) -> Dict:
        """
        Generate weekly three-card reading (PREMIUM FEATURE - RATE LIMITED)
        """
        try:
            logger.info(f"Generating weekly reading for: {nfc_id}")
            
            # Import rate limiter
            from api_v2.services.rate_limiter_service import RateLimiterService
            rate_limiter = RateLimiterService(self.db)
            
            # Check rate limit (once per week!)
            can_generate, error_message = await rate_limiter.check_weekly_limit(nfc_id)
            
            if not can_generate:
                # Return cached reading with rate limit message
                logger.warning(f"Weekly reading rate limit for {nfc_id}: {error_message}")
                
                # Try to get the most recent weekly reading
                cached = await self._get_latest_weekly_reading(nfc_id)
                if cached:
                    cached['cached'] = True
                    return cached
                
                raise ValueError(error_message)
            
            # Get user from Firebase
            user_ref = self.db.collection('nfc_users').document(nfc_id)
            user_doc = user_ref.get()
            
            if not user_doc.exists:
                raise ValueError(f"User not found: {nfc_id}")
            
            user_data = user_doc.to_dict()
            
            # Extract user info
            name = user_data.get('name', 'Seeker')
            zodiac_sign = user_data.get('zodiacSign', 'Unknown')
            language = user_data.get('language', 'en')
            preferences = user_data.get('preferences', {})
            
            # Get cosmic context
            current_date = datetime.now()
            moon_phase = calculate_moon_phase(current_date)
            season = get_current_season(current_date)
            day_energy = get_day_energy(current_date)
            numerology_day = calculate_numerology_day(current_date)
            
            # Select three cards
            cards = get_random_cards(3)
            
            # Build prompt for weekly reading
            prompt = self._build_weekly_reading_prompt(
                name=name,
                zodiac_sign=zodiac_sign,
                language=language,
                preferences=preferences,
                cards=cards,
                moon_phase=moon_phase,
                season=season,
                day_energy=day_energy,
                numerology_day=numerology_day
            )
            
            logger.info(f"Generating weekly reading for {name}")
            logger.info(f"Cards: {[card['name'] for card in cards]}")
            
            # Call Claude API (ASYNC!)
            response = await self.client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=2500,
                messages=[{"role": "user", "content": prompt}]
            )
            
            interpretation = response.content[0].text
            
            result = {
                "cards": [get_card_image(card['name']) for card in cards],
                "cardNames": [card['name'] for card in cards],
                "positions": ["Week's Challenge", "Week's Opportunity", "Week's Outcome"],
                "interpretation": interpretation,
                "moonPhase": moon_phase,
                "season": season,
                "dayEnergy": day_energy.get('energy', 'Unknown'),
                "numerologyDay": numerology_day,
                "cached": False,
                "timestamp": datetime.now()
            }
            
            # Save weekly reading
            await self._save_weekly_reading(nfc_id, result)
            
            # Mark weekly reading taken
            await rate_limiter.mark_weekly_reading_taken(nfc_id)
            
            logger.info(f"✅ Weekly reading generated for {name}")
            
            return result
            
        except ValueError as e:
            logger.error(f"Validation error: {e}")
            raise
        except Exception as e:
            logger.error(f"Error generating weekly reading: {e}")
            return self._get_fallback_three_card_reading()
    
    def _build_weekly_reading_prompt(
        self,
        name: str,
        zodiac_sign: str,
        language: str,
        preferences: Dict,
        cards: List[Dict],
        moon_phase: str,
        season: str,
        day_energy: Dict,
        numerology_day: int
    ) -> str:
        """Build prompt for weekly reading"""
        
        positions = ["Week's Challenge", "Week's Opportunity", "Week's Outcome"]
        cards_info = [
            f"{pos}: {card['name']} ({', '.join(card['keywords'])})"
            for pos, card in zip(positions, cards)
        ]
        
        color_info = preferences.get('color', {})
        color_name = color_info.get('name', 'Cosmic Purple') if color_info else 'Cosmic Purple'
        interests = preferences.get('interests', ['spiritual growth'])
        interests_str = ', '.join(interests) if interests else 'spiritual growth'
        
        prompt = f"""Create a deeply personalized weekly tarot reading for {name}, 
a {zodiac_sign} born under this week's {moon_phase} moon in {season}.

This is a WEEKLY reading focusing on the week ahead.

Cards Drawn:
{chr(10).join(cards_info)}

Cosmic Timing This Week:
- Moon Phase: {moon_phase}
- Season: {season}
- Today's Energy: {day_energy.get('energy', 'balanced energy')} ({day_energy.get('planet', 'Cosmic')} Day)
- Numerological Day: {numerology_day}

Personal Energy:
- Color Connection: {color_name}
- Life Path Focus: {interests_str}

Critical Instructions:
1. Respond ENTIRELY in {getLanguageForClaude(language)} language
2. This is a WEEKLY forecast - focus on the 7 days ahead
3. Structure with these EXACT markers:

[WEEKLY_CHALLENGE]
(Interpretation of {cards[0]['name']} - the main challenge or lesson this week)
[/WEEKLY_CHALLENGE]

[WEEKLY_OPPORTUNITY]
(Interpretation of {cards[1]['name']} - the opportunity or gift available this week)
[/WEEKLY_OPPORTUNITY]

[WEEKLY_OUTCOME]
(Interpretation of {cards[2]['name']} - the likely outcome if you navigate the week wisely)
[/WEEKLY_OUTCOME]

[WEEKLY_GUIDANCE]
(Practical advice for navigating this week successfully, weaving in their {zodiac_sign} strengths and {interests_str} interests)
[/WEEKLY_GUIDANCE]

Maintain a mystical yet practical tone, focusing on actionable weekly guidance."""
        
        return prompt
    
    async def _save_weekly_reading(self, nfc_id: str, reading_data: Dict):
        """Save weekly reading to Firebase"""
        try:
            user_ref = self.db.collection('nfc_users').document(nfc_id)
            
            # Save to weekly_readings subcollection
            weekly_ref = user_ref.collection('weekly_readings').document()
            weekly_ref.set(reading_data)
            
            logger.info(f"Weekly reading saved for {nfc_id}")
            
        except Exception as e:
            logger.error(f"Error saving weekly reading: {e}")
    
    async def _get_latest_weekly_reading(self, nfc_id: str) -> Optional[Dict]:
        """Get the most recent weekly reading"""
        try:
            user_ref = self.db.collection('nfc_users').document(nfc_id)
            weekly_readings = user_ref.collection('weekly_readings')\
                .order_by('timestamp', direction='DESCENDING')\
                .limit(1)\
                .get()
            
            for reading in weekly_readings:
                return reading.to_dict()
            
            return None
            
        except Exception as e:
            logger.error(f"Error getting latest weekly reading: {e}")
            return None