import React from 'react';

import './Header.css'

export default props =>
    <header className="Header">
      <img className="Header-image" src={props.sentiment ? './' + props.sentiment + '.png' : './neutral.png'} alt="emoji"/>
      <h1 className="Header-title">Feelpad</h1>
      <p className="Header-slug">The language of emotions</p>
    </header>