from flask import Blueprint, jsonify, session, request
from flask_login import login_required, current_user
from app.models import User, Post, Note, Message
from sqlalchemy import or_, and_
from app import db
from app.forms import MessageForm
from datetime import datetime
from app.socket import socketio
import json

message_routes = Blueprint('messages', __name__)


def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field} : {error}')
    return errorMessages


@message_routes.route("/current", methods=["GET"])
@login_required
def get_messages():
    messages = Message.query.filter(or_(
        Message.recipient_id == current_user.id,
        Message.sender_id == current_user.id
    )).all()
    message_objs = []
    for message in messages:
        message_obj = message.to_dict()
        message_obj["associated_user"] = message_obj["recipient"] if message.sender_id == current_user.id else message_obj["sender"]
        message_objs.append(message_obj)
    return {'messages': [message for message in message_objs]}


@message_routes.route("/new", methods=["POST"])
@login_required
def create_message():
    form = MessageForm()

    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        message = Message(
            sender_id=current_user.id,
            recipient_id=form.data["recipient_id"],
            content=form.data["content"],
            created_at=datetime.today()
        )
        db.session.add(message)
        db.session.commit()
        message_obj = message.to_dict()
        message_obj["associated_user"] = message_obj["recipient"] if message.sender_id == current_user.id else message_obj["sender"]
        socketio.emit('new_message', message_obj, to=f"user{message.recipient_id}")
        return {'message': message_obj}
    return {"errors": validation_errors_to_error_messages(form.errors)}, 401


@message_routes.route("/users/<int:id>", methods=["PUT"])
@login_required
def read_messages(id):
    """
    Read all the messages between current user and the given user
    """
    messages = Message.query.filter(and_(
        Message.recipient_id == current_user.id,
        Message.sender_id == id
    )).all()
    for message in messages:
        message.read = True
    db.session.commit()
    return {'info': f'read all the messages between current user and the user {id}'}
