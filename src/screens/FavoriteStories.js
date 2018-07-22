import React, { Component } from "react";
import Icon from "antd/lib/icon";
import Spin from "antd/lib/spin";
import styled from "styled-components";
import StoryItem from "../components/Story/Item";
import { Link } from "react-router-dom";
import Infinite from "react-infinite";
import Divider from "antd/lib/divider";
import { connect } from "react-redux";
import { compose } from "redux";
import { push } from "react-router-redux";

import { firebaseConnect, populate } from "react-redux-firebase";

const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

const ListContainer = styled.div`
  padding: 10px; */
`;

class FavoriteStories extends Component {
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
              useWindowAsScrollContainer
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
                    display: "block"
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

const populates = (dataKey, originalData) => [
  {
    child: Object.keys(originalData)[0],
    root: "stories"
  }
];

export default compose(
  firebaseConnect(() => [
    {
      path: "story_favorite",
      populates
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
)(FavoriteStories);
