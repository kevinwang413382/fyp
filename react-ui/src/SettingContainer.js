import React, { Component } from 'react';
import CheckBox from './CheckBox.js';
import DateInput from './DateInput.js';
import './css/SettingContainer.css';
import ReactDOM from 'react-dom';
const TYPE_CHECK_BOX_ALGO  = 'TYPE_CHECK_BOX_ALGO';
const TYPE_CHECK_BOX_FEATURES  = 'TYPE_CHECK_BOX_FEATURES';
const TYPE_OPTION     = 'TYPE_OPTION';

// DATE
const TYPE_DATE_INPUT = 'TYPE_DATE_INPUT';
const ID_DATE_INPUT_TRAIN_START = 'date_train_start';
const ID_DATE_INPUT_TRAIN_END = 'date_train_end';
const ID_DATE_INPUT_TEST_START = 'date_test_start';
const ID_DATE_INPUT_TEST_END = 'date_test_end';
const DATE_INPUT_ID_LIST = [
  ID_DATE_INPUT_TRAIN_START ,
  ID_DATE_INPUT_TRAIN_END,
  ID_DATE_INPUT_TEST_START,
  ID_DATE_INPUT_TEST_END
];

const LABEL_DATE_INPUT_START = "Start";
const LABEL_DATE_INPUT_END =   "End  ";
const STATE_FEATURES = "features";
const STATE_ALGORITHMS = "algorithms";
var keyLock = false;
const algorithms =
    [
        {id:'algo_rf', label: 'Random Forest'},
        {id:'algo_dt', label: 'Decision Tree'},
        {id:'algo_gbt', label: 'GBT'},
        {id:'algo_nn', label: 'Neural Network'}
    ]

const features =
    [
        {id: 'avg-block-size'     ,label: 'Block Size'},
        {id: 'cost-per-transaction'         ,label: 'Cost per Transaction'},
        {id: 'difficulty'      ,label: 'Mining Difficulty'},
        {id: 'estimated-transaction-volume'     ,label: 'Transaction Volume'},
        {id: 'hash-rate'    ,label: 'Hash rate'},
        {id: 'market-cap'     ,label: 'Market Cap'},
        {id: 'median-confirmation-time'      ,label: 'Confirmation Time'},
        {id:"miners-revenue", label: "Miner Revenue"},
        {id:"n-orphaned-blocks" , label: "No. Orphaned blocks"},
        {id:"n-transactions-per-block", label: "Transaction per block"},
        {id:"market-price", label: "Market Price"}
    ]


class SettingContainer extends Component{
    constructor(props){
      super(props);
      this.onChange = this.onChange.bind(this);
      this.train = this.train.bind(this);
      var default_states = {};
      default_states[TYPE_OPTION] = "daily";                  // avoid magic word
      for(var date_input of DATE_INPUT_ID_LIST){
        default_states[date_input] = ""
      }
      // default_states[ID_DATE_INPUT_TRAIN_END] = "";
      // default_states[ID_DATE_INPUT_TRAIN_START] = "";
      // default_states[ID_DATE_INPUT_TEST_END] = "";
      // default_states[ID_DATE_INPUT_TEST_START] = "";
      default_states[STATE_ALGORITHMS] =[];
      for(var algo of algorithms){
        default_states[STATE_ALGORITHMS][algo.id] = false;
      }
      default_states[STATE_FEATURES] = [];
      for(var feature of features){
        default_states[STATE_FEATURES][feature.id] = false;
      }
      this.state = default_states;
      console.log(this.state);
    }

    onChange(e, data){
        var updateState = {}
        console.log(e.target.id);
        switch (e.target.name) {
          case TYPE_OPTION:
            updateState[e.target.id] = e.target.options[e.target.options.selectedIndex].value;
            break;
          case TYPE_CHECK_BOX_FEATURES:
            updateState[STATE_FEATURES] = this.state[STATE_FEATURES];
            updateState[STATE_FEATURES][e.target.id]=data;
            break;
          case TYPE_CHECK_BOX_ALGO:
            updateState[STATE_ALGORITHMS] = this.state[STATE_ALGORITHMS];
            updateState[STATE_ALGORITHMS][e.target.id]=data;

            break;
          case TYPE_DATE_INPUT:
            updateState[e.target.id]=data;
            if(data.length>4){
                console.log(parseInt(data.substring(0,4)));
                if(data.length>7){
                  console.log(parseInt(data.substring(5,8)));
                  if(data.length>=10){
                    console.log(parseInt(data.substring(9,11)));
                  }
                }
            }
            break;

          default:
        }
        this.setState(updateState,function(){
          console.log(this.state);
        });
    }

