from .db import db, environment, SCHEMA, add_prefix_for_prod

class Message(db.Model):
  __tablename__ = "messages"

  if environment == "production":
    __table_args__ = {'schema': SCHEMA}

  id = db.Column(db.Integer, primary_key=True)
  sender_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')))
  recipient_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')))
  content = db.Column(db.Text, nullable=False)
  read = db.Column(db.Boolean, default=False, nullable=False)
  created_at = db.Column(db.TIMESTAMP(), nullable=False)

  # Relationships
  sender = db.relationship("User", foreign_keys="Message.sender_id", back_populates="sent_messages")
  recipient = db.relationship("User", foreign_keys="Message.recipient_id", back_populates="received_messages")

  def to_dict(self):
    return {
      'id': self.id,
      'sender': self.sender.to_dict_no_post(),
      'recipient': self.recipient.to_dict_no_post(),
      'content': self.content,
      'read': self.read,
      'createdAt': self.created_at.strftime("%a, %d %b %Y %H:%M:%S GMT")
    }
