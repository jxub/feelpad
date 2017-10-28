export const ADD_TEXT = 'ADD_TEXT';

export const UNDO_TEXT = 'UNDO_TEXT';
export const REDO_TEXT = 'REDO_TEXT';

export const ADD_SENT = 'ADD_SENT';


export const addText = (text) => (
    { type: ADD_TEXT, text }
);

export const addSent = (sent) => (
    { type: ADD_SENT, sent }
);
