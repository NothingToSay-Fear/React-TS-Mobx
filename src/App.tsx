import { FC, useEffect, useState } from "react";
import "./test";
import ABC from "./abc";
import "./index.css";
import { changeToken } from "./mobx/actions";
import { observer } from "mobx-react";
import { newRequest } from "./axios/axios";
import img from "./1.png";
import img1 from "./1.jpg";

const App: FC = observer(() => {
  const [count, setCount] = useState(0);
  const add = () => {
    setCount((count) => count + 1);
  };
  const changeTok = () => {
    changeToken("" + 100 * Math.random());
  };

  useEffect(() => {
    import("./fn").then((res) => {
      console.log(res);
    });
    newRequest.get({ url: "/1" }, { isNeedLoading: true }).then((res) => {
      console.log("1", res);
    });
    newRequest.get({ url: "/2" }, { isNeedLoading: true }).then((res) => {
      console.log("2", res);
    });
    newRequest.get({ url: "/3" }, { isNeedLoading: true }).then((res) => {
      console.log("3", res);
    });
  }, []);

  return (
    <>
      <div>{count}</div>
      <button onClick={add}>+1</button>
      <button onClick={changeTok}>changeToken</button>
      <ABC></ABC>
      {/* <img src={img} alt="" /> */}
      <img src={img1} alt="" />
    </>
  );
});
export default App;
