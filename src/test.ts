
type A = {
  name: string
}

type B = {
  age: number
}

type AB = A & B

const obj: AB = {
  name: '1',
  age: 1
}

let bbb: number = 1