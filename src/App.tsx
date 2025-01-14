import { FC, lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import './test'
import ABC from './abc';
import './index.css';
import { changeToken } from './mobx/actions';
import { observer } from 'mobx-react';
import MobxConnection from './mobx/mobx.hoc';
import { axios, AxiosInject, newRequest } from './axios/axios';



const App: FC = observer(() => {

  const [count, setCount] = useState(0);
  const add = () => {
    setCount((count) => count + 1)
  }
  const changeTok = () => {
    changeToken('' + 100 * Math.random())
  }

  useEffect(() => {
    // axios.get('/').then(res => {
    //   console.log(res)
    // })

    newRequest.get({ url: '/' }, { isNeedLoading: true }).then(res => {
      console.log('res', res)
    })
    newRequest.get({ url: '/' }, { isNeedLoading: true }).then(res => {
      console.log('res', res)
    })
    newRequest.get({ url: '/' }, { isNeedLoading: true }).then(res => {
      console.log('res', res)
    })
  }, [])

  return (
    <>

      <MobxConnection>
        <AxiosInject>
          <div>{count}</div>
          <button onClick={add}>+1</button>
          <button onClick={changeTok}>changeToken</button>
          <ABC></ABC>
        </AxiosInject>
      </MobxConnection>
    </>
  )
})
export default App