import ReactDOM from 'react-dom/client'
import App from './App'
import './index.scss'
import { ConfigProvider } from 'antd'

import MobxConnection from './mobx/mobx.hoc'
import { AxiosInject } from './axios/axios'
import { HashRouter } from 'react-router-dom'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <HashRouter>
    <ConfigProvider>
      <MobxConnection>
        <AxiosInject>
          <App />
        </AxiosInject>
      </MobxConnection>
    </ConfigProvider>
  </HashRouter>
)
