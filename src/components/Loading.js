import React from "react";
import Spin from "antd/lib/spin";
import Icon from "antd/lib/icon";

const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

const Loading = () => {
  return <Spin indicator={antIcon} />;
};

export default Loading;
