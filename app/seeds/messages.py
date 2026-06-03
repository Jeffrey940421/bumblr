from app.models import db, environment, SCHEMA, Message
from sqlalchemy.sql import text
from faker import Faker
from random import randint, choice
from datetime import datetime
from .users import users
from .posts import posts

faker = Faker()

def fake_messages(message_num):
  messages = []
  for i in range(1, message_num + 1):
    user = choice(users)
    recipient = choice(users)
    while recipient.id == user.id:
      recipient = choice(users)
    content = faker.text()
    year = randint(2021, 2022)
    month = randint(1, 12)
    day = randint(1, 28)
    hour = randint(0, 23)
    minute = randint(0, 59)
    second = randint(0, 59)
    microsecond = randint(0, 999999)
    created_at = datetime(year, month, day, hour, minute, second, microsecond)
    messages.append(Message(
      sender_id = user.id,
      recipient_id = recipient.id,
      content = content,
      created_at = created_at,
    ))
  return messages


def seed_messages():
  messages = fake_messages(100)
  _ = [db.session.add(message) for message in messages]
  db.session.commit()

def undo_messages():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.messages RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM messages"))

    db.session.commit()
