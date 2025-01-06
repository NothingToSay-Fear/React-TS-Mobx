import { FC, useCallback, useState } from 'react'
import { add, mul } from './fn';


const Async: FC = () => {

  const [count, setCount] = useState(0);

  const aaa = useCallback(() => {
    console.log(add(Math.random(), '2'))
    setCount((count) => count + 1)
  }, [])

  return (
    <>
      <div>{count}</div>
      <button onClick={aaa}>+1</button>
    </>

  )
}
export default Async