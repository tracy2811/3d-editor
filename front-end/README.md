# 3D Edtior - Frontend

Current frontend is a single webpage using React and Bootstrap. We may need to separate pages using react-router and keep its update with our back-end.

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

2. Run servers (developement version)

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

Everything is set, now you can start developing.

## TODO

* Improve UX

* Save token

## Credit

* Icons from [Font Awesome](https://fontawesome.com)

* Background image by Jonatan Pie on Unsplash

