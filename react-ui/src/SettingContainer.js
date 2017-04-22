import React, { Component } from 'react';
import CheckBox from './CheckBox.js';
import DateInput from './DateInput.js';
import './css/SettingContainer.css';
import ReactDOM from 'react-dom';
const TYPE_CHECK_BOX_ALGO  = 'TYPE_CHECK_BOX_ALGO';
const TYPE_CHECK_BOX_FEATURES  = 'TYPE_CHECK_BOX_FEATURES';
const TYPE_CHECK_BOX_ADDITIONAL_FEATURES = 'TYPE_CHECK_BOX_ADDITIONAL_FEATURES'
const TYPE_OPTION = 'TYPE_OPTION';
const TYPE_OPTION_TIME = 'time';
const TYPE_OPTION_ALGO = 'algorithms';
const TYPE_DATE_INPUT = 'TYPE_DATE_INPUT';
// DATE
const MONTHS= ["Jan",'Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];


const ID_DATE_INPUT_TRAIN_START = 'start_train';
const ID_DATE_INPUT_TRAIN_END = 'end_train';
const ID_DATE_INPUT_TEST_START = 'start_test';
const ID_DATE_INPUT_TEST_END = 'end_test';
const DATE_INPUT_ID_LIST = [
  ID_DATE_INPUT_TRAIN_START ,
  ID_DATE_INPUT_TRAIN_END,
  ID_DATE_INPUT_TEST_START,
  ID_DATE_INPUT_TEST_END
];

const LABEL_DATE_INPUT_START = "Start";
const LABEL_DATE_INPUT_END =   "End  ";

const STATE_FEATURES = "features";
const STATE_ADDITIONAL_FEATURES = 'additional_features'
const STATE_ALGORITHMS = "algorithms";
const STATE_PREDICTION_TYPE = 'time'
// default values
const DEFAULT_TRAIN_START = '';
const DEFAULT_TRAIN_END = ''
const DEFAULT_TEST_START= '';
const DEFAULT_TEST_END = '';



const TYPE_CLASSIFICATION = 1;
const TYPE_REGRESSION = 2;

const algorithms =[
    {id:'CLASS_LR'          , label:'Logistic regression for Classification' ,cls : TYPE_CLASSIFICATION},
    {id:'CLASS_RAND_FOREST' , label:'Random Forest Classification' ,cls : TYPE_CLASSIFICATION},
    {id:'CLASS_DEC_TREE'    , label:'Decision Tree Classification' ,cls : TYPE_CLASSIFICATION},
    {id:'CLASS_GBT'         , label:'GBT Classification'           ,cls : TYPE_CLASSIFICATION},
    {id:'CLASS_NN'          , label:'Neural Network Classification',cls : TYPE_CLASSIFICATION},
    {id:'REGRESS_GLR'       , label:'GLR Regression'               ,cls : TYPE_REGRESSION},
    {id:'REGRESS_GBT'       , label:'GBT Regression'               ,cls : TYPE_REGRESSION},
    {id:'REGRESS_RAND_FOREST', label:'Random Forest Regression'    ,cls : TYPE_REGRESSION},
    {id:'REGRESS_DEC_TREE'  , label:'Decision Tree Regression'     ,cls : TYPE_REGRESSION}

]
const additional_features = [
  {id:'yuan',label:'RMB'},
  {id:'gold',label:'Gold'},
  {id:'oil',label:'Oil'},
  {id:'snp',label:'S&P500'},
  {id:'twitter',label:'Twitter'},
  {id:'sse',label:'ShangHai Exchange'}
]
const features_daily =
    [
        {id: 'avg-block-size'     ,label: 'Block Size'},
        {id: 'cost-per-transaction'         ,label: 'Cost per Transaction'},
        {id: 'difficulty'      ,label: 'Mining Difficulty'},
        {id: 'estimated-transaction-volume'     ,label: 'Transaction Volume'},
        {id: 'hash-rate'    ,label: 'Hash rate'},
        {id: 'market-cap'     ,label: 'Market Cap'},
        {id: 'median-confirmation-time'      ,label: 'Confirmation Time'},
        {id: "miners-revenue", label: "Miner Revenue"},
        {id: "n-orphaned-blocks" , label: "No. Orphaned blocks"},
        {id: "n-transactions-per-block", label: "Transaction per block"},
        {id: "market-price", label: "Market Price"}
    ]
const features_hourly = [
        {id: 0, label:'Hour in day'},
        {id: 1, label:'Market price'},
        {id: 2, label:'Volume'},
        {id: 3, label:'Market Cap'},
        {id: 4, label:'Trades per minute'},
        {id: 5, label:'Ask'},
        {id: 6, label:'Bid'},
        {id: 7, label:'Hash rate'},
        {id: 8, label:'Mining difficulty'},
        {id: 9, label:'block size'},
        {id: 10,label:'No. of transaction'},
        {id: 11,label:'Time between blocks'}

]
class SettingContainer extends Component{
    constructor(props){
      super(props);
      this.onChange = this.onChange.bind(this);
      this.train = this.train.bind(this);
      this.setAllFeatures = this.setAllFeatures.bind(this);
      var default_states = {};
      default_states[TYPE_OPTION_TIME] = "daily";                  // avoid magic word

      const ID_DATE_INPUT_TRAIN_START = 'start_train';
      const ID_DATE_INPUT_TRAIN_END = 'end_train';
      const ID_DATE_INPUT_TEST_START = 'start_test';
      const ID_DATE_INPUT_TEST_END = 'end_test'
      default_states[ID_DATE_INPUT_TRAIN_START] = DEFAULT_TRAIN_START;
      default_states[ID_DATE_INPUT_TRAIN_END] = DEFAULT_TRAIN_END;
      default_states[ID_DATE_INPUT_TEST_START] = DEFAULT_TEST_START;
      default_states[ID_DATE_INPUT_TEST_END] = DEFAULT_TEST_END;
      default_states[STATE_ALGORITHMS] = algorithms[0].id;
      default_states[STATE_FEATURES] = [];
      default_states[STATE_ADDITIONAL_FEATURES] = [];
      for(var feature of features_daily){
        default_states[STATE_FEATURES][feature.id] = false;
      }
      for(var feature of additional_features){
        default_states[STATE_ADDITIONAL_FEATURES][feature.id] = false;
      }
      this.state = default_states;
    }

    setAllFeatures(e,bool){

      var updateState = this.state;
      for(var key in this.state[STATE_FEATURES]){
        updateState[STATE_FEATURES][key] = bool;
      }
      for(var key in this.state[STATE_ADDITIONAL_FEATURES]){
        updateState[STATE_ADDITIONAL_FEATURES][key] = bool;
      }
      this.setState(updateState);
    }
    onChange(e, data){
        var updateState = this.state;
        switch (e.target.name) {
          case TYPE_OPTION:
            updateState[e.target.id] = e.target.options[e.target.options.selectedIndex].value;

            if(e.target.id == TYPE_OPTION_TIME){
              switch (e.target.options[e.target.options.selectedIndex].value) {
                case 'daily':
                  console.log('changed to daily');
                  updateState[STATE_FEATURES] = [];
                  for(var feature of features_daily){
                     updateState[STATE_FEATURES][feature.id]= false;
                  }
                  for(var feature of additional_features){
                     updateState[STATE_FEATURES][feature.id]= false;
                  }
                  this.setAllFeatures('',false)
                  break;
                case 'hourly':
                  console.log('changed to hourly');
                  updateState[STATE_FEATURES] = [];
                  for(var feature of features_hourly){
                     updateState[STATE_FEATURES][feature.id]= false;
                  }
                  this.setAllFeatures('',false)
                  break;
                default:

              }


              // for(var feature in this.state[STATE_ADDITIONAL_FEATURES]){
              //   updateState[STATE_ADDITIONAL_FEATURES][feature] = false;
              // }
            }
            break;
          case TYPE_CHECK_BOX_FEATURES:
            updateState[STATE_FEATURES] = this.state[STATE_FEATURES];
            updateState[STATE_FEATURES][e.target.id]=data;
            break;
          case TYPE_CHECK_BOX_ADDITIONAL_FEATURES:
            updateState[STATE_ADDITIONAL_FEATURES] = this.state[STATE_ADDITIONAL_FEATURES];
            updateState[STATE_ADDITIONAL_FEATURES][e.target.id]=data;
            break;
          case TYPE_DATE_INPUT:
            updateState[e.target.id]=data;
            if(data.length>4){
                console.log(parseInt(data.substring(0,4)));
                if(data.length>7){
                  console.log(parseInt(data.substring(5,7)));
                  if(data.length>=10){
                    console.log(parseInt(data.substring(8,10)));
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

      var options;
      // adding features/ additional features to list


      // request params for daily prediction
      if(this.state[TYPE_OPTION_TIME]=='daily'){
            var feature_list = [];
            var additional_feature_list = [];
            for(var key in this.state[STATE_FEATURES]){
              if(this.state[STATE_FEATURES][key]) feature_list.push(key);
            }
            for(var key in this.state[STATE_ADDITIONAL_FEATURES]){
              if(this.state[STATE_ADDITIONAL_FEATURES][key]) additional_feature_list.push(key);
            }

            options = {
                classification: false,
                diff_regression: false,
                ratio: 0.7,
                normalize: false,
                scale: false,
                continuous_split: true,
                time_formats: [],
              //  addit_delimiters: []
            }
            options['features_to_use'] = feature_list;
            options['additional_features'] = additional_feature_list,
            options['layers']= [
              feature_list.length,
              Math.floor((feature_list.length +2)/2),
              Math.floor((feature_list.length +2)/2),
              2
            ];
            const transformDate = (date)=> {
              return date.substring(8,10)+" "+MONTHS[parseInt(date.substring(5,7))-1]+" "+date.substring(0,4);
            }
            DATE_INPUT_ID_LIST.map(function(index){
              options[index] = transformDate(this.state[index]);
            }.bind(this));
      }
      // request params for hourly prediction
      else if(this.state[TYPE_OPTION_TIME]=='hourly'){
            var feature_list = [];
            for(var key in this.state[STATE_FEATURES]){
                if(this.state[STATE_FEATURES][key] && !isNaN(key)){
                    feature_list.push(parseInt(key));
                }
            }

            options ={
              "continuous_split": true,
              "ratio": 0.7,
              "diff_regression": false,
              "start_train": 0,
              "end_train": 25
            };
            options['features_to_use'] = feature_list;
      }

      options['classification'] = (this.state[STATE_ALGORITHMS].substring(0,5)=='CLASS')?true:false;
      options['model_to_use'] = this.state[STATE_ALGORITHMS];
      console.log(options);
      var isClassification = options['classification'];
      var isDaily = (this.state[TYPE_OPTION_TIME]=='daily')? true: false;
      console.log(isDaily);

      // const STANDARD_LEN = 10;
      // for(var date_input_field of DATE_INPUT_ID_LIST){
      //   var date_input = this.state[date_input_field];
      //   if(date_input.length>=STANDARD_LEN){
      //     if(parseInt(date_input.substring(0,4))>=2009){
      //       if(parseInt(date_input.substring(5,7))<=12){
      //         if(parseInt(date_input.substring(5,7))<=12){
      //
      //         }else; //console.log(date_input_field+": day should be smaller than 30");
      //       }else; //console.log(date_input_field+": month should be smaller than 12");
      //     }else; //console.log(date_input_field+": year should be bigger than 2009");
      //   }else ; //console.log(date_input_field+"<10");
      // }

       fetch((this.state[STATE_PREDICTION_TYPE]=='daily')?'/daily':'/hourly', {
            method : 'POST',
            headers: {'Accept': 'application/json',
                      'Content-Type': 'application/json'
                    },
            body: JSON.stringify(options)
        }).then(function(res) {
          res.json().then(function(res){
            console.log(isDaily);
            this.props.handler({
              model_type: (isClassification)? 'CLASS': 'REGRE',
              prediction_type: (isDaily)? 'daily': 'hourly',
              graph: res,
              params: options});
          }.bind(this));
        }.bind(this));
        // .catch(function(err) {
        //   // Error :(
        // });

    }
    render(){
      var feature_list = (this.state[TYPE_OPTION_TIME]=='daily')? features_daily: features_hourly;
      var additional_features_list = (this.state[TYPE_OPTION_TIME]=='daily')? additional_features: [];

      return(
        <div>
          <div className = "upper-setting section-border">
            <div className = "upper-left-setting">
              <div className = "section-title">Training Type</div>
              <select className = 'select-box' name = {TYPE_OPTION} id = {TYPE_OPTION_TIME} onChange={this.onChange}>
                <option value='daily'>Daily</option>
                <option value='hourly'>Hourly</option>
              </select>

            </div>
            <div className = "upper-right-setting">
                <div className = "section-title">Algorithm</div>
                  <select className = 'select-box' name = {TYPE_OPTION} id = {TYPE_OPTION_ALGO} onChange={this.onChange}>
                  { algorithms.map(function(obj){
                      return(
                        <option value = {obj.id}>{obj.label}</option>
                      )
                    })
                  }
                  </select>
            </div>
          </div>
          <div className = "clear-both"/>
          <div className = "center-setting section-border">
          <div className = "section-title">Features</div>
              <div className = 'features-left'>

                {
                  feature_list.map(function(obj, index){
                    return(
                      <CheckBox name = {TYPE_CHECK_BOX_FEATURES} isChecked = {this.state[STATE_FEATURES][obj.id]}
                         key = {index} id = {obj.id} label = {obj.label} handler = {this.onChange}/>
                    );
                  }.bind(this))
                }
              </div>
              <div className = 'features-right'>
                {
                  additional_features_list.map(function(obj, index){
                    return(
                      <CheckBox name = {TYPE_CHECK_BOX_ADDITIONAL_FEATURES} isChecked = {this.state[STATE_ADDITIONAL_FEATURES][obj.id]}
                         key = {index} id = {obj.id} label = {obj.label} handler = {this.onChange}/>
                    );
                  }.bind(this))
                }
              </div>
              <div className = "clear-both"/>

            <div>
              <button onClick = {(e)=>this.setAllFeatures(e,true)}>Select All</button>
              <button onClick = {(e)=>this.setAllFeatures(e,false)}>Select None</button>
              <div className = "clear-both"/>
            </div>
          </div>
          {
          (this.state[TYPE_OPTION_TIME]=='daily')?
          <div className = "lower-setting section-border">

            <div className = "date-input-section">
              <div className = "section-title">Train Period</div>
              <DateInput id = {ID_DATE_INPUT_TRAIN_START} name = {TYPE_DATE_INPUT} default_value = {DEFAULT_TRAIN_END} label = {LABEL_DATE_INPUT_START}handler = {this.onChange}/>
              <DateInput id = {ID_DATE_INPUT_TRAIN_END}   name = {TYPE_DATE_INPUT} default_value = {DEFAULT_TRAIN_END} label = {LABEL_DATE_INPUT_END}handler = {this.onChange}/>
              <div className = "clear-both"/>
            </div>
            <hr/>
            <div className = "date-input-section">
              <div className = "section-title">Test Period</div>
              <DateInput id = {ID_DATE_INPUT_TEST_START} name = {TYPE_DATE_INPUT} default_value = {DEFAULT_TEST_START} label = {LABEL_DATE_INPUT_START}handler = {this.onChange}/>
              <DateInput id = {ID_DATE_INPUT_TEST_END}   name = {TYPE_DATE_INPUT} default_value = {DEFAULT_TEST_END}label = {LABEL_DATE_INPUT_END}handler = {this.onChange}/>
              <div className = "clear-both"/>

            </div>
          </div> : null

        }
        <button id = "send-train" onClick = {this.train}>Train</button>
        </div>
      )
    }
}

export default SettingContainer;
// {
//     algorithms.map(function(obj, index){
//       return(
//         <CheckBox name = {TYPE_CHECK_BOX_ALGO} key = {index} id = {obj.id} label = {obj.label} handler = {this.onChange}/>
//       );
//     }.bind(this))
// }
