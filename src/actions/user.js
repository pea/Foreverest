import config from 'config'
import { push } from 'connected-react-router'
import request from 'superagent'
import store from '../store'

export function updateUserSuccess (data) {
  return {
    type: 'UPDATE_SUCCESSFUL',
    user: {
      stravaId: data.stravaId,
      feet: Math.round(data.elevationGain),
      feetYearAgo: Math.round(data.elevationGainYearAgo),
      feetQuarterAgo: Math.round(data.elevationGainQuarterAgo),
      percentage: Math.round(data.elevationGain / 29030 * 100),
      percentageYearAgo: Math.round(data.elevationGainYearAgo / 29030 * 100),
      percentageQuarterAgo: Math.round(data.elevationGainQuarterAgo / 29030 * 100),
      elevationGain: Math.round(data.elevationGain),
      remaining: Math.round(29030 - +data.elevationGain)
    }
  }
}

export function updateUserFail () {
  return {
    type: 'UPDATE_FAILED'
  }
}

export function updateUser () {
  return function (dispatch) {
    return request
      .get(`${config.api.endpoint}/user/updateElevation`)
      .withCredentials()
      .then((res) => {
        const data = JSON.parse(res.text)
        store.dispatch(updateUserSuccess(data))
      })
      .catch(() => {
        store.dispatch(updateUserFail())
        store.dispatch(push('/connect'))
      })
  }
}

export function getUserSuccess (data) {
  return {
    type: 'GET_SUCCESSFUL',
    user: {
      stravaId: data.stravaId,
      feet: Math.round(data.elevationGain) || 0,
      feetYearAgo: Math.round(data.elevationGainYearAgo) || 0,
      feetQuarterAgo: Math.round(data.elevationGainQuarterAgo) || 0,
      percentage: Math.round(data.elevationGain / 29030 * 100) || 0,
      percentageYearAgo: Math.round(data.elevationGainYearAgo / 29030 * 100) || 0,
      percentageQuarterAgo: Math.round(data.elevationGainQuarterAgo / 29030 * 100) || 0,
      remaining: Math.round(29030 - +data.elevationGain),
      elevationGain: Math.round(data.elevationGain)
    }
  }
}

export function getUserFail () {
  return {
    type: 'GET_FAILED'
  }
}

export function getUser () {
  return function (dispatch) {
    return request
      .get(`${config.api.endpoint}/user`)
      .withCredentials()
      .then((res) => {
        const data = JSON.parse(res.text)
        store.dispatch(getUserSuccess(data))
      })
      .catch(() => {
        store.dispatch(getUserFail())
      })
  }
}

export function getUsersSuccess (data) {
  return {
    type: 'GET_USERS_SUCCESSFUL',
    users: data
  }
}

export function getUsersFail () {
  return {
    type: 'GET_USERS_FAILED'
  }
}

export function getUsers () {
  return function (dispatch) {
    return request
      .get(`${config.api.endpoint}/user/all`)
      .withCredentials()
      .then((res) => {
        const data = JSON.parse(res.text)
        store.dispatch(getUsersSuccess(data))
      })
      .catch(() => {
        store.dispatch(getUsersFail())
      })
  }
}

export default { updateUser }
