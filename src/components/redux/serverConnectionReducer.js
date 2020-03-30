import { SET_SERVER_LIST } from "./types"

const initialState = {
    server_list: []
}

export const serverConnectionReducer = (state = initialState, action) => {
    switch(action.type) {
        case SET_SERVER_LIST:
            return  {...state, server_list: action.payload}
        default:
            return state
    }
} 