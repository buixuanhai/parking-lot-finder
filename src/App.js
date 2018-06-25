import React from "react";
import styled from "styled-components";
import Header from "./components/Header";
import Tabs from "antd/lib/tabs";
import Button from "antd/lib/button";

import { connect } from "react-redux";
import { compose } from "redux";
import { push } from "react-router-redux";

import { firebaseConnect, populate } from "react-redux-firebase";
import StoryList from "./components/Story/List";
import message from "antd/lib/message";
import Loadable from "react-loadable";
import Loading from "./components/Loading";
import "./App.css";

const AddStory = Loadable({
  loader: () => import("./screens/AddStory"),
  loading: Loading
});

const TabPane = Tabs.TabPane;

const TabContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  top: 50px;
  display: flex;
  align-items: flex-end;
`;
const AppContainer = styled.div`
  position: relative;
  height: 100vh;
  overflow: hidden;
`;

const TabContent = styled.div`
  height: calc(100vh - 60px);
  padding: 10px;
  width: 100%;
  overflow: auto;
`;

const populates = [{ child: "imageId", root: "uploadedFiles" }];

class App extends React.Component {
  state = {
    tabKey: "1",
    page: 1,
    itemPerPage: 5
  };

  enhancedCreator = (page, itemPerPage) =>
    compose(
      firebaseConnect([
        {
          path: "stories",
          populates: populates,
          queryParams: [
            // `startAt=${itemPerPage * (page - 1)}`,
            `limitToFirst=${itemPerPage * page}`,
            "orderByChild=order"
          ]
        }
      ]),
      connect(
        state => ({
          stories: populate(state.firebase, "stories", populates)
        }),
        { push }
      )
    );

  EnhancedStoryList = this.enhancedCreator(
    this.state.page,
    this.state.itemPerPage
  )(StoryList);

  onLogout = () => {
    this.props.firebase.logout().then(() => message.success("Logged out"));
  };

  loadMoreStories = () => {
    if (
      this.props.counts &&
      this.props.counts.stories > this.state.page * this.state.itemPerPage
    ) {
      console.log("loading more");
      // this.EnhancedStoryList = this.enhancedCreator(
      //   this.state.page + 1,
      //   this.state.itemPerPage
      // )(StoryList);
      this.setState({ page: this.state.page + 1 });
    }
  };

  render() {
    console.log("rerender");
    const {
      auth: { isEmpty, isLoaded }
    } = this.props;

    let EnhancedStoryList = this.enhancedCreator(
      this.state.page,
      this.state.itemPerPage
    )(StoryList);

    return (
      <AppContainer id="test">
        {!isEmpty && (
          <Button
            size="small"
            onClick={this.onLogout}
            style={{ position: "absolute", top: 10, right: 10, zIndex: 100 }}
          >
            Logout
          </Button>
        )}
        <Header title="English story" />
        <TabContainer>
          <Tabs
            defaultActiveKey={this.state.tabKey}
            onChange={tabKey => this.setState({ tabKey })}
            tabBarStyle={{
              width: "100%"
            }}
            tabPosition="bottom"
            style={{ width: "100%" }}
          >
            <TabPane tab="Stories" key="1">
              <TabContent>
                <EnhancedStoryList loadMoreStories={this.loadMoreStories} />
              </TabContent>
            </TabPane>
            <TabPane tab="Add" key="2">
              <TabContent>
                <AddStory isEmpty={isEmpty} isLoaded={isLoaded} />
              </TabContent>
            </TabPane>
          </Tabs>
        </TabContainer>
      </AppContainer>
    );
  }
}

export default compose(
  firebaseConnect([
    {
      path: "counts"
    }
  ]),
  connect(state => ({
    profile: state.firebase.profile,
    counts: state.firebase.data.counts,
    auth: state.firebase.auth
  }))
)(App);
