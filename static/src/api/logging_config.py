import os
import logging
from logging.handlers import RotatingFileHandler
import json
from datetime import datetime

# Create logs directory if it doesn't exist
LOGS_DIR = 'logs'
if not os.path.exists(LOGS_DIR):
    os.makedirs(LOGS_DIR)

# Configure logging
LOG_FILE = os.path.join(LOGS_DIR, 'tarot_app.log')

def setup_logging():
    """Configure logging for the application"""
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            RotatingFileHandler(
                LOG_FILE,
                maxBytes=1024 * 1024,  # 1MB
                backupCount=3
            ),
            logging.StreamHandler()  # Console output
        ]
    )
    return logging.getLogger(__name__)

class APILogger:
    def __init__(self):
        self.logger = setup_logging()
        
    def log_api_call(self, function_name, input_data, output_data=None, error=None):
        """Log API calls with structured data"""
        log_entry = {
            'timestamp': datetime.now().isoformat(),
            'function': function_name,
            'input': self._sanitize_data(input_data),
            'output': self._sanitize_data(output_data) if output_data else None,
            'success': error is None,
            'error': str(error) if error else None
        }
        
        # Write to log file
        self.logger.info(json.dumps(log_entry))
        
        # Print to console if in debug mode
        if os.getenv('DEBUG') == 'True':
            print(f"\nAPI Log: {json.dumps(log_entry, indent=2)}")
            
    def _sanitize_data(self, data):
        """Remove sensitive information from log data"""
        if isinstance(data, dict):
            return {
                k: '***' if k in ['api_key', 'email', 'date_of_birth'] 
                else self._sanitize_data(v)
                for k, v in data.items()
            }
        elif isinstance(data, list):
            return [self._sanitize_data(item) for item in data]
        return data

api_logger = APILogger()