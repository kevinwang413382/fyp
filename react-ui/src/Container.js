import React, { Component } from 'react';
import SettingContainer from './SettingContainer.js';
import GraphContainer from './GraphContainer.js';

import './css/Container.css'
const _graph = require('./data.json');
class Container extends Component{
    constructor(){
      super();
      this.onDataReceived = this.onDataReceived.bind(this);
      this.state = {
        test: 1,
        graph:{
          metrics:{},
          graph_data: [
          ],
          actual_prediction: [
            {"day":7,"prediction":913.3411605384222}
          ]
        }
      }
      console.log(this.state);
    }
    onDataReceived(data){
      console.log("container received data");
      console.log(data.body);
      this.setState({test: 2,graph: data.body},function(){
        console.log(this.state);
      });
    }
    render(){
      return(
        <div>
            <div className = 'setting-container' >
              <SettingContainer handler = {(data)=>this.onDataReceived(data)}/>
            </div>
            <div className = 'graph-container'>
              <GraphContainer test = {this.state.test} graph = {this.state.graph}/>
            </div>
          </div>
      )
    }
}
export default Container;
