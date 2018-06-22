import React, { Component } from "react";
import { Form, Input, Button } from "antd";
import { firebaseConnect } from "react-redux-firebase";
import { Redirect } from "react-router-dom";

const FormItem = Form.Item;

class StoryAdd extends Component {
	state = { title: null, content: null };

	handleChange = field => ({ target: { value } }) => {
		this.setState({ [field]: value });
	};

	onSubmit = e => {
		e.preventDefault();
		this.props.firebase.push("todos", this.state);
	};

	render() {
		const { isEmpty, isLoaded } = this.props;
		if (isEmpty && isLoaded) {
			return <Redirect to="/login" />;
		}
		return (
			<Form layout="vertical" onSubmit={this.onSubmit}>
				<FormItem label="Title">
					<Input placeholder="Title" onChange={this.handleChange("title")} />
				</FormItem>
				<FormItem label="Content">
					<Input.TextArea
						placeholder="Content"
						autosize={{ minRows: 14 }}
						onChange={this.handleChange("content")}
					/>
				</FormItem>
				<FormItem>
					<Button type="primary" htmlType="submit">
						Submit
					</Button>
				</FormItem>
			</Form>
		);
	}
}

export default firebaseConnect()(StoryAdd);
