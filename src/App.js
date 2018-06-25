import React from "react";
import styled from "styled-components";
import Header from "./components/Header";
import Tabs from "antd/lib/tabs";
import Button from "antd/lib/button";

import { connect } from "react-redux";
import { compose } from "redux";

import { firebaseConnect } from "react-redux-firebase";
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

class App extends React.Component {
  state = {
    tabKey: "1",
    page: 1,
    itemPerPage: 5
  };

  onLogout = () => {
    this.props.firebase.logout().then(() => message.success("Logged out"));
  };

  loadMoreStories = () => {
    if (
      this.props.counts &&
      this.props.counts.stories > this.state.page * this.state.itemPerPage
    ) {
      this.setState({ page: this.state.page + 1 });
    }
  };

  // componentDidUpdate() {
  //   console.log("did update");
  //   if (this.props.stories) {
  //     Object.keys(this.props.stories).forEach((key, index) => {
  //       console.log(this.props.stories[key].order);
  //       // console.log(1000000000 - index);
  //       // this.props.firebase.update(`stories/${key}`, {
  //       //   ...this.props.stories[key],
  //       //   order: 1000000000 - index
  //       // });
  //     });
  //   }
  // }

  render() {
    const {
      auth: { isEmpty, isLoaded }
    } = this.props;

    const { page, itemPerPage } = this.state;

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
                <StoryList
                  loadMoreStories={this.loadMoreStories}
                  page={page}
                  itemPerPage={itemPerPage}
                />
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
    },
    { path: "stories" }
  ]),
  connect(state => ({
    counts: state.firebase.data.counts,
    stories: state.firebase.data.stories,
    auth: state.firebase.auth
  }))
)(App);
