import React from "react";

const StoryItem = ({ title, content, index }) => {
  return (
    <div>
      <h4>{`${index + 1}. ${title}`}</h4>
      <p>{`${content.substring(0, 100)}...`}</p>
    </div>
  );
};

export default StoryItem;
