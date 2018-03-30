const initialState = {
  loaded: false,
  pageTitle: '',
  user: {
    stravaId: 0,
    feet: 0,
    percentage: 0,
    remaining: 0
  },
  users: {}
}

export default function app(state = initialState, action) {
  switch (action.type) {
    case 'APP_LOAD':
      return { ...state, loaded: true }
    case 'UPDATE_PAGE_TITLE':
      return { ...state, pageTitle: action.text }
    case 'UPDATE_SUCCESSFUL':
      return { ...state, user: action.user }
    case 'GET_SUCCESSFUL':
      return { ...state, user: action.user }
    case 'GET_USERS_SUCCESSFUL':
      return { ...state, users: action.users }
    default:
      return state
  }
}
