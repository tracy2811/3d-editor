from flask import Flask
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
import models, resources
from flask_jwt_extended import JWTManager

app = Flask(__name__)

api = Api(app)

api.add_resource(resources.BasePage, '/')
api.add_resource(resources.UserRegistration, '/registration')
api.add_resource(resources.UserLogin, '/login')
api.add_resource(resources.UserLogoutAccess, '/logout')
api.add_resource(resources.UserLogoutRefresh, '/logout/refresh')
api.add_resource(resources.TokenRefresh, '/token/refresh')
api.add_resource(resources.AllUsers, '/users')
api.add_resource(resources.GetSphere, '/sphere')
api.add_resource(resources.UploadButton, '/upload')
api.add_resource(resources.GetDonut, '/donut')
api.add_resource(resources.SecretResource, '/secret')

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///models.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'InnopolisBachOne'

db = SQLAlchemy(app)

app.config['JWT_SECRET_KEY'] = 'ThisIsVerySecretKey'
app.config['JWT_BLACKLIST_ENABLED'] = True
app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access', 'refresh']

jwt = JWTManager(app)


@jwt.token_in_blacklist_loader
def check_if_token_in_blacklist(decrypted_token):
    jti = decrypted_token['jti']
    return models.RevokedTokenModel.is_jti_blacklisted(jti)


@app.before_first_request
def create_tables():
    db.create_all()


if __name__ == '__main__':
    models.create_base()
    app.run('localhost', 5000, debug=True)
