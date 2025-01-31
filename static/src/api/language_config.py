import logging
from typing import Dict, Optional, List, Set, Tuple

logger = logging.getLogger(__name__)

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

    def create_validation_set(script_type: str) -> Optional[Set[str]]:
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