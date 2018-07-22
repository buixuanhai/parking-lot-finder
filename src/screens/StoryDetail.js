import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { compose } from "redux";
import { firebaseConnect } from "react-redux-firebase";
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
  toggleFavorite = (userId, storyId) => () => {
    const { firebase, isFavorited } = this.props;
    firebase.set(`story_favorite/${userId}/${storyId}`, !isFavorited);
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
      goBack,
      story,
      userId,
      match: {
        params: { id: storyId }
      },
      isFavorited
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
                type={isFavorited ? "heart" : "heart-o"}
                style={{ marginRight: "16px" }}
                onClick={this.toggleFavorite(userId, storyId)}
              />
            ]}
          >
            {story.title}
          </NavBar>
          <Content>
            <div>{story.imageURL && <Image src={story.imageURL} />}</div>
            <div>{story.content}</div>
          </Content>
        </Container>
      );
    } else {
      return null;
    }
  }
}

const populates = [{ child: "imageId", root: "uploadedFiles" }];

export default compose(
  firebaseConnect((props, store) => {
    return [
      { path: `stories/${props.match.params.id}`, populates },
      { path: "counts" },
      { path: `story_favorite/${store.getState().firebase.auth.uid}` }
    ];
  }),
  connect(
    (state, ownProps) => {
      return {
        story: state.firebase.data.stories
          ? state.firebase.data.stories[ownProps.match.params.id]
          : null,
        userId: state.firebase.auth.uid,
        isFavorited: state.firebase.data.story_favorite
          ? state.firebase.data.story_favorite[state.firebase.auth.uid][
            ownProps.match.params.id
          ]
          : null
      };
    },
    { push, goBack }
  )
)(StoryDetail);
