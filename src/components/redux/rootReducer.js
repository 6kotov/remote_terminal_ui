import {combineReducers} from 'redux'
import { сlientСonnectionReducer} from './сlientСonnectionReducer'

export const rootReducer = combineReducers({
    connectionsClient: сlientСonnectionReducer
})