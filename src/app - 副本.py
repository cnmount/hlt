from flask import Flask, request, jsonify
from src.routes.auth_routes import auth_bp
from src.routes.user_routes import user_bp

app = Flask(__name__)
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(user_bp, url_prefix='/user')

if __name__ == '__main__':
    app.run(debug=True)
