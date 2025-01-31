from flask import Blueprint, jsonify, request
import os

admin_routes = Blueprint('admin_routes', __name__)

def init_admin_routes(db, monitor):
    @admin_routes.before_request
    def verify_admin():
        if request.headers.get('X-Admin-Key') != os.getenv('ADMIN_KEY'):
            return jsonify({"error": "Unauthorized"}), 401

    @admin_routes.route('/nfc/stats', methods=['GET'])
    async def get_nfc_stats():
        try:
            days = request.args.get('days', default=7, type=int)
            stats = monitor.get_usage_stats(days)
            return jsonify(stats)
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @admin_routes.route('/nfc/health', methods=['GET'])
    async def get_nfc_health():
        try:
            health_data = monitor.check_system_health()
            if health_data['status'] != 'healthy':
                await monitor.alert_if_needed(health_data)
            return jsonify(health_data)
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @admin_routes.route('/nfc/alerts', methods=['GET'])
    async def get_nfc_alerts():
        try:
            alerts = db.collection('system_alerts')\
                      .where('acknowledged', '==', False)\
                      .order_by('timestamp', direction='desc')\
                      .limit(100)\
                      .stream()
                      
            return jsonify([alert.to_dict() for alert in alerts])
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    return admin_routes