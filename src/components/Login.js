import React, { Component } from "react";
import Button from "antd/lib/button";
import Form from "antd/lib/form";
import Input from "antd/lib/input";
import { firebaseConnect } from "react-redux-firebase";
import styled from "styled-components";
import { connect } from "react-redux";
import { compose } from "redux";
import { Redirect } from "react-router-dom";
import { push } from "react-router-redux";
const Container = styled.div`
	margin: 10px;
`;

const FormItem = Form.Item;

class Login extends Component {
	state = { login: null, password: null };

	handleChange = field => ({ target: { value } }) => {
	  this.setState({ [field]: value });
	};

	handleCancel = () => {
	  this.props.push("/");
	};

	onSubmit = e => {
	  e.preventDefault();
	  this.props.firebase.login(this.state);
	};

	render() {
	  if (!this.props.auth.isEmpty) {
	    return <Redirect to="/" />;
	  }
	  return (
	    <Container>
	      <Form layout="vertical" onSubmit={this.onSubmit}>
	        <FormItem label="Email">
	          <Input placeholder="Email" onChange={this.handleChange("email")} />
	        </FormItem>
	        <FormItem label="Password">
	          <Input
	            placeholder="Password"
	            onChange={this.handleChange("password")}
	            type="password"
	          />
	        </FormItem>
	        <FormItem>
	          <Button
	            type="primary"
	            htmlType="submit"
	            style={{ marginRight: 20 }}
	          >
							Login
	          </Button>
	          <Button onClick={this.handleCancel}>Cancel</Button>
	        </FormItem>
	      </Form>
	    </Container>
	  );
	}
}

export default compose(
  firebaseConnect(() => {
    return ["stories"];
  }),
  connect(
    state => ({
      profile: state.firebase.profile,
      auth: state.firebase.auth
    }),
    { push }
  )
)(Login);
