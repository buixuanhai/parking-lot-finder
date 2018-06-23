import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import Icon from "antd/lib/icon";
import Spin from "antd/lib/spin";
import List from "antd/lib/list";
import styled from "styled-components";
import StoryItem from "./Item";
const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

const ListContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  /* height: 100%; */
`;

class StoryList extends Component {
  state = { stories: [] };
  static getDerivedStateFromProps(nextProps) {
    if (!nextProps.stories) {
      return null;
    }
    return {
      stories: Object.keys(nextProps.stories).map(id => ({
        id,
        ...nextProps.stories[id]
      }))
    };
  }
  render() {
    const { stories } = this.state;
    if (!stories) {
      return null;
    }

    return (
      <ListContainer>
        {stories.length ? (
          <List
            style={{
              height: "calc(100vh - 120px)",
              overflow: "auto"
            }}
            itemLayout="horizontal"
            dataSource={stories}
            renderItem={item => <StoryItem key={item.id} {...item} />}
          />
        ) : (
          <Spin indicator={antIcon} />
        )}
      </ListContainer>
    );
  }
}

export default connect(
  null,
  { push }
)(StoryList);
