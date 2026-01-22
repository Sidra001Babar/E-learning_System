from flask import Blueprint,jsonify
from models.announcementReaction import AnnouncementReaction
MixForBoth_bp = Blueprint("mixForBoth", __name__)

@MixForBoth_bp.route("/announcements/<int:announcement_id>/reactions", methods=["GET"])
def get_reactions(announcement_id):
    reactions = AnnouncementReaction.query.filter_by(announcement_id=announcement_id).all()
    users = [r.user.email for r in reactions]
    return jsonify(users)