import { combineReducers } from 'redux';
import {
    ADD_TEXT,
    ADD_SENT
} from './store'

const textReducer = (state = {}, action) => {
    switch (action.type) {
        case ADD_TEXT:
            return Object.assign({}, state, { text: action.text });
        default:
            return state;
    }
};

const sentReducer = (state = {}, action) => {
    switch (action.type) {
        case ADD_SENT:
            return Object.assign({}, state, { sent: action.sent });
        default:
            return state;
    }
};

const reducers = combineReducers({
    textState: textReducer,
    sentState: sentReducer,
});

export default reducers;
