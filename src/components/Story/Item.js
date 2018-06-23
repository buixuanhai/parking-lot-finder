import React from "react";

const StoryItem = ({ title, content }) => {
  return (
    <div>
      <h4>{title}</h4>

      <p>{`${content.substring(0, 100)}...`}</p>
    </div>
  );
};

export default StoryItem;
