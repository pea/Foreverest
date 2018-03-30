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
          updateTime: 946684800
        }
      )
      user.elevationGain = 0
      user.updateTime = 946684800
    } catch (err) {
      throw new Error(err)
    }
  }

  if ((updateTime - user.updateTime) > 60) {
    try {
      elevationGain = await stravaController.returnElevationGain(req, res, passport, next)
    } catch (err) {
      throw new Error(err)
    }

    try {
      new UserModel().insert(
        { stravaId: req.user.id },
        {
          stravaId: req.user.id,
          elevationGain: elevationGain,
          updateTime
        }
      )
    } catch (err) {
      throw new Error(err)
    }
  } else {
    elevationGain = user.elevationGain
    updateTime = user.updateTime
  }

  return {
    stravaId: req.user.id,
    elevationGain,
    timeSinceUpdate: (Date.now() / 1000) - updateTime
  }
}

export default {
  getUser,
  updateUserElevation
}
