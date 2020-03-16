import os.path

from flask_restful import Resource, reqparse
from werkzeug.datastructures import FileStorage
from datetime import timedelta
from flask import send_from_directory, Response, make_response, get_template_attribute, request
import models
import os
from flask_jwt_extended import (create_access_token, create_refresh_token, jwt_required,
                                jwt_refresh_token_required, get_jwt_identity, get_raw_jwt)

auth_parser = reqparse.RequestParser()
auth_parser.add_argument('username', help='This field cannot be blank', location='form');#, required=True)
auth_parser.add_argument('password', help='This field cannot be blank', location='form')#, required=True)

model_rename_parser = reqparse.RequestParser()
model_rename_parser.add_argument('id', help='This field cannot be blank', required=True)
model_rename_parser.add_argument('new_name', help='This field cannot be blank', required=True)

model_delete_parser = reqparse.RequestParser()
model_delete_parser.add_argument('id', help='This field cannot be blank', required=True)

model_download_parser = reqparse.RequestParser()
model_download_parser.add_argument('model', type=FileStorage, location='files')
model_download_parser.add_argument('name', help='This field cannot be blank', required=True)


class UserRegistration(Resource):
    def get(self):
        content = get_file('registration_page.html')
        return Response(content, mimetype="text/html")

    def post(self):
        dir = root_dir()
        data = auth_parser.parse_args()
        access_token_expiration_time = timedelta(minutes=15)
        refresh_token_expiration_time = timedelta(days=7)

        if models.UserModel.find_by_username(data['username']):
            return {'message': 'User {} already exists'.format(data['username'])}

        new_user = models.UserModel(
            username=data['username'],
            password=models.UserModel.generate_hash(data['password'])
        )

        new_user.save_to_db()
        print('User created')
        access_token = create_access_token(identity=data['username'], expires_delta=access_token_expiration_time)
        refresh_token = create_refresh_token(identity=data['username'], expires_delta=refresh_token_expiration_time)
        print('Tokens generated')
        os.mkdir(r'static/users_models/{}'.format(data['username']))
        template = get_template_attribute('success_registration.html', 'success_registration')
        print('Template generated')
        resp = make_response(template(data['username']))
        print('Response created')
        resp.set_cookie(data['username'], access_token)
        print('Cookies set')
        return resp
        try:
            new_user.save_to_db()
            access_token = create_access_token(identity=data['username'], expires_delta=access_token_expiration_time)
            refresh_token = create_refresh_token(identity=data['username'], expires_delta=refresh_token_expiration_time)
            os.mkdir(r'static/users_models/{}'.format(data['username']))
            template = get_template_attribute('success_registration.html', 'success_registration')
            resp = make_response(template(data['username']))
            resp.set_cookie(data['username'], access_token)
            return resp
        except:
            return {'message': 'Something went wrong'}, 500


class UserLogin(Resource):
    def get(self):
        content = get_file('login_page.html')
        return Response(content, mimetype="text/html")

    def post(self):
        data = auth_parser.parse_args()
        access_token_expiration_time = timedelta(minutes=5)
        refresh_token_expiration_time = timedelta(days=1)
        current_user = models.UserModel.find_by_username(data['username'])

        if not current_user:
            return {'message': 'User {} doesn\'t exist'.format(data['username'])}

        if models.UserModel.verify_hash(data['password'], current_user.password):
            access_token = create_access_token(identity=data['username'], expires_delta=access_token_expiration_time)
            refresh_token = create_refresh_token(identity=data['username'], expires_delta=refresh_token_expiration_time)
            template = get_template_attribute('success_login.html', 'success_login')
            resp = make_response(template(data['username']))
            resp.set_cookie(data['username'], access_token)
            return resp
        else:
            return {'message': 'Wrong credentials'}


class UserLogoutAccess(Resource):
    @jwt_required
    def post(self):
        jti = get_raw_jwt()['jti']
        try:
            revoked_token = models.RevokedTokenModel(jti=jti)
            revoked_token.add()
            return {'message': 'Access token has been revoked'}
        except:
            return {'message': 'Something went wrong'}, 500


class UserLogoutRefresh(Resource):
    @jwt_refresh_token_required
    def post(self):
        jti = get_raw_jwt()['jti']
        try:
            revoked_token = models.RevokedTokenModel(jti=jti)
            revoked_token.add()
            return {'message': 'Refresh token has been revoked'}
        except:
            return {'message': 'Something went wrong'}, 500


class TokenRefresh(Resource):
    @jwt_refresh_token_required
    def post(self):
        current_user = get_jwt_identity()
        access_token = create_access_token(identity=current_user)
        return {'access_token': access_token}


class AllUsers(Resource):
    def get(self):
        return models.UserModel.return_all()

    def delete(self):
        return models.UserModel.delete_all()


class SecretResource(Resource):
    @jwt_required
    def get(self):
        return {
            'answer': 42
        }

def root_dir():
    return os.path.abspath(os.path.dirname(__file__))

def get_file(filename):
    try:
        src = os.path.join(root_dir(), filename)
        return open(src).read()
    except IOError as exc:
        return str(exc)

class GetSphere(Resource):
    def get(self):
        content = get_file('sphere.html')
        return Response(content, mimetype="text/html")

class UploadButton(Resource):
    def get(self):
        content = get_file('button.html')
        return Response(content, mimetype="text/html")

    def post(self):
        data = model_download_parser.parse_args()
        model = data['model']
        model_name = data['name']

        if not model:
            return {'message': 'No model was found'}  # TODO Add HTTP error ID
        try:
            dir = root_dir()
            model.save(
                dst=r'{}/static/3d_models/{}.glb'.format(dir, model_name)
            )
            model.close()
        except:
            return {'message': 'Something went wrong'}, 500
        return {
            'message': 'Model with name {} was successfully saved'.format(model_name)
        }

class GetDonut(Resource):
    def get(self):
        content = get_file('donut.html')
        return Response(content, mimetype="text/html")

    
