#!/usr/bin/python3
""" Starts a Flash Web Application """
#!/usr/bin/python3
""" Flask Application """
from models import storage
from app.routes import app_routes
from flask import Flask, jsonify


app = Flask(__name__)
app.register_blueprint(app_routes)


if __name__ == "__main__":
    """ Main Function """
    app.run(host='0.0.0.0', port=5001, debug=True)