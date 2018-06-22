import React from "react";
import styled from "styled-components";
import Header from "./components/Header";
import Tabs from "antd/lib/tabs";
import { Button } from "antd";

import { connect } from "react-redux";
import { compose } from "redux";
import { push } from "react-router-redux";

import { firebaseConnect } from "react-redux-firebase";
import StoryAdd from "./components/Story/Add";
import "./App.css";

const TabPane = Tabs.TabPane;

const TabContainer = styled.div`
	position: absolute;
	margin-top: -20px;
	bottom: 0;
	left: 0;
	right: 0;
`;

const TabContent = styled.div`
	height: calc(100vh - 150px);
`;

const LogoutButton = styled.div`
	display: flex;
	justify-content: flex-end;
	margin: 10px;
`;

class App extends React.Component {
	state = {
		tabKey: "1"
	};

	onLogout = () => {
		this.props.firebase.logout();
	};

	render() {
		const { isEmpty, isLoaded } = this.props.auth;

		return (
			<div>
				{!isEmpty && (
					<LogoutButton>
						<Button size="small" onClick={this.onLogout}>
							Logout
						</Button>
					</LogoutButton>
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
					>
						<TabPane tab="Stories" key="1">
							<TabContent />
						</TabPane>
						<TabPane tab="Add" key="2">
							<TabContent style={{ margin: 10 }}>
								<StoryAdd isEmpty={isEmpty} isLoaded={isLoaded} />
							</TabContent>
						</TabPane>
					</Tabs>
				</TabContainer>
			</div>
		);
	}
}

export default compose(
	firebaseConnect(() => {
		return ["todos"];
	}),
	connect(
		state => ({
			todos: state.firebase.data.todos,
			profile: state.firebase.profile,
			auth: state.firebase.auth
		}),
		{ push }
	)
)(App);
