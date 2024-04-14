from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4

db = SQLAlchemy()

def get_uuid():
    return uuid4().hex

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    email = db.Column(db.String(345), unique=True)
    password = db.Column(db.Text, nullable=False)
    username = db.Column(db.String(150), nullable=False)  

class WatchlistMovie(db.Model):
    __tablename__ = "watchlist_movies"
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    user_id = db.Column(db.String(32), db.ForeignKey('users.id'))
    movie_id = db.Column(db.Integer, nullable=False)  
    title = db.Column(db.String(255), nullable=False)
    overview = db.Column(db.Text, nullable=False)
    poster_path = db.Column(db.String(255), nullable=False)
    backdrop_path = db.Column(db.String(255))
    original_language = db.Column(db.String(10))
    release_date = db.Column(db.String(20))
    vote_average = db.Column(db.Float)
    vote_count = db.Column(db.Integer)
    popularity = db.Column(db.Float)
    genre_ids = db.Column(db.JSON, nullable=False)  
    added_date = db.Column(db.DateTime, default=db.func.current_timestamp())

    user = db.relationship('User', backref=db.backref('watchlist_movies', lazy=True))
    
class WatchlistSeries(db.Model):
    __tablename__ = "watchlist_series"
    id = db.Column(db.String(32), primary_key=True, unique=True, default=get_uuid)
    user_id = db.Column(db.String(32), db.ForeignKey('users.id'))
    series_id = db.Column(db.Integer, nullable=False)  
    name = db.Column(db.String(255), nullable=False)
    overview = db.Column(db.Text, nullable=False)
    poster_path = db.Column(db.String(255), nullable=False)
    backdrop_path = db.Column(db.String(255))
    original_language = db.Column(db.String(10))
    first_air_date = db.Column(db.String(20))
    vote_average = db.Column(db.Float)
    vote_count = db.Column(db.Integer)
    popularity = db.Column(db.Float)
    genre_ids = db.Column(db.JSON, nullable=False)  
    added_date = db.Column(db.DateTime, default=db.func.current_timestamp())

    user = db.relationship('User', backref=db.backref('watchlist_series', lazy=True))