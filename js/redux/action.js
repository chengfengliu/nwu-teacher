import * as types from './actionType.js'
export function login(userName, level, job_id) {
  return {
    type: types.LOGIN,
    userName,
    level,
    job_id,
  }
}
export function logout() {
  return {
    type: types.LOGOUT
  }
}