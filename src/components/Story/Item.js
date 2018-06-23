import React from "react";
import { Link } from "react-router-dom";

const StoryItem = ({ id, title, content }) => {
	return (
		<div>
			<Link to={`/stories/${id}`}>
				<h4>{title}</h4>
			</Link>

			<p>{`${content.substring(0, 100)}...`}</p>
		</div>
	);
};

export default StoryItem;
