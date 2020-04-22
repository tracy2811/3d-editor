# 3D Editor

Simple 3D Editor website

## Built in

* Front-end: React, Bootstrap, Babylonjs

* Back-end: Express (Nodejs), Mongodb

## Setup

1. Download and install dependencies

```bash
# Clone fron-end branch
git clone -b front-end https://github.com/tracy2811/3d-editor.git

# Install back-end dependencies
cd back-end && npm i

# Install front-end dependencies
cd ../front-end && npm i
```

2. Run servers (developement mode)

Create `.env` file in back-end directory with format:

```
SECRET_KEY=ThisIsYourSecretKey
PORT=8000
MONGODB=URIToYourMongoDBDatabase
```

Then you are ready to go.

```bash
# Run back-end
cd ../back-end
npm start

# Run front-end
npm start
```

Backend is now running on port 8000, frontend is on 3000.

Everything is set, now you can start developing.

## API guide

### Users

* Login: POST request to `http://locahost:8000/users/login` with `username` and `password` in body

* Register: POST request to `http://locahost:8000/users/register` with `username` and `password` in body

### Models

* Get available models' information: GET request to `http://locahost:8000/models` (with `token` to get private models)

* Get model: GET request to `http://locahost:8000/models/FILENAME` (with `token` to get private model)

* Create new model: POST request to `http://locahost:8000/models` with `token`, and `.glb` file under name `model`

* Update old model: PUT request to `http://locahost:8000/models/FILENAME` with `token`, and new `.glb` file under name `model`

* Delete model: DELETE request to `http://locahost:8000/models/FILENAME` with `token`

You can get information about api by making GET request to `http://locahost:8000`.

## Credit

* Icons from [Font Awesome](https://fontawesome.com)

* Background image by Jonatan Pie on Unsplash

