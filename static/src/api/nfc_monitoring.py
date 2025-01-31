from datetime import datetime, timedelta
import logging
from typing import Dict, List
import json

logger = logging.getLogger(__name__)

class NFCMonitor:
    def __init__(self, db):
        self.db = db
        
    def track_registration_attempt(self, poster_code: str, success: bool, error_msg: str = None):
        """Track each registration attempt"""
        try:
            tracking_data = {
                'poster_code': poster_code,
                'timestamp': datetime.now(),
                'success': success,
                'error': error_msg,
                'type': 'registration'
            }
            
            self.db.collection('nfc_tracking').add(tracking_data)
            
        except Exception as e:
            logger.error(f"Failed to track registration attempt: {e}")
    
    def track_daily_reading(self, nfc_id: str, success: bool, error_msg: str = None):
        """Track daily reading attempts"""
        try:
            tracking_data = {
                'nfc_id': nfc_id,
                'timestamp': datetime.now(),
                'success': success,
                'error': error_msg,
                'type': 'daily_reading'
            }
            
            self.db.collection('nfc_tracking').add(tracking_data)
            
        except Exception as e:
            logger.error(f"Failed to track daily reading: {e}")
    
    def get_usage_stats(self, days: int = 7) -> Dict:
        """Get NFC usage statistics"""
        try:
            start_date = datetime.now() - timedelta(days=days)
            
            # Query tracking collection
            tracks = self.db.collection('nfc_tracking')\
                          .where('timestamp', '>=', start_date)\
                          .stream()
                          
            stats = {
                'total_registrations': 0,
                'successful_registrations': 0,
                'total_readings': 0,
                'successful_readings': 0,
                'error_counts': {},
                'daily_usage': {},
                'active_posters': set()
            }
            
            for track in tracks:
                data = track.to_dict()
                day_key = data['timestamp'].strftime('%Y-%m-%d')
                
                if data['type'] == 'registration':
                    stats['total_registrations'] += 1
                    if data['success']:
                        stats['successful_registrations'] += 1
                        stats['active_posters'].add(data['poster_code'])
                        
                elif data['type'] == 'daily_reading':
                    stats['total_readings'] += 1
                    if data['success']:
                        stats['successful_readings'] += 1
                
                if not data['success'] and data['error']:
                    stats['error_counts'][data['error']] = \
                        stats['error_counts'].get(data['error'], 0) + 1
                        
                stats['daily_usage'][day_key] = \
                    stats['daily_usage'].get(day_key, 0) + 1
            
            # Convert active_posters set to length for JSON serialization
            stats['active_posters'] = len(stats['active_posters'])
            
            return stats
            
        except Exception as e:
            logger.error(f"Failed to get usage stats: {e}")
            return {}
    
    def check_system_health(self) -> Dict:
        """Check NFC system health"""
        try:
            # Get last hour's data
            last_hour = datetime.now() - timedelta(hours=1)
            recent_tracks = self.db.collection('nfc_tracking')\
                              .where('timestamp', '>=', last_hour)\
                              .stream()
            
            tracks_list = list(recent_tracks)
            
            health_data = {
                'status': 'healthy',
                'last_hour_requests': len(tracks_list),
                'error_rate': 0,
                'average_response_time': 0,
                'timestamp': datetime.now().isoformat()
            }
            
            if tracks_list:
                errors = sum(1 for t in tracks_list if not t.to_dict()['success'])
                health_data['error_rate'] = (errors / len(tracks_list)) * 100
                
            # Check error rate threshold
            if health_data['error_rate'] > 10:  # 10% error rate threshold
                health_data['status'] = 'degraded'
            
            return health_data
            
        except Exception as e:
            logger.error(f"Health check failed: {e}")
            return {
                'status': 'error',
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }

    async def alert_if_needed(self, health_data: Dict):
        """Send alerts if system health is degraded"""
        try:
            if health_data['status'] != 'healthy':
                alert_data = {
                    'type': 'nfc_system_alert',
                    'status': health_data['status'],
                    'error_rate': health_data['error_rate'],
                    'timestamp': datetime.now(),
                    'acknowledged': False
                }
                
                await self.db.collection('system_alerts').add(alert_data)
                
                # Here you could add additional alert mechanisms:
                # - Send email
                # - Send Slack notification
                # - Trigger monitoring system
                
        except Exception as e:
            logger.error(f"Failed to send alert: {e}")