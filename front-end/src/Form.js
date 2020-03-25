import React, { useState, } from 'react';

export default function Form({ setUser, }) {
	const [form, setForm] = useState({ login: true, ok: true, });

	function handleSubmit(event) {
		const formData = new FormData(event.target);
		const url = `http://localhost:8000/${form.login ? 'login' : 'registration'}`;
		const username = formData.get('username');
		fetch(url, {
			method: 'POST',
			body: formData,
		}).then(res => {
			if (res.ok) {
				setUser({ username, });
			} else {
				setForm({ login: form.login, ok: res.ok, });
			}
		});
		event.preventDefault();
	}

	function handleClick() {
		setForm({ login: !form.login, ok: true, });
	}

	return (
		<form onSubmit={handleSubmit} className="bg-transparent text-white rounded p-3 my-4 mx-auto shadow-lg">
			<h2 className="text-center">{form.login ? 'Login' : 'Register'}</h2>

			<div className="form-group">
			<label>Username</label>
			<input type="text" name="username" className="form-control bg-transparent text-white" required pattern="[^\s]+" placeholder="demo"/>
			</div>

			<div className="form-group">
			<label>Password</label>
			<input type="password" name="password" className="form-control bg-transparent text-white" required minLength="4" placeholder="demo" />
			</div>

			{!form.ok &&
				<p className="text-sm-center text-danger">
				{form.login ? 'Incorrect Username or Password' : 'Username existed'}
				</p>
			}
			<button type="submit" className="btn btn-light btn-block">{form.login ? 'Login' : 'Register'}</button>

			<hr />
			<button onClick={handleClick} type="button" className="btn btn-link text-info">{form.login ? 'Register' : 'Login'}</button>
		</form>
	);
};

