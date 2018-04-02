require('dotenv').config()
const UserModel = require('../models/user.js')
const stravaController = require('../controllers/stravaController.js')

export function getUser (req, res, passport, next) {
  return new Promise((resolve, reject) => {
    if (typeof req.user !== 'undefined') {
      resolve(new UserModel().get(req.user.id))
    }
    reject(new Error('Couldn\'t find user'))
  })
}

export function getUsers (req, res, passport, next) {
  return new Promise((resolve, reject) => {
    const users = new UserModel().getAll()
      .then((users) => {
        resolve(users)
      })
      .catch(err => {
        reject(new Error(err))
      })
  })
}

export async function updateUserElevation (req, res, passport, next) {
  let updateTime = Date.now() / 1000
  let elevationGain
  let elevationGainYearAgo
  let elevationGainQuarterAgo
  let elevationData
  let user

  try {
    user = await getUser(req, res, passport, next)
  } catch (err) {
    throw new Error(err)
  }

  if (typeof user.elevationGain === 'undefined') {
    try {
      new UserModel().insert(
        { stravaId: req.user.id },
        {
          stravaId: req.user.id,
          elevationGain: 0,
          elevationGainYearAgo: 0,
          elevationGainQuarterAgo: 0,
          updateTime: 946684800
        }
      )
      user.elevationGain = 0
      user.elevationGainYearAgo = 0
      user.elevationGainQuarterAgo = 0
      user.updateTime = 946684800
    } catch (err) {
      throw new Error(err)
    }
  }

  if ((updateTime - user.updateTime) > 60) {
    try {
      elevationData = await stravaController.returnElevationGain(req, res, passport, next)
      elevationGain = elevationData.totalElevationGain
      elevationGainYearAgo = elevationData.totalElevationGainYearAgo
      elevationGainQuarterAgo = elevationData.totalElevationGainQuarterAgo
    } catch (err) {
      throw new Error(err)
    }

    try {
      new UserModel().insert(
        { stravaId: req.user.id },
        {
          stravaId: req.user.id,
          elevationGain: elevationGain,
          elevationGainYearAgo: elevationGainYearAgo,
          elevationGainQuarterAgo: elevationGainQuarterAgo,
          updateTime
        }
      )
    } catch (err) {
      throw new Error(err)
    }
  } else {
    elevationGain = user.elevationGain
    elevationGainYearAgo = user.elevationGainYearAgo
    elevationGainQuarterAgo = user.elevationGainQuarterAgo
    updateTime = user.updateTime
  }

  return {
    stravaId: req.user.id,
    elevationGain,
    elevationGainYearAgo,
    elevationGainQuarterAgo,
    timeSinceUpdate: (Date.now() / 1000) - updateTime
  }
}

export default {
  getUser,
  updateUserElevation
}
