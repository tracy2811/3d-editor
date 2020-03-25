# 3D Edtior - Frontend

Current frontend is a single webpage using React and Bootstrap. We may need to separate pages using react-router and keep its update with our back-end.

## Setup

1. Download and install dependencies

```bash
# Clone fron-end branch
git clone -b front-end https://github.com/tracy2811/3d-editor.git

# Install back-end dependencies
pip install -r api/requirements.txt

# Install front-end dependencies
cd front-end && npm i
```

2. Run servers (developement version)

```bash
# Run back-end
python3 ../api/run.py

# Run front-end
npm start
```

Everything is set, now you can start developing.

## TODO

* Routing

* Update with gRPC api

* Improve UX

* Optimize `requirements.txt` file

* Setup environment

## Credit

* Icons from [Font Awesome](https://fontawesome.com)

* Background image by Jonatan Pie on Unsplash

