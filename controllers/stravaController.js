require('dotenv').config()
const strava = require('strava-v3')
const config = require('../config').default

export function authenticate (req, res, passport, next) {
  passport.authenticate('strava', { scope: ['public'] })(req, res, next)
}

export function handleCallback (req, res, passport, next) {
  passport.authenticate(
    'strava',
    {
      successRedirect: `${config.clientUrl}/progress`,
      failureRedirect: '/connect'
    }
  )(req, res, next)
}

export function getElevationData (req, res, passport, next, page = 1, totalElevationGain) {
  return new Promise((resolve, reject) => {
    if (typeof req.user === 'undefined') reject(new Error('User not available'))

    strava.athlete.listActivities({'access_token': req.user.token, 'page': page, 'per_page': 100}, (err, payload, limits) => {
      if (err) reject(err)
      let elevationGain = 0
      payload.forEach((item) => {
        elevationGain = elevationGain + item.total_elevation_gain
      })
      resolve(elevationGain)
    })
  })
}

export function returnElevationGain (req, res, passport, next, page = 1, totalElevationGain = 0) {
  return new Promise((resolve, reject) => {
    getElevationData(req, res, passport, next, page, totalElevationGain)
      .then((elevationGain) => {
        if (typeof elevationGain === 'undefined') reject(new Error('Invalid elevation gain value'))
        if (elevationGain === 0) resolve(totalElevationGain)

        totalElevationGain = +totalElevationGain + +elevationGain
        if (page >= 10) {
          resolve(totalElevationGain)
        } else {
          page = page + 1
          returnElevationGain(req, res, passport, next, page, totalElevationGain)
          .then((result) => {
            resolve(result)
          })
          .catch((err) => {
            console.log(err)
          })
        }
      })
      .catch((err) => {
        console.log(err)
      })
  })
}

export default {
  authenticate,
  handleCallback
}
