export const errorAction = (error = 'Something went wrong.') => {
  const errorOut = {
    type: 'UI_SET',
    payload: {
      section: 'error',
      value: error
    }
  }
  return errorOut
}
