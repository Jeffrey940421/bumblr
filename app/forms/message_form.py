from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, DateTimeField
from wtforms.validators import DataRequired, ValidationError
from app.models import Message


class MessageForm(FlaskForm):
  recipient_id = IntegerField("recipient id", validators=[DataRequired()])
  content = StringField("content", validators=[DataRequired()])
