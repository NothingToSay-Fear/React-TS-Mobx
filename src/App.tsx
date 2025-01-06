import { FC, lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import './test'
import ABC from './abc';
import './index.css';



const App: FC = () => {

  const MyComponent = lazy(() => import('./async'))

  const [count, setCount] = useState(0);
  const add = () => {
    setCount((count) => count + 1)
  }

  return (
    <>
      <div>{count}</div>
      <button onClick={add}>+1</button>
      <ABC></ABC>
      <Suspense fallback={<div>Loading...</div>}>
        <MyComponent />
      </Suspense>
    </>

  )
}
export default App