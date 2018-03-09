const express = require('express')
const userController = require('../controllers/userController.js')
const stravaController = require('../controllers/stravaController.js')
const UserModel = require('../models/user.js')

const router = express.Router()

module.exports = (passport) => {
  router.get('/', (req, res, next) => {
    stravaController.returnElevationGain(req, res, passport, next)
      .then((elevation) => {
        // Save in database
        const user = new UserModel()
        user.insert(
          { stravaId: req.user.id },
          {
            stravaId: req.user.id,
            elevationGain: elevation
          }
        )
        userController.getUser(req, res, passport, next)
          .then(result => {
            res.status(200).send(result)
          })
          .catch(err => {
            res.status(400).send({error: err.toString()})
          })
      })
  })

  router.get(
    '/elevationTotal',
    (req, res, next) => {
      stravaController.returnElevationGain(req, res, passport, next)
        .then(result => {
          // Save in database
          const user = new UserModel()
          user.insert(
            { stravaId: req.user.id },
            {
              stravaId: req.user.id,
              elevationGain: result
            }
          )
          res.status(200).send({'elevationGain': result.toString()})
        })
        .catch(err => {
          next(err)
        })
    }
  )

  return router
}
