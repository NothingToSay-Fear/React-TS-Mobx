import { FC, Suspense, useEffect, useState } from 'react'
import './test'
import './App.scss'
import ABC from './abc'
import { changeToken } from './mobx/actions'
import { observer } from 'mobx-react'
import { newRequest } from './axios/axios'
import { Button, Layout, Menu, theme } from 'antd'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
// import img from './1.png'
// import img1 from './1.jpg'
import {
  redirect,
  Route,
  Routes,
  useLocation,
  useNavigate
} from 'react-router-dom'
import Home from './pages/Home/Home'
import routers from './routers/routers'

const { Header, Sider, Content } = Layout

const App: FC = observer(() => {
  const navigate = useNavigate()
  const location = useLocation()
  const pathName = location.pathname

  const [collapsed, setCollapsed] = useState(false)

  const {
    token: { colorBgContainer }
  } = theme.useToken()

  const [count, setCount] = useState(0)
  const add = () => {
    setCount((count) => count + 1)
  }
  const changeTok = () => {
    changeToken('' + 100 * Math.random())
  }

  useEffect(() => {
    if (pathName) {
      navigate(pathName)
    }

    import('./fn').then((res) => {
      console.log(res)
    })
    newRequest.get({ url: '/1' }, { isNeedLoading: true }).then((res) => {
      console.log('1', res)
    })
    newRequest.get({ url: '/2' }, { isNeedLoading: true }).then((res) => {
      console.log('2', res)
    })
    newRequest.get({ url: '/3' }, { isNeedLoading: true }).then((res) => {
      console.log('3', res)
    })
  }, [])

  return (
    <>
      {/* <div>{count}</div>
      <button onClick={add}>+1</button>
      <button onClick={changeTok}>changeToken</button>
      <ABC></ABC> */}
      {/* <img src={img} alt="" /> */}
      {/* <img src={img1} alt="" /> */}

      <Layout style={{ height: '100%' }}>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className='logo-vertical'>
            <div className='text'>
              <div className='logo'></div>
              Fugue
            </div>
          </div>
          <Menu
            theme='dark'
            mode='inline'
            defaultSelectedKeys={[pathName.slice(1) || 'Home']}
            items={routers}
            onClick={(e) => {
              navigate('/' + e.keyPath.join('/'))
            }}
          />
        </Sider>
        <Layout>
          <Header style={{ padding: 0, background: colorBgContainer }}>
            <Button
              type='text'
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64
              }}
            />
          </Header>
          <Content
            style={{
              borderTop: '1px solid rgb(151, 143, 143)',
              minHeight: 280,
              background: colorBgContainer
            }}>
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path='/' element={<Home />} />
                {routers.map((item) => {
                  return (
                    <Route
                      key={item.key}
                      path={item.key}
                      element={item.element}
                    />
                  )
                })}
              </Routes>
            </Suspense>
          </Content>
        </Layout>
      </Layout>
    </>
  )
})
export default App
