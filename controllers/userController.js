require('dotenv').config()
const UserModel = require('../models/user.js')

export function getUser (req, res, passport, next) {
  return new Promise((resolve, reject) => {
    if (typeof req.user !== 'undefined') {
      resolve(new UserModel().get(req.user.id))
    }
    reject(new Error('Couldn\'t find user'))
  })
}

export default {
  getUser
}
