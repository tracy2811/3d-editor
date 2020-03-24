from passlib.hash import pbkdf2_sha256 as sha256
from run import db
import shutil
import os


class UserModel(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    num_of_models = db.Column(db.Integer, default=0)

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    @classmethod
    def find_by_username(cls, username):
        return cls.query.filter_by(username=username).first()

    @classmethod
    def return_all(cls):
        def to_json(x):
            return {
                'username': x.username,
                'password': x.password
            }

        return {'users': list(map(lambda x: to_json(x), UserModel.query.all()))}

    @classmethod
    def delete_all(cls):
        try:
            num_rows_deleted = db.session.query(cls).delete()
            num_models_deleted = db.session.query(ModelsModel).delete()
            db.session.commit()
            folder = r'static\users_models'
            for the_file in os.listdir(folder):
                file_path = os.path.join(folder, the_file)
                if os.path.isfile(file_path):
                    os.unlink(file_path)
                elif os.path.isdir(file_path):
                    shutil.rmtree(file_path)
            return {'message': '{} user(s) and {} model(s) deleted'.format(num_rows_deleted, num_models_deleted)}
        except:
            return {'message': 'Something went wrong'}

    @staticmethod
    def generate_hash(password):
        return sha256.hash(password)

    @staticmethod
    def verify_hash(password, hash):
        return sha256.verify(password, hash)


class RevokedTokenModel(db.Model):
    __tablename__ = 'revoked_tokens'
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(120))

    def add(self):
        db.session.add(self)
        db.session.commit()

    @classmethod
    def is_jti_blacklisted(cls, jti):
        query = cls.query.filter_by(jti=jti).first()
        return bool(query)


class ModelsModel(db.Model):
    __tablename__ = 'models'

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    user_id = db.Column(db.Integer, nullable=False, name='user_id')
    model_id = db.Column(db.Integer, nullable=False, name='model_id')
    model_name = db.Column(db.String(120), nullable=False)
    is_valid = db.Column(db.Integer, nullable=False, name='is_valid', default=1)

    def add(self):
        db.session.add(self)
        db.session.commit()

    @classmethod
    def find_by_ids(cls, user_id, model_id):
        return db.session.query(cls).filter(cls.user_id == user_id, cls.model_id == model_id).first()

    @classmethod
    def return_all(cls, username):
        def to_json(x):
            return {
                'id': x.model_id,
                'name': x.model_name
            }

        user_id = UserModel.find_by_username(username).id

        return {
            "{}'s models".format(username): list(
                map(lambda x: to_json(x), db.session.query(cls).filter(cls.user_id == user_id, cls.is_valid).all())
            )
        }

    @classmethod
    def rename_model(cls, new_name, user_id, id):
        if db.session.query(cls).filter(cls.user_id == user_id, cls.model_id == id).first().is_valid:
            old_name = db.session.query(cls).filter(cls.user_id == user_id, cls.model_id == id).first().model_name
            db.session.query(cls).filter(cls.user_id == user_id, cls.model_id == id).first().model_name = new_name
            db.session.commit()
        else:
            return {'message': 'This model was deleted'}
        return {
            'old_name': old_name,
            'new_name': db.session.query(cls).filter(cls.user_id == user_id, cls.model_id == id).first().model_name
        }

    @classmethod
    def delete_model(cls, username, id):
        user_id = UserModel.find_by_username(username).id
        model_name = db.session.query(cls).filter(cls.user_id == user_id, cls.model_id == id).first().model_name
        if db.session.query(cls).filter(cls.user_id == user_id, cls.model_id == id).first().is_valid:
            db.session.query(cls).filter(cls.user_id == user_id, cls.model_id == id).first().is_valid = 0
            os.unlink(r'static\users_galleries\{}\{}.jpg'.format(username, id))
            db.session.commit()
        else:
            return {'message': 'This model already was deleted'}
        return {'message': '{}\' model with name {} was successfully deleted'.format(username, model_name)}

    @classmethod
    def check_validity(cls, username, id):
        user_id = UserModel.find_by_username(username).id
        return db.session.query(cls).filter(cls.user_id == user_id, cls.model_id == id).first().is_valid


def create_base():
    db.create_all()
