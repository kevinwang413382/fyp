import React, { Component} from 'react';
import './css/CheckBox.css';
class CheckBox extends Component{

  constructor(props){
    super(props);
    this.state = {
      isChecked: false
    }
    this.onChange = this.onChange.bind(this);
  }
  onChange(e){
    this.setState({isChecked: (this.state.isChecked)? false: true})
    this.props.handler(e,(this.state.isChecked)? false: true);
    // as there is some delay in setstate
    console.log(this.props.id);


  }

  render(){
    return(
      <div className = "box">
          <input name = {this.props.name} type ="checkbox" id = {this.props.id} onChange = {this.onChange}
          checked = {this.state.isChecked} value = {this.state.isChecked}/>
          <label for = {this.props.id} >{this.props.label}</label>

      </div>
    )
  }
}
export default CheckBox;
