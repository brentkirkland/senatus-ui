import { combineReducers } from 'redux'

import UIReducer from './UI.reducer'

const reducers = combineReducers({
  UI: UIReducer
})

export default reducers
