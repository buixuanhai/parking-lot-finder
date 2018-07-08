import React, { Fragment } from "react";
import { Drawer, List, NavBar } from "antd-mobile";
import Icon from "antd/lib/icon";
import { connect } from "react-redux";
import { compose } from "redux";
import { Modal } from "antd-mobile";
import { push } from "react-router-redux";
import StoryList from "./components/Story/List";
import message from "antd/lib/message";
import "./App.css";
import { TabBar } from "antd-mobile";
import { firebaseConnect, isLoaded, isEmpty } from "react-redux-firebase";

const prompt = Modal.prompt;

class App extends React.Component {
  state = {
    tabKey: "1",
    page: 1,
    open: false,
    itemPerPage: 5
  };

  onOpenChange = () => {
    this.setState({ open: !this.state.open });
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
  renderTabs = () => {
    const { page, itemPerPage, selectedTab } = this.state;

    return (
      <TabBar
        unselectedTintColor="#949494"
        tintColor="#33A3F4"
        barTintColor="white"
      >
        <TabBar.Item
          key="List"
          icon={<Icon type="bars" />}
          selectedIcon={<Icon type="bars" />}
          onPress={() => {
            this.setState({
              selectedTab: "storyList"
            });
          }}
          selected={selectedTab === "storyList"}
        >
          <StoryList
            loadMoreStories={this.loadMoreStories}
            page={page}
            itemPerPage={itemPerPage}
          />
        </TabBar.Item>
        <TabBar.Item
          key="Item"
          selected={selectedTab === "storyItem"}
          icon={<Icon type="smile-o" />}
          selectedIcon={<Icon type="smile-o" />}
          onPress={() => {
            this.setState({
              selectedTab: "storyItem"
            });
          }}
        >
          {/* <AddStory isEmpty={isEmpty} isLoaded={isLoaded} /> */}
          <p>add story</p>
        </TabBar.Item>
      </TabBar>
    );
  };

  render() {
    const { auth, push } = this.props;

    const sidebar = (
      <List>
        {!auth.isEmpty && (
          <Fragment>
            <List.Item thumb={<Icon type="user" />} multipleLine>
              Welcome
            </List.Item>
            <List.Item thumb={<Icon type="file-add" />} multipleLine>
              <span onClick={() => push("/stories/add")}>Add story</span>
            </List.Item>
          </Fragment>
        )}
        <List.Item thumb={<Icon type="bars" />} multipleLine>
          Collections
        </List.Item>
        <List.Item thumb={<Icon type="login" />} multipleLine>
          {!isLoaded(auth) ? (
            <span>Loading...</span>
          ) : isEmpty(auth) ? (
            <span
              onClick={() => {
                prompt(
                  "Login",
                  "Please input login information",
                  [
                    { text: "Cancel" },
                    {
                      text: "Login",
                      onPress: (email, password) =>
                        this.props.firebase.login({ email, password })
                    }
                  ],
                  "login-password",
                  null,
                  ["Email", "Password"],
                  "ios"
                );
              }}
            >
              Login
            </span>
          ) : (
            <span onClick={this.onLogout}>Logout</span>
          )}
        </List.Item>
      </List>
    );

    return (
      <div style={{ height: "100vh", overflow: "hidden" }}>
        <Drawer
          className="my-drawer"
          style={{ minHeight: document.documentElement.clientHeight }}
          enableDragHandle
          sidebar={sidebar}
          open={this.state.open}
          onOpenChange={this.onOpenChange}
        >
          <NavBar
            icon={<Icon type="ellipsis" />}
            onLeftClick={this.onOpenChange}
          >
            English Stories
          </NavBar>
          {this.renderTabs()}
        </Drawer>
      </div>
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
  connect(
    state => ({
      counts: state.firebase.data.counts,
      stories: state.firebase.data.stories,
      profile: state.firebase.profile,
      auth: state.firebase.auth
    }),
    { push }
  )
)(App);
