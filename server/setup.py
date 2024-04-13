# db_setup.py

from flask import Flask
from models import db
from config import ApplicationConfig

app = Flask(__name__)
app.config.from_object(ApplicationConfig)

db.init_app(app)

with app.app_context():
    print("Dropping all tables...")
    db.drop_all() 
    print("Creating all tables...")
    db.create_all()  
    print("Database setup complete.")
