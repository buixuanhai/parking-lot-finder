import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { compose } from "redux";
import {
  firebaseConnect,
  populate,
  firestoreConnect
} from "react-redux-firebase";
import { Redirect } from "react-router-dom";
import get from "lodash/get";
import Icon from "antd/lib/icon";
import { push, goBack } from "react-router-redux";
import { NavBar, Icon as MobileIcon } from "antd-mobile";

const Container = styled.div`
  height: 100vh;
  overflow: auto;
`;

const Content = styled.div`
  padding: 20px;
  white-space: pre-line;
`;

const Image = styled.img`
  width: 100%;
`;

class StoryDetail extends Component {
  addToFavorite = (userId, storyId) => () => {
    this.props.firebase.set(`story_favorite/${userId}/${storyId}`, true);
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
    const {
      title,
      goBack,
      story,
      userId,
      match: {
        params: { id: storyId }
      }
    } = this.props;
    if (story) {
      return (
        <Container>
          <NavBar
            mode="dark"
            icon={<MobileIcon type="left" />}
            onLeftClick={() => goBack()}
            rightContent={[
              <Icon
                key="0"
                type="heart-o"
                style={{ marginRight: "16px" }}
                onClick={this.addToFavorite(userId, storyId)}
              />
            ]}
          >
            {title}
          </NavBar>
          <Content>
            <div>{story.imageURL && <Image src={story.imageURL} />}</div>
            <div>{story.content}</div>
          </Content>
        </Container>
      );
    } else {
      // return <Redirect to="/" />;
      return null;
    }
  }
}

const populates = [{ child: "imageId", root: "uploadedFiles" }];

export default compose(
  firebaseConnect((props, store) => [
    { path: `stories/${props.match.params.id}`, populates },
    { path: "counts" },
    { path: `story_favorite/${store.getState().firebase.auth.uid}` }
  ]),
  connect(
    (state, ownProps) => ({
      story: state.firebase.data.stories
        ? state.firebase.data.stories[ownProps.match.params.id]
        : null,
      userId: state.firebase.auth.uid,
      isFavorited: get(
        state,
        `firebase.data.story_favorite.${ownProps.match.params.id}`
      )
    }),
    { push, goBack }
  )
)(StoryDetail);
