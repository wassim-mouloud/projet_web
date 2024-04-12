from flask import Flask
from models import db

app = Flask(__name__)

db.init_app(app)
db.create_all()

