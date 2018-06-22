import React, { Component } from "react";
import { connect } from "react-redux";
class StoryList extends Component {
	state = {};
	render() {
		return <h1>Story list</h1>;
	}
}

export default connect()(StoryList);
