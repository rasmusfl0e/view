import React, { Component } from "react";
import ContentEditable from "react-wysiwyg";
import "../style/app.css";

var items = [
	{id: 1, skin: "a"},
	{id: 2, skin: "a-3"},
	{id: 3, skin: "a-3"},
	{id: 4, skin: "b"},
	{id: 5, skin: "b"}
];

class Item extends Component {

	constructor(props) {
		super();

		this.select = this.select.bind(this);
		this.focusChild = this.focusChild.bind(this);
	}

	select(event) {
		if (event.key === "Enter" && this.props.selected !== this.props.id) {
			this.focusChild();
		}
	}

	focusChild() {
		this.props.select(this.props.id);
	}

	filterKeys(event) {
		switch (event.key) {
			case "Enter":
				event.stopPropagation();
				event.preventDefault();
				break;
		}
	}

	paste(event) {
		console.log("paste", event);
		var data = event.clipboardData.getData("text/plain");
		event.clipboardData = data.replace(/(<([^>]+)>)/ig,"");
	}

	change(textContent, placeholder) {
		console.log("change", textContent, placeholder);
	}

	render() {
		var { id, skin, selected, focused } = this.props;
		var tabIndex = (selected === id)  ? 0 : -1;
		var childProps = {
			contentEditable: "true",
			onFocus: this.focusChild,
			onKeyDown: this.filterKeys,
			onPaste: this.paste,
			tabIndex
		};

		var className = "item item--" + skin;

		if (selected === id) {
			className += " item--selected";
		}
		else if (focused === id) {
			className += " item--focused";
		}

		return (<div className={className} onFocus={()=>this.props.focus(this.props.id)} onKeyDown={this.select} tabIndex={ (!selected) ? 0 : -1 }>
					<div className="image" {...childProps} contentEditable="false"></div>
					<div className="text">
						<h3><i {...childProps}></i><span {...childProps}></span></h3>
						<ContentEditable tagName="p" preventStyling noLinebreaks editing={true} onChange={this.change}/>
						<p {...childProps}></p>
					</div>
				</div>);
	}
}

class App extends Component {

	constructor(props) {
		super();

		this.focus = this.focus.bind(this);
		this.select = this.select.bind(this);
		this.unselect = this.unselect.bind(this);
		this.handleUnselect = this.handleUnselect.bind(this);

		this.state = {
			focused: null,
			selected: null
		};
	}

	focus(focused) {
		console.log("focus", focused, this.state.selected);
		/*
		this.setState({
			focused,
			selected: (focused !== this.state.selected) ? null : focused
		});
		*/
	}

	select(selected) {
		console.log("select", selected);
		this.setState({
			selected,
			focused: selected
		});
	}

	unselect() {
		console.log("unselect");
		this.setState({
			selected: null
		});
	}

	handleUnselect(event) {
		if (event.key === "Escape") {
			this.unselect();
		}
	}

	render() {
		return (
			<div onKeyDown={this.handleUnselect}>
				{
					items.map(
						({id, skin}) =>
						<Item
							key={id}
							id={id}
							skin={skin}
							selected={this.state.selected}
							select={this.select}
							focused={this.state.focused}
							focus={this.focus}
						/>
					)
				}
			</div>
		);
	}
}

export default App;
