import React, { Component } from 'react';
import Markdown from 'react-remarkable';
import removeMd from 'remove-markdown';
// import Rx from 'rxjs/Rx';
import _ from 'lodash';
import {Application, loader, Sprite} from 'pixi.js';
import mojs from 'mo-js';
import axios from 'axios';
import logo from './logo.svg';
import './Editor.css';

const NLP_SERVICE = 'http://127.0.0.1:5000/nlp';

const app = new Application();

// The application will create a canvas element for you that you
// can then insert into the DOM.
document.body.appendChild(app.view);
document.getElementsByClassName
// load the texture we need
loader.add('bunny', 'bunny.png').load(function(loader, resources) {
  // This creates a texture from a 'bunny.png' image.
  var bunny = new Sprite(resources.bunny.texture);

  // Setup the position of the bunny
  bunny.x = app.renderer.width / 2;
  bunny.y = app.renderer.height / 2;

  // Rotate around the center
  bunny.anchor.x = 0.5;
  bunny.anchor.y = 0.5;

  // Add the bunny to the scene we are building.
  app.stage.addChild(bunny);

  // Listen for frame updates
  app.ticker.add(function() {
        // each frame we spin the bunny around a bit
      bunny.rotation += 0.01;
  });
});

const Text = (props) => (
  <div className="padWrap editorWindow">
    <textarea className="pad" onInput={({target}) => (props.onEdit(target.value))} />
  </div>
);

const Result = (props) => (
  <div className={"feelWrap editorWindow " + props.sentiment}> 
    <Markdown className="feel" source={props.source} />
  </div>
);

const Header = (props) => (
  <header className="Editor-header">
    <img src={logo} className="Editor-logo" alt="logo" />
    <div id="Editor-animation" />
    <h1 className="Editor-title">Feelpad</h1>
  </header>
);

const burst = new mojs.Burst({
  left:     0,
  top:      0,
  radius:   { 4: 19 },
  angle:    45,
  children: {
    shape:            'line',
    radius:           3,
    scale:            1,
    stroke:          '#FD7932',
    strokeDasharray: '100%',
    strokeDashoffset: { '-100%' : '100%' },
    duration:         700,
    easing:           'quad.out',
  }
});

class Editor extends Component {
  constructor() {
    super();
    this.state = {
      text: '',
      sentiment: '',
    };
    this.handleEdit = this.handleEdit.bind(this);
    this.handleMd = this.handleMd.bind(this);
    this.makeSwirl = this.makeSwirl.bind(this);
  }

  handleEdit(text) {
    this.setState({
      text: text
    });
  }

  async handleMd() {
    const plain = removeMd(this.state.text);
    this.setState({
      text: this.state.text,
      plain: plain
    });
    let sentiment;
    try {
      sentiment = await axios.post('/nlp', {
        text: this.state.plain
      });
      this.setState({
        ...this.state,
        sentiment: sentiment // positive | negative | neutral
      });
    } catch (err) {
      console.log(`ajax error: ${err}`)
    }
  }

  makeSwirl() {
    const xCoord = Math.random() * (1600 - 200) + 200;
    const yCoord = Math.random() * (170 - 20) + 20;
    return burst
           .tune({ x: xCoord, y:  yCoord })
           .replay();
  }

  async componentDidMount() {
    setInterval(this.makeSwirl, 1000);
    _.throttle(this.handleMd, 10000);
  }

  render() {
    return (
      <div className="Editor">
        <Header />
        <div className="editorWrap">
          <div className="textWrap">
            <section>
              <label>Write here</label>
              <br />
              <Text onEdit={this.handleEdit}/>
            </section>
          </div>
          <div className="resultWrap">
            <section>
              <label>Feel here</label>
              <br />
              <Result source={this.state.text}
              sentiment={this.state.sentiment} />  
            </section>
          </div>
        </div>
      </div>
    )
  }
}

export default Editor;
