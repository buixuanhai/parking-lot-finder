import React, { Component } from "react";
import Icon from "antd/lib/icon";
import Spin from "antd/lib/spin";
import styled from "styled-components";
import StoryItem from "./Item";
import { Link } from "react-router-dom";
import Infinite from "react-infinite";

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
    return {
      stories: Object.keys(nextProps.stories)
        .map(id => ({
          id,
          ...nextProps.stories[id]
        }))
        .sort((a, b) => a.order > b.order)
    };
  }

  handleInfiniteLoad = () => console.log("loading");
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
              // loadingSpinnerDelegate={this.elementInfiniteLoad()}
              // isInfiniteLoading={this.state.isInfiniteLoading}
            >
              {stories.map(item => (
                <Link
                  key={item.id}
                  to={`/stories/${item.id}`}
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <StoryItem {...item} />
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

export default StoryList;
