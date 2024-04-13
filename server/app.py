from flask import Flask, request, abort, jsonify, session
from flask_bcrypt import Bcrypt
from flask_session import Session
from models import db, User
from config import ApplicationConfig

app = Flask(__name__)
app.config.from_object(ApplicationConfig)
bcrypt = Bcrypt(app)
server_session = Session(app)
db.init_app(app)

with app.app_context() :
    db.create_all()
    
@app.route("/register", methods=["POST"])
def register_user() :
        
    email = request.json["email"]
    password = request.json["password"]
    
    user_exists = User.query.filter_by( email=email ).first() is not None
    
    if user_exists :
        return jsonify({"error" : "User already exists"}), 409
    
    hashed_password = bcrypt.generate_password_hash(password)
    new_user = User (email = email,  password = hashed_password)
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify ({
        "id" : new_user.id,
        "email" : new_user.email
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
        "email": user.email
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
        "email": user.email
    })

    
    
@app.route("/logout", methods=["POST"])
def logout_user():
    # Remove 'user_id' from session, fail silently if 'user_id' isn't present
    session.pop("user_id", None)
    
    # Return a JSON response indicating successful logout
    return jsonify({"message": "Logged out successfully"}), 200


    


if __name__ == "__main__" :
    app.run(debug= True, port = 8000)
    