import { SHOW_MESSAGE,SET_LOADING , SET_LOGGED } from "./types"

const initialState = {
    message_text: '',
    show_message:false,
    message_style: 'messageBlack',
    is_logged:false,
    init_logged_check:false,
    is_loading: true
}

export const appReducer = (state = initialState, action) => {
    switch(action.type) {
        case SHOW_MESSAGE: 
            return {...state, message_text: action.payload.text, show_message:action.payload.isShown, message_style: action.payload.style }
        case SET_LOADING:
            return {...state, is_loading: action.payload}
        case SET_LOGGED: 
            return  {...state, is_logged:action.payload.isLogged, init_logged_check: action.payload.init }
        default:
            return state
    }
} 