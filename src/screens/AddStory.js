import React, { Component, Fragment } from "react";
import message from "antd/lib/message";
import { firebaseConnect } from "react-redux-firebase";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";
import ImageUploader from "../components/ImageUploader";
import styled from "styled-components";
import { NavBar } from "antd-mobile";
import Icon from "antd/lib/icon";
import { withRouter } from "react-router";
import { Form as FinalForm, Field } from "react-final-form";
import { InputItem } from "antd-mobile";
import { required } from "../utils/validations";
import { TextareaItem } from "antd-mobile";

const FormContainer = styled.div`
  padding: 10px;
  height: calc(100vh - 45px);
`;

const Container = styled.div`
  height: 100vh;
  overflow: hidden;
`;

class AddStory extends Component {
  onSave = values => {
    const storyCount = this.props.counts.stories;
    const { firebase, history } = this.props;
    firebase
      .push("stories", {
        ...values,
        createdDateTime: Date.now(),
        order: 1000000000 - storyCount - 1
      })
      .then(() => {
        message.success("Story is created successfully");
        firebase
          .update("counts", {
            stories: storyCount + 1
          })
          .then(() => {
            history.goBack();
          });
      });
  };

  render() {
    let submit;
    const { isEmpty, isLoaded, history } = this.props;
    if (isEmpty && isLoaded) {
      return <Redirect to="/" />;
    }
    return (
      <Container>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => history.goBack()}
          rightContent={[
            <span key="1" onClick={event => submit(event)}>
              Save
            </span>
          ]}
        >
          Add story
        </NavBar>
        <FormContainer>
          <FinalForm
            onSubmit={this.onSave}
            render={({ handleSubmit, form, submitting, pristine, values }) => {
              submit = handleSubmit;
              return (
                <form onSubmit={handleSubmit}>
                  <div>
                    <Field name="title" validate={required}>
                      {({ input, meta }) => (
                        <Fragment>
                          <InputItem {...input} clear placeholder="Story title">
                            Title
                          </InputItem>
                          {meta.error &&
                            meta.touched && <span>{meta.error}</span>}
                        </Fragment>
                      )}
                    </Field>
                    <Field name="image">
                      {({ input, meta }) => (
                        <Fragment>
                          <ImageUploader {...input} error={true} />
                          {meta.error &&
                            meta.touched && <span>{meta.error}</span>}
                        </Fragment>
                      )}
                    </Field>
                    <Field name="content" validate={required}>
                      {({ input, meta }) => (
                        <Fragment>
                          <TextareaItem
                            clear
                            placeholder="Story content"
                            rows={10}
                            {...input}
                          >
                            Title
                          </TextareaItem>
                          {meta.error &&
                            meta.touched && <span>{meta.error}</span>}
                        </Fragment>
                      )}
                    </Field>
                  </div>
                </form>
              );
            }}
          />
        </FormContainer>
      </Container>
    );
  }
}

export default compose(
  firebaseConnect([{ path: "counts" }]),
  connect(state => ({ counts: state.firebase.data.counts })),
  withRouter
)(AddStory);
