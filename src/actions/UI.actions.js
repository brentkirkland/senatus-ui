const errorAction = (error = 'Something went wrong.') => {
  const payload = {
    type: 'UI_SET',
    payload: {
      section: 'error',
      value: error
    }
  }
  return payload
}

const clearSection = (section) => {
  const payload = {
    type: 'UI_SET',
    payload: {
      section,
      value: null
    }
  }
  return payload
}

export default {
  errorAction,
  clearSection
}
