import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import { List } from "antd";
import { Link } from "react-router-dom";

class StoryList extends Component {
	state = { stories: [] };
	static getDerivedStateFromProps(nextProps) {
		if (!nextProps.stories) {
			return null;
		}
		return {
			stories: Object.keys(nextProps.stories).map(key => ({
				key,
				...nextProps.stories[key]
			}))
		};
	}
	render() {
		const { stories } = this.state;
		if (!stories) {
			return null;
		}

		return (
			<List
				style={{
					height: "calc(100vh - 120px)",
					overflow: "auto"
				}}
				itemLayout="horizontal"
				dataSource={stories}
				renderItem={item => (
					<List.Item>
						<List.Item.Meta
							title={<Link to={`/stories/${item.key}`}>{item.title}</Link>}
							description={`${item.content.substring(0, 100)}...`}
						/>
					</List.Item>
				)}
			/>
		);
	}
}

export default connect(
	null,
	{ push }
)(StoryList);
