import { AppReducer } from './app';
import { combineReducers } from 'redux';

export const rootReducer = combineReducers({
    app: AppReducer,
});
