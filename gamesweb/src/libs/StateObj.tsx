import React from 'react'

export default class StateObj<T> {
  get: T
  set: React.Dispatch<React.SetStateAction<T>>

  constructor(state: [T, React.Dispatch<React.SetStateAction<T>>]) {
    [this.get, this.set] = state
  }
}
