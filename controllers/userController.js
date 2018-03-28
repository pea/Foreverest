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

export function updateUserElevation (req, res, passport, next) {
  return new Promise((resolve, reject) => {
    getUser(req, res, passport, next)
      .then(user => {
        const updateTime = Date.now() / 1000
        if ((updateTime - user.updateTime) > 60) {
          return stravaController.returnElevationGain(req, res, passport, next)
            .then(elevationGain => {
              return {elevationGain, updateTime}
            })
            .catch(err => { reject(err) })
        } else {
          return {elevationGain: user.elevationGain, updateTime: user.updateTime}
        }
      })
      .then(({elevationGain, updateTime}) => {
        new UserModel().insert(
          { stravaId: req.user.id },
          {
            stravaId: req.user.id,
            elevationGain: elevationGain,
            updateTime
          }
        )
        resolve({
          stravaId: req.user.id,
          elevationGain: elevationGain,
          timeSinceUpdate: (Date.now() / 1000) - updateTime
        })
      })
      .catch(err => { reject(err) })
    })

  //   stravaController.returnElevationGain(req, res, passport, next)
  //   .then(result => {
  //     getUser(req, res, passport, next)
  //       .then(({elevationGain, updateTime}, err) => {
  //         if ((Date.now() / 1000 - updateTime) > 300) {
  //           const user = new UserModel()
  //           updateTime = Date.now() / 1000
  //           user.insert(
  //             { stravaId: req.user.id },
  //             {
  //               stravaId: req.user.id,
  //               elevationGain: result,
  //               updateTime
  //             }
  //           )
  //         }
  //         resolve({
  //           elevationGain,
  //           timeSinceUpdate: ((Date.now() / 1000) - updateTime)
  //         })
  //       })
  //       .catch(err => {
  //         reject(err)
  //       })
  //   })
  //   .catch(err => {
  //     reject(err)
  //   })
  // })
}

export default {
  getUser,
  updateUserElevation
}
