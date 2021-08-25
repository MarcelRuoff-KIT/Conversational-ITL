import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { param } from 'jquery';

import {
  formatDate
} from '@angular/common';
import { element } from 'protractor';

@Injectable()
export class SimpleService {

  public x = 0;
  public y = 0;
  public scale = 0;
  public date;
  public tab;
  public fieldToColor = { "Visualizations": "#1F8FFF", "Legend": "#FF7738", "DataFields": "#00FFE6", "Filter": "#877AFF" };
  public stateList;
  public metricList;
  public actionSequence;



  constructor(private http: HttpClient) {

  }

  analyzeEntities(that, entities) {
    this.actionSequence = [];
    

    this.stateList = []
    for (var sI in entities["State"]) {
      var state = entities["State"][sI]
      var index = parseInt(state.charAt(0))
      if (this.stateList.length < index) {
        this.stateList[index - 1] = [state.substring(1)]
      }
      else {
        this.stateList[index - 1].push(state.substring(1))
      }
    }

    this.metricList = []
    for (var mI in entities["DataFields"]) {
      var metric = entities["DataFields"][mI]
      var index = parseInt(metric.charAt(0))
      if (this.metricList.length <= index) {
        this.metricList[index] = [metric.substring(1)]
      }
      else {
        this.metricList[index].push(metric.substring(1))
      }
    }

    if(entities["Legend"].length > 0){
      this.analyzeLegend(that, entities["Legend"])
    }

    if(entities["Aggregate"].length > 0){
      this.analyzeAggregate(that, entities["Aggregate"])
    }

    if(entities["Cumulative"].length > 0){
      this.analyzeCumulative(that, entities["Cumulative"])
    }

    if(entities["Visualizations"].length > 0){
      this.analyzeVisualizations(that, entities["Visualizations"])
    }

    if(this.stateList.length > 0){
      this.analyzeStateList(that, this.stateList)
    }

    if(this.metricList.length > 0){
      this.analyzeMetricList(that, this.metricList)
    }

    if(entities["Filter"].length > 0){
      this.analyzeFilter(that, entities["Filter"])
    }

    console.log(this.actionSequence)

    var response = "For example, you could use commands, such as: "
    for(var aIndex in this.actionSequence){
      response = response + "\r\n * " + this.actionSequence[aIndex]
    }

    that.communicateToBot(response)

  }


  analyzeLegend(that, legends){
    console.log(legends)
    for(var index in legends){
      if(that.unitedStatesMap.legend_Values == legends[index]){
        this.actionSequence.push("Remove " + legends[index])
      }
      else{
        this.actionSequence.push("Add " + legends[index])
      }
    }
  }

  analyzeAggregate(that, aggregate){
    console.log(aggregate)
    for(var index in aggregate){
      if(that.unitedStatesMap.aggregate != aggregate[index]){
        var text = ""
        if (aggregate[index] == "D") {
          text = "day"
        }
        else if (aggregate[index] == "M") {
          text = "month"
        }
        else if (aggregate[index] == "Y") {
          text = "year"
        }
        this.actionSequence.push("Aggregate data by " + text)
      }
    }
  }

  analyzeCumulative(that, cumulative){
    console.log(cumulative)
  }

  analyzeVisualizations(that, visualization){
    for(var index in visualization){
      if(that.unitedStatesMap.chartType != visualization[index]){
        this.actionSequence.push("Change to " + visualization[index])
      }
    }
  }

  analyzeStateList(that, stateList){
    console.log(stateList)
    for(var index in stateList){
      var textRec = ""
      for (var textIndex in stateList[index]) {

        if (parseInt(textIndex) == stateList[index].length - 1 && stateList[index].length != 1) {
          textRec += " and "
        }
        else if (parseInt(textIndex) > 0) {
          textRec += ", "
        }
        textRec += stateList[index][textIndex];
      }

      if(!stateList[index].every(state => that.unitedStatesMap.statesSelect.includes(state))){
        this.actionSequence.push("Add " + textRec)
      }
      else if (stateList[index].every(state => that.unitedStatesMap.statesSelect.includes(state)) ){
        this.actionSequence.push("Remove " + textRec)
      }
    }
  }

