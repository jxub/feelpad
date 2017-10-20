import React from 'react';
import Markdown from 'react-remarkable';

import './Result.css';

export default props =>
  <div className={"Result " + props.sentiment}> 
    <Markdown className="Result-markdown" source={props.source} />
  </div>
