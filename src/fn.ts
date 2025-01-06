
export const add = (a: number, b: string) => {
  let c = 100
  let arr = [1, 23, 4]
  let count = 0
  for (const element of arr) {
    count += element
  }
  console.log('add')
  return a + Number(b) + Math.random() + c + arr.length +count
}

export const mul = (a: number, b: number) => {
  console.log('mul')
  return a * b
}