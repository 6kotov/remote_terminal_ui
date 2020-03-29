import { SET_CLIENT_LIST, DELETE_CONNECTION_CLIENT, ADD_CLIENT_LIST, SET_SERVER_LIST } from "./types"

const initialState = {
    client_list: [],
    server_list: []
}

export const connectionReducer = (state = initialState, action) => {
    switch(action.type) {
        case SET_CLIENT_LIST: 
            return {...state, client_list: [action.payload]}
        case DELETE_CONNECTION_CLIENT:
            return {...state, client_list: state.client_list.filter(connection => connection.uuid !== action.payload)}
        case ADD_CLIENT_LIST: 
            return  {...state, client_list: state.client_list.concat([action.payload])}
        case SET_SERVER_LIST:
            return  {...state, server_list: action.payload}
        default:
            return state
    }
} 