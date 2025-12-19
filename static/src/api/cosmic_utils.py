from datetime import datetime
import math
import ephem

def calculate_moon_phase(date=None):
    """Calculate current moon phase"""
    if date is None:
        date = datetime.now()
        
    moon = ephem.Moon()
    moon.compute(date)
    
    # Get illuminated percentage
    illuminated = moon.phase
    
    # Determine moon phase name
    if illuminated <= 5:
        return "New Moon"
    elif illuminated <= 45:
        return "Waxing Crescent"
    elif illuminated <= 55:
        return "First Quarter"
    elif illuminated <= 95:
        return "Waxing Gibbous"
    elif illuminated <= 100:
        return "Full Moon"
    elif illuminated <= 145:
        return "Waning Gibbous"
    elif illuminated <= 155:
        return "Last Quarter"
    else:
        return "Waning Crescent"

def get_current_season(date=None):
    """Get current season based on date"""
    if date is None:
        date = datetime.now()

    # Get day of year
    doy = date.timetuple().tm_yday
    
    # Northern hemisphere seasons
    if doy >= 80 and doy < 172:  # March 21 to June 20
        return "Spring"
    elif doy >= 172 and doy < 264:  # June 21 to September 21
        return "Summer"
    elif doy >= 264 and doy < 355:  # September 22 to December 20
        return "Autumn"
    else:  # December 21 to March 20
        return "Winter"

def get_day_energy(date=None):
    """Get cosmic energy for the day"""
    if date is None:
        date = datetime.now()
        
    weekday = date.strftime('%A')
    day_energies = {
        'Monday': {
            'planet': 'Moon',
            'energy': 'intuition, emotions, and inner wisdom',
            'focus': 'emotional healing and intuitive development'
        },
        'Tuesday': {
            'planet': 'Mars',
            'energy': 'action, courage, and determination',
            'focus': 'initiative and breaking through obstacles'
        },
        'Wednesday': {
            'planet': 'Mercury',
            'energy': 'communication, intellect, and adaptability',
            'focus': 'learning, writing, and social connections'
        },
        'Thursday': {
            'planet': 'Jupiter',
            'energy': 'growth, abundance, and wisdom',
            'focus': 'expansion and spiritual development'
        },
        'Friday': {
            'planet': 'Venus',
            'energy': 'love, beauty, and harmony',
            'focus': 'relationships and creative expression'
        },
        'Saturday': {
            'planet': 'Saturn',
            'energy': 'structure, discipline, and manifestation',
            'focus': 'organization and long-term planning'
        },
        'Sunday': {
            'planet': 'Sun',
            'energy': 'vitality, confidence, and success',
            'focus': 'personal power and achievement'
        }
    }
    return day_energies.get(weekday, {})

def calculate_numerology_day(date=None):
    """Calculate numerology day number"""
    if date is None:
        date = datetime.now()
        
    # Add all numbers in date
    day_num = sum(int(digit) for digit in date.strftime('%Y%m%d'))
    
    # Reduce to single digit
    while day_num > 9:
        day_num = sum(int(digit) for digit in str(day_num))
        
    return day_num

def getLanguageForClaude(iso_code):
    """Convert ISO language code to Claude-friendly language name"""
    language_map = {
        'ka': 'Georgian',
        'ru': 'Russian',
        'es': 'Spanish',
        'fr': 'French',
        'de': 'German',
        'zh': 'Chinese',
        'ja': 'Japanese',
        'ko': 'Korean',
        'en': 'English'
    }
    return language_map.get(iso_code, 'English')