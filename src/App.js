import React, { Component } from "react";
import "./style/app.css";

class App extends Component {
	render() {
		return (
			<div className="item">
				<div className="image"></div>
				<h3><i contentEditable={"true"}></i><span contentEditable={"true"}></span></h3>
				<p contentEditable={"true"}></p>
			</div>
		);
	}
}

export default App;
