const express = require('express')
const userController = require('../controllers/userController.js')

const router = express.Router()

module.exports = (passport) => {
  router.get('/', (req, res, next) => {
    userController.getUser(req, res, passport, next)
      .then(result => {
        res.status(200).send(result)
      })
      .catch(err => {
        res.status(400).send({error: err.toString()})
      })
  })

  router.get('/all', (req, res, next) => {
    userController.getUsers(req, res, passport, next)
      .then(result => {
        res.status(200).send(result)
      })
      .catch(err => {
        res.status(400).send({error: err.toString()})
      })
  })

  router.get(
    '/updateElevation',
    (req, res, next) => {
      userController.updateUserElevation(req, res, passport, next)
        .then(result => {
          res.status(200).send(result)
        })
        .catch(err => {
          res.status(400).send({error: err.toString()})
        })
    }
  )

  return router
}
