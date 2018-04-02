require('dotenv').config()
const strava = require('strava-v3')
const config = require('../config').default
const moment = require('moment')

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

export function getElevationData (req, res, passport, next, page = 1, totalElevationGain, totalElevationGainYearAgo, totalElevationQuarterAgo) {
  return new Promise((resolve, reject) => {
    if (typeof req.user === 'undefined') reject(new Error('User not available'))

    strava.athlete.listActivities({'access_token': req.user.token, 'page': page, 'per_page': 100}, (err, payload, limits) => {
      if (err) reject(err)
      let elevationGain = 0
      let elevationGainYearAgo = 0
      let elevationGainQuarterAgo = 0
      const yearAgo = moment().subtract(1, 'years')
      const quarterAgo = moment().subtract(3, 'months')

      payload.forEach((item) => {
        if (item.type === 'Ride') {
          elevationGain += item.total_elevation_gain
          if (moment(item.start_date).isBefore(yearAgo)) {
            elevationGainYearAgo += item.total_elevation_gain
          }
          if (moment(item.start_date).isBefore(quarterAgo)) {
            elevationGainQuarterAgo += item.total_elevation_gain
          }
        }
      })
      resolve({elevationGain, elevationGainYearAgo, elevationGainQuarterAgo})
    })
  })
}

export function returnElevationGain (req, res, passport, next, page = 1, totalElevationGain = 0, totalElevationGainYearAgo = 0, totalElevationGainQuarterAgo = 0) {
  return new Promise((resolve, reject) => {
    getElevationData(req, res, passport, next, page, totalElevationGain, totalElevationGainYearAgo, totalElevationGainQuarterAgo)
      .then(({elevationGain, elevationGainYearAgo, elevationGainQuarterAgo}) => {
        if (typeof elevationGain === 'undefined') reject(new Error('Invalid elevation gain value'))
        if (elevationGain === 0) resolve({totalElevationGain, totalElevationGainYearAgo, totalElevationGainQuarterAgo})

        totalElevationGain = +totalElevationGain + +elevationGain
        totalElevationGainYearAgo = +totalElevationGainYearAgo + +elevationGainYearAgo
        totalElevationGainQuarterAgo = +totalElevationGainQuarterAgo + +elevationGainQuarterAgo
        if (page >= 10) {
          resolve({totalElevationGain, totalElevationGainYearAgo, totalElevationGainQuarterAgo})
        } else {
          page = page + 1
          returnElevationGain(req, res, passport, next, page, totalElevationGain, totalElevationGainYearAgo, totalElevationGainQuarterAgo)
          .then((result) => {
            resolve(result)
          })
          .catch((err) => {
            reject(err)
          })
        }
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export default {
  authenticate,
  handleCallback
}
