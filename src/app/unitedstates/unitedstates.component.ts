import { Component, OnInit, OnDestroy, ElementRef, AfterViewInit, AfterContentInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ViewChild } from '@angular/core';
import { UnitedStatesMapComponent } from '../unitedstates-map/unitedstates-map.component';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MetricSummaryComponent } from '../metric-summary/metric-summary.component';
import { DrillDownService } from "../shared/drilldown.services";
import { FunctionService } from "../shared/function.services";
import { SimpleService } from "../shared/simple.services";
import { CheckUpService } from '../shared/checkup.services';

import {
  formatDate
} from '@angular/common';

/**
 * Declares the WebChat property on the window object.
 */
declare global {
  interface Window {
    WebChat: any;
  }
}



window.WebChat = window.WebChat || {};

@Component({
  selector: 'app-unitedstates',
  templateUrl: './unitedstates.component.html',
  styleUrls: ['./unitedstates.component.scss']
})
export class UnitedStatesComponent implements OnInit, OnDestroy, AfterViewInit, AfterContentInit {

  @ViewChild('unitedStatesMap', { static: true }) unitedStatesMap: UnitedStatesMapComponent;
  @ViewChild('metricSummary', { static: true }) metricSummary: MetricSummaryComponent;
  @ViewChild("botWindow", { static: true }) botWindowElement: ElementRef;

  private _routerSub = Subscription.EMPTY;
  refreshInterval;

  //Experimental Data
  public userID;
  public currentTime;
  public treatment;
  public task;

  //Conversational Agent
  public directLine;
  public store;
  public componentMessage = null;
  public messengerID = null;
  public animate = false;

  //Relevant for Training Mode
  public initialState;
  public initialUnusedEntities;
  public unusedEntities;
  public trainableEntites: any;
  public stateList;
  public metricList;
  public actionSequence = [];
  public recommendationList = [];
  public initialStateSequence = [];
  public trainingMode = false;// false
  public addToSequence = false; //false
  public resetProzess = false;
  public shortcut = true;
  public initialUtterance = "";

  /* slider */
  public disabled = false;
  public range = { start: null, end: null };
  public tickPlacement: string = 'none';
  public min: number;
  public max: number;
  public smallStep: number = 86400000;
  public dateMin = "2020-01-21";
  public dateMax = "2021-06-30";
  public currentDateMin = "2020-01-21";
  public currentDateMax = "2021-06-30";

  /* States Select Menu*/
  public scaleButtons = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Puerto Rico", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];
  public statesSelect = [];


  public possibleDatesDay = ["2020-01-01", "2020-01-02", "2020-01-03", "2020-01-04", "2020-01-05", "2020-01-06", "2020-01-07", "2020-01-08", "2020-01-09", "2020-01-10", "2020-01-11", "2020-01-12", "2020-01-13", "2020-01-14", "2020-01-15", "2020-01-16", "2020-01-17", "2020-01-18", "2020-01-19", "2020-01-20", "2020-01-21", "2020-01-22", "2020-01-23", "2020-01-24", "2020-01-25", "2020-01-26", "2020-01-27", "2020-01-28", "2020-01-29", "2020-01-30", "2020-01-31", "2020-02-01", "2020-02-02", "2020-02-03", "2020-02-04", "2020-02-05", "2020-02-06", "2020-02-07", "2020-02-08", "2020-02-09", "2020-02-10", "2020-02-11", "2020-02-12", "2020-02-13", "2020-02-14", "2020-02-15", "2020-02-16", "2020-02-17", "2020-02-18", "2020-02-19", "2020-02-20", "2020-02-21", "2020-02-22", "2020-02-23", "2020-02-24", "2020-02-25", "2020-02-26", "2020-02-27", "2020-02-28", "2020-02-29", "2020-03-01", "2020-03-02", "2020-03-03", "2020-03-04", "2020-03-05", "2020-03-06", "2020-03-07", "2020-03-08", "2020-03-09", "2020-03-10", "2020-03-11", "2020-03-12", "2020-03-13", "2020-03-14", "2020-03-15", "2020-03-16", "2020-03-17", "2020-03-18", "2020-03-19", "2020-03-20", "2020-03-21", "2020-03-22", "2020-03-23", "2020-03-24", "2020-03-25", "2020-03-26", "2020-03-27", "2020-03-28", "2020-03-29", "2020-03-29", "2020-03-30", "2020-03-31", "2020-04-01", "2020-04-02", "2020-04-03", "2020-04-04", "2020-04-05", "2020-04-06", "2020-04-07", "2020-04-08", "2020-04-09", "2020-04-10", "2020-04-11", "2020-04-12", "2020-04-13", "2020-04-14", "2020-04-15", "2020-04-16", "2020-04-17", "2020-04-18", "2020-04-19", "2020-04-20", "2020-04-21", "2020-04-22", "2020-04-23", "2020-04-24", "2020-04-25", "2020-04-26", "2020-04-27", "2020-04-28", "2020-04-29", "2020-04-30", "2020-05-01", "2020-05-02", "2020-05-03", "2020-05-04", "2020-05-05", "2020-05-06", "2020-05-07", "2020-05-08", "2020-05-09", "2020-05-10", "2020-05-11", "2020-05-12", "2020-05-13", "2020-05-14", "2020-05-15", "2020-05-16", "2020-05-17", "2020-05-18", "2020-05-19", "2020-05-20", "2020-05-21", "2020-05-22", "2020-05-23", "2020-05-24", "2020-05-25", "2020-05-26", "2020-05-27", "2020-05-28", "2020-05-29", "2020-05-30", "2020-05-31", "2020-06-01", "2020-06-02", "2020-06-03", "2020-06-04", "2020-06-05", "2020-06-06", "2020-06-07", "2020-06-08", "2020-06-09", "2020-06-10", "2020-06-11", "2020-06-12", "2020-06-13", "2020-06-14", "2020-06-15", "2020-06-16", "2020-06-17", "2020-06-18", "2020-06-19", "2020-06-20", "2020-06-21", "2020-06-22", "2020-06-23", "2020-06-24", "2020-06-25", "2020-06-26", "2020-06-27", "2020-06-28", "2020-06-29", "2020-06-30", "2020-07-01", "2020-07-02", "2020-07-03", "2020-07-04", "2020-07-05", "2020-07-06", "2020-07-07", "2020-07-08", "2020-07-09", "2020-07-10", "2020-07-11", "2020-07-12", "2020-07-13", "2020-07-14", "2020-07-15", "2020-07-16", "2020-07-17", "2020-07-18", "2020-07-19", "2020-07-20", "2020-07-21", "2020-07-22", "2020-07-23", "2020-07-24", "2020-07-25", "2020-07-26", "2020-07-27", "2020-07-28", "2020-07-29", "2020-07-30", "2020-07-31", "2020-08-01", "2020-08-02", "2020-08-03", "2020-08-04", "2020-08-05", "2020-08-06", "2020-08-07", "2020-08-08", "2020-08-09", "2020-08-10", "2020-08-11", "2020-08-12", "2020-08-13", "2020-08-14", "2020-08-15", "2020-08-16", "2020-08-17", "2020-08-18", "2020-08-19", "2020-08-20", "2020-08-21", "2020-08-22", "2020-08-23", "2020-08-24", "2020-08-25", "2020-08-26", "2020-08-27", "2020-08-28", "2020-08-29", "2020-08-30", "2020-08-31", "2020-09-01", "2020-09-02", "2020-09-03", "2020-09-04", "2020-09-05", "2020-09-06", "2020-09-07", "2020-09-08", "2020-09-09", "2020-09-10", "2020-09-11", "2020-09-12", "2020-09-13", "2020-09-14", "2020-09-15", "2020-09-16", "2020-09-17", "2020-09-18", "2020-09-19", "2020-09-20", "2020-09-21", "2020-09-22", "2020-09-23", "2020-09-24", "2020-09-25", "2020-09-26", "2020-09-27", "2020-09-28", "2020-09-29", "2020-09-30", "2020-10-01", "2020-10-02", "2020-10-03", "2020-10-04", "2020-10-05", "2020-10-06", "2020-10-07", "2020-10-08", "2020-10-09", "2020-10-10", "2020-10-11", "2020-10-12", "2020-10-13", "2020-10-14", "2020-10-15", "2020-10-16", "2020-10-17", "2020-10-18", "2020-10-19", "2020-10-20", "2020-10-21", "2020-10-22", "2020-10-23", "2020-10-24", "2020-10-26", "2020-10-27", "2020-10-28", "2020-10-29", "2020-10-30", "2020-10-31", "2020-11-01", "2020-11-02", "2020-11-03", "2020-11-04", "2020-11-05", "2020-11-06", "2020-11-07", "2020-11-08", "2020-11-09", "2020-11-10", "2020-11-11", "2020-11-12", "2020-11-13", "2020-11-14", "2020-11-15", "2020-11-16", "2020-11-17", "2020-11-18", "2020-11-19", "2020-11-20", "2020-11-21", "2020-11-22", "2020-11-23", "2020-11-24", "2020-11-25", "2020-11-26", "2020-11-27", "2020-11-28", "2020-11-29", "2020-11-30", "2020-12-01", "2020-12-02", "2020-12-03", "2020-12-04", "2020-12-05", "2020-12-06", "2020-12-07", "2020-12-08", "2020-12-09", "2020-12-10", "2020-12-11", "2020-12-12", "2020-12-13", "2020-12-14", "2020-12-15", "2020-12-16", "2020-12-17", "2020-12-18", "2020-12-19", "2020-12-20", "2020-12-21", "2020-12-22", "2020-12-23", "2020-12-24", "2020-12-25", "2020-12-26", "2020-12-27", "2020-12-28", "2020-12-29", "2020-12-30", "2020-12-31", "2021-01-01", "2021-01-02", "2021-01-03", "2021-01-04", "2021-01-05", "2021-01-06", "2021-01-07", "2021-01-08", "2021-01-09", "2021-01-10", "2021-01-11", "2021-01-12", "2021-01-13", "2021-01-14", "2021-01-15", "2021-01-16", "2021-01-17", "2021-01-18", "2021-01-19", "2021-01-20", "2021-01-21", "2021-01-22", "2021-01-23", "2021-01-24", "2021-01-25", "2021-01-26", "2021-01-27", "2021-01-28", "2021-01-29", "2021-01-30", "2021-01-31", "2021-02-01", "2021-02-02", "2021-02-03", "2021-02-04", "2021-02-05", "2021-02-06", "2021-02-07", "2021-02-08", "2021-02-09", "2021-02-10", "2021-02-11", "2021-02-12", "2021-02-13", "2021-02-14", "2021-02-15", "2021-02-16", "2021-02-17", "2021-02-18", "2021-02-19", "2021-02-20", "2021-02-21", "2021-02-22", "2021-02-23", "2021-02-24", "2021-02-25", "2021-02-26", "2021-02-27", "2021-02-28", "2021-03-01", "2021-03-02", "2021-03-03", "2021-03-04", "2021-03-05", "2021-03-06", "2021-03-07", "2021-03-08", "2021-03-09", "2021-03-10", "2021-03-11", "2021-03-12", "2021-03-13", "2021-03-14", "2021-03-15", "2021-03-16", "2021-03-17", "2021-03-18", "2021-03-19", "2021-03-20", "2021-03-21", "2021-03-22", "2021-03-23", "2021-03-24", "2021-03-25", "2021-03-26", "2021-03-27", "2021-03-28", "2021-03-28", "2021-03-29", "2021-03-30", "2021-03-31", "2021-04-01", "2021-04-02", "2021-04-03", "2021-04-04", "2021-04-05", "2021-04-06", "2021-04-07", "2021-04-08", "2021-04-09", "2021-04-10", "2021-04-11", "2021-04-12", "2021-04-13", "2021-04-14", "2021-04-15", "2021-04-16", "2021-04-17", "2021-04-18", "2021-04-19", "2021-04-20", "2021-04-21", "2021-04-22", "2021-04-23", "2021-04-24", "2021-04-25", "2021-04-26", "2021-04-27", "2021-04-28", "2021-04-29", "2021-04-30", "2021-05-01", "2021-05-02", "2021-05-03", "2021-05-04", "2021-05-05", "2021-05-06", "2021-05-07", "2021-05-08", "2021-05-09", "2021-05-10", "2021-05-11", "2021-05-12", "2021-05-13", "2021-05-14", "2021-05-15", "2021-05-16", "2021-05-17", "2021-05-18", "2021-05-19", "2021-05-20", "2021-05-21", "2021-05-22", "2021-05-23", "2021-05-24", "2021-05-25", "2021-05-26", "2021-05-27", "2021-05-28", "2021-05-29", "2021-05-30", "2021-05-31", "2021-06-01", "2021-06-02", "2021-06-03", "2021-06-04", "2021-06-05", "2021-06-06", "2021-06-07", "2021-06-08", "2021-06-09", "2021-06-10", "2021-06-11", "2021-06-12", "2021-06-13", "2021-06-14", "2021-06-15", "2021-06-16", "2021-06-17", "2021-06-18", "2021-06-19", "2021-06-20", "2021-06-21", "2021-06-22", "2021-06-23", "2021-06-24", "2021-06-25", "2021-06-26", "2021-06-27", "2021-06-28", "2021-06-29", "2021-06-30"]
  public possibleDatesMonth = ["2020-01", "2020-02", "2020-03", "2020-04", "2020-05", "2020-06", "2020-07", "2020-08", "2020-09", "2020-10", "2020-11", "2020-12", "2021-01", "2021-02", "2021-03", "2021-04", "2021-05", "2021-06"];
  public possibleDatesYear = ["2020", "2021"]
  public dates = this.possibleDatesDay;
  public datesSelect = [];
  public datesSelectDropDown = [];


