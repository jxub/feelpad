import React from 'react';
import PropTypes from 'prop-types';

import './Header.css';

const Header = props => (
  <header className="Header">
    <div className="Header-textwrap">
      <img className="Header-image" src={props.sentiment ? `./${props.sentiment}.png` : './neutral.png'} alt="emoji" />
      <h1 className="Header-title">Feelpad</h1>
      <p className="Header-slug">The language of emotions</p>
    </div> 
  </header>
);

Header.defaultProps = {
  sentiment: 'neutral',
};


Header.propTypes = {
  sentiment: PropTypes.oneOf(['awful', 'negative', 'neutral', 'positive', 'amazing']),
};

export default Header;
