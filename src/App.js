import React from "react";
import styled from "styled-components";
import Header from "./components/Header";
import Tabs from "antd/lib/tabs";
import Button from "antd/lib/button";

import { connect } from "react-redux";
import { compose } from "redux";
import { push } from "react-router-redux";

import { firebaseConnect } from "react-redux-firebase";
import StoryAdd from "./components/Story/Add";
import StoryList from "./components/Story/List";
import message from "antd/lib/message";

import "./App.css";

const TabPane = Tabs.TabPane;

const TabContainer = styled.div`
	position: absolute;
	/* margin-top: -20px; */
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
	overflow: "auto";
`;

class App extends React.Component {
	state = {
	  tabKey: "1"
	};

	onLogout = () => {
	  this.props.firebase.logout().then(() => message.success("Logged out"));
	};

	render() {
	  const {
	    stories,
	    auth: { isEmpty, isLoaded }
	  } = this.props;

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
	              <StoryList stories={stories} />
	            </TabContent>
	          </TabPane>
	          <TabPane tab="Add" key="2">
	            <TabContent>
	              <StoryAdd isEmpty={isEmpty} isLoaded={isLoaded} />
	            </TabContent>
	          </TabPane>
	        </Tabs>
	      </TabContainer>
	    </AppContainer>
	  );
	}
}

export default compose(
  firebaseConnect(() => {
    return ["stories"];
  }),
  connect(
    state => ({
      stories: state.firebase.data.stories,
      profile: state.firebase.profile,
      auth: state.firebase.auth
    }),
    { push }
  )
)(App);
