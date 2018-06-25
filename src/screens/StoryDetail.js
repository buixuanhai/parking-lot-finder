import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { compose } from "redux";
import { firebaseConnect, populate } from "react-redux-firebase";
import { Redirect } from "react-router-dom";
import Button from "antd/lib/button";
import Popconfirm from "antd/lib/popconfirm";
import { push } from "react-router-redux";

const Container = styled.div`
  height: 100vh;
  overflow: auto;
`;

const Content = styled.p`
  padding: 20px;
  padding-top: 60px;
  white-space: pre-line;
`;

const Header = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	right: 0
	background-color: white;
	display: flex;
	padding: 12px;
	padding-left: 52px;
	padding-right: 52px;
	justify-content: center;
`;

const Title = styled.h3`
  text-align: center;
`;

const Image = styled.img`
  width: 100%;
`;

class StoryDetail extends Component {
  handleBack = () => {
    this.props.push("/");
  };

  handleDelete = () => {
    this.props.firebase.remove(`stories/${this.props.id}`).then(() => {
      this.props.push("/");
      this.props.firebase.update("counts", {
        stories: this.props.counts.stories - 1
      });
    });
  };

  render() {
    const { title, content, imageURL } = this.props;
    if (this.props.id) {
      return (
        <Container>
          {imageURL && <Image src={imageURL} />}
          <Button
            shape="circle"
            icon="arrow-left"
            style={{ position: "absolute", top: 10, left: 10, zIndex: 2 }}
            onClick={this.handleBack}
          />
          <Header>
            <Title>{title}</Title>

            <Popconfirm
              title="Are you sure delete this story?"
              onConfirm={this.handleDelete}
              okText="Yes"
              placement="leftTop"
              cancelText="No"
            >
              <Button
                shape="circle"
                icon="delete"
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  zIndex: 2,
                  color: "red"
                }}
              />
            </Popconfirm>
          </Header>
          <Content>{content}</Content>
        </Container>
      );
    } else {
      return <Redirect to="/" />;
    }
  }
}

const populates = [{ child: "imageId", root: "uploadedFiles" }];

export default compose(
  firebaseConnect([{ path: "stories", populates }, { path: "counts" }]),
  connect(
    state => ({
      ...state.firebase.data,
      stories: populate(state.firebase, "stories", populates)
    }),
    { push },
    (stateProps, dispatchProps, ownProps) => {
      const { stories } = stateProps;
      if (stories) {
        const id = ownProps.match.params.id;
        const story = stories[id];
        if (story) {
          return {
            ...dispatchProps,
            ...stateProps,
            ...ownProps,
            ...story,
            id,
            imageURL: story.imageId ? story.imageId.downloadURL : null
          };
        } else {
          return { ...dispatchProps };
        }
      } else {
        return { ...dispatchProps };
      }
    }
  )
)(StoryDetail);
