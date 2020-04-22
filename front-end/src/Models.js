import React from 'react';

export default function Models({ token, models, getModels, setEditing, setModelEditing,}) {
	// Edit public model button clicked,  update states
	const handleEditPublic = function (event) {
		setEditing(true);
		setModelEditing({ filename: event.target.id, public: true, });
	};

	// Edit private model button clicked, update states
	const handleEditPrivate = function (event) {
		setEditing(true);
		setModelEditing({ filename: event.target.id, public: false, });
	};

	// Delete private model button clicked, update states
	const handleDeletePrivate = function (event) {
		let url = `http://localhost:8000/models/${event.target.id}`;
		fetch(url, {
			method: 'DELETE',
			headers: {
				'Authorization': `bearer ${token}`,
			},
		}).then(res => {
		if (res.ok) getModels();
		});
	};

	// Go to editor, update states
	const handleNew = function () {
		setEditing(true);
		setModelEditing(null);
	};

	return (
		<>
		{ !models || models.public.map(model => 
			<div className="col-sm-6 col-md-4 col-xl-3" key={model._id}>
			<div className="card bg-transparent text-white shadow-lg">
			<div className="card-body">
			<h3 className="card-title">{model.filename}</h3>
			<p className="card-text">This is a public model.</p>
			<button className="btn btn-block btn-outline-info" id={model.filename} onClick={handleEditPublic}>Edit</button>
			</div>
			</div>
			</div>)
		}
		{ !models || !models.private || models.private.map(model => 
			<div className="col-sm-6 col-md-4 col-xl-3" key={model._id}>
			<div className="card bg-transparent text-white shadow-lg">
			<div className="card-body">
			<h3 className="card-title">{model.filename}</h3>
			<p className="card-text">This is your private model.</p>
			<button className="btn btn-block btn-outline-danger" id={model.filename} onClick={handleDeletePrivate} >Delete</button>
			<button className="btn btn-block btn-outline-info" id={model.filename} onClick={handleEditPrivate} >Edit</button>
			</div>
			</div>
			</div>)
		}

		<div className="col-sm-6 col-md-4 col-xl-3">
		<div className="card bg-transparent text-white shadow-lg">
		<div className="card-body">
		<h3 className="card-title">Editor</h3>
		<p className="card-text">Upload your own model and start editing.</p>
		<button className="btn btn-block btn-info" onClick={handleNew} >Go</button>
		</div>
		</div>
		</div>
		</>
	);
};