  analyzeMetricList(that, metricList){
    console.log(metricList)
    for(var index in metricList){
      var textRec = ""
      for (var textIndex in metricList[index]) {

        if (parseInt(textIndex) == metricList[index].length - 1 && metricList[index].length != 1) {
          textRec += " and "
        }
        else if (parseInt(textIndex) > 0) {
          textRec += ", "
        }
        textRec += metricList[index][textIndex];
      }

      if(!metricList[index].every(state => that.unitedStatesMap.y_Axis_Values.includes(state))){
        this.actionSequence.push("Add " + textRec)
      }
      else if (metricList[index].every(state => that.unitedStatesMap.y_Axis_Values.includes(state)) ){
        this.actionSequence.push("Remove " + textRec)
      }
    }
  }

  analyzeFilter(that, filter){
    console.log(filter)
    for(var fIndex in filter[0]){
      if(filter[0][fIndex][0] != 'none' && filter[0][fIndex][1] != 'none' && filter[0][fIndex] != that.filterValue[fIndex]){
        this.actionSequence.push("Select  " + fIndex + " between " + filter[0][fIndex][0] + " and " + filter[0][fIndex][1])
      }
      else if(filter[0][fIndex][0] != 'none' && filter[0][fIndex][0] != that.filterValue[fIndex][0] && filter[0][fIndex][0] != that.filterValue[fIndex][1]){
        this.actionSequence.push("Select with more than "+ filter[0][fIndex][0] + " " + fIndex)
      }
      else if(filter[0][fIndex][1] != 'none' && filter[0][fIndex][1] != that.filterValue[fIndex][0] && filter[0][fIndex][1] != that.filterValue[fIndex][1]){
        this.actionSequence.push("Select with less than "+ filter[0][fIndex][1] + " " + fIndex)
      }
    }
  }


  checkUnused(that, unusedEntities){
    console.log(unusedEntities)

    var text = "You have not used the following parts of your command in your sequence of actions:"

    var allUsed = true
    for(var uIndex in unusedEntities){
      if(unusedEntities[uIndex].length > 0 && uIndex != "Metric" && uIndex != "Filter"  && uIndex != "State" && uIndex != "Aggregate" && uIndex != "Date"){
        allUsed = false
        for (var dIndex in unusedEntities[uIndex]){
          text = text + "\r\n * " + unusedEntities[uIndex][dIndex]
        }
      }
      else if(unusedEntities[uIndex].length > 0 && uIndex == "Aggregate"){
        for (var dIndex in unusedEntities[uIndex]){
          var agg = ""
          if (unusedEntities[uIndex][dIndex] == "D") {
            agg = "day"
          }
          else if (unusedEntities[uIndex][dIndex] == "M") {
            agg = "month"
          }
          else if (unusedEntities[uIndex][dIndex] == "Y") {
            agg = "year"
          }
          text = text + "\r\n * " + agg
        }
      }
      else if(uIndex == "Metric" || uIndex == "State"){
        for (var mIndex in unusedEntities[uIndex]){
          if(unusedEntities[uIndex][mIndex].length > 0){
            allUsed = false
            for (var dIndex in unusedEntities[uIndex][mIndex]){
              text = text + "\r\n * " + unusedEntities[uIndex][mIndex][dIndex]
            }
          }
        }
      }
      else if (uIndex == "Filter"){
        for(var fIndex in unusedEntities[uIndex][0]){
          allUsed = false
          text = text + "\r\n * " + fIndex + " Filter"
        }
        
      }
    }

    if(!allUsed){
      that.communicateToBot(text)
    }

    return allUsed;
  }


}
