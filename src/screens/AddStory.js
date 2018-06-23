import React, { Component } from "react";
import Button from "antd/lib/button";
import Form from "antd/lib/form";
import Input from "antd/lib/input";
import message from "antd/lib/message";
import { firebaseConnect } from "react-redux-firebase";
import { Redirect } from "react-router-dom";

const FormItem = Form.Item;

const initialState = { title: null, content: null };
class StoryAdd extends Component {
  state = initialState;

  handleChange = field => ({ target: { value } }) => {
    this.setState({ [field]: value });
  };

  onSubmit = e => {
    e.preventDefault();
    this.props.firebase.push("stories", this.state).then(() => {
      message.success("Story is created successfully");
      this.setState(initialState);
    });
  };

  render() {
    const { isEmpty, isLoaded } = this.props;
    const { title, content } = this.state;
    if (isEmpty && isLoaded) {
      return <Redirect to="/login" />;
    }
    return (
      <Form layout="vertical" onSubmit={this.onSubmit}>
        <FormItem label="Title">
          <Input
            placeholder="Title"
            onChange={this.handleChange("title")}
            value={title}
          />
        </FormItem>
        <FormItem label="Content">
          <Input.TextArea
            placeholder="Content"
            autosize={{ minRows: 14, maxRows: 14 }}
            onChange={this.handleChange("content")}
            value={content}
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
