import {combineReducers} from 'redux'
import { connectionReducer} from './connectionReducer'

export const rootReducer = combineReducers({
    connections: connectionReducer
})