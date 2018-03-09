const defaultConfig = require('./default')

const configName = __DEV__ ? 'local' : 'prod'
const overrideConfig = require(`./${configName}`).default

export default {
  ...defaultConfig,
  ...overrideConfig
}
