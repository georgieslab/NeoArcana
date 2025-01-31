# monitoring.py
import logging
import os
from datetime import datetime
from typing import Any, Dict, Optional

class APIMonitor:
    def __init__(self):
        # Set up local logging
        self.logger = logging.getLogger('tarot-api-monitor')
        self.logger.setLevel(logging.INFO)
        
        # Create logs directory if it doesn't exist
        os.makedirs('logs', exist_ok=True)
        
        # Add file handler
        fh = logging.FileHandler('logs/tarot_api.log')
        fh.setLevel(logging.INFO)
        
        # Add console handler
        ch = logging.StreamHandler()
        ch.setLevel(logging.INFO)
        
        # Create formatter
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        fh.setFormatter(formatter)
        ch.setFormatter(formatter)
        
        # Add handlers to logger
        self.logger.addHandler(fh)
        self.logger.addHandler(ch)

    def log_api_interaction(self, 
                          endpoint: str, 
                          input_data: Dict[str, Any], 
                          output_data: Dict[str, Any], 
                          error: Optional[Exception] = None) -> None:
        """Log API interactions to local file"""
        log_data = {
            'timestamp': datetime.now().isoformat(),
            'endpoint': endpoint,
            'input': input_data,
            'output': output_data,
            'error': str(error) if error else None
        }
        
        if error:
            self.logger.error(f"API Error: {log_data}")
        else:
            self.logger.info(f"API Call: {log_data}")