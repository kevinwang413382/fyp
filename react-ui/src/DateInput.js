import React, { Component } from 'react';
import "./css/DateInput.css";
var keyLock = false;

class DateInput extends Component{
  constructor(props){
    super(props);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onChange  = this.onChange.bind(this);
    this.state = {value: this.props.default_value};
  }
  onKeyDown(e){
    if(e.keyCode==8){         //backspace keystroke
      keyLock = true;
    }
  }
  onChange(e){
      var len   = e.target.value.length;
      var val = e.target.value;
      if(len>10 || !(val.charAt(len-1) =='/'|| val.charAt(len-1) ==''|| (Number.isInteger(parseInt(val.charAt(len-1)))))) return;

      if(!keyLock){                          // not locked:
        val = (len==4||len==7)? val+'/':val; // adding slash in YYYY/MM/DD
      }else{
        val = (len==4||len==7)? val.substring(0,len-1): val; // deleting slash together with char
        keyLock = false;
      }
      this.setState({value:val});
      this.props.handler(e,val);

  }
  render(){
    return(
      <div className = "date-input">
        <label for ={this.props.id}> {this.props.label}</label>
        <input type="text" id = {this.props.id}  name={this.props.name} onChange = {this.onChange} onKeyDown = {this.onKeyDown}
          value = {this.state.value}   />

      </div>
    )
  }
}

export default DateInput;
//
// var len = e.target.value.length;
// console.log(e.target.value);
// var updateState = {};
// var result = "";
// if(len<=10){
//   if(!keyLock){
//       if(len==4||len==7) result = e.target.value+"/";
//       else result = e.target.value
//   }
//   else{
//       if(len==4||len==7){
//         console.log("triggered:"+ e.target.value);
//         var tmp = e.target.value
//         result = tmp.substring(0,tmp.length-1);
//         keyLock = false;
//       }
//       else {
//         result = e.target.value
//         keyLock = false;
//       }
//   }
// }else{
//   result = this.state.value;
// }
// //
