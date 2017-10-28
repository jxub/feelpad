import React, { Component } from 'react';
import removeMd from 'remove-markdown';
import html2canvas from 'html2canvas';
import { Converter } from 'showdown';
import jsPDF from 'jspdf';
import axios from 'axios';

import './Editor.css';

import burst from './../../utils/burst';
import randomRng from './../../utils/utils';
import Text from './../Text/Text';
import Header from './../Header/Header';
import Result from './../Result/Result';
import Footer from './../Footer/Footer';

const NLP_SERVICE = 'http://127.0.0.1:5000/nlp';


export default class Editor extends Component {
  constructor() {
    super();

    this.state = {
      sentHistory: [],
      textHistory: [],
      currentText: 0,
    };

    this.mdConverter = new Converter();

    this.handleEdit = this.handleEdit.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
    this.handleAnalyze = this.handleAnalyze.bind(this);
    this.handlePdf = this.handlePdf.bind(this);
    this.handleMd = this.handleMd.bind(this);
    this.makeBurst = this.makeBurst.bind(this);
    this.undoText = this.undoText.bind(this);
    this.redoText = this.redoText.bind(this);
  }


  componentDidMount() {
    setInterval(this.makeBurst, 1000);
  }

  handleEdit(text) {
    this.setState({
      ...this.state,
      textHistory: [...this.state.textHistory, text],
      currentText: this.state.currentText + 1,
    });
  }

  handleSave() {
    return this.state.textHistory; // change
  }

  handleEnter(event) {
    if(event.keyCode === 13) return this.handleAnalyze;
  }

  handleAnalyze() {
    const [currentText] = this.state.textHistory.slice(-1);
    console.log(`CurrentText: ${JSON.stringify(currentText)}`);
    const plain = removeMd(currentText)
      .replace('%0A', ' ')
      .replace('+', ' ');
    axios.get(NLP_SERVICE, {
      params: {
        text: plain,
      },
    })
      .then((response) => {
        console.log(response.data);
        const data = JSON.parse(response.data);
        console.log(data.sentiment);
        this.setState({
          ...this.state,
          sentHistory: [...this.state.sentHistory, data.sentiment],
        });
      })
      .catch((error) => {
        console.error(`fetching sentiment: ${error}`);
      });
  }

  handlePdf() {
    const input = document.getElementsByClassName('Editor-print')[0];
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

  handleMd(md) {
    const html = this.mdConverter.makeHtml(md);
    return {__html: html};
  }

  makeBurst() {
    const [x, y] = [window.innerWidth, window.innerHeight];
    console.log(x, y)
    const [xMax, xMin] =  [x * 0.9, x * 0.1];
    const [yMax, yMin] =  [200, 10];
    const xCoord = randomRng(xMin, xMax);
    const yCoord = randomRng(yMin, yMax);
    console.log(xCoord, yCoord)
    return burst
      .tune({ x: xCoord, y:  yCoord })
      .replay();
  }

  undoText() {
    this.setState({
      ...this.state,
      currentText: this.state.currentText - 1,
    });
  }

  redoText() {
    this.setState({
      ...this.state,
      currentText: this.state.currentText + 1,
    });
  }

  render() {
    console.log(`state ${JSON.stringify(this.state)}`);
    const now = this.state.currentText - 1;
    const currentText = this.handleMd(this.state.textHistory[now]);
    console.log(`currentText ${JSON.stringify(currentText)}`);
    const [currentSent] = this.state.sentHistory.slice(-1);
    return (
      <div className="Editor">
        <Header sentiment={currentSent} />
        <div className="Editor-body">
          <div className="Editor-text">
            <section className="Editor-section">
              <label className="Editor-explanation">
                write here
                <i className="em em-pencil label-em" />
              </label>
              <button className="butt" onKeyDown={this.handleEnter} onClick={this.handleAnalyze}>
              <i className="em em-arrow_right_hook butt-em" />
                Analyze!
              </button>
              <br />
              <Text onEdit={this.handleEdit} />
            </section>
          </div>
          <div className="Editor-result">
            <section className="Editor-section">
              <label className="Editor-explanation">
                {currentSent} feelz here
                <i className="em em-heartbeat label-em" />
              </label>
              <button className="butt" onClick={this.handlePdf}>
                <i className="em em-arrow_down butt-em" />
                Download!
              </button>
              <br />
              <div className="Editor-print">
                <Result
                  text={currentText}
                  sentiment={currentSent}
                />
              </div>
            </section>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
