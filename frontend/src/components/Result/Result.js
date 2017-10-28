import React from 'react';
import PropTypes from 'prop-types';

import './Result.css';

const Result = props => (
  <div className={`Result ${props.sentiment}`}>
    <div className="Result-markdown">
        <p className="Result-text" dangerouslySetInnerHTML={props.text} />
    </div>
  </div>
);

Result.defaultProps = {
  sentiment: 'neutral',
  text: '',
};

Result.propTypes = {
  sentiment: PropTypes.oneOf(['awful', 'negative', 'neutral', 'positive', 'amazing']),
  text: PropTypes.string,
};

export default Result;
