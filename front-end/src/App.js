import React, { useState, useEffect, } from 'react';
import Form from './Form';
import NavBar from './NavBar';
import Editor from './Editor';
import Footer from './Footer';
import Models from './Models';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
	// States
	const [user, setUser] = useState(null);
	const [token, setToken] = useState('');
	const [models, setModels] = useState(null);
	const [editing, setEditing] = useState(false);
	const [modelEditing, setModelEditing] = useState(null);

	// Get model list and update
	const getModels = function () {
		if (editing || !token) return;
		const url = 'http://localhost:8000/models';
		fetch(url, {
			headers: {
				'Authorization': `bearer ${token}`,
			},
		}).then(res => res.json()).then(res => setModels(res));
	};

	useEffect(getModels, [token, editing]);

	return (
		<>
		<NavBar user={user} setUser={setUser} setToken={setToken}/>
		<div className="container">
		<div className="row p-5 align-content-center justify-content-center">
		{ !user && <Form setToken={setToken} setUser={setUser}/> }
		{ !!token && !editing &&
				<Models token={token} models={models} getModels={getModels} setEditing={setEditing} setModelEditing={setModelEditing}/> }
		{ !token || !editing || 
				<Editor token={token} setEditing={setEditing} modelEditing={modelEditing} setModelEditing={setModelEditing}/>
		}
		</div>
		</div>
		<Footer />
		</>
	);
}

export default App;

