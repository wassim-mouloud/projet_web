from flask import Flask, request, abort, jsonify, session
from flask_bcrypt import Bcrypt
from flask_session import Session
from flask_cors import CORS
from models import db, User, WatchlistMovie, WatchlistSeries
from config import ApplicationConfig

app = Flask(__name__)
app.config.from_object(ApplicationConfig)
bcrypt = Bcrypt(app)
CORS(app , supports_credentials = True)
server_session = Session(app)
db.init_app(app)

with app.app_context() :
    db.create_all()
    
@app.route("/register", methods=["POST"])
def register_user():
    email = request.json["email"]
    password = request.json["password"]
    username = request.json["username"]  

    user_exists = User.query.filter_by(email=email).first() is not None
    
    if user_exists:
        return jsonify({"error": "User with this email already exists"}), 409
    
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')  
    new_user = User(email=email, username=username, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    
    session["user_id"] = new_user.id

    return jsonify({
        "id": new_user.id,
        "email": new_user.email,
        "username": new_user.username  
    })


    
@app.route("/login", methods=["POST"])
def login_user():
    email = request.json.get("email")
    password = request.json.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()

    if user is None:
        return jsonify({"error": "User does not exist"}), 404  # Changed to 404

    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Invalid password"}), 403  # Changed to 403

    session["user_id"] = user.id
    return jsonify({
        "id": user.id,
        "email": user.email,
        "username" : user.username
    })

    
@app.route("/@me")
def get_current_session():
    user_id = session.get("user_id")
    
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    user = User.query.filter_by(id=user_id).first()
    if user is None:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "id": user.id,
        "email": user.email,
    })

    
    
@app.route("/logout", methods=["POST"])
def logout_user():
    session.pop("user_id", None)    
    return jsonify({"message": "Logged out successfully"}), 200

@app.route("/watchlist/movies/add", methods=["POST"])
def add_movie_to_watchlist():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    movie_data = request.json
    new_movie = WatchlistMovie(
        user_id=user_id,
        movie_id=movie_data.get("id"),
        title=movie_data.get("title"),
        overview=movie_data.get("overview"),
        poster_path=movie_data.get("poster_path"),
        backdrop_path=movie_data.get("backdrop_path", ""),
        original_language=movie_data.get("original_language"),
        release_date=movie_data.get("release_date"),
        vote_average=movie_data.get("vote_average"),
        vote_count=movie_data.get("vote_count"),
        popularity=movie_data.get("popularity"),
        genre_ids=movie_data.get("genre_ids")  # Assuming genre_ids is a list of integers
    )
    db.session.add(new_movie)
    db.session.commit()

    return jsonify({"message": "Movie added to watchlist"}), 201

@app.route("/watchlist/series/add", methods=["POST"])
def add_series_to_watchlist():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    series_data = request.json
    new_series = WatchlistSeries(
        user_id=user_id,
        series_id=series_data.get("id"),
        name=series_data.get("name"),
        overview=series_data.get("overview"),
        poster_path=series_data.get("poster_path"),
        backdrop_path=series_data.get("backdrop_path", ""),
        original_language=series_data.get("original_language"),
        first_air_date=series_data.get("first_air_date"),
        vote_average=series_data.get("vote_average"),
        vote_count=series_data.get("vote_count"),
        popularity=series_data.get("popularity"),
        genre_ids=series_data.get("genre_ids")  # Assuming genre_ids is a list of integers
    )
    db.session.add(new_series)
    db.session.commit()

    return jsonify({"message": "Series added to watchlist"}), 201

@app.route("/watchlist/movies/remove", methods=["POST"])
def remove_movie_from_watchlist():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    movie_id = request.json.get("movie_id")
    if not movie_id:
        return jsonify({"error": "Movie ID is required"}), 400

    movie_to_remove = WatchlistMovie.query.filter_by(user_id=user_id, movie_id=movie_id).first()
    if movie_to_remove:
        db.session.delete(movie_to_remove)
        db.session.commit()
        return jsonify({"message": "Movie removed from watchlist"}), 200
    else:
        return jsonify({"error": "Movie not found in watchlist"}), 404

@app.route("/watchlist/series/remove", methods=["POST"])
def remove_series_from_watchlist():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    series_id = request.json.get("series_id")
    if not series_id:
        return jsonify({"error": "Series ID is required"}), 400

    series_to_remove = WatchlistSeries.query.filter_by(user_id=user_id, series_id=series_id).first()
    if series_to_remove:
        db.session.delete(series_to_remove)
        db.session.commit()
        return jsonify({"message": "Series removed from watchlist"}), 200
    else:
        return jsonify({"error": "Series not found in watchlist"}), 404


@app.route("/watchlist/movies", methods=["GET"])
def get_watchlist_movies():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    movies = WatchlistMovie.query.filter_by(user_id=user_id).all()
    movies_list = [{
        "movie_id": movie.movie_id,
        "title": movie.title,
        "overview": movie.overview,
        "poster_path": movie.poster_path,
        "backdrop_path": movie.backdrop_path,
        "original_language": movie.original_language,
        "release_date": movie.release_date,
        "vote_average": movie.vote_average,
        "vote_count": movie.vote_count,
        "popularity": movie.popularity,
        "genre_ids": movie.genre_ids
    } for movie in movies]

    return jsonify(movies_list), 200


@app.route("/watchlist/series", methods=["GET"])
def get_watchlist_series():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    series = WatchlistSeries.query.filter_by(user_id=user_id).all()
    series_list = [{
        "series_id": series.series_id,
        "name": series.name,
        "overview": series.overview,
        "poster_path": series.poster_path,
        "backdrop_path": series.backdrop_path,
        "original_language": series.original_language,
        "first_air_date": series.first_air_date,
        "vote_average": series.vote_average,
        "vote_count": series.vote_count,
        "popularity": series.popularity,
        "genre_ids": series.genre_ids
    } for series in series]

    return jsonify(series_list), 200


    
if __name__ == "__main__" :
    app.run(debug= True, port = 8000)
    