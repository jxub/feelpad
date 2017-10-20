import React, { Component } from 'react';
import removeMd from 'remove-markdown';
import html2canvas from 'html2canvas';
import {Converter} from 'showdown';
import jsPDF from 'jspdf';
import axios from 'axios';
import './Editor.css';

import burst from './../../utils/burst';
import Text from './../Text/Text';
import Header from './../Header/Header';
import Result from './../Result/Result';

const NLP_SERVICE = 'http://127.0.0.1:5000/nlp';

const emotions = ['awful', 'negative', 'neutral', 'positive', 'amazing']





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
    this.handleAnalyze = this.handleAnalyze.bind(this);
    this.handlePdf = this.handlePdf.bind(this);
    this.makeBurst = this.makeBurst.bind(this);
    this.undoText = this.undoText.bind(this);
    this.redoText = this.redoText.bind(this);
  }

  handleEdit(text) {
    this.setState({
      ...this.state,
      textHistory: [...this.state.textHistory, text],
      currentText: this.state.currentText + 1
    });
  }

  handleSave() {
    return;
  }

  handleAnalyze() {
    const [currentText] = this.state.textHistory.slice(-1);
    console.log(`CurrentText: ${JSON.stringify(currentText)}`)
    const plain = removeMd(currentText)
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
        ...this.state,
        sentHistory: [...this.state.sentHistory, data.sentiment],
      })
    })
    .catch((error) => {
      console.error(`fetching sentiment: ${error}`);
    });
  }

  handlePdf() {
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

  handleMd(md) {

  }

  makeBurst() {
    const xCoord = Math.random() * (1600 - 200) + 200;
    const yCoord = Math.random() * (170 - 20) + 20;
    return burst
           .tune({ x: xCoord, y:  yCoord })
           .replay();
  }

  componentDidMount() {
    setInterval(this.makeBurst, 1000);
  }

  undoText() {
    this.setState({
      ...this.state,
      currentText: this.state.currentText - 1,
    })
  }

  redoText() {
    this.setState({
      ...this.state,
      currentText: this.state.currentText + 1,
    })
  }

  render() {
    console.log(`state ${JSON.stringify(this.state)}`)
    const now = this.state.currentText - 1;
    const currentText = this.state.textHistory[now]
    const [currentSent] = this.state.sentHistory.slice(-1) || ['neutral'];  
    return (
      <div className="Editor">
        <Header sentiment={currentSent}/>
        <div className="Editor-body">
          <div className="Editor-text">
            <section className="Editor-section">
              <label>write here</label>
              <button className="butt" onClick={this.handleAnalyze}>Analyze!</button>
              <br />
              <Text onEdit={this.handleEdit}/>
            </section>
          </div>
          <div className="Editor-result">
            <section className="Editor-section">
              <label>{currentSent} feelz here</label>
              <button className="butt" onClick={this.handlePdf}>Download!</button>
              <br />
              <div id="printResult">
                <Result source={currentText}
                sentiment={currentSent} />  
              </div>
            </section>
          </div>
        </div>
      </div>
    )
  }
}
