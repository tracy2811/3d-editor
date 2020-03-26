import React, { useState, } from 'react';
import Form from './Form';
import NavBar from './NavBar';
import Editor from './Editor';
import Footer from './Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
	const [user, setUser] = useState(null);
	return (
		<>
		<NavBar user={user} setUser={setUser}/>
		{ !user && <Form setUser={setUser}/> }
		{ !user || 
				<>
				<h2 className="text-secondary text-center" id="drag-guide">Drag and Drop to Upload Model</h2> 
				<Editor />
				</>
		}
		<Footer />
		</>
	);
}

export default App;

