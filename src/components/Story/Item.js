import React from "react";
import { Link } from "react-router-dom";

const StoryItem = ({ key, title, content }) => {
	return (
		<div>
			<Link to={`/stories/${key}`}>
				<h4>{title}</h4>
			</Link>

			<p>{`${content.substring(0, 100)}...`}</p>
		</div>
	);
};

export default StoryItem;
