import React, { useState } from 'react'

export default class StateObj<T> {
  get: T
  set: React.Dispatch<React.SetStateAction<T>>

  constructor(state: [T, React.Dispatch<React.SetStateAction<T>>]) {
    [this.get, this.set] = state
  }

  static new<T>(init:T): StateObj<T> {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return new StateObj<T>(useState<T>(init))
  }
}
