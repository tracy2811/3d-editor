# 3D Edtior - Frontend

Current frontend is a single webpage using React and Bootstrap and use old api. We may need to separate pages using react-router and keep its update with our back-end.

## Getting started

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

* Implement view/edit page

* Routing

* Update with gRPC api

* Improve design

* Optimize `requirements.txt` file

* Setup environment

