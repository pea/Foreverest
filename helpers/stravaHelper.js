const strava = require('strava-v3')
const validator = require('validator')

export function getRequestAccessURL () {
  return new Promise((resolve, reject) => {
    const response = strava.oauth.getRequestAccessURL({ scope: 'view_private,write' })
    if (validator.isURL(response)) {
      resolve(response)
    } else {
      reject(response)
    }
  })
}

export function getToken (code) {
  return new Promise((resolve, reject) => {
    strava.oauth.getToken(code, (err, payload) => {
      if (err) {
        reject(new Error('Couldn\'t get token'))
      } else {
        resolve(payload)
      }
    })
  })
}

export default {
  getRequestAccessURL,
  getToken
}
