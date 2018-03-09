const express = require('express')
const stravaController = require('../controllers/stravaController.js')

const router = express.Router()

module.exports = (passport) => {
  router.get('/strava/authenticate', (req, res, next) => { stravaController.authenticate(req, res, passport, next) })
  router.get('/strava/callback', (req, res, next) => { stravaController.handleCallback(req, res, passport, next) })
  return router
}
