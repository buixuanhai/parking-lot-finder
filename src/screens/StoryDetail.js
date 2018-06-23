import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { compose } from "redux";
import { firebaseConnect, populate } from "react-redux-firebase";
import Button from "antd/lib/button";
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
  render() {
    const { title, content, imageURL } = this.props;
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
        </Header>
        <Content>{content}</Content>
      </Container>
    );
  }
}

const populates = [{ child: "imageId", root: "uploadedFiles" }];

export default compose(
  firebaseConnect([{ path: "stories", populates }]),
  connect(
    state => ({
      stories: populate(state.firebase, "stories", populates),
      uploadedFiles: state.firebase.data.uploadedFiles
    }),
    { push },
    (stateProps, dispatchProps, ownProps) => {
      const { stories } = stateProps;
      if (stories) {
        const id = ownProps.match.params.id;
        const story = stories[id];
        return {
          id,
          ...story,
          imageURL: story.imageId ? story.imageId.downloadURL : null,
          ...dispatchProps
        };
      } else {
        return { ...dispatchProps };
      }
    }
  )
)(StoryDetail);
