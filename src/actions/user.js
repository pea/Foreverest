import config from 'config'
import { push } from 'connected-react-router'
import request from 'superagent'
import store from '../store'

export function updateUserSuccess (data) {
  return {
    type: 'UPDATE_SUCCESSFUL',
    user: {
      feet: Math.round(data.elevationGain),
      percentage: Math.round(data.elevationGain / 29030 * 100),
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
      .get(`${config.api.endpoint}/user`)
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

export default { updateUser }
