import React from "react";
import { MobxContext, Store as StoreType } from "./store";
import { ObservableMap } from "mobx";

/**
 *
 * 获取 Mobx 的 Store
 */
const useMobxStore = (key = "") => {
  const Store: ObservableMap<String, any> = React.useContext(MobxContext);
  if (key) {
    return Store.get(key);
  }
  return Store;
};

export default useMobxStore;