  public legendLabel = "x-Axis"
  public metricLabel = "y-Axis"

  /* Filter */
  public minSlider = { Date: new Date(this.dateMin).getTime(), Tests: 0, Cases: 0, Deaths: 0, Population: 0, PartialVaccinated: 0, FullyVaccinated: 0 }
  public maxSlider = { Date: new Date(this.dateMax).getTime(), Tests: 0, Cases: 0, Deaths: 0, Population: 0, PartialVaccinated: 0, FullyVaccinated: 0 } //.setHours(23, 59, 59, 999)
  public filterValue = { Date: [new Date(this.dateMin).getTime(), new Date(this.dateMax).getTime()], Tests: [0, false], Cases: [0, false], Deaths: [0, false], Population: [0, false], PartialVaccinated: [0, false], FullyVaccinated: [0, false] };
  public updateVisualization = false;
  public fieldToColor = { "Visualizations": "#1F8FFF", "Legend": "#FF7738", "DataFields": "#00FFE6", "Filter": "#877AFF", "Configuration": "#000000" };




  constructor(
    private router: Router,
    public route: ActivatedRoute,
    private drillDownService: DrillDownService,
    private functionService: FunctionService,
    private simpleService: SimpleService,
    private checkUpService: CheckUpService
  ) {

    this._routerSub = router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.route.params.subscribe(params => {

        if (this.route.snapshot.params['userID']) {
          this.userID = this.route.snapshot.params['userID'];
        }
        else {
          this.userID = "0000000";
        }

        if (this.route.snapshot.params['treatment']) {
          this.treatment = this.route.snapshot.params['treatment'];
        }
        else {
          this.treatment = "0";
        }

        if (this.route.snapshot.params['task']) {
          this.task = this.route.snapshot.params['task'];
        }
        else {
          this.task = "0";
        }
      });
    });

  }

  async ngOnInit() {

    this.currentTime = new Date()

    try {
      this.messengerID = sessionStorage.getItem('conversationID')
    }
    catch (e) {
      this.drillDownService.post(this.userID, this.task, this.treatment, "CatchException", null, { site: "UnitedStates", date: this.unitedStatesMap.date, statesSelected: this.unitedStatesMap.statesSelect }, 0);
    }

    if (this.messengerID != null) {
      var conversationID = sessionStorage.getItem('conversationID')
      this.directLine = window.WebChat.createDirectLine({
        secret: "I9zWGr48ptY.a56vpsiJsI-8omBWyUGKSSNoEkrotfvYVxFWLCWVgDc",
        conversationId: conversationID,
        webSocket: false
      });
      this.communicateToBot("The visualization has been reset to its default.")

    }
    else {
      this.directLine = window.WebChat.createDirectLine({
        secret: "I9zWGr48ptY.a56vpsiJsI-8omBWyUGKSSNoEkrotfvYVxFWLCWVgDc",
        webSocket: false
      });
    }

    async function createHybridPonyfillFactory() {
      const speechServicesPonyfillFactory = await window.WebChat.createCognitiveServicesSpeechServicesPonyfillFactory({
        credentials: {
          region: 'eastus',
          subscriptionKey: 'ae8ac8ac8b3244d5a976a30ced9b1298'
        }
      });

      return (options) => {
        const speech = speechServicesPonyfillFactory(options);

        return {
          SpeechGrammarList: speech.SpeechGrammarList,
          SpeechRecognition: speech.SpeechRecognition,
          speechSynthesis: null, // speech.speechSynthesis,
          SpeechSynthesisUtterance: null, // speech.SpeechSynthesisUtterance
        };
      }
    };



    this.store = window.WebChat.createStore(
      {},
      ({ dispatch }) => next => action => {
        if (action.type === 'DIRECT_LINE/POST_ACTIVITY') {
          //connect outgoing event handler and hand over reported data
          const event = new Event('webchatoutgoingactivity');
          action.payload.activity.channelData = { Visualizations: this.unitedStatesMap.chartType, Legend: this.unitedStatesMap.legend_Values ? this.unitedStatesMap.legend_Values : null, DataFields: this.unitedStatesMap.y_Axis_Values };
          var find = ',';
          var re = new RegExp(find, 'g');
          action.payload.activity.text = String(action.payload.activity.text).replace(re, '');
          (<any>event).data = action.payload.activity;
          window.dispatchEvent(event);
        }
        else if (action.type === 'DIRECT_LINE/INCOMING_ACTIVITY') {
          const event = new Event('webchatincomingactivity');
          (<any>event).data = action.payload.activity;
          window.dispatchEvent(event);

        }
        return next(action);
      });

    if (this.treatment != 4 && this.treatment != 5) {

      window.WebChat.renderWebChat(
        {
          directLine: this.directLine,
          sendTypingIndicator: true,
          sendTyping: true,
          styleOptions: {
            botAvatarBackgroundColor: 'rgba(0, 0, 0)',
            hideUploadButton: true,
            bubbleBorderWidth: 0,
            bubbleBackground: '#e6e2e27a',
            bubbleFromUserBorderWidth: 1,
            bubbleFromUserBorderColor: 'black',
            sendBoxButtonColor: 'rgba(255,153, 0, 1)',
            sendBoxButtonColorOnFocus: 'rgba(255,153, 0, 1)',
            sendBoxButtonColorOnHover: 'rgba(255,153, 0, 1)',
            sendBoxHeight: 70,
            bubbleMinHeight: 0,
            bubbleMaxWidth: 600,
          },
          webSpeechPonyfillFactory: await createHybridPonyfillFactory(),
          locale: 'en-US',
          store: this.store,
          overrideLocalizedStrings: {
            TEXT_INPUT_PLACEHOLDER: 'Click on the microphone and speak OR type ...'
          }

        },
        this.botWindowElement.nativeElement

      );

      this.directLine
        .postActivity({
          from: { id: "USER_ID", name: "USER_NAME" },
          name: "requestWelcomeDialog",
          type: "event",
          value: "token"
        })
        .subscribe(
          id => {
            if (sessionStorage.getItem('conversationID') == null) {
              sessionStorage.setItem('conversationID', this.directLine.conversationId);
            };
          },
          error => console.log(`Error posting activity ${error}`)
        );

    }
  }

  ngOnDestroy() {
    this.currentTime = new Date(8640000000000000);
    this.directLine = null;
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
    window.removeEventListener('webchatincomingactivity', this.webChatHandler.bind(this));
    window.removeEventListener("message", this.messageHandler.bind(this), false);
    this.store = null;
  }

  initialize() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
    this.refreshInterval = setInterval(() => {

      if (this.trainingMode) {
        document.getElementById("itl-container").style.display = 'flex';

        //document.getElementById("FilterField").style.width = '30%';
        //document.getElementById("botWin").style.width = '70%';

        //document.getElementById("FilterField").style.height = '100%';
        document.getElementById("botWin").style.height = '44%';

        document.getElementById("botWin").style.borderTop = '0px';


        //$('.filterTitle').css('display','block');
      }
      else {
        document.getElementById("itl-container").style.display = 'none';

        //document.getElementById("FilterField").style.width = '100%';
        //document.getElementById("botWin").style.width = '100%';

        //document.getElementById("FilterField").style.height = '50%';
        document.getElementById("botWin").style.height = '100%';

        document.getElementById("botWin").style.borderTop = '3px solid #122e51';
      }
      switch (this.treatment) {
        case '0':

          //console.log("Treatment: " + this.treatment)
          break;
        case '1':

          //console.log("Treatment: " + this.treatment)
          break;
        case '2':
          //console.log("Treatment: " + this.treatment)
          //document.getElementById("hallo").style.zIndex = '100';
          //document.getElementById("infoButton").style.display = 'none';

          break;
        case '3':
          //console.log("Treatment: " + this.treatment)
          document.getElementById("hallo").style.zIndex = '100';
          document.getElementById("infoButton").style.display = 'none';
          break;
        case '4':
          //console.log("Treatment: " + this.treatment)
          document.getElementById("botWin").style.display = 'none';
          break;
        case '5':
          //console.log("Treatment: " + this.treatment)
          document.getElementById("botWin").style.display = 'none';
          break;
      }
      document.querySelectorAll('#botWin > div > div > div > div > button > svg')[0].setAttribute('height', '65');
      document.querySelectorAll('#botWin > div > div > div > div > button > svg')[0].setAttribute('width', '65');
      document.querySelectorAll('#botWin > div > div > div > div > button > svg')[0].setAttribute('style', 'padding-right: 20px');
      document.getElementById("testSVG").style.left = '85%';
      if (this.statesSelect.length > 0) {
        $("input[id^='k']")[1]["placeholder"] = "  +"
      }
      if (this.datesSelectDropDown.length > 0) {
        $("input[id^='k']")[0]["placeholder"] = "  +"
      }

      if (this.unitedStatesMap.y_Axis_Values.length > 0) {
        var placeholderText = "&nbsp; ";
        for (var i = 0; i < this.unitedStatesMap.y_Axis_Values.length; i++) {
          placeholderText += this.unitedStatesMap.y_Axis_Values[i]

          if (this.unitedStatesMap.y_Axis_Values.length > 1 && i < this.unitedStatesMap.y_Axis_Values.length - 1 && i < 2) {
            placeholderText += ", "
          }
          else if (i == 2 && this.unitedStatesMap.y_Axis_Values.length > 3) {
            placeholderText += "... "
            break;
          }
        }

        document.getElementById("cumulateText").innerHTML = placeholderText

      }
      else {
        document.getElementById("cumulateText").innerHTML = " &nbsp; Tests, Cases, Deaths, ..."
      }

    }, 1000);

  }

  public ngAfterViewInit(): void {

    //this.router.navigate(['unitedstates/' + this.unitedStatesMap.metric + "/" + this.unitedStatesMap.date + "/" + this.unitedStatesMap.userID + "/" + this.unitedStatesMap.treatment + "/" + this.unitedStatesMap.task])

    if (this.treatment != 4 && this.treatment != 5) {
      window.addEventListener('webchatincomingactivity', this.webChatHandler.bind(this));
    }
    window.addEventListener("message", this.messageHandler.bind(this), false);


    document.getElementById("overlay").addEventListener("click", function () {
      $(".popup-overlay, .popup-content").removeClass("active");
    });

    document.getElementById("content").addEventListener("click", function () {
      $(".popup-overlay, .popup-content").removeClass("active");
    });

    document.getElementById("Aggregate").addEventListener("change", this.changedAggregateMouse.bind(this));

    document.getElementById("statesSelect").addEventListener("change", this.changedStatesSelectMouse.bind(this));

    document.getElementById("Cumulative").addEventListener("change", this.changedCumulativeMouse.bind(this));

    //document.getElementById("DropdownDate").addEventListener("change", this.changedDateSetting.bind(this));



    window.addEventListener('resize', this.update.bind(this));



    //document.querySelector('#map > app-unitedstates-map > div > div > div:nth-child(3) > kendo-label > kendo-multiselect > div').setAttribute('style', 'padding: 0px');
  }

  public ngAfterContentInit() {
    this.initialize();
  }

  public openMenu() {
    document.getElementById("myDropdown").classList.toggle("show");
  }

  dateChanged(data) {

    for (var key in this.maxSlider) {
      if (key !== "Date" && key !== "State") {

        var oldMax = this.maxSlider[key]
        this.maxSlider[key] = data[key + 'Max']
        if (!this.filterValue[key][1] || typeof this.filterValue[key][1] == 'undefined' || this.filterValue[key][1] > this.maxSlider[key] || this.filterValue[key][1] == oldMax) {
          this.filterValue[key] = [this.filterValue[key][0], this.maxSlider[key]]

        }
        else {
          this.filterValue[key] = [this.filterValue[key][0], this.filterValue[key][1]]
        }

        document.getElementById(key + "-From")["value"] = String(this.filterValue[key][0])
        document.getElementById(key + "-To")["value"] = String(this.filterValue[key][1])
      }
    }
    this.unitedStatesMap.filterValue = this.filterValue
  }


  toggleChanged(data) {

    for (var key in data) {
      if (key == "Cumulative") {
        this.functionService.changeCumulative(this, data["Cumulative"])
      }
    }

    this.update();

  }




  openInfo() {
    if (this.treatment == 0 || this.treatment == 1) {
      $("#infoPic").attr("src", "../../assets/images/info.jpg");
    }
    else if (this.treatment == 4 || this.treatment == 5) {
      $("#infoPic").attr("src", "../../assets/images/info_Mouse.jpg");
    }
    $(".popup-overlay, .popup-content").addClass("active");
    this.drillDownService.post(this.userID, this.task, this.treatment, "Help", null, { site: "UnitedStates", date: this.unitedStatesMap.date, statesSelected: this.unitedStatesMap.statesSelect }, 0);
  }

  closeInfo() {
    $(".popup-overlay, .popup-content").removeClass("active");
    this.drillDownService.post(this.userID, this.task, this.treatment, "Close Help", null, { site: "UnitedStates", date: this.unitedStatesMap.date, statesSelected: this.unitedStatesMap.statesSelect }, 0);

  }

  closeFilter(event) {

    if (event.path[4]["className"] == "col") {

      var data = event.path[4]["id"].split("_")[0]
      var second = event.path[4]["id"].split("_")[1]

      this.functionService.removeFilter(this, [{ [data]: ["close"] }])
      this.update();
    }
  }

  resetFilter(event, target) {

    if (event.path[4]["className"] == "col") {

      var data = event.path[4]["id"].split("_")[0]

      if (data == "State") {
        if (target == "All") {
          this.functionService.addState(this, ["All"])
        }
        else if (target == "None") {
          this.functionService.removeState(this, ["All"])
        }

      }
      else if (data == "Date") {
        if (target == "All") {
          this.functionService.addDate(this, ["All"])
        }
        else if (target == "None") {
          this.functionService.removeDate(this, ["All"])
        }
      }
      else {
        var filters = [{ [data]: [0, this.maxSlider[data]] }]

        document.getElementById(data + "-From")["value"] = 0
        document.getElementById(data + "-To")["value"] = this.maxSlider[data]
        this.functionService.addFilter(this, filters)
      }



      this.update();



    }
  }


  public webChatHandler(event) {
    var sheight = document.querySelectorAll("[class$=webchat__basic-transcript__scrollable]")[0].scrollHeight;
    document.querySelectorAll("[class$=webchat__basic-transcript__scrollable]")[0].scrollTo({ left: 0, top: sheight, behavior: 'auto' });
    if ((this.router.url.includes("unitedstates") || this.router.url == "/") && (new Date((<any>event).data.timestamp) >= this.currentTime)) {  //
      console.log(<any>event)
      if ((<any>event).data.type == 'event') {
        $("li[class$='from-bot']").each(function (i, el) {
          if (this["innerText"].indexOf("Bot said:Processing") !== -1) {
            this["style"]["display"] = "none";
          }
        });
        
        if ((<any>event).data.name == "Generic") {
          this.animate = true;
          try {
            this.functionService.processAction(this, <any>event.data.value)
            this.update();
          }
          catch (e) {

          }
          this.animate = false;
          setTimeout(element => { $('.draggable').removeClass("animate"); $('.col').removeClass("animate"); $('.highlight').removeClass("highlight"); }, 1000)
        
        }
        else if ((<any>event).data.name == "Help") {
          this.functionService.visualizeUnderstanding(this, (<any>event).data.value)
        }
        else if ((<any>event).data.name == "Start Demonstration") {
          this.startDemonstration((<any>event).data.value);
        }
        else if ((<any>event).data.name == "ConfirmRecommendation") {
          this.endTrainingMode('true');
        }
        else if ((<any>event).data.name == "Refuse") {
          this.endTrainingMode('false');
        }
        else if ((<any>event).data.name == "RecommendSimpleAction") {
          this.simpleService.analyzeEntities(this, (<any>event).data.value);
        }



      }
      else if ((<any>event).data.type == 'message' && (<any>event).data.from.name != 'Conversational-ITL') {
        if ((<any>event).data.channelData.clientTimestamp != this.componentMessage) {
          this.componentMessage = (<any>event).data.channelData.clientTimestamp;
          if ((<any>event).data.channelData.speech != null) {
            //console.log("speech");
            //this.drillDownService.postSpeech(this.userID, this.task, this.treatment, 1, (<any>event).data.text, "State");
          }
          else {
            //console.log("nospeech");
            //this.drillDownService.postSpeech(this.userID, this.task, this.treatment, 0, (<any>event).data.text, "State");
          }
        }
      }
      else{
        var that = this
        $("li[class$='from-bot']").each(function (i, el) {
          if (this["innerText"].indexOf("Bot said:Ambiguity") !== -1) {
            this.addEventListener("mouseover",function(){ 
              $("div[id^='RecommenderTemplate']").each(function (i, el) {
              if(this["style"]["display"] != "none"){
                this["style"]["background-color"] = "yellow"
                document.getElementById("ActionTemplate" + this["id"].substring(19))["style"]["background-color"] = "yellow"
              }
            });})
            this.addEventListener("mouseout",function(){ 
              $("div[id^='RecommenderTemplate']").each(function (i, el) {
              if(this["style"]["display"] != "none"){
                this["style"]["background-color"] = "white"
                document.getElementById("ActionTemplate" + this["id"].substring(19))["style"]["background-color"] = "white"
              }
            });})

          }
        });
      }
    }

  }

  public messageHandler(event) {

    if ("https://iism-im-survey.iism.kit.edu" != event.origin)
      return;
    const { action, value } = event.data
    if ((this.router.url.includes("unitedstates") || this.router.url == "/") && (action == 'end') && (new Date() >= this.currentTime)) {
      this.drillDownService.post(this.userID, this.task, this.treatment, "Task Ended", value, { site: "UnitedStates", date: this.unitedStatesMap.date, statesSelected: this.unitedStatesMap.statesSelect }, 0);
    }
    else if ((this.router.url.includes("unitedstates") || this.router.url == "/") && (action == 'start') && (sessionStorage.getItem('taskNr') != value) && (new Date() >= this.currentTime)) {
      this.reload(value)
    }
  }

  reload(value) {
    this.drillDownService.post(this.userID, this.task, this.treatment, "Task Started", value, { site: "UnitedStates", date: this.unitedStatesMap.date, statesSelected: this.unitedStatesMap.statesSelect }, 0);
    this.unitedStatesMap.task = value
    sessionStorage.setItem('taskNr', value);

    this.router.navigate(['/unitedstates/Total Cases/2020-12-02/' + this.unitedStatesMap.userID + '/' + this.unitedStatesMap.treatment + "/" + value]);


    this.unitedStatesMap.statesSelect = [];
    this.update();
  }

  ablegenErlauben(ev) {
    ev.preventDefault();
  }

  ziehen(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
  }

  ablegen(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    if (ev.target["className"].includes("interactiveField")) {
      if (data != "Date" && data != "State" && ev.target["id"] == "legend") {
        this.communicateToBot(String(data) + " can not be entered as a Legend.");

      }
      else if ((data == "Date" || data == "State") && ev.target["id"] == "y_Axis") {
        this.communicateToBot(String(data) + " can not be entered as a Metric.");
      }
      else if (ev.target["id"] == "data_Field") {
        if (data == "State" || data == "Date") {
          this.functionService.removeLegend(this, data);
        }
        else {
          this.functionService.removeMetric(this, [data])
        }
      }

      else {
        if (ev.target["id"] == "legend") {
          this.functionService.addLegend(this, data);
        }
        else if (ev.target["id"] == "y_Axis") {

          this.functionService.addMetric(this, [data]);

        }

        this.update();
      }
    }
    else if (ev.target["className"] == "filter-container" || ev.path[1]["className"] == "filter-container") {
      this.functionService.addFilter(this, [{ [data]: ["open"] }]);
    }

  }

  backToDataField(ev) {
    ev.preventDefault();


    var data = ev.target["id"];

    if (ev.path[1]['id'] == "legend") {
      this.functionService.removeLegend(this, data);
    }
    else if (ev.path[1]['id'] == "y_Axis") {
      this.functionService.removeMetric(this, [data]);

    }
    this.unitedStatesMap.filterValue = this.filterValue
    this.update();
  }



  changeVisualizationMouse(ev) {

    var visualization = ev.target["id"];

    if (visualization != this.unitedStatesMap.chartType) {
      this.functionService.changeVisualization(this, visualization)
      this.update();
    }
  }

  selectedStateChange(value: any) {

    var selected = value.filter(x => !this.unitedStatesMap.statesSelect.includes(x));
    if (selected.length != 0) {
      this.functionService.addState(this, selected)
    }
    else {
      selected = this.unitedStatesMap.statesSelect.filter(x => !value.includes(x));
      this.functionService.removeState(this, selected)
    }
    this.update();
  }


  selectedDateChange(value: any) {

    if (this.unitedStatesMap.aggregate == "M") {
      value = value.map(i => i + "-01");
    }
    else if (this.unitedStatesMap.aggregate == "Y") {
      value = value.map(i => i + "-01-01");
    }

    var selected = value.filter(x => !this.datesSelect.includes(x));
    if (selected.length != 0) {
      this.functionService.addDate(this, selected)
    }
    else {
      selected = this.datesSelect.filter(x => !value.includes(x));
      this.functionService.removeDate(this, selected)
    }

    this.update();
  }


  changedDateSetting(value: any) {
    console.log(value["target"][0]["selected"])
    if (value["target"][0]["selected"] || value["target"][0]["selected"] == "true") {
      document.getElementById("Date-From")["style"]["display"] = "none"
      document.getElementById("Date-To")["style"]["display"] = "none"
      document.getElementById("Date-Select")["style"]["display"] = "block"

      this.functionService.changeDateSetting(this, "Selection")
    }
    else if (value["target"][1]["selected"] || value["target"][1]["selected"] == "true") {
      document.getElementById("Date-From")["style"]["display"] = "block"
      document.getElementById("Date-To")["style"]["display"] = "block"
      document.getElementById("Date-Select")["style"]["display"] = "none"


      this.functionService.changeDateSetting(this, "Range")
    }

    this.update();

  }



  dateRangeChange(value: any) {

    var filters = [{ Date: [value[0], value[1]] }]

    this.filterValue['Date'] = [value[0], value[1]]
    document.getElementById("Date-From")["value"] = String(formatDate(new Date(value[0]), 'yyyy-MM-dd', 'en'))
    document.getElementById("Date-To")["value"] = String(formatDate(new Date(value[1]), 'yyyy-MM-dd', 'en'))

    this.updateVisualization = true;

    var that = this;
    setTimeout(function () {
      if (that.updateVisualization) {
        that.updateVisualization = false
        that.update();
      }

    }, 500);
  }


  mouseFilterChange(value: any, filterName) {

    var filters = [{ [filterName]: [value[0], value[1]] }]

    document.getElementById(filterName + "-From")["value"] = value[0]
    document.getElementById(filterName + "-To")["value"] = value[1]


    this.updateVisualization = true;

    this.functionService.addFilter(this, filters)


    var that = this;
    setTimeout(function () {
      if (that.updateVisualization) {
        that.updateVisualization = false
        that.update();
      }

    }, 500);

  }

  changedAggregateMouse(event) {
    var element = document.getElementById('Aggregate');
    this.functionService.changeAggregate(this, element["value"])
    this.update();
  }

  changedStatesSelectMouse(event) {
    var element = document.getElementById('statesSelect');
    this.functionService.changeStatesSelect(this, element["value"])
    this.update();
  }

  changedCumulativeMouse(event) {
    var element = document.getElementById('Cumulative');
    this.functionService.changeCumulative(this, element["value"])
    this.update();
  }


  changedMetricAction(event) {
    var id;

    if (event["path"][2].id.includes("ActionTemplate")) {
      id = event["path"][2].id.slice(14);
    }

    var previousAction = this.actionSequence[id]


    var metrics = []
    if (previousAction["Add"]["DataFields"] != "none" && previousAction["Add"]["DataFields"] != "All") {
      metrics = previousAction["Add"]["DataFields"]
    }
    else if (previousAction["Remove"]["DataFields"] != "none" && previousAction["Remove"]["DataFields"] != "All") {
      metrics = previousAction["Remove"]["DataFields"]
    }

    if (event["target"]["value"] == "Add") {
      previousAction["Add"]["DataFields"] = metrics;
      previousAction["Remove"]["DataFields"] = 'none'
    }
    else if (event["target"]["value"] == "Select") {
      previousAction["Add"]["DataFields"] = metrics;
      previousAction["Remove"]["DataFields"] = 'All'
    }
    else if (event["target"]["value"] == "Remove all except") {
      previousAction["Add"]["DataFields"] = metrics;
      previousAction["Remove"]["DataFields"] = 'All'
    }
    else if (event["target"]["value"] == "Remove") {
      previousAction["Add"]["DataFields"] = 'none';
      previousAction["Remove"]["DataFields"] = metrics
    }
    else if (event["target"]["value"] == "Select all except") {
      previousAction["Add"]["DataFields"] = 'All';
      previousAction["Remove"]["DataFields"] = metrics
    }

    this.actionSequence[id] = previousAction

    this.updateDuringTraining();

  }

  changedLegendAction(event) {


    var previousAction = this.actionSequence[id]


    var legend = ""
    if (previousAction["Add"]["Legend"] != "none" && previousAction["Add"]["Legend"] != "All") {
      legend = previousAction["Add"]["Legend"]
    }
    else if (previousAction["Remove"]["Legend"] != "none" && previousAction["Remove"]["Legend"] != "All") {
      legend = previousAction["Remove"]["Legend"]
    }

    if (event["target"]["value"] == "Add") {
      previousAction["Add"]["Legend"] = legend;
      previousAction["Remove"]["Legend"] = 'none'
    }
    else if (event["target"]["value"] == "Remove") {
      previousAction["Add"]["Legend"] = 'none';
      previousAction["Remove"]["Legend"] = legend
    }

    var id;

    if (event["path"][2].id.includes("ActionTemplate")) {
      id = event["path"][2].id.slice(14);
      this.actionSequence[id] = previousAction
      this.updateDuringTraining();
    }
    else if (event["path"][2].id.includes("InitialStateTemplate")) {
      id = event["path"][2].id.slice(20);
      this.initialStateSequence = previousAction
    }
  }

  changedStateAction(event) {
    var id;

    if (event["path"][2].id.includes("ActionTemplate")) {
      id = event["path"][2].id.slice(14);
    }

    var previousAction = this.actionSequence[id]



    console.log(previousAction["Add"]["State"])
    var states = []

    if (previousAction["Add"]["State"] != "none" && typeof previousAction["Add"]["State"] !== "undefined" && previousAction["Add"]["State"][0] != "All") {
      states = previousAction["Add"]["State"]
    }
    else if (previousAction["Remove"]["State"] != "none" && typeof previousAction["Remove"]["State"] !== "undefined" && previousAction["Remove"]["State"][0] != "All") {
      states = previousAction["Remove"]["State"]
    }

    if (event["target"]["value"] == "Add") {
      previousAction["Add"]["State"] = states
      previousAction["Remove"]["State"] = 'none'
    }
    else if (event["target"]["value"] == "Remove all except") {
      previousAction["Add"]["State"] = states
      previousAction["Remove"]["State"] = ['All']
    }
    else if (event["target"]["value"] == "Remove") {
      previousAction["Add"]["State"] = 'none'
      previousAction["Remove"]["State"] = states
    }
    else if (event["target"]["value"] == "Select all except") {
      previousAction["Add"]["State"] = ['All']
      previousAction["Remove"]["State"] = states
    }

    this.actionSequence[id] = previousAction

    this.updateDuringTraining();

  }

  changedStateActionAll(event) {
    var id;

    if (event["path"][2].id.includes("ActionTemplate")) {
      id = event["path"][2].id.slice(14);
    }

    var previousAction = this.actionSequence[id]



    console.log(previousAction["Add"]["State"])
    var states = []

    if (previousAction["Add"]["State"] != "none") {
      states = previousAction["Add"]["State"]
    }
    else if (previousAction["Remove"]["State"] != "none") {
      states = previousAction["Remove"]["State"]
    }

    if (event["target"]["value"] == "Add") {
      previousAction["Add"]["State"] = states
      previousAction["Remove"]["State"] = 'none'
    }
    else if (event["target"]["value"] == "Remove") {
      previousAction["Add"]["State"] = 'none'
      previousAction["Remove"]["State"] = states
    }

    this.actionSequence[id] = previousAction

    this.updateDuringTraining();

  }

  changedDateAction(event) {
    var id;

    if (event["path"][2].id.includes("ActionTemplate")) {
      id = event["path"][2].id.slice(14);
    }

    var previousAction = this.actionSequence[id]



    console.log(previousAction["Add"]["Date"])
    var dates = []

    if (previousAction["Add"]["Date"] != "none" && typeof previousAction["Add"]["Date"] !== "undefined" && previousAction["Add"]["Date"][0] != "All") {
      dates = previousAction["Add"]["Date"]
    }
    else if (previousAction["Remove"]["Date"] != "none" && typeof previousAction["Remove"]["Date"] !== "undefined" && previousAction["Remove"]["Date"][0] != "All") {
      dates = previousAction["Remove"]["Date"]
    }

    if (event["target"]["value"] == "Add") {
      previousAction["Add"]["Date"] = dates
      previousAction["Remove"]["Date"] = 'none'
    }
    else if (event["target"]["value"] == "Remove all except") {
      previousAction["Add"]["Date"] = dates
      previousAction["Remove"]["Date"] = ['All']
    }
    else if (event["target"]["value"] == "Remove") {
      previousAction["Add"]["Date"] = 'none'
      previousAction["Remove"]["Date"] = dates
    }
    else if (event["target"]["value"] == "Select all except") {
      previousAction["Add"]["Date"] = ['All']
      previousAction["Remove"]["Date"] = dates
    }

    this.actionSequence[id] = previousAction

    this.updateDuringTraining();

  }

  changedDateActionAll(event) {
    var id;

    if (event["path"][2].id.includes("ActionTemplate")) {
      id = event["path"][2].id.slice(14);
    }

    var previousAction = this.actionSequence[id]



    console.log(previousAction["Add"]["Date"])
    var dates = []

    if (previousAction["Add"]["Date"] != "none") {
      dates = previousAction["Add"]["Date"]
    }
    else if (previousAction["Remove"]["Date"] != "none") {
      dates = previousAction["Remove"]["Date"]
    }

    if (event["target"]["value"] == "Add") {
      previousAction["Add"]["Date"] = dates
      previousAction["Remove"]["Date"] = 'none'
    }
    else if (event["target"]["value"] == "Remove") {
      previousAction["Add"]["Date"] = 'none'
      previousAction["Remove"]["Date"] = dates
    }

    this.actionSequence[id] = previousAction

    this.updateDuringTraining();

  }


  changedFilterAction(event) {
    var id;

    if (event["path"][2].id.includes("ActionTemplate")) {
      id = event["path"][2].id.slice(14);
    }

    var previousAction = this.actionSequence[id]


    var filter = ""
    if (previousAction["Add"]["Filter"] != "none") {
      filter = previousAction["Add"]["Filter"]
    }
    else if (previousAction["Remove"]["Filter"] != "none") {
      filter = previousAction["Remove"]["Filter"]
    }

    if (event["target"]["value"] == "Add") {
      previousAction["Add"]["Filter"] = filter;
      previousAction["Remove"]["Filter"] = 'none'
    }
    else if (event["target"]["value"] == "Remove") {
      previousAction["Add"]["Filter"] = 'none';
      previousAction["Remove"]["Filter"] = filter
    }

    this.actionSequence[id] = previousAction

    this.updateDuringTraining();

  }


  communicateToBot(value: any) {
    this.directLine
      .postActivity({
        from: { id: "USER_ID", name: "USER_NAME" },
        name: "chatbotNotification",
        type: "event",
        value: value
      })
      .subscribe(
        id => {
          if (sessionStorage.getItem('conversationID') == null) {
            sessionStorage.setItem('conversationID', this.directLine.conversationId);
          };
        },
        error => console.log(`Error posting activity ${error}`)
      );
  }

  getFeedbackFromBot(value: any) {
    this.directLine
      .postActivity({
        from: { id: "USER_ID", name: "USER_NAME" },
        name: "Feedback",
        type: "event",
        value: value,
        channelData: { Visualizations: this.unitedStatesMap.chartType, Legend: this.unitedStatesMap.legend_Values ? this.unitedStatesMap.legend_Values : null, DataFields: this.unitedStatesMap.y_Axis_Values }
      })
      .subscribe(
        id => {
          if (sessionStorage.getItem('conversationID') == null) {
            sessionStorage.setItem('conversationID', this.directLine.conversationId);
          };
        },
        error => console.log(`Error posting activity ${error}`)
      );
  }


  tagMapperState(tags: any[]): any[] {
    tags = tags.sort((tag1: any, tag2: any): number => {
      return tag1["value"] - tag2["value"];
    });
    return tags.length < 51 ? tags : [tags];
  }

  tagMapperDate(tags: any[]): any[] {
    tags = tags.sort((tag1: any, tag2: any): number => {
      return Date.parse(tag1) - Date.parse(tag2);
    });
    return tags.length < 548 ? tags : [tags];
  }

  update() {
    this.unitedStatesMap.removeExistingMapFromParent();
    this.unitedStatesMap.updateMap();
  }

  inputCheck(ev) {
    var data = ev.target.id.split("-");
    var filters = []
    if (data[0] == "Date") {

      var date = document.getElementById("Date-From")["value"] + " till " + document.getElementById("Date-To")["value"]

      this.functionService.addDate(this, [date])

    }
    else {
      if (data[1] == "From") {
        if (parseInt(ev.target.value) < this.minSlider[data[0]]) {
          ev.target.value = this.minSlider[data[0]]
          filters.push({ [data[0]]: [this.minSlider[data[0]], this.filterValue[data[0]][1]] })
          this.communicateToBot("The value you selected is smaller than the minimum value of " + data[0] + ".")

        }
        else {
          filters.push({ [data[0]]: [parseInt(ev.target.value), this.filterValue[data[0]][1]] })
        }

      }
      else {
        if (parseInt(ev.target.value) > this.maxSlider[data[0]]) {
          ev.target.value = this.maxSlider[data[0]]
          filters.push({ [data[0]]: [this.filterValue[data[0]][0], this.maxSlider[data[0]]] })

          this.communicateToBot("The value you selected is larger than the maximum value of " + data[0] + ".")
        }
        else {
          filters.push({ [data[0]]: [this.filterValue[data[0]][0], parseInt(ev.target.value)] })
        }
      }
      this.functionService.addFilter(this, filters)
    }

    this.update();
  }

  startDemonstration(value) {
    this.trainingMode = true;
    this.addToSequence = true;
    this.shortcut = false;
    document.getElementById("trainUtterance").innerHTML = this.initialUtterance + document.getElementById("trainUtterance").innerHTML;

    document.getElementById("trainUtterance").childNodes.forEach(function (child) {
      if (child["title"] != "") {
        console.log(child["title"])
        if (child["title"].includes("x-Axis") || child["title"].includes("Legend") || child["title"].includes("State :")) {
          child.addEventListener("mouseover", function () { document.getElementById(child["title"].split(/ : | &#10; | \n /)[1])["style"]["box-shadow"] = "black 5px 5px 10px 0px" })
          child.addEventListener("mouseout", function () { document.getElementById(child["title"].split(/ : | &#10; | \n /)[1])["style"]["box-shadow"] = "" })
        }
        else if (child["title"].includes("y-Axis") || child["title"].includes("Axis") || child["title"].includes("Color")) {
          child.addEventListener("mouseover", function () { document.getElementById(child["title"].split(/ : | &#10; | \n /)[1])["style"]["box-shadow"] = "black 5px 5px 10px 0px" })
          child.addEventListener("mouseout", function () { document.getElementById(child["title"].split(/ : | &#10; | \n /)[1])["style"]["box-shadow"] = "" })
        }
        else if (child["title"].includes("Visualizations")) {
          child.addEventListener("mouseover", function () { document.getElementById(child["title"].split(/ : | &#10; | \n /)[1])["style"]["background-color"] = "RoyalBlue" })
          child.addEventListener("mouseout", function () { 
            var element = document.getElementById(child["title"].split(/ : | &#10; | \n /)[1]);
            if(element["className"].includes("active")){
              element["style"]["background-color"] = "DodgerBlue"
            }
            else{
              element["style"]["background-color"] = "gray"
            }
          })
        }
        else if (child["title"].includes("Aggregate")) {
          child.addEventListener("mouseover", function () { document.getElementById(child["title"].split(/ : | &#10; | \n /)[0])["style"]["box-shadow"] = "black 0px 0px 10px 6px" })
          child.addEventListener("mouseout", function () { document.getElementById(child["title"].split(/ : | &#10; | \n /)[0])["style"]["box-shadow"] = "" })
        }
        else if (child["title"].includes("Cumulative")) {
          child.addEventListener("mouseover", function () { document.getElementById(child["title"].split(/ : | &#10; | \n /)[0])["style"]["box-shadow"] = "black 0px 0px 10px 6px" })
          child.addEventListener("mouseout", function () { document.getElementById(child["title"].split(/ : | &#10; | \n /)[0])["style"]["box-shadow"] = "" })
        }

        /** TODO */
        else if (child["title"].includes("Filter")) {

          if (document.getElementById(child["title"].split(/ : | &#10; | \n /)[1] + "_Filter").classList.contains("closed")) {
            child.addEventListener("mouseover", function () { document.getElementById("FilterField")["style"]["box-shadow"] = "black 0px 0px 10px 6px" })
            child.addEventListener("mouseout", function () { document.getElementById("FilterField")["style"]["box-shadow"] = "" })
          }
          else {
            child.addEventListener("mouseover", function () { document.getElementById(child["title"].split(/ : | &#10; | \n /)[1] + "_Filter")["style"]["box-shadow"] = "black 0px 0px 10px 6px" })
            child.addEventListener("mouseout", function () { document.getElementById(child["title"].split(/ : | &#10; | \n /)[1] + "_Filter")["style"]["box-shadow"] = "" })
          }
        }
      }

    })

    this.trainableEntites = value;

    this.stateList = []
    for (var sI in this.trainableEntites["State"]) {
      var state = this.trainableEntites["State"][sI]
      var index = parseInt(state.charAt(0))
      if (this.stateList.length < index) {
        this.stateList[index - 1] = [state.substring(1)]
      }
      else {
        this.stateList[index - 1].push(state.substring(1))
      }
    }

    this.metricList = []
    for (var mI in this.trainableEntites["DataFields"]) {
      var metric = this.trainableEntites["DataFields"][mI]
      var index = parseInt(metric.charAt(0))
      if (this.metricList.length < index) {
        this.metricList[index - 1] = [metric.substring(1)]
      }
      else {
        this.metricList[index - 1].push(metric.substring(1))
      }
    }

    console.log(this.metricList[0])


    var possibleFilter = ["Date", "State", "Tests", "Cases", "Deaths", "Population", "PartialVaccinated", "FullyVaccinated"]
    var activeFilters = []
    for (var filterIndex in possibleFilter) {
      if (document.getElementById(possibleFilter[filterIndex] + "_Filter")["className"] != "col closed") {
        activeFilters.push(possibleFilter[filterIndex])
      }
    }



    this.initialState = {
      'Visualization': this.unitedStatesMap.chartType,
      'Legend': this.unitedStatesMap.legend_Values,
      'Metric': this.unitedStatesMap.y_Axis_Values,
      'Filters': this.filterValue,
      'States': this.unitedStatesMap.statesSelect,
      'Dates': this.datesSelect,
      'DateSettings': this.unitedStatesMap.dateSetting,
      'OpenFilters': activeFilters,
      'Aggregate': this.unitedStatesMap.aggregate,
      'Cumulative': this.unitedStatesMap.cumulative,
      'GroupBy': this.unitedStatesMap.groupBy
    }

    this.unusedEntities = {}

    for (var tIndex in this.trainableEntites) {
      if (this.trainableEntites[tIndex].length > 0 && tIndex != "State" && tIndex != "DataFields" && tIndex != "StatesSelect") {
        this.unusedEntities[tIndex] = JSON.parse(JSON.stringify(this.trainableEntites[tIndex]))
      }
      else if (this.trainableEntites[tIndex].length > 0 && tIndex == "State") {
        this.unusedEntities[tIndex] = JSON.parse(JSON.stringify(this.stateList))
      }
      else if (this.trainableEntites[tIndex].length > 0 && tIndex == "DataFields") {
        this.unusedEntities["Metric"] = JSON.parse(JSON.stringify(this.metricList))
      }
    }

    this.initialUnusedEntities = JSON.parse(JSON.stringify(this.unusedEntities))

    console.log(this.initialState)


  }

  closeRecommendationItem(event) {
    console.log(event.path[2].childNodes[2].childNodes[2]["checked"])
    if (event.path[2].childNodes[2].childNodes[0]["checked"] || event.path[2].childNodes[2].childNodes[2]["checked"]) {
      var index = parseInt(event.path[2].id.substring(19))
      document.getElementById('ActionTemplate' + index)["children"][0]["children"][0]["disabled"] = false
      var element = document.getElementById("RecommenderTemplate" + index);
      element.parentNode.removeChild(element);

      for (var rIndex in this.recommendationList) {
        var recommendation = this.recommendationList[rIndex]
        if (recommendation["id"] == index) {
          if (event.path[2].childNodes[2].childNodes[2]["checked"] == true) {
            this.actionSequence[index] = recommendation["action"]
            if (recommendation["value"] == "Remove all") {
              document.getElementById("ActionTemplate" + index).childNodes[0]["innerHTML"] = recommendation["text"]
            }
            else {
              var selection = document.getElementById("ActionTemplate" + index).childNodes[0].childNodes[0];
              console.log(selection)
              for (var i = 0; i < selection["options"].length; i++) {
                if (selection["options"][i]["value"] == recommendation["value"]) {
                  selection["options"][i]["selected"] = true;
                }
                else {
                  selection["options"][i]["selected"] = false;
                }
              }
            }


          }
          else if (event.path[2].childNodes[2].childNodes[0]["checked"] == true) {
            this.recommendationList.splice(parseInt(rIndex), 1)
          }
        }
      }

      this.communicateToBot("I confirmed your selection.")
      this.updateDuringTraining();
    }
    else {
      this.communicateToBot("Please select one of the two options.")
    }



  }

  confirmRecommendation(id) {
    for (var rIndex in this.recommendationList) {
      var recommendation = this.recommendationList[rIndex]
      if (recommendation["id"] == id) {
        this.actionSequence[id] = recommendation["action"]
        document.getElementById("ActionTemplate" + id).childNodes[0]["innerHTML"] = recommendation["text"].replace("Do you want to: ", "")

      }
    }

    $("div[id^='RecommenderTemplate']").each(function (i, el) {
      this["style"]["display"] = "none"
    });

    this.updateDuringTraining();
  }

  highlightRecommendation(){
    console.log()
  }

  removeHiglightRecommendation(){

  }

  refuse() {
    $("div[id^='RecommenderTemplate']").each(function (i, el) {
      this["style"]["display"] = "none"
    });
  }

  sendRecommendation(recommendationID, phrase) {
    this.directLine
      .postActivity({
        from: { id: "USER_ID", name: "USER_NAME" },
        name: "NewRecommendation",
        type: "event",
        value: {
          'id': recommendationID,
          'phrase': phrase
        }
      })
      .subscribe(
        id => {
          if (sessionStorage.getItem('conversationID') == null) {
            sessionStorage.setItem('conversationID', this.directLine.conversationId);
          };
        },
        error => console.log(`Error posting activity ${error}`)
      );
  }

  closeITLElement(event) {
    var id;

    if (event["path"][2].id.includes("ActionTemplate")) {
      id = event["path"][2].id.slice(14);
    }
    else {
      id = event["path"][1].id.slice(14);
    }

    this.actionSequence.splice(id, 1)


    var element = document.getElementById("ActionTemplate" + id);
    element.parentNode.removeChild(element);

    try {
      var RecElement = document.getElementById("RecommenderTemplate" + id);
      RecElement.parentNode.removeChild(RecElement);
    }
    catch {
    }

    for (var i = id; i < this.actionSequence.length; i++) {
      var oldID = parseInt(i) + 1
      document.getElementById("ActionTemplate" + oldID).id = "ActionTemplate" + i
    }

    if(this.actionSequence.length == 0){
      document.getElementById("NoAction")["style"]["display"] = "inline-block";
    }

    this.updateDuringTraining()


  }



  async updateDuringTraining() {

    this.addToSequence = false;
    this.resetProzess = true;
    this.functionService.changeVisualization(this, this.initialState["Visualization"])

    if (typeof this.initialState["Legend"] !== 'undefined' && this.initialState["Legend"] != null) {
      this.functionService.addLegend(this, this.initialState["Legend"])
    }
    else if (typeof this.unitedStatesMap.legend_Values !== 'undefined' && this.unitedStatesMap.legend_Values != null) {
      this.functionService.removeLegend(this, this.unitedStatesMap.legend_Values)
    }

    this.functionService.removeAllMetrics(this)

    this.functionService.addMetric(this, this.initialState["Metric"])



    var possibleFilter = ["Tests", "Cases", "Deaths", "Population", "PartialVaccinated", "FullyVaccinated"]

    for (var index in possibleFilter) {
      this.functionService.removeFilter(this, [{ [possibleFilter[index]]: ["close"] }])
    }

    for (var index in this.initialState['OpenFilters']) {
      this.functionService.addFilter(this, [{ [this.initialState['OpenFilters'][index]]: ["open"] }])
    }

    this.functionService.removeState(this, ["All"])
    this.functionService.addState(this, this.initialState['States'])

    this.functionService.removeDate(this, ["All"])
    this.functionService.changeDateSetting(this, this.initialState['DateSettings'])
    this.functionService.addDate(this, this.initialState['Dates'])

    this.functionService.changeFilter(this, this.initialState["Filters"])

    this.functionService.changeAggregate(this, this.initialState["Aggregate"])

    this.functionService.changeStatesSelect(this, this.initialState["GroupBy"])

    this.functionService.changeCumulative(this, this.initialState["Cumulative"])

    this.resetProzess = false;

    for (var i = 0; i < this.actionSequence.length; i++) {
      await this.functionService.processAction(this, this.actionSequence[i])
    }
    this.addToSequence = true;

    this.update()

  }

  addElementtoITL(action, target) {

    if (this.addToSequence) {
      var that = this
      $("div[id^='RecommenderTemplate']").each(function (i, el) {
        if(this["style"]["display"] != "none"){
          this["style"]["display"] = "none"
          that.communicateToBot("I set the default action for the ambiguity")
        }
        
      });
      

      var returnValues = this.drillDownService.processUserInput(this, action, target, this.actionSequence)

      this.actionSequence = returnValues[1];

      

      this.getFeedbackFromBot(this.actionSequence[this.actionSequence.length - 1])

      for (var i = 0; i < returnValues[0].length; i++) {
        document.getElementById("NoAction")["style"]["display"] = "none";

        var clone;

        clone = document.getElementById('ActionTemplate' + returnValues[0][i]['id'])

        if (clone == null) {
          clone = document.getElementById('ActionTemplate').cloneNode(true);
          clone.lastChild.parentElement.id = "ActionTemplate" + returnValues[0][i]['id'];
          clone.lastChild.parentElement.style["display"] = "block";
          clone.childNodes[1].onclick = this.closeITLElement.bind(this);
        }
        clone.childNodes[0].innerHTML = returnValues[0][i]['text']
        document.getElementById('itl-pane').appendChild(clone);

        if (document.getElementsByClassName("metricSwitch").length > 0) {
          document.getElementsByClassName("metricSwitch")[document.getElementsByClassName("metricSwitch").length - 1].addEventListener("change", this.changedMetricAction.bind(this));
        }
        if (document.getElementsByClassName("legendSwitch").length > 0) {
          document.getElementsByClassName("legendSwitch")[document.getElementsByClassName("legendSwitch").length - 1].addEventListener("change", this.changedLegendAction.bind(this));
        }
        if (document.getElementsByClassName("stateSwitch").length > 0) {
          document.getElementsByClassName("stateSwitch")[document.getElementsByClassName("stateSwitch").length - 1].addEventListener("change", this.changedStateAction.bind(this));
        }
        if (document.getElementsByClassName("stateSwitchAll").length > 0) {
          document.getElementsByClassName("stateSwitchAll")[document.getElementsByClassName("stateSwitchAll").length - 1].addEventListener("change", this.changedStateActionAll.bind(this));
        }
        if (document.getElementsByClassName("filterSwitch").length > 0) {
          document.getElementsByClassName("filterSwitch")[document.getElementsByClassName("filterSwitch").length - 1].addEventListener("change", this.changedFilterAction.bind(this));
        }
        if (document.getElementsByClassName("dateSwitch").length > 0) {
          document.getElementsByClassName("dateSwitch")[document.getElementsByClassName("dateSwitch").length - 1].addEventListener("change", this.changedDateAction.bind(this));
        }
        if (document.getElementsByClassName("dateSwitchAll").length > 0) {
          document.getElementsByClassName("dateSwitchAll")[document.getElementsByClassName("dateSwitchAll").length - 1].addEventListener("change", this.changedDateActionAll.bind(this));
        }




      }
      

      for (var index in returnValues[2]) {


        this.recommendationList.push(returnValues[2][index])
        this.communicateToBot(returnValues[2][index]['reason'])

        if (this.treatment == "2") {
          this.sendRecommendation(returnValues[2][index]['id'], returnValues[2][index]['text'])
        }

        if (this.treatment == "0" || this.treatment == "1") {
          var RecClone;

          document.getElementById('ActionTemplate' + returnValues[2][index]['id'])["children"][0]["children"][0]["disabled"] = true

          RecClone = document.getElementById('RecommenderTemplate' + returnValues[2][index]['id'])

          if (RecClone == null) {
            RecClone = document.getElementById('RecommenderTemplate').cloneNode(true);
            RecClone.lastChild.parentElement.id = "RecommenderTemplate" + returnValues[2][index]['id'];
          }
          RecClone.lastChild.parentElement.style["display"] = "block";
          RecClone.childNodes[1].childNodes[0].onclick = this.closeRecommendationItem.bind(this);
          //RecClone.childNodes[1].childNodes[2].onclick = this.closeRecommendationItem.bind(this);

          RecClone.childNodes[0].innerHTML = returnValues[2][index]['text']
          document.getElementById('itl-pane').appendChild(RecClone);
        }

        /*for(var elementIndex in document.getElementsByName("recommendation")){
          var item = document.getElementsByName("recommendation")[elementIndex]
          if(item["value"] == "original"){
            item["checked"] = true
          }
        }*/
        console.log(document.getElementsByName("recommendation"))


      }

      //document.getElementById('itl').appendChild(clone);
    }
  }

  endTrainingMode(sendActivity) {

    if (sendActivity == "false" || this.shortcut || this.simpleService.checkUnused(this, this.unusedEntities)) {

      this.trainingMode = false;
      this.addToSequence = false;

      this.actionSequence = this.initialStateSequence.concat(this.actionSequence)

      if (sendActivity == "true") {
        this.directLine
          .postActivity({
            from: { id: "USER_ID", name: "USER_NAME" },
            name: "endTrainingMode",
            type: "event",
            value: {
              'sequence': this.actionSequence,
              'initialState': this.initialState
            }
          })
          .subscribe(
            id => {
              if (sessionStorage.getItem('conversationID') == null) {
                sessionStorage.setItem('conversationID', this.directLine.conversationId);
              };
            },
            error => console.log(`Error posting activity ${error}`)
          );
      }
      else if (sendActivity == "false") {
        this.directLine
          .postActivity({
            from: { id: "USER_ID", name: "USER_NAME" },
            name: "cancelTrainingMode",
            type: "event",
          })
          .subscribe(
            id => {
              if (sessionStorage.getItem('conversationID') == null) {
                sessionStorage.setItem('conversationID', this.directLine.conversationId);
              };
            },
            error => console.log(`Error posting activity ${error}`)
          );
      }

      if(this.actionSequence.length == 0){
        document.getElementById("NoAction")["style"]["display"] = "inline-block";
      }

      this.actionSequence = [];
      this.initialState = null;
      this.recommendationList = [];
      this.initialStateSequence = []




      document.getElementById("trainUtterance").innerHTML = "";

      for (var i = document.getElementById("itl-pane").childNodes.length - 1; 0 <= i; i--) {
        var element = document.getElementById("itl-pane").childNodes[i];
        if(element["id"] != "NoAction"){
          element.parentNode.removeChild(element);
        }
        
      }
    }
    else {
      this.shortcut = true;

      var returnValues = this.checkUpService.processInitialState(this, this.initialState, this.unusedEntities, this.initialStateSequence)

      this.initialStateSequence = returnValues[1];

      if(returnValues[0].length > 0){
        document.getElementById("NoAction")["style"]["display"] = "none";
        this.communicateToBot("I have made some suggestions based on the initial state of the tool to adress parts of your command that you have not yet used.")
      }

      for (var i = 0 ; i < returnValues[0].length; i++) {
        

        var clone;

        clone = document.getElementById('InitialStateTemplate' + returnValues[0][i]['id'])

        if (clone == null) {
          clone = document.getElementById('InitialStateTemplate').cloneNode(true);
          clone.lastChild.parentElement.id = "InitialStateTemplate" + returnValues[0][i]['id'];
          clone.lastChild.parentElement.style["display"] = "block";
          //clone.childNodes[1].onclick = this.closeITLElement.bind(this);
        }
        clone.childNodes[0].innerHTML = returnValues[0][i]['text']
        document.getElementById('itl-pane').append(clone);

        if (document.getElementsByClassName("metricSwitch").length > 0) {
          document.getElementsByClassName("metricSwitch")[document.getElementsByClassName("metricSwitch").length - 1].addEventListener("change", this.changedMetricAction.bind(this));
        }
        if (document.getElementsByClassName("legendSwitch").length > 0) {
          document.getElementsByClassName("legendSwitch")[document.getElementsByClassName("legendSwitch").length - 1].addEventListener("change", this.changedLegendAction.bind(this));
        }
        if (document.getElementsByClassName("stateSwitch").length > 0) {
          document.getElementsByClassName("stateSwitch")[document.getElementsByClassName("stateSwitch").length - 1].addEventListener("change", this.changedStateAction.bind(this));
        }
        if (document.getElementsByClassName("stateSwitchAll").length > 0) {
          document.getElementsByClassName("stateSwitchAll")[document.getElementsByClassName("stateSwitchAll").length - 1].addEventListener("change", this.changedStateActionAll.bind(this));
        }
        if (document.getElementsByClassName("filterSwitch").length > 0) {
          document.getElementsByClassName("filterSwitch")[document.getElementsByClassName("filterSwitch").length - 1].addEventListener("change", this.changedFilterAction.bind(this));
        }
        if (document.getElementsByClassName("dateSwitch").length > 0) {
          document.getElementsByClassName("dateSwitch")[document.getElementsByClassName("dateSwitch").length - 1].addEventListener("change", this.changedDateAction.bind(this));
        }
      }

      this.simpleService.feedbackUnused(this, this.unusedEntities)
    }
  }
}


