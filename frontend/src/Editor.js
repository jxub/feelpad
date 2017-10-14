import React, { Component } from 'react';
import Markdown from 'react-remarkable';
import removeMd from 'remove-markdown';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import mojs from 'mo-js';
import axios from 'axios';
import logo from './logo.svg';
import './Editor.css';

const NLP_SERVICE = 'http://127.0.0.1:5000/nlp';

const emotions = ['awful', 'negative', 'neutral', 'positive', 'amazing']

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
    <img className="rotatingImg" src={props.sentiment ? './' + props.sentiment + '.png' : './neutral.png'} />
    <h1 className="Editor-title">Feelpad</h1>
    <p>The language of emotions</p>
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
    this.handleAnalyzeClick = this.handleAnalyzeClick.bind(this);
    this.handleCopyClick = this.handleCopyClick.bind(this);
    this.makeSwirl = this.makeSwirl.bind(this);
  }

  handleEdit(text) {
    this.setState({
      text: text
    });
  }

  handleAnalyzeClick() {
    const plain = removeMd(this.state.text)
                  .replace('%0A', ' ')
                  .replace('+', ' ')
    axios.get(NLP_SERVICE, {
      params: {
        text: plain
      }
    })
    .then((response) => {
      console.log(response.data)
      const data = JSON.parse(response.data)
      console.log(data.sentiment)
      this.setState({
        ...this.state, // check
        sentiment: data.sentiment, // positive | negative | neutral
      })
    })
    .catch((error) => {
      console.error(`fetching sentiment: ${error}`);
    });
  }

  handleCopyClick() {
    const input = document.getElementById('printResult');
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'JPEG', 0, 0);
        pdf.output('dataurlnewwindow');
      })
      .catch((error) => {
        console.error(`creating pdf: ${error}`);
      });
  }

  makeSwirl() {
    const xCoord = Math.random() * (1600 - 200) + 200;
    const yCoord = Math.random() * (170 - 20) + 20;
    return burst
           .tune({ x: xCoord, y:  yCoord })
           .replay();
  }

  componentDidMount() {
    setInterval(this.makeSwirl, 1000);
  }

  render() {
    return (
      <div className="Editor">
        <Header sentiment={this.state.sentiment}/>
        <div className="editorWrap">
          <div className="textWrap">
            <section>
              <label>Write here</label>
              <button className="butt" onClick={this.handleAnalyzeClick}>Analyze!</button>
              <br />
              <Text onEdit={this.handleEdit}/>
            </section>
          </div>
          <div className="resultWrap">
            <section>
              <label>Feel here: {this.state.sentiment}</label>
              <button className="butt" onClick={this.handleCopyClick}>Download!</button>
              <br />
              <div id="printResult">
                <Result source={this.state.text}
                sentiment={this.state.sentiment} />  
              </div>
            </section>
          </div>
        </div>
      </div>
    )
  }
}

export default Editor;
