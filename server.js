require('babel-polyfill')
const path = require('path')
const express = require('express')
const cors = require('cors')
const passport = require('passport')
const StravaStrategy = require('passport-strava-oauth2').Strategy
const authRoute = require('./routes/auth.js')(passport)
const userRoute = require('./routes/user.js')(passport)
const usersRoute = require('./routes/users.js')(passport)
const UserModel = require('./models/user.js')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const config = require('./config').default
require('dotenv').config()
const Raven = require('raven')

Raven.config('https://67062895fce848e6bb63587d840a6b05@sentry.io/1081440').install()

process.env.STRAVA_ACCESS_TOKEN = config.strava.accessToken
process.env.STRAVA_CLIENT_ID = config.strava.clientId
process.env.STRAVA_CLIENT_SECRET = config.strava.clientSecret
process.env.STRAVA_REDIRECT_URI = config.strava.redirectUri

passport.serializeUser(function(user, done) {
  done(null, user)
})

passport.deserializeUser(function(obj, done) {
  done(null, obj)
})

passport.use(
  new StravaStrategy(
    {
      clientID: config.strava.clientId,
      clientSecret: config.strava.clientSecret,
      callbackURL: config.strava.redirectUri,
      passReqToCallBack: true
    },
    (accessToken, refreshToken, profile, done) => {
      process.nextTick(() => {
        const user = new UserModel()
        user.insert(
          { stravaId: profile.id },
          {
            stravaId: profile.id,
            displayName: profile.displayName,
            photo: profile._json.profile_medium
          }
        )
        return done(null, profile)
      })
    }
  )
)

const MongoStore = require('connect-mongo')(session)

const app = express()

app.set('trust proxy', 1)

const port = process.env.PORT ? process.env.PORT : 3000
const dist = path.join(__dirname, 'dist')

app.use(Raven.requestHandler())
app.use(express.static(dist))
app.use(cookieParser('L}L+Gfx(2of7Gu7Z'))
app.use(bodyParser.json())
app.use(methodOverride())
app.use(session({
  secret: 'L}L+Gfx(2of7Gu7Z',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false },
  store: new MongoStore({ url: config.MongoDbConnectionString })
}))
app.use(passport.initialize())
app.use(passport.session())

app.use(Raven.errorHandler())

app.use('/api/auth', authRoute)
app.use('/api/user', cors({origin: config.clientUrl, credentials: true}), isAuthenticated, userRoute)
app.use('/api/users', cors({origin: config.clientUrl, credentials: true}), usersRoute)

app.use('*', (req, res) => {
  res.sendFile(path.join(dist, 'index.html'))
})

app.listen(port, (error) => {
  if (error) {
    console.log(error) // eslint-disable-line no-console
  }
  console.info('Express is listening on port %s.', port) // eslint-disable-line no-console
})

function isAuthenticated (req, res, next) {
  if (!req.user) {
    res.status(400).send({error: 'User not authenticated'})
  }
  next()
}
