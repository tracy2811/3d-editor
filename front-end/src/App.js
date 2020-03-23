import React, { useState, } from 'react';
import Form from './Form';
import NavBar from './NavBar';
import Footer from './Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
	const [user, setUser] = useState(null);

	return (
		<>
		<NavBar user={user} setUser={setUser}/>
		{ !user && <Form setUser={setUser}/> }
		<Footer />
		</>
	);
}

export default App;
