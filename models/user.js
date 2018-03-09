const config = require('../config').default
const MongoClient = require('mongodb').MongoClient;

module.exports = class {
  insert (query, data) {
    return new Promise((resolve, reject) => {
      MongoClient.connect(config.MongoDbConnectionString, (err, db) => {
        db.collection('users').updateOne(
          { stravaId: data.stravaId },
          { $set: data },
          {
            upsert: true
          },
          () => {
            db.close()
            resolve()
          }
        )
      })
    })
  }
  get (stravaId) {
    return new Promise((resolve, reject) => {
      MongoClient.connect(config.MongoDbConnectionString, (err, db) => {
        db.collection('users').findOne(
          { stravaId: stravaId },
          {},
          (err, result) => {
            db.close()
            if (err) reject(new Error('User not found'))
            resolve(result)
          }
        )
      })
    })
  }
}
