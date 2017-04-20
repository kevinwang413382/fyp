import React, { Component } from 'react';
import SettingContainer from './SettingContainer.js';
import GraphContainer from './GraphContainer.js';
import { TimeSeries } from "pondjs";
import './css/Container.css'
const _graph = require('./data.json');
const default_graph =   {
    metrics:[],
    graph_data: [
    ],
    actual_prediction: [
      {"day":0,"prediction":0}
    ]
};
const default_params = {
  "classification": false,
  "diff_regression": true,
  "ratio": 0.7,
  "normalize": false,
  "scale": false,
  "continuous_split": true,
  "additional_features": [],
  "start_test": "14 Jan 2017",
  "end_test": "2 Mar 2017",
  "start_train": "10 Jan 2009",
  "end_train": "14 Jan 2017",
  "features_to_use": ["avg-block-size", "cost-per-transaction","difficulty", "estimated-transaction-volume", "hash-rate", "market-cap"],

  "model_to_use": "REGRESS_RAND_FOREST"	// we have more models now:

}

const TYPE_REQUEST_PARAMS = 'request_params';
const TYPE_GRAPH = 'graph';

class Container extends Component{
    constructor(){
      super();
      var _metrics = [];
      for(var index in _graph.metrics){
        var obj = {id: index, value:_graph.metrics[index]};
        _metrics.push(obj);
      }


      this.buildPoints = this.buildPoints.bind(this);
      this.onDataReceived = this.onDataReceived.bind(this);
      this.onSelected = this.onSelected.bind(this);
      const timeSeries = new TimeSeries({
          name: "Default",
          columns: ["time", "actual_price", "predicted_price"],
          points: this.buildPoints(default_graph)
      });
      this.state = {
        graphs: [
          {timeseries: timeSeries, metrics: _metrics, show: true, params: default_params}
        ]
      }
    }
    buildPoints(actual_data) {
        let points = [];
        var last_unix_time;

        for(let i = 0; i < actual_data.graph_data.length; i++){

          var date_string = actual_data.graph_data[i]['date'].substring(0, 10)+ " 00:00:00";
          var unix_time = new Date(date_string).getTime();
          if(i == actual_data.graph_data.length-1) last_unix_time = unix_time;
          points.push(  [unix_time,
                        actual_data.graph_data[i]['prediction'],
                        actual_data.graph_data[i]['label']]
                    )
        }

        for(var point of actual_data.actual_prediction){
          console.log(point.prediction);
          //
           points.push([
             last_unix_time + point['day']*86400000,
             point.prediction,
             point.prediction
           ]);
        }

        return points;
    }
    onSelected(e, index){
      console.log(index);
      var updateState = this.state.graphs;
      for(var i in this.state.graphs){
        updateState[i].show = (i==index)? true:false;

      }
      this.setState(updateState,function(){
        console.log(this.state);
      });
    }
    onDataReceived(data){

      console.log("container received data");
      console.log(data);
      var graph_data = data.graph;
      var params_data = data.params;
      var _timeseries =  new TimeSeries({
          name: "Result " + this.state.graphs.length,
          columns: ["time", "actual_price", "predicted_price"],
          points: this.buildPoints(graph_data)
      });
      var _metrics = [];
      for(var index in graph_data.metrics){
        var obj = {id: index, value:graph_data.metrics[index]};
        _metrics.push(obj);
      }
      var updateState = {};
      updateState['graphs']= this.state.graphs;
      for(var i in updateState['graphs']){
        if(updateState['graphs'][i].show) updateState['graphs'][i].show = false;
      }
      updateState['graphs'].push({timeseries: _timeseries, metrics: _metrics, show: true, params: params_data});


      this.setState(updateState,function(){
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
              {
                this.state.graphs.map(function(obj,index){
                    return (

                        (obj.show)?
                        <GraphContainer metrics = {obj.metrics} timeseries = {obj.timeseries} params = {obj.params}/>
                        : null

                    );
                })
              }
              </div>
              <div className = "graph-select-list">
                {
                  this.state.graphs.map(function(obj, index){
                    if(index==0) return null;
                    var style_selected = {'background-color': 'green'};
                    return(

                      <div style = {(this.state.graphs[index].show)?style_selected:null}onClick = {(e)=>this.onSelected(e,index)}>
                        {'result '+index}
                      </div>
                    );
                  }.bind(this))
                }
              </div>
          </div>
      )
    }
}
export default Container;
//<GraphContainer metrics = {this.state.graphs[0].metrics} timeseries = {this.state.graphs[0].timeseries}/>
