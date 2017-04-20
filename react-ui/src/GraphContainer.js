
import React, { Component } from 'react';
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";
import { TimeSeries } from "pondjs";
import {ScatterChart, ChartContainer,ChartRow, Charts,YAxis , LineChart,Baseline ,Legend,Resizable ,styler,EventMarker}from "react-timeseries-charts";
import './css/GraphContainer.css';
//import  from "../../../js/styler";



const style = styler([
    { key: "actual_price", color: "steelblue", width: 1, dashed: true },
    { key: "predicted_price", color: "#F68B24", width: 1 }
]);

class GraphContainer extends Component{
    constructor(props) {
        super(props);
        this.handleTimeRangeChange = this.handleTimeRangeChange.bind(this);
        this.handleTrackerChanged = this.handleTrackerChanged.bind(this);




        this.state = {
            showMetrics: true,
            showDot: false,
            height: 300,
            tracker: null,
            actual_price: "--",
            predicted_price: "--",
            trackerEvent: null,
            timerange:  this.props.timeseries.range(),
            timeseries: this.props.timeseries,
            metric: this.props.metrics,
            params: this.props.params
        };
    }



    handleTrackerChanged(t) {
      if(t){
        const e = this.state.timeseries.atTime(t);
        const eventTime = new Date(
        e.begin().getTime() + (e.end().getTime() - e.begin().getTime()) / 2);
           //trim to 2nd position in decimal
        this.setState({ tracker: eventTime, trackerEvent: e
          , actual_price: e.get("actual_price").toFixed(2)
          , predicted_price: e.get("predicted_price").toFixed(2)
        });
      }else{
        this.setState({ tracker: null, trackerEvent: null, actual_price: '--', predicted_price: '--'});
      }
    }

    handleTimeRangeChange(timerange) {
        this.setState({ timerange });
    }

    renderMarker() {
      if (!this.state.tracker) {
        return <g />
      }

        return (
          <EventMarker
              type="flag"
              axis="y"
              event ={this.state.trackerEvent}
              column="actual_price"
              info={[
                { label: "Price", value: this.state.predicted_price }
              ]}
              infoTimeFormat="%Y %m %d"
              infoWidth={120}
              markerRadius={2}
              markerStyle={{ fill: "black" }}
          />
        );

    }

    onChange(){
      var updateState = {};
      updateState['showDot'] = (this.state.showDot)? false: true;
      this.setState(updateState,function(){
        console.log(this.state.showDot);
      })
    }

    render(){

        //https://github.com/d3/d3-time-format/blob/master/README.md#timeFormat
        const f = format("$,.2f");
        const df = timeFormat("%m %d %Y %X");
        const range = this.state.timerange;


        const timeStyle = {
            fontSize: "1.2rem",
            color: "#999"
        };

        let euroValue, audValue;
        if (this.state.tracker) {
            const index = this.state.timeseries.bisect(this.state.tracker);
            const trackerEvent = this.state.timeseries.at(index);
            audValue = `${f(trackerEvent.get("actual_price"))}`;
            euroValue = `${f(trackerEvent.get("predicted_price"))}`;
        }

        return (
            <div>
                <p>{this.props.timeseries.name()}</p>
                <div className = "graph-upper-panel">
                    <div  style={{ height: 14 }}>
                        <div >
                             {`${df(this.state.tracker)}` }
                        </div>

                    </div>
                    <div id = "price-tag-section">
                        <div className = "price-tag" >
                            <p>Actual</p>
                            <p>{this.state.actual_price}</p>
                        </div>
                        <div className = "price-tag" >
                              <p>Prediction</p>
                              <p>{this.state.predicted_price}</p>
                        </div>
                        <div className = "clear-both"/>
                    </div>

                    <div className="row">
                    <div className="col-md-12">
                        <Resizable>
                            <ChartContainer
                                timeRange={range}
                                maxTime={this.state.timeseries.range().end()}
                                minTime={this.state.timeseries.range().begin()}
                                trackerPosition={this.state.tracker}
                                onTrackerChanged={this.handleTrackerChanged}
                                onBackgroundClick={() =>this.setState({ selection: null })}
                                enablePanZoom={true}
                                onTimeRangeChanged={this.handleTimeRangeChange}
                                minDuration={1000 * 60 * 60 * 24 *8}
                            >
                                <ChartRow height={this.state.height}>
                                    <YAxis
                                        id="y"
                                        min={500}
                                        max={1500}
                                        width="60"
                                        type="linear"
                                        format="$,.2f"
                                    />
                                    <Charts>

                                        <LineChart
                                            axis="y"
                                            breakLine={false}
                                            series={this.state.timeseries}
                                            columns={["actual_price", "predicted_price"]}
                                            style={style}
                                            highlight={this.state.highlight}
                                            onHighlightChange={highlight => this.setState({ highlight })}
                                            selection={this.state.selection}
                                            onSelectionChange={selection => this.setState({ selection })}
                                        />

                                    {this.renderMarker()}
                                    </Charts>
                                </ChartRow>
                            </ChartContainer>
                        </Resizable>
                    </div>
                </div>
                <div className = 'graph-lower-panel'>
                   <button onClick = {function(){this.setState({showMetrics:true })}.bind(this)}>Metrics</button>
                   <button onClick = {function(){this.setState({showMetrics:false})}.bind(this)}>Options</button>
                   <div className = 'clear-both'></div>
                   </div>
                   <div>{
                   (this.state.showMetrics)?
                     <div className = "metric-container border-section">{
                         this.props.metrics.map(function(obj){
                           return (
                             <p> {obj.id +": "+ obj.value}  </p>
                           );
                         })
                       }
                     </div>
                     :
                     <div className = ' params-container border-section'>
                      <table>

                        <tr>
                          <td>Model </td>
                          <td>Features </td>
                          <td>Training </td>
                          <td>Testing </td>
                        </tr>
                        <tr>
                          <td>
                            <div> {this.state.params.model_to_use} </div>
                          </td>
                          <td>
                            <div className = 'params-container-features'>{
                              this.state.params.features_to_use.map(function(obj,index){
                              return(<div>{obj}</div>)
                              })}
                            </div>
                          </td>
                          <td>{ this.state.params.start_train+" - "+this.state.params.end_train}</td>
                          <td>{ this.state.params.start_test+" - "+this.state.params.end_test}</td>
                        </tr>
                      </table>
                     </div>
                   }</div>

                </div>

            </div>
        );
    }
}
// <ScatterChart
//   axis="y"
//   series={currencySeries}
//   columns={["actual_price", "predicted_price"]}
//   style={style}
// />
export default GraphContainer;
