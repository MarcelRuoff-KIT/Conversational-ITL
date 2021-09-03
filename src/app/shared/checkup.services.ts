import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { param } from 'jquery';

import {
  formatDate
} from '@angular/common';

@Injectable()
export class CheckUpService {

  public x = 0;
  public y = 0;
  public scale = 0;
  public date;
  public tab;
  public fieldToColor = { "Visualizations": "#1F8FFF", "Legend": "#FF7738", "DataFields": "#00FFE6", "Filter": "#877AFF" };



  constructor(private http: HttpClient) {

  }


  public processInitialState(that, intialState, unusedEntities, initialStateSequence) {
    var instances = []
    var newAction = {
      'Add': {
        'Visualizations': unusedEntities,
        'DataFields': unusedEntities,
        'Legend': unusedEntities,
        'Filter': unusedEntities,
        'State': unusedEntities,
        'Date': unusedEntities,
        'Aggregate': unusedEntities,
        'Cumulative': unusedEntities,
        'StatesSelect': unusedEntities
      },
      'Remove': {
        'Visualizations': unusedEntities,
        'DataFields': unusedEntities,
        'Legend': unusedEntities,
        'Filter': unusedEntities,
        'State': unusedEntities,
        'Date': unusedEntities,
        'Aggregate': unusedEntities,
        'Cumulative': unusedEntities,
        'StatesSelect': unusedEntities
      }
    }


    for (var uIndex in unusedEntities) {

      /**
      * Visualizations
      */
      if (uIndex == "Visualizations" && unusedEntities[uIndex].includes(that.initialState["Visualization"])) {

        newAction = {
          'Add': {
            'Visualizations': that.initialState["Visualization"],
            'DataFields': 'none',
            'Legend': 'none',
            'Filter': 'none',
            'State': 'none',
            'Date': 'none',
            'Aggregate': 'none',
            'Cumulative': 'none',
            'StatesSelect': 'none'
          },
          'Remove': {
            'Visualizations': 'none',
            'DataFields': 'none',
            'Legend': 'none',
            'Filter': 'none',
            'State': 'none',
            'Date': 'none',
            'Aggregate': 'none',
            'Cumulative': 'none',
            'StatesSelect': 'none'
          }
        }

        instances.push({
          'text': "Change <span style='color:" + this.fieldToColor['Visualizations'] + "'> Visualization</span> to <b>" + that.initialState["Visualization"] + "</b>.",
          'id': initialStateSequence.length
        });
        initialStateSequence.push(newAction)
      }

      /**
       * Legend
       */

      if (uIndex == "Legend" && unusedEntities[uIndex].includes(that.initialState["Legend"])) {

        newAction = {
          'Add': {
            'Visualizations': 'none',
            'DataFields': 'none',
            'Legend': that.initialState["Legend"],
            'Filter': 'none',
            'State': 'none',
            'Date': 'none',
            'Aggregate': 'none',
            'Cumulative': 'none',
            'StatesSelect': 'none'
          },
          'Remove': {
            'Visualizations': 'none',
            'DataFields': 'none',
            'Legend': 'none',
            'Filter': 'none',
            'State': 'none',
            'Date': 'none',
            'Aggregate': 'none',
            'Cumulative': 'none',
            'StatesSelect': 'none'
          }
        }

        instances.push({
          'text': 'Add <b>' + that.initialState["Legend"] + "</b> to <span class='trainLegend' style='color:" + this.fieldToColor['Legend'] + "'>" + that.legendLabel + "</span>.",
          'id': initialStateSequence.length
        });
        initialStateSequence.push(newAction)
      }

      /**
       * Metric
       */

      if (uIndex == "Metric") {

        var matchedMetrics = []
        var metricPhrase = "";

        for (var mIndex in unusedEntities[uIndex]) {
          matchedMetrics = matchedMetrics.concat(unusedEntities[uIndex][mIndex].filter(element => that.initialState["Metric"].includes(element)))
        }

        matchedMetrics = [...new Set(matchedMetrics)];

        if (matchedMetrics.length > 0) {
          newAction = {
            'Add': {
              'Visualizations': 'none',
              'DataFields': matchedMetrics,
              'Legend': 'none',
              'Filter': 'none',
              'State': 'none',
              'Date': 'none',
              'Aggregate': 'none',
              'Cumulative': 'none',
              'StatesSelect': 'none'
            },
            'Remove': {
              'Visualizations': 'none',
              'DataFields': 'none',
              'Legend': 'none',
              'Filter': 'none',
              'State': 'none',
              'Date': 'none',
              'Aggregate': 'none',
              'Cumulative': 'none',
              'StatesSelect': 'none'
            }
          }
          //metricPhrase = '<select class="metricSwitch"><option value="Add" selected>Add</option><option value="Remove all except">Remove all except</option></select> '
          metricPhrase = "Add "

          for (var i = 0; i < matchedMetrics.length; i++) {

            if (i == 0) { }
            else if (i == matchedMetrics.length - 1) {
              metricPhrase += " and "
            }
            else {
              metricPhrase += ", "
            }
            metricPhrase += matchedMetrics[i];
          }

          metricPhrase += "</b> to <span class='trainMetric' style='color:" + this.fieldToColor['DataFields'] + "'>" + that.metricLabel + "</span>."

          instances.push({
            'text': metricPhrase,
            'id': initialStateSequence.length
          });
          initialStateSequence.push(newAction)

        }



      }

      /**
       * State
       */

      if (uIndex == "State") {

        var matchedStates = []
        var statePhrase = "";

        for (var mIndex in unusedEntities[uIndex]) {
          matchedStates = matchedStates.concat(unusedEntities[uIndex][mIndex].filter(element => that.initialState["States"].includes(element)))
        }

        matchedStates = [...new Set(matchedStates)];

        if (matchedStates.length > 0) {
          newAction = {
            'Add': {
              'Visualizations': 'none',
              'DataFields': 'none',
              'Legend': 'none',
              'Filter': 'none',
              'State': matchedStates,
              'Date': 'none',
              'Aggregate': 'none',
              'Cumulative': 'none',
              'StatesSelect': 'none'
            },
            'Remove': {
              'Visualizations': 'none',
              'DataFields': 'none',
              'Legend': 'none',
              'Filter': 'none',
              'State': 'none',
              'Date': 'none',
              'Aggregate': 'none',
              'Cumulative': 'none',
              'StatesSelect': 'none'
            }
          }
          //metricPhrase = '<select class="metricSwitch"><option value="Add" selected>Add</option><option value="Remove all except">Remove all except</option></select> '
          statePhrase = "Add "

          for (var i = 0; i < matchedStates.length; i++) {

            if (i == 0) { }
            else if (i == matchedStates.length - 1) {
              statePhrase += " and "
            }
            else {
              statePhrase += ", "
            }
            statePhrase += matchedStates[i];
          }

          statePhrase += " to States."

          instances.push({
            'text': statePhrase,
            'id': initialStateSequence.length
          });
          initialStateSequence.push(newAction)

        }



      }


      /**
       * Date
       */

      if (uIndex == "Date") {

        var matchedDates = []
        var datePhrase = "";

        matchedDates = unusedEntities[uIndex].filter(element => that.initialState["Dates"].includes(element))


        matchedDates = [...new Set(matchedDates)];

        if (matchedDates.length > 0) {
          newAction = {
            'Add': {
              'Visualizations': 'none',
              'DataFields': 'none',
              'Legend': 'none',
              'Filter': 'none',
              'State': 'none',
              'Date': matchedDates,
              'Aggregate': 'none',
              'Cumulative': 'none',
              'StatesSelect': 'none'
            },
            'Remove': {
              'Visualizations': 'none',
              'DataFields': 'none',
              'Legend': 'none',
              'Filter': 'none',
              'State': 'none',
              'Date': 'none',
              'Aggregate': 'none',
              'Cumulative': 'none',
              'StatesSelect': 'none'
            }
          }
          //metricPhrase = '<select class="metricSwitch"><option value="Add" selected>Add</option><option value="Remove all except">Remove all except</option></select> '
          datePhrase = "Add "

          for (var i = 0; i < matchedDates.length; i++) {

            if (i == 0) { }
            else if (i == matchedDates.length - 1) {
              datePhrase += " and "
            }
            else {
              datePhrase += ", "
            }
            datePhrase += matchedDates[i];
          }

          datePhrase += " to Dates."

          instances.push({
            'text': datePhrase,
            'id': initialStateSequence.length
          });
          initialStateSequence.push(newAction)

        }

      }

      /**
       * Aggregate
       */

      if (uIndex == "Aggregate" && unusedEntities[uIndex].includes(that.initialState["Aggregate"])) {

        newAction = {
          'Add': {
            'Visualizations': 'none',
            'DataFields': 'none',
            'Legend': 'none',
            'Filter': 'none',
            'State': 'none',
            'Date': 'none',
            'Aggregate': that.initialState["Aggregate"],
            'Cumulative': 'none',
            'StatesSelect': 'none'
          },
          'Remove': {
            'Visualizations': 'none',
            'DataFields': 'none',
            'Legend': 'none',
            'Filter': 'none',
            'State': 'none',
            'Date': 'none',
            'Aggregate': 'none',
            'Cumulative': 'none',
            'StatesSelect': 'none'
          }
        }

        var text = that.initialState["Aggregate"]

        if (that.initialState["Aggregate"] == "D") {
          text = "day"
        }
        else if (that.initialState["Aggregate"] == "M") {
          text = "month"
        }
        else if (that.initialState["Aggregate"] == "Y") {
          text = "year"
        }

        instances.push({
          'text': 'Aggregate the data by <b>' + text + "</b>.",
          'id': initialStateSequence.length
        });
        initialStateSequence.push(newAction)
      }

      /**
       * Cumulative
       */

      if (uIndex == "Cumulative" && unusedEntities[uIndex].includes(that.initialState["Cumulative"])) {

        newAction = {
          'Add': {
            'Visualizations': 'none',
            'DataFields': 'none',
            'Legend': 'none',
            'Filter': 'none',
            'State': 'none',
            'Date': 'none',
            'Aggregate': 'none',
            'Cumulative': that.initialState["Cumulative"],
            'StatesSelect': 'none'
          },
          'Remove': {
            'Visualizations': 'none',
            'DataFields': 'none',
            'Legend': 'none',
            'Filter': 'none',
            'State': 'none',
            'Date': 'none',
            'Aggregate': 'none',
            'Cumulative': 'none',
            'StatesSelect': 'none'
          }
        }

        instances.push({
          'text': 'Show the <b>' + that.initialState["Cumulative"] + "</b> data.",
          'id': initialStateSequence.length
        });

        initialStateSequence.push(newAction)
      }

      /**
       * Filter
       */

      if (uIndex == "Filter") {

        var lower = 'none'
        var upper = 'none'

        for (var key in Object.keys(unusedEntities[uIndex][0])) {
          if (that.initialState["Filters"][key][0] == unusedEntities[uIndex][0][key][0] || that.initialState["Filters"][key][0] == unusedEntities[uIndex][0][key][1]) {
            lower = that.initialState["Filters"][key][0]
          }
          if (that.maxSlider[key] != that.initialState["Filters"][key][1] && (that.initialState["Filters"][key][1] == unusedEntities[uIndex][0][key][0] || that.initialState["Filters"][key][1] == unusedEntities[uIndex][0][key][1])) {
            upper = that.initialState["Filters"][key][1]
          }

          if (upper != 'none' || lower != 'none') {
            var filter = { [key]: [String(that.initialState["Filters"][key][0]), String(that.initialState["Filters"][key][1])] }
            newAction = {
              'Add': {
                'Visualizations': 'none',
                'DataFields': 'none',
                'Legend': 'none',
                'Filter': 'none',
                'State': 'none',
                'Date': 'none',
                'Aggregate': 'none',
                'Cumulative': 'none',
                'StatesSelect': 'none'
              },
              'Remove': {
                'Visualizations': 'none',
                'DataFields': 'none',
                'Legend': 'none',
                'Filter': [filter],
                'State': 'none',
                'Date': 'none',
                'Aggregate': 'none',
                'Cumulative': 'none',
                'StatesSelect': 'none'
              }
            }

            var filterPhrase = "";



            if (that.initialState["Filters"][key][0] != "none" && that.initialState["Filters"][key][0] != that.minSlider[key] && that.initialState["Filters"][key][1] != "none" && that.initialState["Filters"][key][1] != "max" && that.initialState["Filters"][key][1] != that.maxSlider[key]) {
              filterPhrase = 'Remove all ' + that.unitedStatesMap.legend_Values + '(s) with ' + key
              filterPhrase += " less than " + that.initialState["Filters"][key][0] + " and more than " + that.initialState["Filters"][key][1]
            }
            else if (that.initialState["Filters"][key][0] != "none" && that.initialState["Filters"][key][0] != that.minSlider[key]) {
              filterPhrase = '<select class="filterSwitch"><option value="Add">Add</option><option value="Remove" selected>Remove</option></select> all ' + that.unitedStatesMap.legend_Values + '(s) with ' + key
              filterPhrase += " less than " + that.initialState["Filters"][key][0]
              that.initialState["Filters"] = { [key]: [that.initialState["Filters"][key][0], "max"] }
            }
            else if (that.initialState["Filters"][key][1] != "none" && that.initialState["Filters"][key][1] != that.maxSlider[key]) {
              filterPhrase = '<select class="filterSwitch"><option value="Add">Add</option><option value="Remove" selected>Remove</option></select> all ' + that.unitedStatesMap.legend_Values + '(s) with ' + key
              filterPhrase += " more than " + that.initialState["Filters"][key][1]
            }

            instances.push({
              'text': "Change <span style='color:" + this.fieldToColor['Visualizations'] + "'> Visualization</span> to <b>" + that.initialState["Visualization"] + "</b>.",
              'id': initialStateSequence.length
            });
            initialStateSequence.push(newAction)
          }
        }

      }


    }



    return [instances, initialStateSequence, unusedEntities]

  }

}
