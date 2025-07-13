import { combineReducers } from 'redux'
import chooseModeReducer from './reducer'

export const appReducer = combineReducers({
    chooseMode: chooseModeReducer
})

export * from './reducer'
export * from './selector'