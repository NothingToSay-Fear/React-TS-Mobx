import { ItemType, MenuItemType } from 'antd/es/menu/interface'
import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined
} from '@ant-design/icons'
import { lazy, LazyExoticComponent } from 'react'

interface RouterType extends MenuItemType {
  key: string
  element: React.ReactNode
}

const Home = lazy(() => import('../pages/Home/Home'))
const Options = lazy(() => import('../pages/Options'))
const Setting = lazy(() => import('../pages/Setting'))

const routers: RouterType[] = [
  {
    key: 'Home',
    icon: <UserOutlined />,
    label: 'Home',
    element: <Home />
  },
  {
    key: 'Options',
    icon: <VideoCameraOutlined />,
    label: 'Options',
    element: <Options />
  },
  {
    key: 'Setting',
    icon: <UploadOutlined />,
    label: 'Setting',
    element: <Setting />
  }
]

export default routers
