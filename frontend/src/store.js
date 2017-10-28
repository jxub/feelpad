import Redux, { createStore, combineReducers } from 'redux';

const textReducer = (state = {}, action) => {
    if (action.type === 'ADD_TEXT') {
        const newText = [...state.text, action.text];
        Object.assign({}, state, newText);
    }

    return state;
};

const sentReducer = (state = {}, action) => {
    if (action.type === 'ADD_SENT') {
        state.concat([action.sent])
    }

    return state;
};

const reducers = combineReducers({
    textState: textReducer,
    sentState: sentReducer,
});

const store = createStore(reducers);

export default store;

store.subscribe(() =>
    console.log(store.getState())
)


/*
this.state = {
      sentHistory: [],
      textHistory: [],
      currentText: 0,
    };
*/