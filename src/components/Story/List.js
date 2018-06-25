import React, { Component } from "react";
import Icon from "antd/lib/icon";
import Spin from "antd/lib/spin";
import styled from "styled-components";
import StoryItem from "./Item";
import { Link } from "react-router-dom";
import Infinite from "react-infinite";
import Divider from "antd/lib/divider";
import Loading from "../Loading";
import { connect } from "react-redux";
import { compose } from "redux";
import { push } from "react-router-redux";

import { firebaseConnect, populate } from "react-redux-firebase";

const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

const ListContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 120px);
`;

class StoryList extends Component {
  state = { stories: [] };
  static getDerivedStateFromProps(nextProps) {
    if (!nextProps.stories) {
      return null;
    }

    const stories = Object.keys(nextProps.stories)
      .map(id => ({
        id,
        ...nextProps.stories[id]
      }))
      .sort((a, b) => a.order > b.order);

    return {
      stories
    };
  }

  render() {
    const { stories } = this.state;
    if (!stories) {
      return null;
    } else {
      return (
        <ListContainer>
          {stories.length ? (
            <Infinite
              elementHeight={69.4}
              containerHeight={window.innerHeight - 120}
              infiniteLoadBeginEdgeOffset={200}
              onInfiniteLoad={this.props.loadMoreStories}
            >
              {stories.map((item, index) => (
                <Link
                  key={item.id}
                  to={`/stories/${item.id}`}
                  style={{
                    textDecoration: "none",
                    color: "black",
                    display: "block",
                    width: "100vw"
                  }}
                >
                  <StoryItem {...item} index={index} />
                  <Divider />
                </Link>
              ))}
            </Infinite>
          ) : (
            <Spin indicator={antIcon} />
          )}
        </ListContainer>
      );
    }
  }
}

const populates = [{ child: "imageId", root: "uploadedFiles" }];

export default compose(
  firebaseConnect(props => [
    {
      path: "stories",
      populates: populates,
      queryParams: [
        `limitToFirst=${props.itemPerPage * props.page}`,
        "orderByChild=order"
      ]
    },
    {
      path: "counts"
    }
  ]),
  connect(
    state => ({
      stories: populate(state.firebase, "stories", populates)
    }),
    { push }
  )
)(StoryList);
