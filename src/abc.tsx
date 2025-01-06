import { FC, useCallback, useState } from 'react'


const ABC: FC = () => {

  const [count, setCount] = useState(0);

  const aaa = useCallback(() => {
    setCount((count) => count + 1)
  }, [])

  return (
    <>
      <div>{count}</div>
      <button onClick={aaa}>+1</button>
    </>

  )
}
export default ABC