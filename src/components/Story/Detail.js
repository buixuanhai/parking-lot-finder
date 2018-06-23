import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { compose } from "redux";
import { firebaseConnect } from "react-redux-firebase";
import { Button } from "antd";
import { push } from "react-router-redux";

const Container = styled.div`
	height: 100vh;
	overflow: auto;
`;

const Content = styled.p`
	padding: 20px;
	padding-top: 60px;
	white-space: pre-line;
`;

const Header = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	right: 0
	background-color: white;
	display: flex;
	padding: 12px;
	padding-left: 52px;
	justify-content: center;
`;

const Title = styled.h3`
	text-align: center;
`;

class StoryDetail extends Component {
	handleBack = () => {
		this.props.push("/");
	};
	render() {
		const { title, content } = this.props;
		return (
			<Container>
				<Button
					shape="circle"
					icon="arrow-left"
					style={{ position: "absolute", top: 10, left: 10, zIndex: 2 }}
					onClick={this.handleBack}
				/>
				<Header>
					<Title>{title}</Title>
				</Header>
				<Content>{content}</Content>
			</Container>
		);
	}
}

export default compose(
	firebaseConnect(() => {
		return ["stories"];
	}),
	connect(
		state => ({
			stories: state.firebase.data.stories
		}),
		{ push },
		(stateProps, dispatchProps, ownProps) => {
			if (stateProps.stories) {
				return {
					id: ownProps.match.params.id,
					...stateProps.stories[ownProps.match.params.id],
					...dispatchProps
				};
			} else {
				return { ...dispatchProps };
			}
		}
	)
)(StoryDetail);
