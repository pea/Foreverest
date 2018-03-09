# Foreverest
NodeJS, React, Redux, D3

Web app that connects to Strava, measures your total elevation gain and plots it on a mountain to show how far up Everest (or further) you've gone.

## Starting

In development the app is run in two parts to make use of hot reloading - the server-side and client-side. In production only the server will run.

### Starting in Development

1. `npm run server`
2. In a seperate process: `npm start`
3. Open http://localhost:8080 for the client-side
4. Open http://localhost:3000 for server-side output (API)

### Starting in Production

1. Copy `config/default.js` to `config/prod.js` and update with production settings
2. `npm run build`
3. `npm run production`

Optionally, the app can be started with docker by using the docker image, running `docker-compose up`, or with Zeit Now by running now --docker.