import ReactDOM from "react-dom/client";
import App from "./App";
import { ConfigProvider } from "antd";
import MobxConnection from "./mobx/mobx.hoc";
import { AxiosInject } from "./axios/axios";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(
  <ConfigProvider>
    <MobxConnection>
      <AxiosInject>
        <App />
      </AxiosInject>
    </MobxConnection>
  </ConfigProvider>,
);
