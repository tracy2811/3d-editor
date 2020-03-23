import React from 'react';

export default function Nav({ user, setUser}) {
	function handleLogout() {
		setUser(null);
	}
	return (
		<nav className="navbar navbar-expand-lg navbar-dark bg-dark">
		<a className="navbar-brand" href="https://github.com/tracy2811/3d-editor/">
		<img src="/GitHub-Mark-Light-32px.png" width="30" height="30" className="d-inline-block align-top" alt="" /> 3D EDITOR</a>

		{ user &&
			<button className="ml-auto btn btn-light" onClick={handleLogout}>
			{user.username} <img src="/logout.svg" width="20" height="20" className="d-inline-block align-top" alt="" /></button>
		}
		</nav>
	);
};