    train(){

      var options = {
        classification: false,
        diff_regression: false,
        ratio: 0.7,
        normalize: false,
        scale: false,
        continuous_split: true,
        additional_features: [],
        time_formats: [],
        addit_delimiters: []
      };
      var feature_list = [];
      for(var key in this.state[STATE_FEATURES]){
        if(this.state[STATE_FEATURES][key]) feature_list.push(key);
      }
      options['features_to_use'] = feature_list;
      options['start_train']  = this.state[ID_DATE_INPUT_TRAIN_START];
      options['end_train']    = this.state[ID_DATE_INPUT_TRAIN_END];
      options['start_test']   = this.state[ID_DATE_INPUT_TEST_START];
      options['end_test']     = this.state[ID_DATE_INPUT_TEST_END];
      options['model_to_use'] = "REGRESS_RAND_FOREST";

      const STANDARD_LEN = 10;
      for(var date_input_field of DATE_INPUT_ID_LIST){
        var date_input = this.state[date_input_field];
        if(date_input.length>=STANDARD_LEN){
          if(parseInt(date_input.substring(0,4))>=2009){
            if(parseInt(date_input.substring(5,7))<=12){
              if(parseInt(date_input.substring(5,7))<=12){

              }else console.log(date_input_field+": day should be smaller than 30");
            }else console.log(date_input_field+": month should be smaller than 12");
          }else console.log(date_input_field+": year should be bigger than 2009");
        }else  console.log(date_input_field+"<10");

      }

      console.log(feature_list);
       fetch('/api', {
            method : 'POST',
            headers: {'Accept': 'application/json',
                      'Content-Type': 'application/json'
                    },
            body: JSON.stringify(options)
        }).then(function(res) {
          res.json().then(function(res){
            console.log("received from server");
            console.log(res);
            this.props.handler(res);
          }.bind(this));
        }.bind(this));
        // .catch(function(err) {
        //   // Error :(
        // });

    }
    render(){

      return(
        <div>
          <div className = "upper-setting section-border">
            <div className = "upper-left-setting">
              <div className = "section-title">Training Type</div>
              <select name = {TYPE_OPTION} id = {TYPE_OPTION} onChange={this.onChange}>
                <option value='daily'>Daily</option>
                <option value='hourly'>Hourly</option>
              </select>

            </div>
            <div className = "upper-right-setting">
                <div className = "section-title">Algorithm</div>
                {
                    algorithms.map(function(obj, index){
                      return(
                        <CheckBox name = {TYPE_CHECK_BOX_ALGO} key = {index} id = {obj.id} label = {obj.label} handler = {this.onChange}/>
                      );
                    }.bind(this))
                }
            </div>
          </div>
          <div className = "clear-both"/>
          <div className = "center-setting section-border">
          <div className = "section-title">Features</div>
          {
              features.map(function(obj, index){
                return(
                  <CheckBox name = {TYPE_CHECK_BOX_FEATURES} key = {index} id = {obj.id} label = {obj.label} handler = {this.onChange}/>
                );
              }.bind(this))
          }
          </div>
          <div className = "lower-setting section-border">
            <div className = "date-input-section">
              <div className = "section-title">Train Period</div>
              <DateInput id = {ID_DATE_INPUT_TRAIN_START} name = {TYPE_DATE_INPUT} label = {LABEL_DATE_INPUT_START}handler = {this.onChange}/>
              <DateInput id = {ID_DATE_INPUT_TRAIN_END}   name = {TYPE_DATE_INPUT} label = {LABEL_DATE_INPUT_END}handler = {this.onChange}/>
              <div className = "clear-both"/>
            </div>
            <hr/>
            <div className = "date-input-section">
              <div className = "section-title">Test Period</div>
              <DateInput id = {ID_DATE_INPUT_TEST_START} name = {TYPE_DATE_INPUT} label = {LABEL_DATE_INPUT_START}handler = {this.onChange}/>
              <DateInput id = {ID_DATE_INPUT_TEST_END}   name = {TYPE_DATE_INPUT} label = {LABEL_DATE_INPUT_END}handler = {this.onChange}/>
              <div className = "clear-both"/>
              <button id = "send-train" onClick = {this.train}>Train</button>
            </div>
          </div>

        </div>
      )
    }
}

export default SettingContainer;
