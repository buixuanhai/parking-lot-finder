import React, { Component } from "react";
import Button from "antd/lib/button";
import Form from "antd/lib/form";
import Input from "antd/lib/input";
import message from "antd/lib/message";
import { firebaseConnect } from "react-redux-firebase";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";
import ImageUploader from "../components/ImageUploader";
const FormItem = Form.Item;

const initialState = { title: null, content: null, imageId: null };
class AddStory extends Component {
  state = initialState;

  handleChange = field => ({ target: { value } }) => {
    this.setState({ [field]: value });
  };

  handleUploadedImage = imageId => this.setState({ imageId });

  onSubmit = e => {
    e.preventDefault();
    this.props.firebase
      .push("stories", {
        ...this.state,
        createdDateTime: Date.now(),
        order: this.props.lastItemOrder - 1
      })
      .then(() => {
        message.success("Story is created successfully");
        this.setState(initialState);
        this.props.firebase.update("counts", {
          stories: this.props.counts.stories + 1
        });
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
        <FormItem>
          <ImageUploader handleUploadedImage={this.handleUploadedImage} />
        </FormItem>
        <FormItem label="Content">
          <Input.TextArea
            placeholder="Content"
            autosize={{ minRows: 10, maxRows: 10 }}
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

export default compose(
  firebaseConnect([{ path: "counts" }]),
  connect(state => {
    return {
      lastItemOrder: state.firebase.data.stories
        ? Math.min(
          ...Object.values(state.firebase.data.stories).map(v => v.order)
        )
        : null,
      counts: state.firebase.data.counts
    };
  })
)(AddStory);
