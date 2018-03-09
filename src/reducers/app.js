const initialState = {
  loaded: false,
  pageTitle: '',
  user: {}
}

export default function app(state = initialState, action) {
  switch (action.type) {
    case 'APP_LOAD':
      return { ...state, loaded: true }
    case 'UPDATE_PAGE_TITLE':
      return { ...state, pageTitle: action.text }
    case 'UPDATE_SUCCESSFUL':
      return { ...state, user: action.user }
    default:
      return state
  }
}