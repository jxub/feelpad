import React from 'react';
import Markdown from 'react-remarkable';
import './Result.css';

export default (props) => (
    <div className={"feelWrap " + props.sentiment}> 
      <Markdown className="feel" source={props.source} />
    </div>
);

// export default Result extent