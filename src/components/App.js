import React, { Component } from "react";
import "../style/app.css";

var items = [
	{id: 1, skin: "a"},
	{id: 2, skin: "a-3"},
	{id: 3, skin: "a-3"},
	{id: 4, skin: "b-3"},
	{id: 5, skin: "b"}
];

class Item extends Component {

	constructor(props) {
		super();

		this.keyhandler = this.keyhandler.bind(this);
		this.focusChild = this.focusChild.bind(this);
		this.paste = this.paste.bind(this);
	}

	keyhandler(event) {

		switch (event.key) {

			case "Enter":
				if (this.props.selected !== this.props.id) {
					this.focusChild();
				}
				break;

			default:
				break;
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

			default:
				break;
		}
	}

	// from react-wysiwyg
	_replaceCurrentSelection(data) {
		var selection = window.getSelection();
		var range = selection.getRangeAt(0);
		range.deleteContents();
		var fragment = range.createContextualFragment('');
		fragment.textContent = data;
		var replacementEnd = fragment.lastChild;
		range.insertNode(fragment);
		// Set cursor at the end of the replaced content, just like browsers do.
		range.setStartAfter(replacementEnd);
		range.collapse(true);
		selection.removeAllRanges();
		selection.addRange(range);
	}

	paste(event) {
		var data = event.clipboardData.getData("text/plain");
		this._replaceCurrentSelection(data);
		event.preventDefault();
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
// <ContentEditable tagName="p" preventStyling noLinebreaks editing={this.state.editing} onChange={this.change} onFocus={()=>this.setState({editing: true})} onBlur={()=>this.setState({editing: false})}/>
		return (<div className={className} onFocus={()=>this.props.focus(this.props.id)} onKeyDown={this.keyhandler} tabIndex={ (!selected) ? 0 : -1 }>
					<div className="image" {...childProps} contentEditable="false"></div>
					<div className="text">
						<h3><i {...childProps}></i><span {...childProps}></span></h3>
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
