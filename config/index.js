const defaultConfig = require('./default')

const configName = process.env.NODE_ENV === 'production' ? 'prod' : 'local'
const overrideConfig = require(`./${configName}`).default

export default Object.assign(defaultConfig, overrideConfig)
