import config from 'config'
import { push } from 'connected-react-router'
import store from '../store'

export function loadApp () {
  return {
    type: 'APP_LOAD'
  }
}

export function updatePageTitle (text) {
  return {
    type: 'UPDATE_PAGE_TITLE',
    text
  }
}

export default { loadApp, updatePageTitle }
