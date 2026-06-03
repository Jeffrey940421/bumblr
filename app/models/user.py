from .db import db, environment, SCHEMA, add_prefix_for_prod
from .join import likes, follows
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    nickname = db.Column(db.String(40))
    bio = db.Column(db.Text())
    profile_pic = db.Column(db.String(255), nullable=False)
    banner_pic = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)

    # Relationships
    posts = db.relationship("Post", back_populates="user", cascade="all, delete-orphan")
    comments = db.relationship("Note", back_populates="user")
    received_messages = db.relationship(
        "Message",
        foreign_keys="Message.recipient_id",
        back_populates="recipient",
        cascade="all, delete-orphan"
    )
    sent_messages = db.relationship(
        "Message",
        foreign_keys="Message.sender_id",
        back_populates="sender",
        cascade="all, delete-orphan"
    )
    likes = db.relationship(
        "Post",
        secondary="user_likes",
        back_populates="likes"
    )

    followers = db.relationship(
        "User",
        secondary=follows,
        primaryjoin=follows.columns.follower == id,
        secondaryjoin=follows.columns.followed == id,
        back_populates="following"
    )

    following = db.relationship(
        "User",
        secondary=follows,
        primaryjoin=follows.columns.followed == id,
        secondaryjoin=follows.columns.follower == id,
        back_populates="followers"
    )

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict_current(self):
        return {
            'id': self.id,
            'username': self.username,
            'nickname': self.nickname,
            'bio': self.bio,
            'profilePic': self.profile_pic,
            'bannerPic': self.banner_pic,
            'email': self.email,
            'likes': [like.to_dict_likes() for like in self.likes],
            'posts': [post.post_to_dict_notes() for post in self.posts],
            'userFollowers': [user.to_dict_no_post() for user in self.following],
            "userFollowing": [user.to_dict_no_post() for user in self.followers]
        }

    def to_dict_current_summary(self):
        return {
            'id': self.id,
            'username': self.username,
            'nickname': self.nickname,
            'bio': self.bio,
            'profilePic': self.profile_pic,
            'bannerPic': self.banner_pic,
            'email': self.email,
            'likes': [like.to_dict_likes() for like in self.likes],
            'posts': [post.post_to_dict_notes() for post in self.posts],
            'userFollowers': [user.id for user in self.following],
            "userFollowing": [user.id for user in self.followers]
        }

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'nickname': self.nickname,
            'bio': self.bio,
            'profilePic': self.profile_pic,
            'bannerPic': self.banner_pic,
            'email': self.email,
            # 'likes': [like.to_dict_likes() for like in self.likes],
            'posts': [post.post_to_dict_notes() for post in self.posts],
            # 'followers':
        }

    def to_dict_general(self):
        return {
            'id': self.id,
            'username': self.username,
            'nickname': self.nickname,
            'bio': self.bio,
            'profilePic': self.profile_pic,
            'bannerPic': self.banner_pic,
            'posts': [post.post_to_dict_notes() for post in self.posts],
        }

    def to_dict_no_post(self):
        return {
            "id": self.id,
            "username": self.username,
            "nickname": self.nickname,
            "bio": self.bio,
            "email": self.email,
            "profilePic": self.profile_pic,
            "bannerPic": self.banner_pic
        }

    def to_dict_likes(self):
        return {
            "postId": self.id
        }

    def to_dict_user_likes(self):
        return {
            "userId": self.id
        }

    def to_dict_followers(self):
        # print('followers', self.followers)
        # print('following', self.following)
        return {
            "id": self.id,
            "userFollowers": [user.to_dict_no_post() for user in self.following]
        }

    def to_dict_following(self):
        return {
            "id": self.id,
            "userFollowing": [user.to_dict_no_post() for user in self.followers]
        }
