import { FC, useCallback, useState } from 'react'
import useMobxStore from './mobx/useMobxStore'
import { observer } from 'mobx-react'

const ABC: FC = observer(() => {
  const token = useMobxStore('token')

  const [count, setCount] = useState(0)

  const ccc = useCallback(() => {
    setCount((count) => count + 1)
  }, [])

  return (
    <>
      <div>{count + token}</div>
      <button onClick={ccc}>+1</button>
    </>
  )
})
export default ABC
