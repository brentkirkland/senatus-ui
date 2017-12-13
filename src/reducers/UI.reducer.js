import types from '../constants/UI.constants'

export const getInitialState = () => ({
  error: null
})

const UIReducer = (state = getInitialState(), { type, payload = {} }) => {
  const {
    value = 'ruh oh',
    section = 'unknown-section'
  } = payload
  switch (type) {
    case types.UI_SET: {
      return {
        ...state,
        [ section ]: value
      }
    }
    default: {
      return state
    }
  }
}

export default UIReducer
