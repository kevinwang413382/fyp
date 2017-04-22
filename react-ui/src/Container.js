import React, { Component } from 'react';
import SettingContainer from './SettingContainer.js';
import GraphContainer from './GraphContainer.js';
import { TimeSeries } from "pondjs";
import './css/Container.css'
const _graph = require('./data.json');
const default_graph =   {
    model_type: 'REGRE',
    prediction_type: 'daily',
    graph: _graph,
    params: {}
};
const default_prediction_graph = [
  {'day':0,'prediction':0}
]
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
const TYPE_PREDICTION_DAILY ='daily';
const TYPE_PREDICTION_HOURLY = 'hourly';


class Container extends Component{
    constructor(){
      super();
      var _metrics = [];
      for(var index in default_graph.metrics){
        var obj = {id: index, value:default_graph.metrics[index]};
        _metrics.push(obj);
      }


      this.buildPoints = this.buildPoints.bind(this);
      this.onDataReceived = this.onDataReceived.bind(this);
      this.onSelected = this.onSelected.bind(this);
      this.changeDisplay = this.changeDisplay.bind(this);
      const timeSeries = new TimeSeries({
          name: "validation",
          columns: ["time", "predicted_price", "actual_price"],
          points : this.buildPoints(TYPE_PREDICTION_DAILY,default_graph.graph.graph_data)
      });
      const prediction_timeSeries = new TimeSeries({
          name: 'Prediction',
          columns: ["time", "predicted_price"],
          points : this.buildPredictionPoints(TYPE_PREDICTION_DAILY,default_graph.graph.actual_prediction)
      });
      this.state = {
        show: 'validation',
        graphs: [
          {
            show: true,
            validation:{timeseries: timeSeries           , metrics: _metrics, params: default_params, max: 1500, min: 600},
            prediction:{timeseries: prediction_timeSeries, metrics: _metrics, params: default_params, max: 1500, min: 600}
          }
        ]
      }
    }
    buildPoints(prediction_type,graph_data) {
        let points = [];
        for(let i = 0; i <graph_data.length; i++){

          var date_string = (prediction_type=='daily')?graph_data[i]['date'].substring(0, 10)+" 00:00:00"
                                                      :graph_data[i]['date'];
          var unix_time = new Date(date_string).getTime();
          points.push(  [unix_time,
                        graph_data[i]['prediction'],
                        graph_data[i]['label']]
                    )
        }
        return points;
    }
    buildPredictionPoints(prediction_type,prediction_data){
      let points = [];
      let currentTime = new Date(new Date().getFullYear()+'-'+(new Date().getMonth()+1)+'-'+ new Date().getDate()).getTime();

      let multiple = (prediction_type == 'daily')? 86400000: 360000;
      for(var point of prediction_data){
         points.push([
           currentTime + ((prediction_type=='daily')?point['day']:point['hour']-1)*multiple,
           point['prediction']
         ]);
      }
      return points;
    }

    changeDisplay(type){
        if(this.state.show == type) return;
        var updateState = this.state;
        updateState['show'] = type;
        this.setState({show: type},function(){
          console.log(this.state);
        });
    }

    onSelected(e, index){

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
          name: "Result " + this.state.graphs.length+": Validation",
          columns: ["time", "actual_price", "predicted_price"],
          points: this.buildPoints(data.prediction_type,graph_data['graph_data'])
      });
      var _prediction_timeseries =  new TimeSeries({
          name: "Result " + this.state.graphs.length+": Prediction",
          columns: ["time", "predicted_price"],
          points: this.buildPoints(data.prediction_type,graph_data['actual_prediction'])
      });


      var _metrics = [];
      for(var index in graph_data.metrics){
        var obj = {id: index, value:graph_data.metrics[index]};
        _metrics.push(obj);
      }
      var updateState = {};

      // pushing the new graph to graph array
      updateState['graphs']= this.state.graphs;
      for(var i in updateState['graphs']){
        if(updateState['graphs'][i].show) updateState['graphs'][i].show = false;
      }
      // get the max and min
      // var max = graph_data['graph_data'].reduce(function(a,b){
      //   console.log(a);
      // },0);
      var validation_max = 0;
      var prediction_max = 0 ;
      var validation_min = 100000;
      var prediction_min = 1000000 ;
      for(var point of graph_data['graph_data']){
          validation_max = (Math.max(point.label,point.prediction)>validation_max)? Math.max(point.label,point.prediction): validation_max;
          validation_min = (Math.min(point.label,point.prediction)<validation_min)? Math.min(point.label,point.prediction): validation_min;
      }
      for(var point of graph_data['actual_prediction']){
          prediction_max = (Math.max(point.label,point.prediction)>prediction_max)? Math.max(point.label,point.prediction): prediction_max;
          prediction_min = (Math.min(point.label,point.prediction)<prediction_min)? Math.min(point.label,point.prediction): prediction_min;
      }
      var coef = 0.5;
      updateState['graphs'].push(
        {
          'validation':{
              timeseries: _timeseries,
              max: validation_max+coef*(validation_max-validation_min),
              min: Math.max(0,validation_min-coef*(validation_max-validation_min)),
              metrics: _metrics,
              show: true,
              params: params_data,
              model_type: (data.model_type = 'REGRE')? 'REGRE': 'CLASS',
              prediction_type: (data.prediction_type = 'daily')? 'daily': 'hourly',
          },
          'prediction':{
              timeseries: _prediction_timeseries,
              max: prediction_max+coef*(prediction_max-prediction_min),
              min: Math.max(0, prediction_min-coef*(prediction_max-prediction_min)),
              metrics: _metrics,
              show: true,
              params: params_data,
              model_type: (data.model_type = 'REGRE')? 'REGRE': 'CLASS',
              prediction_type: (data.prediction_type = 'daily')? 'daily': 'hourly',
          }
        });


      this.setState(updateState,function(){
          this.onSelected('',this.state.graphs.length-1);
      }.bind(this));
    }
    render(){
      return(
        <div>
            <div className = 'setting-container' >
              <SettingContainer handler = {(data)=>this.onDataReceived(data)}/>
            </div>
            <div className = 'graph-container'>
              <button onClick = {(e)=>this.changeDisplay('validation')}>Validation</button>
              <button onClick = {(e)=>this.changeDisplay('prediction')}>Prediction</button>

              {
                this.state.graphs.map(function(graph,index){

                  return (

                        (graph.show)?

                            <GraphContainer metrics = {graph[this.state.show].metrics} timeseries = {graph[this.state.show].timeseries} params = {graph[this.state.show].params}
                            max = {graph[this.state.show].max} min = {graph[this.state.show].min}/>

                        : null

                    );
                }.bind(this))
              }
              </div>
              <div className = "graph-select-list">
                {
                  this.state.graphs.map(function(obj, index){
                    if(index==0) return null;
                    var style_selected = {'background-color': '#848484'};
                    return(

                      <div style = {(this.state.graphs[index].show)?style_selected:null} onClick = {(e)=>this.onSelected(e,index)}>
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
