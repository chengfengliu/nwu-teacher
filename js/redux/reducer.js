import * as types from './actionType.js'

const initialState = {
  userName: '',
  level: '',
  job_id: '',
}

const reducer = function(state = initialState, action) {
  switch(action.type) {
    case types.LOGIN:
      return Object.assign({}, state, {userName: action.userName, level: action.level, job_id: action.job_id})
    case types.LOGOUT:
      return Object.assign({}, state, {userName: '', level: '', job_id: ''})
    default:
      return state
  }
}

export default reducer