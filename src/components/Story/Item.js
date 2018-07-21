import React from "react";
import styled from "styled-components";

const Title = styled.h4`
  font-weight: bold;
`;

const StoryItem = ({ title, content, index }) => {
  return (
    <div>
      <Title>{`${index + 1}. ${title}`}</Title>
      <p>{`${content.substring(0, 100)}...`}</p>
    </div>
  );
};

export default StoryItem;
