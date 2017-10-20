import React from 'react';
import './Text.css'

export default (props) => (
  <div className="Text">
    <textarea className="Text-textarea" onInput={({target}) => (props.onEdit(target.value))} />
  </div>
);