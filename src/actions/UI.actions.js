const setUI = (section, value) => {
  const payload = {
    type: 'UI_SET',
    payload: {
      section,
      value
    }
  }
  return payload
}

const errorAction = (error = 'Something went wrong.') => {
  const payload = setUI('error', error)
  return payload
}

const clearSection = (section) => {
  const payload = setUI(section, null)
  return payload
}

export default {
  errorAction,
  clearSection,
  setUI
}
