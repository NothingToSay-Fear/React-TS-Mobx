import React from "react";
import { MobxContext, store } from "./store";
import { ChildrenProps } from "../common/commonType";

/**
 *
 * 连接 Mobx 的 HOC
 */
const MobxConnection: React.FC<ChildrenProps> = ({ children }) => {
  return <MobxContext.Provider value={store}>{children}</MobxContext.Provider>;
};

export default MobxConnection;
