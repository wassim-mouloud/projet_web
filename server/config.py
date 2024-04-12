class ApplicationConfig :
    SQLALCHEMY_TRACK_MODIFICATIONS = FALSE
    SQLALCHEMY_ECHO = True
    SQLALCHEMY_DATABASE_URI = r"sqlite:///./db.sqlite"