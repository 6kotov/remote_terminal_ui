import { SET_CLIENT_LIST, DELETE_CONNECTION_CLIENT, ADD_CLIENT_LIST } from "./types"

const initialState = {
    list: []
}

export const сlientСonnectionReducer = (state = initialState, action) => {
    switch(action.type) {
        case SET_CLIENT_LIST: 
            return {...state, list: [action.payload]}
        case DELETE_CONNECTION_CLIENT:
            return {...state, list: state.list.filter(connection => connection.uuid !== action.payload)}
        case ADD_CLIENT_LIST: 
        return  {...state, list: state.list.concat([action.payload])}
        default:
            return state
    }
} 