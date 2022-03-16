import { Component, OnInit, OnDestroy, ElementRef, AfterViewInit, AfterContentInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ViewChild } from '@angular/core';
import { UnitedStatesMapComponent } from '../unitedstates-map/unitedstates-map.component';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DrillDownService } from "../shared/drilldown.services";
import { FunctionService } from "../shared/function.services";
import { SimpleService } from "../shared/simple.services";
import { CheckUpService } from '../shared/checkup.services';

import {
  formatDate
} from '@angular/common';
import { Console } from 'console';
import { line } from 'd3';
import { typeWithParameters } from '@angular/compiler/src/render3/util';

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
  @ViewChild("botWindow", { static: true }) botWindowElement: ElementRef;

  private _routerSub = Subscription.EMPTY;
  refreshInterval;
  nextInterval;
  public virtual: any = {
    itemHeight: 28,
  };

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
  public noSpeechInteraction = true;

  //Relevant for Training Mode
  public initialState;
  public currentState;
  public alreadyProposed;
  public initialUnusedEntities;
  public unusedEntities;
  public trainableEntites: any;
  public stateList;
  public metricList;
  public actionSequence = [];
  public recommendationList = [];
  public actionMessageMapping = [];
  public initialStateSequence = [];
  public trainingMode = false;// false
  public addToSequence = false; //false
  public resetProzess = false;
  public shortcut = true;
  public initialUtterance = "";
  public sendStatus = true;
  public activeRecommendationProcess = false;
  public sendStatusLater = false;
  public initialCommand = "";
  public allUsed = false;
  public continueDemonstration = false;
  public continuationSent = false;

  public ambiguityPosition = { x: null, y: null };
  public timeLeft = 0;
  public followTimeLeft = 0;
  public showLine = false;
  public giveHover = false;
  public lineSpecification = "";

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
  public statesSelect = this.scaleButtons; //[];


  public possibleDatesDay = ["2021-06-30", "2021-06-29", "2021-06-28", "2021-06-27", "2021-06-26", "2021-06-25", "2021-06-24", "2021-06-23", "2021-06-22", "2021-06-21", "2021-06-20", "2021-06-19", "2021-06-18", "2021-06-17", "2021-06-16", "2021-06-15", "2021-06-14", "2021-06-13", "2021-06-12", "2021-06-11", "2021-06-10", "2021-06-09", "2021-06-08", "2021-06-07", "2021-06-06", "2021-06-05", "2021-06-04", "2021-06-03", "2021-06-02", "2021-06-01", "2021-05-31", "2021-05-30", "2021-05-29", "2021-05-28", "2021-05-27", "2021-05-26", "2021-05-25", "2021-05-24", "2021-05-23", "2021-05-22", "2021-05-21", "2021-05-20", "2021-05-19", "2021-05-18", "2021-05-17", "2021-05-16", "2021-05-15", "2021-05-14", "2021-05-13", "2021-05-12", "2021-05-11", "2021-05-10", "2021-05-09", "2021-05-08", "2021-05-07", "2021-05-06", "2021-05-05", "2021-05-04", "2021-05-03", "2021-05-02", "2021-05-01", "2021-04-30", "2021-04-29", "2021-04-28", "2021-04-27", "2021-04-26", "2021-04-25", "2021-04-24", "2021-04-23", "2021-04-22", "2021-04-21", "2021-04-20", "2021-04-19", "2021-04-18", "2021-04-17", "2021-04-16", "2021-04-15", "2021-04-14", "2021-04-13", "2021-04-12", "2021-04-11", "2021-04-10", "2021-04-09", "2021-04-08", "2021-04-07", "2021-04-06", "2021-04-05", "2021-04-04", "2021-04-03", "2021-04-02", "2021-04-01", "2021-03-31", "2021-03-30", "2021-03-29", "2021-03-28", "2021-03-28", "2021-03-27", "2021-03-26", "2021-03-25", "2021-03-24", "2021-03-23", "2021-03-22", "2021-03-21", "2021-03-20", "2021-03-19", "2021-03-18", "2021-03-17", "2021-03-16", "2021-03-15", "2021-03-14", "2021-03-13", "2021-03-12", "2021-03-11", "2021-03-10", "2021-03-09", "2021-03-08", "2021-03-07", "2021-03-06", "2021-03-05", "2021-03-04", "2021-03-03", "2021-03-02", "2021-03-01", "2021-02-28", "2021-02-27", "2021-02-26", "2021-02-25", "2021-02-24", "2021-02-23", "2021-02-22", "2021-02-21", "2021-02-20", "2021-02-19", "2021-02-18", "2021-02-17", "2021-02-16", "2021-02-15", "2021-02-14", "2021-02-13", "2021-02-12", "2021-02-11", "2021-02-10", "2021-02-09", "2021-02-08", "2021-02-07", "2021-02-06", "2021-02-05", "2021-02-04", "2021-02-03", "2021-02-02", "2021-02-01", "2021-01-31", "2021-01-30", "2021-01-29", "2021-01-28", "2021-01-27", "2021-01-26", "2021-01-25", "2021-01-24", "2021-01-23", "2021-01-22", "2021-01-21", "2021-01-20", "2021-01-19", "2021-01-18", "2021-01-17", "2021-01-16", "2021-01-15", "2021-01-14", "2021-01-13", "2021-01-12", "2021-01-11", "2021-01-10", "2021-01-09", "2021-01-08", "2021-01-07", "2021-01-06", "2021-01-05", "2021-01-04", "2021-01-03", "2021-01-02", "2021-01-01", "2020-12-31", "2020-12-30", "2020-12-29", "2020-12-28", "2020-12-27", "2020-12-26", "2020-12-25", "2020-12-24", "2020-12-23", "2020-12-22", "2020-12-21", "2020-12-20", "2020-12-19", "2020-12-18", "2020-12-17", "2020-12-16", "2020-12-15", "2020-12-14", "2020-12-13", "2020-12-12", "2020-12-11", "2020-12-10", "2020-12-09", "2020-12-08", "2020-12-07", "2020-12-06", "2020-12-05", "2020-12-04", "2020-12-03", "2020-12-02", "2020-12-01", "2020-11-30", "2020-11-29", "2020-11-28", "2020-11-27", "2020-11-26", "2020-11-25", "2020-11-24", "2020-11-23", "2020-11-22", "2020-11-21", "2020-11-20", "2020-11-19", "2020-11-18", "2020-11-17", "2020-11-16", "2020-11-15", "2020-11-14", "2020-11-13", "2020-11-12", "2020-11-11", "2020-11-10", "2020-11-09", "2020-11-08", "2020-11-07", "2020-11-06", "2020-11-05", "2020-11-04", "2020-11-03", "2020-11-02", "2020-11-01", "2020-10-31", "2020-10-30", "2020-10-29", "2020-10-28", "2020-10-27", "2020-10-26", "2020-10-24", "2020-10-23", "2020-10-22", "2020-10-21", "2020-10-20", "2020-10-19", "2020-10-18", "2020-10-17", "2020-10-16", "2020-10-15", "2020-10-14", "2020-10-13", "2020-10-12", "2020-10-11", "2020-10-10", "2020-10-09", "2020-10-08", "2020-10-07", "2020-10-06", "2020-10-05", "2020-10-04", "2020-10-03", "2020-10-02", "2020-10-01", "2020-09-30", "2020-09-29", "2020-09-28", "2020-09-27", "2020-09-26", "2020-09-25", "2020-09-24", "2020-09-23", "2020-09-22", "2020-09-21", "2020-09-20", "2020-09-19", "2020-09-18", "2020-09-17", "2020-09-16", "2020-09-15", "2020-09-14", "2020-09-13", "2020-09-12", "2020-09-11", "2020-09-10", "2020-09-09", "2020-09-08", "2020-09-07", "2020-09-06", "2020-09-05", "2020-09-04", "2020-09-03", "2020-09-02", "2020-09-01", "2020-08-31", "2020-08-30", "2020-08-29", "2020-08-28", "2020-08-27", "2020-08-26", "2020-08-25", "2020-08-24", "2020-08-23", "2020-08-22", "2020-08-21", "2020-08-20", "2020-08-19", "2020-08-18", "2020-08-17", "2020-08-16", "2020-08-15", "2020-08-14", "2020-08-13", "2020-08-12", "2020-08-11", "2020-08-10", "2020-08-09", "2020-08-08", "2020-08-07", "2020-08-06", "2020-08-05", "2020-08-04", "2020-08-03", "2020-08-02", "2020-08-01", "2020-07-31", "2020-07-30", "2020-07-29", "2020-07-28", "2020-07-27", "2020-07-26", "2020-07-25", "2020-07-24", "2020-07-23", "2020-07-22", "2020-07-21", "2020-07-20", "2020-07-19", "2020-07-18", "2020-07-17", "2020-07-16", "2020-07-15", "2020-07-14", "2020-07-13", "2020-07-12", "2020-07-11", "2020-07-10", "2020-07-09", "2020-07-08", "2020-07-07", "2020-07-06", "2020-07-05", "2020-07-04", "2020-07-03", "2020-07-02", "2020-07-01", "2020-06-30", "2020-06-29", "2020-06-28", "2020-06-27", "2020-06-26", "2020-06-25", "2020-06-24", "2020-06-23", "2020-06-22", "2020-06-21", "2020-06-20", "2020-06-19", "2020-06-18", "2020-06-17", "2020-06-16", "2020-06-15", "2020-06-14", "2020-06-13", "2020-06-12", "2020-06-11", "2020-06-10", "2020-06-09", "2020-06-08", "2020-06-07", "2020-06-06", "2020-06-05", "2020-06-04", "2020-06-03", "2020-06-02", "2020-06-01", "2020-05-31", "2020-05-30", "2020-05-29", "2020-05-28", "2020-05-27", "2020-05-26", "2020-05-25", "2020-05-24", "2020-05-23", "2020-05-22", "2020-05-21", "2020-05-20", "2020-05-19", "2020-05-18", "2020-05-17", "2020-05-16", "2020-05-15", "2020-05-14", "2020-05-13", "2020-05-12", "2020-05-11", "2020-05-10", "2020-05-09", "2020-05-08", "2020-05-07", "2020-05-06", "2020-05-05", "2020-05-04", "2020-05-03", "2020-05-02", "2020-05-01", "2020-04-30", "2020-04-29", "2020-04-28", "2020-04-27", "2020-04-26", "2020-04-25", "2020-04-24", "2020-04-23", "2020-04-22", "2020-04-21", "2020-04-20", "2020-04-19", "2020-04-18", "2020-04-17", "2020-04-16", "2020-04-15", "2020-04-14", "2020-04-13", "2020-04-12", "2020-04-11", "2020-04-10", "2020-04-09", "2020-04-08", "2020-04-07", "2020-04-06", "2020-04-05", "2020-04-04", "2020-04-03", "2020-04-02", "2020-04-01", "2020-03-31", "2020-03-30", "2020-03-29", "2020-03-29", "2020-03-28", "2020-03-27", "2020-03-26", "2020-03-25", "2020-03-24", "2020-03-23", "2020-03-22", "2020-03-21", "2020-03-20", "2020-03-19", "2020-03-18", "2020-03-17", "2020-03-16", "2020-03-15", "2020-03-14", "2020-03-13", "2020-03-12", "2020-03-11", "2020-03-10", "2020-03-09", "2020-03-08", "2020-03-07", "2020-03-06", "2020-03-05", "2020-03-04", "2020-03-03", "2020-03-02", "2020-03-01", "2020-02-29", "2020-02-28", "2020-02-27", "2020-02-26", "2020-02-25", "2020-02-24", "2020-02-23", "2020-02-22", "2020-02-21", "2020-02-20", "2020-02-19", "2020-02-18", "2020-02-17", "2020-02-16", "2020-02-15", "2020-02-14", "2020-02-13", "2020-02-12", "2020-02-11", "2020-02-10", "2020-02-09", "2020-02-08", "2020-02-07", "2020-02-06", "2020-02-05", "2020-02-04", "2020-02-03", "2020-02-02", "2020-02-01", "2020-01-31", "2020-01-30", "2020-01-29", "2020-01-28", "2020-01-27", "2020-01-26", "2020-01-25", "2020-01-24", "2020-01-23", "2020-01-22", "2020-01-21", "2020-01-20", "2020-01-19", "2020-01-18", "2020-01-17", "2020-01-16", "2020-01-15", "2020-01-14", "2020-01-13", "2020-01-12", "2020-01-11", "2020-01-10", "2020-01-09", "2020-01-08", "2020-01-07", "2020-01-06", "2020-01-05", "2020-01-04", "2020-01-03", "2020-01-02", "2020-01-01"]
  public possibleDatesMonth = ['2021-06', '2021-05', '2021-04', '2021-03', '2021-02', '2021-01', '2020-12', '2020-11', '2020-10', '2020-09', '2020-08', '2020-07', '2020-06', '2020-05', '2020-04', '2020-03', '2020-02', '2020-01'];
  public possibleDatesYear = ["2021", "2020"]
  public dates = this.possibleDatesDay;
  public datesSelect = ["2021-06-30"];
  public datesSelectDropDown = ["2021-06-30"];


  public legendLabel = "x-Axis"
  public metricLabel = "y-Axis"

  /* Filter */
  public minSlider = { Date: new Date(this.dateMin).getTime(), Tests: 0, Cases: 0, Deaths: 0, Population: 0, PartialVaccinated: 0, FullyVaccinated: 0 }
  public maxSlider = { Date: new Date(this.dateMax).getTime(), Tests: 0, Cases: 0, Deaths: 0, Population: 0, PartialVaccinated: 0, FullyVaccinated: 0 } //.setHours(23, 59, 59, 999)
  public filterValue = { Date: [new Date(this.dateMin).getTime(), new Date(this.dateMax).getTime()], Tests: [0, false], Cases: [0, false], Deaths: [0, false], Population: [0, false], PartialVaccinated: [0, false], FullyVaccinated: [0, false] };
  public updateVisualization = false;
  public fieldToColor = { "Visualizations": "#1F8FFF", "Legend": "#FF7738", "DataFields": "#00FFE6", "Filter": "#877AFF", "Configuration": "#000000" };

  public lineColor = { "legend": "#FF7738", "y_Axis": "#00FFE6", "States": "#877AFF", "Dates": "#877AFF", "NumFilter": "#877AFF" };



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

    if (this.task == "1") {
      this.functionService.addLegend(this, "State");
    }

    if (this.task == "2") {
      this.functionService.removeState(this, ["All"])
      this.functionService.addState(this, ["California", "Florida", "Delaware"])
    }
    if (this.task == "3") {
      this.functionService.removeState(this, ["All"])
      this.functionService.removeDate(this, ["All"])
      this.functionService.addMetric(this, ["Cases"]);
    }
    if (this.task == "4") {
      this.functionService.addLegend(this, "Date");
      this.functionService.addDate(this, ["All"])
      this.functionService.changeVisualization(this, "scatter")
      this.functionService.addMetric(this, ["PartialVaccinated", "FullyVaccinated"]);
      this.functionService.removeState(this, ["All"])
      this.functionService.addState(this, ["California", "Florida", "Delaware"])
      this.functionService.addDate(this, ["2020-12-31", "2021-03-31", "2021-06-30"])

    }
    this.update()


    this.directLine = window.WebChat.createDirectLine({
      secret: "I9zWGr48ptY.a56vpsiJsI-8omBWyUGKSSNoEkrotfvYVxFWLCWVgDc",
      webSocket: false
    });

    console.log(this.directLine)


    /*
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
*/


    this.store = window.WebChat.createStore(
      {},
      ({ dispatch }) => next => action => {
        if (action.type === 'DIRECT_LINE/POST_ACTIVITY') {
          //connect outgoing event handler and hand over reported data
          const event = new Event('webchatoutgoingactivity');
          action.payload.activity.channelData = { Visualizations: this.unitedStatesMap.chartType, Legend: this.unitedStatesMap.legend_Values ? this.unitedStatesMap.legend_Values : null, DataFields: this.unitedStatesMap.y_Axis_Values, Task: this.task, Treatment: this.treatment, UserID: this.userID };
          var find = '([0-9]),([0-9])';
          var re = new RegExp(find, 'g');
          action.payload.activity.text = String(action.payload.activity.text).replace(re, '$1$2');
          (<any>event).data = action.payload.activity;
          window.dispatchEvent(event);
        }
        else if (action.type === 'DIRECT_LINE/INCOMING_ACTIVITY') {
          const event = new Event('webchatincomingactivity');
          (<any>event).data = action.payload.activity;
          if((<any>event).data["type"] == "message" ){
            (<any>event).data["timestamp"] = ""
          }
          window.dispatchEvent(event);

          if((<any>event).data["type"] != "message" || (<any>event).data["text"] != "Processing..."){
            $("li[class$='from-bot']").each(function (i, el) {
              if (this["innerText"].indexOf("Bot said:Processing") !== -1) {
                this["style"]["display"] = "none";
              }
            });
          }

        }
        return next(action);
      });



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
          bubbleFromUserBorderWidth: 0,
          bubbleFromUserBorderColor: 'black',
          sendBoxButtonColor: 'rgba(255,153, 0, 1)',
          sendBoxButtonColorOnFocus: 'rgba(255,153, 0, 1)',
          sendBoxButtonColorOnHover: 'rgba(255,153, 0, 1)',
          sendBoxHeight: 30,
          bubbleMinHeight: 0,
          bubbleMaxWidth: 450,
          paddingRegular: 5,
          suggestedActionHeight: 30
        },
        //webSpeechPonyfillFactory: await createHybridPonyfillFactory(),
        locale: 'en-US',
        store: this.store,
        overrideLocalizedStrings: {
          TEXT_INPUT_PLACEHOLDER: 'Please type the command you want to perform...'//'Click on the microphone and speak OR type ...'
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
            this.drillDownService.post("Welcome", this.directLine.conversationId, this, this.userID, this.task, this.treatment, 0, this.trainingMode)
          };
        },
        error => console.log(`Error posting activity ${error}`)
      );

  }


  ngOnDestroy() {
    this.currentTime = new Date(8640000000000000);
    this.directLine = null;
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
    if (this.nextInterval) {
      clearInterval(this.nextInterval);
    }
    window.removeEventListener('webchatincomingactivity', this.webChatHandler.bind(this));
    window.removeEventListener("message", this.messageHandler.bind(this), false);
    this.store = null;
  }

  initialize() {

    if (this.nextInterval) {
      clearInterval(this.nextInterval);
    }
    this.nextInterval = setInterval(() => {

      if (this.trainingMode && this.allUsed && !this.continueDemonstration) {
        this.directLine
          .postActivity({
            from: { id: "USER_ID", name: "USER_NAME" },
            name: "AllUsed",
            type: "event",
          })
          .subscribe(
            id => {
            },
            error => console.log(`Error posting activity ${error}`)
          );

        this.checkForSolving()
      }

    }, 3000)



    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
    this.refreshInterval = setInterval(() => {

      this.unitedStatesMap.updateMap("update")

      if (this.timeLeft > 0) {
        this.timeLeft -= 1
      }
      else if (!this.showLine && !this.giveHover && this.treatment == "1") {
        $('#line1').css("display", "none")
        $('#line2').css("display", "none")
        $('#rect').css("display", "none")

      }
      try {
        var text = $("li[class$='from-bot']").last()[0]["innerText"]
        var that = this;
        if ((text.startsWith("Bot said:Did you mean") || text.startsWith("Bot said:If there were") || text.startsWith("Bot said:Do you also")) && this.timeLeft == 0  && this.treatment == "1") {
          $("li[class$='from-bot']").last()[0].addEventListener("mouseover", function (e) {

            if (that.trainingMode && that.giveHover && that.treatment == "1") {
              that.drillDownService.post("HoverRecommendation", text, that, that.userID, that.task, that.treatment, 0, that.trainingMode)

              $('#line1')
                .attr('y2', (e.clientY));

              $('#line1').css("display", "block")
              $('#line2')
                .attr('y1', (e.clientY))
                .attr('y2', (e.clientY));



              $('#line2').css("display", "block")

              $('#rect')
                .attr('y', (e.clientY - 5));

              $('#rect').css("display", "block")

              that.showLine = true
            }

          })
          $("li[class$='from-bot']").last()[0].addEventListener("mouseout", function (e) {
            $('#line1').css("display", "none")
            $('#line2').css("display", "none")
            $('#rect').css("display", "none")


            that.showLine = false;
          })
        }
        else if (text.startsWith("Bot said:Unfortunately, I did not understand how to perform")) {
          $("li[class$='from-bot']").last()[0].addEventListener("mouseover", function (e) {
            that.drillDownService.post("HoverUtterance", "", that, that.userID, that.task, that.treatment, 1, that.trainingMode)
            document.getElementById("trainUtterance")["style"]["box-shadow"] = "black 5px 5px 10px 0px"
          })

          $("li[class$='from-bot']").last()[0].addEventListener("mouseout", function (e) {
            document.getElementById("trainUtterance")["style"]["box-shadow"] = ""

          })
        }
      }
      catch (e) {
      }

      /*
      try{
        $('div.webchat__stacked-layout__status').remove()
      }
      catch(e){

      }
      */


      

      var that = this
      var number = 1
      /*$("li[class$='from-bot']").each(function (i, el) {
        if (this["innerText"].indexOf("Bot said:Processing") == -1) {
          var childrenText = this.childNodes[2].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[1].childNodes[1].childNodes[0].childNodes[0]
          if (childrenText["innerHTML"].indexOf(": ") == -1) {

            childrenText["innerHTML"] = number + ": " + childrenText["innerHTML"];
          }
          number += 1
        }
      });
/*
      $("div[class$='webchat__stacked-layout__status']").each(function (i, el) {
        //this["style"]["display"] = "none";
      });
      */


      if (this.trainingMode) {
        document.getElementById("itl-container").style.display = 'flex';
        document.getElementById("Partitioning").style.height = '0%';
      }
      else {
        document.getElementById("itl-container").style.display = 'none';
        document.getElementById("Partitioning").style.height = '50%';
      }

      document.querySelector('#Date-Select > div').setAttribute('style', 'padding: 0px');
      document.querySelector('#State-Select > div').setAttribute('style', 'padding: 0px');

      $("input[id^='k']").css("cursor", "pointer")

      $("input[id^='k']").css("background-color", "#f0f0f0")
      $("input[id^='k']").css("border-radius", "12px")
      $("input[id^='k']").css("text-align", "center")
      

      if (this.statesSelect.length > 0) {
        $("input[id^='k']")[1]["placeholder"] = "  +"  
      }
      if (this.datesSelectDropDown.length > 0) {
        $("input[id^='k']")[0]["placeholder"] = "  +"
      }
      

      var requiredVisPar = ""

      if (this.unitedStatesMap.legend_Values != "State" && this.unitedStatesMap.legend_Values != "Date") {
        requiredVisPar = requiredVisPar + "<li>" + this.legendLabel + "</li>"
      }

      if (this.unitedStatesMap.chartType == "Map" && this.unitedStatesMap.legend_Values != "State") {
        this.functionService.addLegend(this, "State")
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
        requiredVisPar = requiredVisPar + "<li>" + this.metricLabel + "</li>"
        document.getElementById("cumulateText").innerHTML = " &nbsp; Tests, Cases, Deaths, ..."
      }

      if (this.unitedStatesMap.datesSelect.length == 0) {
        requiredVisPar = requiredVisPar + "<li> at least one Date </li>"
      }

      if (this.unitedStatesMap.statesSelect.length == 0) {
        requiredVisPar = requiredVisPar + "<li> at least one State </li>"
      }


      if (requiredVisPar != "") {
        document.getElementById("requiredVisPar").innerHTML = "<b>Please specify: </b> <ul>" + requiredVisPar + "</ul>"

        if (document.getElementById("loading")["style"]["display"] == "none") {
          document.getElementById("requiredVisPar")["style"]["display"] = "block";
        }
      }
      else {
        document.getElementById("requiredVisPar").innerHTML = "";
        document.getElementById("requiredVisPar")["style"]["display"] = "none";
      }






    }, 1000);

  }

  public ngAfterViewInit(): void {

    window.addEventListener('webchatincomingactivity', this.webChatHandler.bind(this));
    window.addEventListener("message", this.messageHandler.bind(this), false);

    document.getElementById("StatesSelect").addEventListener("change", this.changedStatesSelectMouse.bind(this));
    document.getElementById("Cumulative").addEventListener("change", this.changedCumulativeMouse.bind(this));

    document.getElementById("interactionBlocker").addEventListener("click", this.showBlockerMessage.bind(this));

    //window.addEventListener('resize', this.update.bind(this));

  }

  public ngAfterContentInit() {
    this.initialize();
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

        document.getElementById(key + "-From")["value"] = this.filterValue[key][0].toLocaleString( "en-US" )
        document.getElementById(key + "-To")["value"] = this.filterValue[key][1].toLocaleString( "en-US" )
      }
    }
    this.unitedStatesMap.filterValue = this.filterValue
  }


  toggleChanged(data) {

    for (var key in data) {
      if (key == "Cumulative") {
        this.drillDownService.post("HoverUtterance", "", this, this.userID, this.task, this.treatment, 0, this.trainingMode)
        this.functionService.changeCumulative(this, data["Cumulative"])
      }
    }

    this.update();

  }


  closeFilter(event) {
    var path = event.path || (event.composedPath && event.composedPath());
    if (path[4]["className"] == "col") {

      var data = path[4]["id"].split("_")[0]
      var second = path[4]["id"].split("_")[1]

      this.drillDownService.post("CloseFilter", { [data]: ["close"] }, this, this.userID, this.task, this.treatment, 0, this.trainingMode)
      this.functionService.removeFilter(this, [{ [data]: ["close"] }])
      this.update();
    }
  }

  resetFilter(event, target) {

    var path = event.path || (event.composedPath && event.composedPath());
    if (path[4]["className"] == "col") {

      var data = path[4]["id"].split("_")[0]

      if (data == "State") {
        if (target == "All") {
          this.drillDownService.post("AllStates", "", this, this.userID, this.task, this.treatment, 0, this.trainingMode)
          this.functionService.addState(this, ["All"])
        }
        else if (target == "None") {
          this.drillDownService.post("NoStates", "", this, this.userID, this.task, this.treatment, 0, this.trainingMode)
          this.functionService.removeState(this, ["All"])
        }

      }
      else if (data == "Date") {
        if (target == "All") {
          this.drillDownService.post("AllDates", "", this, this.userID, this.task, this.treatment, 0, this.trainingMode)
          this.functionService.addDate(this, ["All"])
        }
        else if (target == "None") {
          this.drillDownService.post("NoDates", "", this, this.userID, this.task, this.treatment, 0, this.trainingMode)
          this.functionService.removeDate(this, ["All"])
        }
      }
      else {
        var filters = [{ [data]: [0, "max"] }]

        document.getElementById(data + "-From")["value"] = 0
        document.getElementById(data + "-To")["value"] = this.maxSlider[data].toLocaleString( "en-US" )
        this.drillDownService.post("ResetFilter", filters, this, this.userID, this.task, this.treatment, 0, this.trainingMode)
        this.functionService.addFilter(this, filters)
      }



      this.update();



    }
  }


  public async webChatHandler(event) {
    var sheight = document.querySelectorAll("[class$=webchat__basic-transcript__scrollable]")[0].scrollHeight;
    document.querySelectorAll("[class$=webchat__basic-transcript__scrollable]")[0].scrollTo({ left: 0, top: sheight, behavior: 'auto' });
    this.noSpeechInteraction = false;
      console.log(<any>event)
      if ((<any>event).data.type == 'event') {
        if ((<any>event).data.name == "Generic") {
          var possibleFilter = ["Date", "State", "Tests", "Cases", "Deaths", "Population", "PartialVaccinated", "FullyVaccinated"]
          var activeFilters = []
          for (var filterIndex in possibleFilter) {
            if (document.getElementById(possibleFilter[filterIndex] + "_Filter")["className"] != "col closed") {
              activeFilters.push(possibleFilter[filterIndex])
            }
          }
          this.currentState = JSON.stringify({
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
          })
          this.sendInitialStateBack()
          this.animate = true;
          this.recommendationList = []
          this.actionMessageMapping = []

          try {
            await this.functionService.processAction(this, <any>event.data.value)
            this.update();
          }
          catch (e) {

          }
          this.checkForChanges()
          this.animate = false;
          setTimeout(element => { $('.draggable').removeClass("animate"); $('.col').removeClass("animate"); $('.highlight').removeClass("highlight"); }, 2000)
          this.checkForRecommendation();
        }
        if ((<any>event).data.name == "InitialCommands") {
          this.animate = true;
          this.initialCommand = "Initial"
          try {
            await this.functionService.processAction(this, <any>event.data.value)
            this.update();
          }
          catch (e) {

          }
          this.initialCommand = ""
          this.animate = false;
          setTimeout(element => { $('.draggable').removeClass("animate"); $('.col').removeClass("animate"); $('.highlight').removeClass("highlight"); }, 3500)
          this.checkForRecommendation();
        }
        else if ((<any>event).data.name == "Help") {
          this.drillDownService.post("Help", (<any>event).data.value, this, this.userID, this.task, this.treatment, 1, this.trainingMode)
          this.functionService.visualizeUnderstanding(this, (<any>event).data.value)
        }
        else if ((<any>event).data.name == "RebaseHelp") {
          this.drillDownService.post("RebaseHelp", (<any>event).data.value, this, this.userID, this.task, this.treatment, 1, this.trainingMode)
          this.functionService.visualizationHelper(this, (<any>event).data.value["eventValue"], (<any>event).data.value["command"])
        }
        else if ((<any>event).data.name == "Start Demonstration") {
          this.drillDownService.post("Start Demonstration", (<any>event).data.value, this, this.userID, this.task, this.treatment, 1, this.trainingMode)
          this.startDemonstration((<any>event).data.value);
        }
        else if ((<any>event).data.name == "ConfirmRecommendation") {
          this.drillDownService.post("ConfirmRecommendation", (<any>event).data.value, this, this.userID, this.task, this.treatment, 1, this.trainingMode)
          this.confirmRecommendation((<any>event).data.value)
        }
        else if ((<any>event).data.name == "Refuse") {
          this.drillDownService.post("Refuse", (<any>event).data.value, this, this.userID, this.task, this.treatment, 1, this.trainingMode)
          this.refuseRecommendation((<any>event).data.value)
        }
        else if ((<any>event).data.name == "RecommendSimpleAction") {
          if(this.treatment == "1"){
            this.drillDownService.post("RecommendSimpleAction", (<any>event).data.value, this, this.userID, this.task, this.treatment, 1, this.trainingMode)
            this.simpleService.analyzeEntities(this, (<any>event).data.value);
          }
          
        }
        else if ((<any>event).data.name == "Rebase") {
          this.drillDownService.post("Rebase", (<any>event).data.value, this, this.userID, this.task, this.treatment, 1, this.trainingMode)
          this.rebase(this, (<any>event).data.value);
        }
        else if ((<any>event).data.name == "Finish") {
          this.drillDownService.post("Finish", "", this, this.userID, this.task, this.treatment, 1, this.trainingMode)
          this.endTrainingMode('true');
        }
        else if ((<any>event).data.name == "Cancel") {
          this.drillDownService.post("Cancel", "", this, this.userID, this.task, this.treatment, 1, this.trainingMode)
          this.endTrainingMode('false');
        }
        else if ((<any>event).data.name == "Continue") {
          this.continueDemonstration = true;
          this.drillDownService.post("Continue", "", this, this.userID, this.task, this.treatment, 1, this.trainingMode)
          document.getElementById("trainingModeInter")["style"]["display"] = "none";
          document.getElementById("DemonstrationButtons")["style"]["display"] = "block";
          
        }
        else if ((<any>event).data.name == "WrongCommand") {
          this.drillDownService.post("WrongCommand", (<any>event).data.value, this, this.userID, this.task, this.treatment, 1, this.trainingMode)
          this.showBlockerMessage()
        }
        else if ((<any>event).data.name == "CheckIfContinue") {
          this.drillDownService.post("CheckIfContinue", "", this, this.userID, this.task, this.treatment, 1, this.trainingMode)
          this.continueDemonstration = true;
        }
        else if ((<any>event).data.name == "DemonstrationEnded") {
          this.drillDownService.post("DemonstrationEnded", (<any>event).data.value, this, this.userID, this.task, this.treatment, 1, this.trainingMode)
          this.finishTask((<any>event).data.value)
          parent.postMessage("DemonstrationFinished", "*")
        }



      }
      else if ((<any>event).data.type == 'message' && (<any>event).data.from.name != 'Conversational-ITL') {
        if ((<any>event).data.channelData.clientTimestamp != this.componentMessage) {
          this.componentMessage = (<any>event).data.channelData.clientTimestamp;

          this.drillDownService.post("NLInput", (<any>event).data.text, this, this.userID, this.task, this.treatment, 1, this.trainingMode)



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
      else if ((<any>event).data.type == 'message' && (<any>event).data.from.name == 'Conversational-ITL') {

      }
    
    this.noSpeechInteraction = true;

  }

  public messageHandler(event) {

    if ("https://iism-im-survey.iism.kit.edu" != event.origin)
      return;
    const { action, value } = event.data
    if ((this.router.url.includes("unitedstates") || this.router.url == "/") && (action == 'end') && (new Date() >= this.currentTime)) {
      //this.drillDownService.post(this.userID, this.task, this.treatment, "Task Ended", value, { site: "UnitedStates", date: this.unitedStatesMap.date, statesSelected: this.unitedStatesMap.statesSelect }, 0);
    }
    else if ((this.router.url.includes("unitedstates") || this.router.url == "/") && (action == 'start') && (sessionStorage.getItem('taskNr') != value) && (new Date() >= this.currentTime)) {
      this.reload(value)
    }
  }

  reload(value) {
    //this.drillDownService.post(this.userID, this.task, this.treatment, "Task Started", value, { site: "UnitedStates", date: this.unitedStatesMap.date, statesSelected: this.unitedStatesMap.statesSelect }, 0);
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
    var path = ev.path || (ev.composedPath && ev.composedPath());
    if (ev.target["className"].includes("interactiveField")) {
      if (data != "Date" && data != "State" && ev.target["id"] == "legend") {
        this.communicateToBot(String(data) + " can not be entered as a Legend.");
        this.drillDownService.post("WrongAction", String(data) + " can not be entered as a Legend.", this, this.userID, this.task, this.treatment, 0, this.trainingMode)

      }
      else if ((data == "Date" || data == "State") && ev.target["id"] == "y_Axis") {
        this.communicateToBot(String(data) + " can not be entered as a Metric.");
        this.drillDownService.post("WrongAction", String(data) + " can not be entered as a Metric.", this, this.userID, this.task, this.treatment, 0, this.trainingMode)
      }
      else if (ev.target["id"] == "data_Field") {
        if (data == "State" || data == "Date") {
          this.drillDownService.post("RemoveLegend", data, this, this.userID, this.task, this.treatment, 0, this.trainingMode)
          this.functionService.removeLegend(this, data);
        }
        else {
          this.drillDownService.post("RemoveMetric", [data], this, this.userID, this.task, this.treatment, 0, this.trainingMode)
          this.functionService.removeMetric(this, [data])
        }
        this.update();
      }

      else {
        if (ev.target["id"] == "legend") {
          this.drillDownService.post("AddLegend", data, this, this.userID, this.task, this.treatment, 0, this.trainingMode)
          this.functionService.addLegend(this, data);
        }
        else if (ev.target["id"] == "y_Axis") {
          this.drillDownService.post("AddMetric", [data], this, this.userID, this.task, this.treatment, 0, this.trainingMode)
          this.functionService.addMetric(this, [data]);

        }

        this.update();
      }
    }
    else if (ev.target["className"] == "filter-container" || ev.target["className"] == "filterContent" || ev.target["className"] == "filterTitle" || path[1]["className"] == "filter-container") {
      this.drillDownService.post("AddFilter", { [data]: ["open"] }, this, this.userID, this.task, this.treatment, 0, this.trainingMode)
      this.functionService.addFilter(this, [{ [data]: ["open"] }]);
    }

  }

  backToDataField(ev) {
    ev.preventDefault();

    var path = ev.path || (ev.composedPath && ev.composedPath());
    var data = ev.target["id"];

    if (data == '') {
      var data = path[2]["id"];
    }

    if (path[1]['id'] == "legend" || path[3]['id'] == "legend") {
      this.drillDownService.post("RemoveLegend", data, this, this.userID, this.task, this.treatment, 0, this.trainingMode)
      this.functionService.removeLegend(this, data);
      this.unitedStatesMap.filterValue = this.filterValue
      this.update();
    }
    else if (path[1]['id'] == "y_Axis" || path[3]['id'] == "y_Axis") {
      this.drillDownService.post("RemoveMetric", [data], this, this.userID, this.task, this.treatment, 0, this.trainingMode)
      this.functionService.removeMetric(this, [data]);
      this.unitedStatesMap.filterValue = this.filterValue
      this.update();
    }

  }

  changeVisualizationMouse(ev) {

    var visualization = ev.target["id"];

    if (visualization != this.unitedStatesMap.chartType) {
      this.drillDownService.post("ChangeVisualization", visualization, this, this.userID, this.task, this.treatment, 0, this.trainingMode)
      this.functionService.changeVisualization(this, visualization)
      this.update();
    }
  }

  selectedStateChange(value: any) {

    var selected = value.filter(x => !this.unitedStatesMap.statesSelect.includes(x));
    if (selected.length != 0) {
      this.drillDownService.post("AddState", selected, this, this.userID, this.task, this.treatment, 0, this.trainingMode)
      this.functionService.addState(this, selected)
    }
    else {
      selected = this.unitedStatesMap.statesSelect.filter(x => !value.includes(x));
      this.drillDownService.post("RemoveState", selected, this, this.userID, this.task, this.treatment, 0, this.trainingMode)
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
      this.drillDownService.post("AddDate", selected, this, this.userID, this.task, this.treatment, 0, this.trainingMode)
      this.functionService.addDate(this, selected)
    }
    else {
      selected = this.datesSelect.filter(x => !value.includes(x));
      this.drillDownService.post("RemoveDate", selected, this, this.userID, this.task, this.treatment, 0, this.trainingMode)
      this.functionService.removeDate(this, selected)
    }

    this.update();
  }


  mouseFilterChange(value: any, filterName) {

    var filters = [{ [filterName]: [value[0], value[1]] }]

    document.getElementById(filterName + "-From")["value"] = value[0].toLocaleString( "en-US" )
    document.getElementById(filterName + "-To")["value"] = value[1].toLocaleString( "en-US" )


    this.updateVisualization = true;

    this.drillDownService.post("AddFilter", filters, this, this.userID, this.task, this.treatment, 0, this.trainingMode)
    this.functionService.addFilter(this, filters)


    var that = this;
    setTimeout(function () {
      if (that.updateVisualization) {
        that.updateVisualization = false
        that.update();
      }

    }, 500);

  }

  changedStatesSelectMouse(event) {
    var element = document.getElementById('StatesSelect');
    this.drillDownService.post("ChangeStatesSelect", element["value"], this, this.userID, this.task, this.treatment, 0, this.trainingMode)
    this.functionService.changeStatesSelect(this, element["value"])
    this.update();
  }

  changedCumulativeMouse(event) {
    var element = document.getElementById('Cumulative');
    this.drillDownService.post("ChangeCumulative", element["value"], this, this.userID, this.task, this.treatment, 0, this.trainingMode)
    this.functionService.changeCumulative(this, element["value"])
    this.update();
  }

  changedMetricAction(event) {
    var id;

    var path = event.path || (event.composedPath && event.composedPath());

    if (path[2].id.includes("ActionTemplate")) {
      id = path[2].id.slice(14);
    }



    var previousAction = this.actionSequence[id]

    this.drillDownService.post("ChangeMetricAction", { id: id, target: previousAction, newValue: event["target"]["value"] }, this, this.userID, this.task, this.treatment, 0, this.trainingMode)



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

    var id;

    var path = event.path || (event.composedPath && event.composedPath());

    if (path[2].id.includes("ActionTemplate")) {
      id = path[2].id.slice(14);
    }


    var previousAction = this.actionSequence[id]

    this.drillDownService.post("ChangeLegendAction", { id: id, target: previousAction, newValue: event["target"]["value"] }, this, this.userID, this.task, this.treatment, 0, this.trainingMode)

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

    if (path[2].id.includes("ActionTemplate")) {
      id = path[2].id.slice(14);
      this.actionSequence[id] = previousAction
      this.updateDuringTraining();
    }
    else if (path[2].id.includes("InitialStateTemplate")) {
      id = path[2].id.slice(20);
      this.initialStateSequence = previousAction
    }
  }

  changedStateAction(event) {
    var id;
    var path = event.path || (event.composedPath && event.composedPath());

    if (path[2].id.includes("ActionTemplate")) {
      id = path[2].id.slice(14);
    }

    var previousAction = this.actionSequence[id]

    this.drillDownService.post("ChangeStateAction", { id: id, target: previousAction, newValue: event["target"]["value"] }, this, this.userID, this.task, this.treatment, 0, this.trainingMode)


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
    var path = event.path || (event.composedPath && event.composedPath());

    if (path[2].id.includes("ActionTemplate")) {
      id = path[2].id.slice(14);
    }

    var previousAction = this.actionSequence[id]

    this.drillDownService.post("ChangeStateAction", { id: id, target: previousAction, newValue: event["target"]["value"] }, this, this.userID, this.task, this.treatment, 0, this.trainingMode)


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

    var path = event.path || (event.composedPath && event.composedPath());

    if (path[2].id.includes("ActionTemplate")) {
      id = path[2].id.slice(14);
    }

    var previousAction = this.actionSequence[id]

    this.drillDownService.post("ChangeDateAction", { id: id, target: previousAction, newValue: event["target"]["value"] }, this, this.userID, this.task, this.treatment, 0, this.trainingMode)


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
    var path = event.path || (event.composedPath && event.composedPath());

    if (path[2].id.includes("ActionTemplate")) {
      id = path[2].id.slice(14);
    }

    var previousAction = this.actionSequence[id]

    this.drillDownService.post("ChangeDateAction", { id: id, target: previousAction, newValue: event["target"]["value"] }, this, this.userID, this.task, this.treatment, 0, this.trainingMode)


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

    var path = event.path || (event.composedPath && event.composedPath());

    if (path[2].id.includes("ActionTemplate")) {
      id = path[2].id.slice(14);
    }

    var previousAction = this.actionSequence[id]

    this.drillDownService.post("ChangeFilterAction", { id: id, target: previousAction, newValue: event["target"]["value"] }, this, this.userID, this.task, this.treatment, 0, this.trainingMode)

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
    if (this.noSpeechInteraction && this.addToSequence) {
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

  }

  sendInitialStateBack() {

    var possibleFilter = ["Date", "State", "Tests", "Cases", "Deaths", "Population", "PartialVaccinated", "FullyVaccinated"]
    var activeFilters = []
    for (var filterIndex in possibleFilter) {
      if (document.getElementById(possibleFilter[filterIndex] + "_Filter")["className"] != "col closed") {
        activeFilters.push(possibleFilter[filterIndex])
      }
    }

    var initialState = {
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

    this.directLine
      .postActivity({
        from: { id: "USER_ID", name: "USER_NAME" },
        name: "InitialState",
        type: "event",
        value: initialState
      })
      .subscribe(
        id => { },
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
    this.unitedStatesMap.updateMap("normal");
  }

  inputCheck(ev) {
    var data = ev.target.id.split("-");
    var filters = []
    if (data[0] == "Date") {

      var date = document.getElementById("Date-From")["value"] + " till " + document.getElementById("Date-To")["value"]

      this.functionService.addDate(this, [date])

    }
    else {
      // 1
      var input = ev.target.value;
      
      // 2
      var input = input.replace(/[\D\s\._\-]+/g, "");
      
      // 3
      input = input ? parseInt( input, 10 ) : 0;
      
      // 4
      $("#"+ ev.target.id).val( function() {
          return ( input === 0 ) ? "" : input.toLocaleString( "de-DE" );
      } );
      if (data[1] == "From") {
        if (parseInt(input) < this.minSlider[data[0]]) {
          ev.target.value = this.minSlider[data[0]]
          filters.push({ [data[0]]: [this.minSlider[data[0]], this.filterValue[data[0]][1]] })
          this.communicateToBot("The value you selected is smaller than the minimum value of " + data[0] + ".")

        }
        else {
          filters.push({ [data[0]]: [parseInt(input), this.filterValue[data[0]][1]] })
        }

      }
      else {
        if (parseInt(input) > this.maxSlider[data[0]]) {
          ev.target.value = this.maxSlider[data[0]]
          filters.push({ [data[0]]: [this.filterValue[data[0]][0], this.maxSlider[data[0]]] })

          this.communicateToBot("The value you selected is larger than the maximum value of " + data[0] + ".")
        }
        else {
          filters.push({ [data[0]]: [this.filterValue[data[0]][0], parseInt(input)] })
        }
      }
      this.drillDownService.post("AddFilter", filters, this, this.userID, this.task, this.treatment, 1, this.trainingMode)
      this.functionService.addFilter(this, filters)
    }

    this.update();
  }



  addListener() {
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

  startDemonstration(value) {
    this.trainingMode = true;
    this.addToSequence = true;
    this.shortcut = false;
    this.allUsed = false;
    this.continueDemonstration = false;
    this.continuationSent = false;

    document.getElementById("trainUtterance").innerHTML = this.initialUtterance + document.getElementById("trainUtterance").innerHTML;

    document.getElementById("interactionBlocker")["style"]["display"] = "none";

    if (this.actionSequence.length == 0) {
      document.getElementById("NoAction")["style"]["display"] = "inline-block";
    }

    document.getElementById("trainingModeInter")["style"]["display"] = "block";

    document.getElementById("header")["style"]["color"] = "white";
    document.getElementById("header")["style"]["background-color"] = "#1a2126";

    document.getElementById("Partitioning")["style"]["background-color"] = "#1a2126";

    document.getElementById("info")["style"]["border-left"] = "5px solid #1a2126";


    if (this.noSpeechInteraction) {
      this.drillDownService.post("StartDemonstration", this.initialUtterance, this, this.userID, this.task, this.treatment, 0, this.trainingMode)
    }
    var that = this;
    document.getElementById("trainUtterance").addEventListener("mouseover", this.highlightElement.bind(this), false)
    document.getElementById("trainUtterance").addEventListener("mouseout", this.removeHighlightElement.bind(this), false)

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

    this.alreadyProposed = {
      "State": false,
      "Date": false,
      "RemoveAllStates": false,
      "RemoveAllDates": false,
      "RemoveAllMetric": false,
      "Tests": false,
      "Cases": false,
      "Deaths": false,
      "Population": false,
      "PartialVaccinated": false,
      "FullyVaccinated": false,
    }

    this.unusedEntities = {}

    for (var tIndex in this.trainableEntites) {
      if (this.trainableEntites[tIndex].length > 0 && tIndex != "State" && tIndex != "DataFields") {
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

  sendWaitRequest() {
    if (this.noSpeechInteraction && this.addToSequence) {
      this.directLine
        .postActivity({
          from: { id: "USER_ID", name: "USER_NAME" },
          name: "WaitRecommendation",
          type: "event"
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

  checkForChanges() {
    var notChanged = false;

    var possibleFilter = ["Date", "State", "Tests", "Cases", "Deaths", "Population", "PartialVaccinated", "FullyVaccinated"]
    var activeFilters = []
    for (var filterIndex in possibleFilter) {
      if (document.getElementById(possibleFilter[filterIndex] + "_Filter")["className"] != "col closed") {
        activeFilters.push(possibleFilter[filterIndex])
      }
    }
    var newState = {
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

    if (JSON.stringify(newState) === this.currentState) {
      notChanged = true;
    }
    else {
      notChanged = false;
    }


    if (notChanged) {
      this.communicateToBot("However, this action did not change any elements of the visualization or the filters.")
    }
  }

  checkForRecommendation() {
    this.activeRecommendationProcess = true;

    if (this.recommendationList.length > 0) {
      if (!this.recommendationList[0]["posted"]) {
        this.giveHover = true;
        this.recommendationList[0]["posted"] = true
        var recommendation = this.recommendationList[0];
        this.lineSpecification = recommendation["specification"]
        this.ambiguityPosition = recommendation["position"]

        if (this.treatment == "1") {

          if (this.treatment == "1") {

            var position = $('#botWin').position();

            var line1 = $('#line1');

            line1.css("display", "block")

            line1
              .attr('x1', this.ambiguityPosition.x)
              .attr('y1', this.ambiguityPosition.y)
              .attr('x2', this.ambiguityPosition.x)
              .attr('y2', (position.top + $('#botWin').height() - 80));

            var rect = $('#rect');

            rect.css("display", "block")
            rect
              .attr('x', (this.ambiguityPosition.x - 5))
              .attr('y', (position.top + $('#botWin').height() - 85))

            var line2 = $('#line2');

            line2.css("display", "block")

            line2
              .attr('x1', this.ambiguityPosition.x)
              .attr('y1', (position.top + $('#botWin').height() - 80))
              .attr('x2', position.left)
              .attr('y2', (position.top + $('#botWin').height() - 80));

            line1.css("stroke", this.lineColor[this.lineSpecification])

            rect.css("fill", this.lineColor[this.lineSpecification])

            line2.css("stroke", this.lineColor[this.lineSpecification])

            this.timeLeft = 4
          }

          if (this.treatment == "2") {
            $('#followUpNotification').css("display", "block")

          }

          this.drillDownService.post("Recommendation", { Recommendation: recommendation['id'], Reason: recommendation['reason'] }, this, this.userID, this.task, this.treatment, 0, this.trainingMode)
          this.sendRecommendation(recommendation['id'], recommendation['reason'])


          var actionElement = document.getElementById('ActionTemplate' + recommendation['id'])
          actionElement["children"][1]["style"]["display"] = "block"

          actionElement["children"][1].addEventListener("mouseover", function () {
            this["style"]["background-color"] = "lightgray"
            $("li[class$='from-bot']").last()[0]["style"]["background-color"] = "lightcoral"
          })
          actionElement["children"][1].addEventListener("mouseout", function () {
            this["style"]["background-color"] = ""
            $("li[class$='from-bot']").last()[0]["style"]["background-color"] = ""
          })

        }

      }
    }
    else {
      this.giveHover = false;

      this.drillDownService.post("SolvedRecommendation", "", this, this.userID, this.task, this.treatment, 0, this.trainingMode)

      this.directLine
        .postActivity({
          from: { id: "USER_ID", name: "USER_NAME" },
          name: "SolvedRecommendation",
          type: "event",
          value: this.unusedEntities
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
    this.activeRecommendationProcess = false;
    if (this.sendStatusLater) {
      this.sendStatusLater = false;
    }

  }

  checkForSolving() {
    if (this.recommendationList.length == 0 && this.trainingMode) {
      this.giveHover = false;

      this.drillDownService.post("SolvedRecommendation", "", this, this.userID, this.task, this.treatment, 0, this.trainingMode)

      this.directLine
        .postActivity({
          from: { id: "USER_ID", name: "USER_NAME" },
          name: "SolvedRecommendation",
          type: "event",
          value: this.unusedEntities
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

  confirmRecommendation(id) {

    if (this.treatment == "1") {

      for (var rIndex in this.recommendationList) {
        var recommendation = this.recommendationList[rIndex]
        if (recommendation["id"] == id) {
          var actionElement = document.getElementById('ActionTemplate' + recommendation['id'])

          this.drillDownService.post("ConfirmRecommendation", { id: id, Recommendation: recommendation }, this, this.userID, this.task, this.treatment, 0, this.trainingMode)


          if (recommendation["value"] == "Remove all") {
            this.actionSequence[id] = recommendation["action"]

            actionElement["children"][1]["style"]["display"] = "none"
            document.getElementById("ActionTemplate" + id).childNodes[0]["innerHTML"] = recommendation["text"]
          }
          else if (recommendation["value"] == "Add") {
            var newID = this.actionSequence.length
            this.actionSequence.push(recommendation["action"])
            var clone;

            clone = document.getElementById('ActionTemplate' + newID)

            if (clone == null) {
              clone = document.getElementById('ActionTemplate').cloneNode(true);
              clone.lastChild.parentElement.id = "ActionTemplate" + newID;
              clone.lastChild.parentElement.style["display"] = "block";
              clone.childNodes[2].onclick = this.closeITLElement.bind(this);
            }
            clone.childNodes[0].innerHTML = recommendation['text']
            document.getElementById('itl-pane').appendChild(clone);

            actionElement["children"][1]["style"]["display"] = "none"
          }
          else {
            this.actionSequence[id] = recommendation["action"]

            actionElement["children"][1]["style"]["display"] = "none"
            var selection = actionElement.childNodes[0].childNodes[0];
            for (var i = 0; i < selection["options"].length; i++) {
              if (selection["options"][i]["value"] == recommendation["value"]) {
                selection["options"][i]["selected"] = true;
              }
              else {
                selection["options"][i]["selected"] = false;
              }
            }
          }
          this.recommendationList.splice(parseInt(rIndex), 1)
        }
      }
    }

    this.addListener();
    this.updateDuringTraining();
    this.checkForRecommendation();
  }


  refuseRecommendation(id) {

    if (this.treatment == "1") {


      for (var rIndex in this.recommendationList) {
        var recommendation = this.recommendationList[rIndex]
        if (recommendation["id"] == id) {
          this.drillDownService.post("RefuseRecommendation", { id: id, Recommendation: recommendation }, this, this.userID, this.task, this.treatment, 0, this.trainingMode)

          var actionElement = document.getElementById('ActionTemplate' + recommendation['id'])
          actionElement["children"][1]["style"]["display"] = "none"
          this.recommendationList.splice(parseInt(rIndex), 1)
        }
      }

    }
    this.checkForRecommendation();
  }


  closeITLElement(event) {
    var id;

    var path = event.path || (event.composedPath && event.composedPath());
    if (path[2].id.includes("ActionTemplate")) {
      id = path[2].id.slice(14);
    }
    else {
      id = path[1].id.slice(14);
    }

    var removal = this.actionSequence.splice(id, 1)

    this.drillDownService.post("CloseITLElement", { id: id, RemoveAction: removal }, this, this.userID, this.task, this.treatment, 0, this.trainingMode)



    var element = document.getElementById("ActionTemplate" + id);
    element.parentNode.removeChild(element);

    for (var i = id; i < this.actionSequence.length; i++) {
      var oldID = parseInt(i) + 1
      document.getElementById("ActionTemplate" + oldID).id = "ActionTemplate" + i
    }

    if (this.actionSequence.length == 0) {
      document.getElementById("NoAction")["style"]["display"] = "inline-block";
    }

    this.updateDuringTraining()


  }

  rebase(that, initialState) {

    that.resetProzess = true;
    that.functionService.changeVisualization(that, initialState["Visualization"])

    if (typeof that.initialState["Legend"] !== 'undefined' && initialState["Legend"] != null) {
      that.functionService.addLegend(that, initialState["Legend"])
    }
    else if (typeof that.unitedStatesMap.legend_Values !== 'undefined' && that.unitedStatesMap.legend_Values != null) {
      that.functionService.removeLegend(that, that.unitedStatesMap.legend_Values)
    }

    that.functionService.removeAllMetrics(that)

    that.functionService.addMetric(that, initialState["Metric"])



    var possibleFilter = ["Tests", "Cases", "Deaths", "Population", "PartialVaccinated", "FullyVaccinated"]

    for (var index in possibleFilter) {
      that.functionService.removeFilter(that, [{ [possibleFilter[index]]: ["close"] }])
    }

    for (var index in that.initialState['OpenFilters']) {
      that.functionService.addFilter(that, [{ [initialState['OpenFilters'][index]]: ["open"] }])
    }

    that.functionService.removeState(that, ["All"])
    that.functionService.addState(that, initialState['States'])

    that.functionService.removeDate(that, ["All"])
    that.functionService.changeDateSetting(that, initialState['DateSettings'])
    if (initialState['Dates'].length == 548) {
      that.functionService.addDate(that, ["All"])
    }
    else {
      that.functionService.addDate(that, initialState['Dates'])
    }

    that.functionService.changeFilter(that, initialState["Filters"])

    //that.functionService.changeAggregate(that, initialState["Aggregate"])

    that.functionService.changeStatesSelect(that, initialState["GroupBy"])

    that.functionService.changeCumulative(that, initialState["Cumulative"])

    that.resetProzess = false;

  }



  async updateDuringTraining() {

    this.addToSequence = false;

    this.rebase(this, this.initialState)


    for (var i = 0; i < this.actionSequence.length; i++) {
      await this.functionService.processAction(this, this.actionSequence[i])
    }
    this.addToSequence = true;

    this.update()

  }

  async addElementtoITL(action, target) {

    if (this.addToSequence) {
      var that = this
      $("div[id^='RecommenderTemplate']").each(function (i, el) {
        if (this["style"]["display"] != "none") {
          this["style"]["display"] = "none"
          that.communicateToBot("I set the default action for the ambiguity")
        }
      });

      $("img[class^='attention']").each(function (i, el) {
        if (this["style"]["display"] != "none") {
          this["style"]["display"] = "none"
        }
      });

      if (this.noSpeechInteraction) {
        this.recommendationList = [];
        this.actionMessageMapping = []

      }

      var oldSize = this.actionSequence.length

      var returnValues = this.drillDownService.processUserInput(this, action, target, this.actionSequence)


      this.drillDownService.post("AddElementITL", { Action: action, Target: target }, this, this.userID, this.task, this.treatment, 0, this.trainingMode)


      if (this.simpleService.checkUnused(this, this.unusedEntities)) {
        this.drillDownService.post("AllEntitesUsed", "", this, this.userID, this.task, this.treatment, 0, this.trainingMode)

        this.allUsed = true;
        this.continueDemonstration = false;
        this.continuationSent = true;

        this.directLine
          .postActivity({
            from: { id: "USER_ID", name: "USER_NAME" },
            name: "AllUsed",
            type: "event",
          })
          .subscribe(
            id => {
            },
            error => console.log(`Error posting activity ${error}`)
          );
      }

      this.actionSequence = returnValues[1];


      if (this.actionSequence.length >= oldSize) {
        await this.getFeedbackFromBot(this.actionSequence[this.actionSequence.length - 1])
      }

      //await this.sleep(500);
      for (var i = 0; i < returnValues[0].length; i++) {
        document.getElementById("NoAction")["style"]["display"] = "none";

        var clone;

        clone = document.getElementById('ActionTemplate' + returnValues[0][i]['id'])

        if (clone == null) {
          clone = document.getElementById('ActionTemplate').cloneNode(true);
          clone.lastChild.parentElement.id = "ActionTemplate" + returnValues[0][i]['id'];
          clone.lastChild.parentElement.style["display"] = "block";
          clone.childNodes[2].onclick = this.closeITLElement.bind(this);
        }
        clone.childNodes[0].innerHTML = returnValues[0][i]['text']
        document.getElementById('itl-pane').appendChild(clone);

        var objDiv = document.getElementById("itl-pane");
        objDiv.scrollTop = objDiv.scrollHeight;
        this.addListener()
      }

      for (var index in returnValues[2]) {
        this.recommendationList.push(returnValues[2][index])
      }
      if (this.noSpeechInteraction) {
        this.checkForRecommendation();
      }

    }
  }

  endTrainingMode(sendActivity) {

    document.getElementById("trainingModeInter")["style"]["display"] = "none";
    document.getElementById("DemonstrationButtons")["style"]["display"] = "none";


    document.getElementById("header")["style"]["color"] = "#212529";
    document.getElementById("header")["style"]["background-color"] = "#eeeeee";

    document.getElementById("Partitioning")["style"]["background-color"] = "#eeeeee";

    document.getElementById("info")["style"]["border-left"] = "5px solid rgb(238, 238, 238)";

    this.trainingMode = false;
    this.addToSequence = false;
    this.allUsed = false;

    this.actionSequence = this.initialStateSequence.concat(this.actionSequence)

    if (sendActivity == "true") {
      this.drillDownService.post("DemonstrationFinished", { sequence: this.actionSequence }, this, this.userID, this.task, this.treatment, 0, this.trainingMode)

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
      this.drillDownService.post("DemonstrationCanceled", { sequence: this.actionSequence }, this, this.userID, this.task, this.treatment, 0, this.trainingMode)

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
        document.getElementById("interactionBlocker")["style"]["display"] = "block";

    }

    if (this.actionSequence.length == 0) {
      document.getElementById("NoAction")["style"]["display"] = "inline-block";
    }

    this.actionSequence = [];
    this.initialState = null;
    this.recommendationList = [];
    this.actionMessageMapping = []
    this.initialStateSequence = []




    document.getElementById("trainUtterance").innerHTML = "";

    for (var i = document.getElementById("itl-pane").childNodes.length - 1; 0 <= i; i--) {
      var element = document.getElementById("itl-pane").childNodes[i];
      if (element["id"] != "NoAction" && element["id"] != "titleUnderstanding") {
        element.parentNode.removeChild(element);
      }

    }

  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  checkforHover(target, event) {

    if (target == this.lineSpecification && this.trainingMode && this.giveHover && this.treatment == "1") {

      this.drillDownService.post("HoverRecommendation", this.lineSpecification, this, this.userID, this.task, this.treatment, 0, this.trainingMode)

      var position = $('#botWin').position();

      var line1 = $('#line1');

      line1.css("display", "block")

      line1
        .attr('x1', this.ambiguityPosition.x)
        .attr('y1', this.ambiguityPosition.y)
        .attr('x2', this.ambiguityPosition.x)
        .attr('y2', (position.top + $('#botWin').height() - 80));


      var rect = $('#rect');

      rect.css("display", "block")
      rect
        .attr('x', (this.ambiguityPosition.x - 5))
        .attr('y', (position.top + $('#botWin').height() - 85))

      var line2 = $('#line2');

      line2.css("display", "block")

      line2
        .attr('x1', this.ambiguityPosition.x)
        .attr('y1', (position.top + $('#botWin').height() - 80))
        .attr('x2', position.left)
        .attr('y2', (position.top + $('#botWin').height() - 80));

      this.timeLeft = 2
    }
  }

  showBlockerMessage() {

    this.drillDownService.post("AddBlocker", "", this, this.userID, this.task, this.treatment, 0, this.trainingMode)


    if (this.task == "1") {
      document.getElementById("blockMessage").innerText = "Add in cases to what is there"
    }
    else if (this.task == "2") {
      document.getElementById("blockMessage").innerText = "Display all dates with more than 500,000 cases"
    }
    else if (this.task == "3") {
      document.getElementById("blockMessage").innerText = "Only show Ohio and Florida on the 1st of September 2020"
    }
    else if (this.task == "4") {
      document.getElementById("blockMessage").innerText = "Combine all states with less than 10 million inhabitants"
    }

    document.getElementById("blockerBox").style.display = "block";
    document.getElementById("interactionBlocker").style.zIndex = "40000";
    document.getElementById("interactionBlocker").style.opacity = "1";



  }

  highlightElement(event) {
    var child = event.target

    if (child["title"] != "") {
      if (child["title"].includes("x-Axis") || child["title"].includes("Legend") || child["title"].includes("State :")) {
        document.getElementById(child["title"].split(/ : | &#10; | \n /)[1])["style"]["box-shadow"] = "black 5px 5px 10px 0px"; this.drillDownService.post("HoverGUI", "Legend", this, this.userID, this.task, this.treatment, 0, this.trainingMode)
      }
      else if (child["title"].includes("y-Axis") || child["title"].includes("Axis") || child["title"].includes("Color")) {
        document.getElementById(child["title"].split(/ : | &#10; | \n /)[1])["style"]["box-shadow"] = "black 5px 5px 10px 0px"; this.drillDownService.post("HoverGUI", "Metric", this, this.userID, this.task, this.treatment, 0, this.trainingMode)
      }
      else if (child["title"].includes("Visualizations")) {
        document.getElementById(child["title"].split(/ : | &#10; | \n /)[1])["style"]["background-color"] = "RoyalBlue"; this.drillDownService.post("HoverGUI", "Visualization", this, this.userID, this.task, this.treatment, 0, this.trainingMode)
      }
      else if (child["title"].includes("Cumulative")) {
        document.getElementById(child["title"].split(/ : | &#10; | \n /)[0])["style"]["box-shadow"] = "black 0px 0px 10px 6px"; this.drillDownService.post("HoverGUI", "Cumulative", this, this.userID, this.task, this.treatment, 0, this.trainingMode)
      }
      else if (child["title"].includes("StatesSelect")) {
        document.getElementById(child["title"].split(/ : | &#10; | \n /)[0])["style"]["box-shadow"] = "black 0px 0px 10px 6px"; this.drillDownService.post("HoverGUI", "StatesSelect", this, this.userID, this.task, this.treatment, 0, this.trainingMode)
      }

      else if (child["title"].includes("Filter")) {

        if (document.getElementById(child["title"].split(/ : | &#10; | \n /)[1] + "_Filter").classList.contains("closed")) {
          document.getElementById("FilterField")["style"]["box-shadow"] = "black 0px 0px 10px 6px"; this.drillDownService.post("HoverGUI", "Filter", this, this.userID, this.task, this.treatment, 0, this.trainingMode)
        }
        else {
          document.getElementById(child["title"].split(/ : | &#10; | \n /)[1] + "_Filter")["style"]["box-shadow"] = "black 0px 0px 10px 6px";
          this.drillDownService.post("HoverGUI", "Filter", this, this.userID, this.task, this.treatment, 0, this.trainingMode)
        }
      }
    }
    //if(target == "_Filter"){
    //  document.getElementById(element["title"].split(/ : | &#10; | \n /)[1] + "_Filter")["style"]["box-shadow"] = "black 0px 0px 10px 6px"; 
    //  this.drillDownService.post("HoverGUI", "Filter", this, this.userID, this.task, this.treatment, 0, this.trainingMode)
    //}
  }

  removeHighlightElement(event) {
    var child = event.target

    if (child["title"] != "") {
      if (child["title"].includes("x-Axis") || child["title"].includes("Legend") || child["title"].includes("State :")) {

        document.getElementById(child["title"].split(/ : | &#10; | \n /)[1])["style"]["box-shadow"] = ""
      }
      else if (child["title"].includes("y-Axis") || child["title"].includes("Axis") || child["title"].includes("Color")) {
        document.getElementById(child["title"].split(/ : | &#10; | \n /)[1])["style"]["box-shadow"] = ""
      }
      else if (child["title"].includes("Visualizations")) {
        var element = document.getElementById(child["title"].split(/ : | &#10; | \n /)[1]);
        if (element["className"].includes("active")) {
          element["style"]["background-color"] = ""
        }
        else {
          element["style"]["background-color"] = ""
        }

      }
      else if (child["title"].includes("Cumulative")) {
        document.getElementById(child["title"].split(/ : | &#10; | \n /)[0])["style"]["box-shadow"] = ""
      }
      else if (child["title"].includes("StatesSelect")) {
        document.getElementById(child["title"].split(/ : | &#10; | \n /)[0])["style"]["box-shadow"] = ""
      }

      else if (child["title"].includes("Filter")) {

        if (document.getElementById(child["title"].split(/ : | &#10; | \n /)[1] + "_Filter").classList.contains("closed")) {
          document.getElementById("FilterField")["style"]["box-shadow"] = ""
        }
        else {
          document.getElementById(child["title"].split(/ : | &#10; | \n /)[1] + "_Filter")["style"]["box-shadow"] = ""
        }
      }
    }
  }

  removeBlockerBox() {
    this.drillDownService.post("RemoveBlocker", "", this, this.userID, this.task, this.treatment, 0, this.trainingMode)

    document.getElementById("blockerBox").style.display = "none";
    document.getElementById("interactionBlocker").style.opacity = "0";
    document.getElementById("interactionBlocker").style.zIndex = "20000";

  }

  finishTask(data) {

    var accuracy = 0
    var noElse = true;
    var correct = 0;

    if (this.task == "1") {


      for (var key in data["Remove"]) {
        if (data["Remove"][key].length > 0) {
          noElse = false;
        }
      }

      if (noElse) {
        accuracy = correct / 1 * 100
      }
      else {
        accuracy = correct / 2 * 100
      }


    }
    else if (this.task == "2") {

      for (var key in data["Add"]) {
        if (key == "DataFields" && data["Add"][key].length == 1 && data["Add"][key][0] == "Filter0") {
          correct += 1
        }
        else if (key == "Date" && data["Add"][key].length == 1 && data["Add"][key][0] == "All") {
          correct += 1
        }
        else if (key == "Legend" && data["Add"][key].length == 1 && data["Add"][key][0] == "Legend0") {
          correct += 1
        }
        else if (key == "Filter" && data["Add"][key].length == 1 && Object.keys(data["Add"][key][0]).length == 1 && Object.keys(data["Add"][key][0]).includes("Filter0") && data["Add"]["Filter"][0]["Filter0"][0] == 'lower' && data["Add"]["Filter"][0]["Filter0"][1] == 'max') {
          correct += 1
        }
        else if (data["Add"][key].length > 0) {
          noElse = false;
        }
      }

      for (var key in data["Remove"]) {
        if (data["Remove"][key].length > 0) {
          noElse = false;
        }
      }

      if (noElse) {
        accuracy = correct / 4 * 100
      }
      else {
        accuracy = correct / 5 * 100
      }
    }
    else if (this.task == "3") {
      for (var key in data["Add"]) {
        if (key == "State" && data["Add"][key].length == 1 && data["Add"][key][0] == "StatePack1") {
          correct += 1
        }
        else if (key == "Date" && data["Add"][key].length == 1 && data["Add"][key][0] == "Date0") {
          correct += 1
        }
        else if (key == "Legend" && data["Add"][key].length == 1 && data["Add"][key][0] == "State") {
          correct += 1
        }
        else if (data["Add"][key].length > 0) {
          noElse = false;
        }
      }

      for (var key in data["Remove"]) {
        if (key == "State" && data["Remove"][key].length == 1 && data["Remove"][key][0] == "All") {
          correct += 1
        }
        else if (key == "Date" && data["Remove"][key].length == 1 && data["Remove"][key][0] == "All") {
          correct += 1
        }
        else if (data["Remove"][key].length > 0) {
          noElse = false;
        }
      }

      if (noElse) {
        accuracy = correct / 5 * 100
      }
      else {
        accuracy = correct / 6 * 100
      }
    }
    else if (this.task == "4") {
      for (var key in data["Add"]) {
        if (key == "State" && data["Add"][key].length == 1 && data["Add"][key][0] == "All") {
          correct += 1
        }
        else if (key == "Filter" && data["Add"][key].length == 1 && Object.keys(data["Add"][key][0]).length == 1 && Object.keys(data["Add"][key][0]).includes("Filter0") && data["Add"]["Filter"][0]["Filter0"][0] == '0' && data["Add"]["Filter"][0]["Filter0"][1] == 'upper') {
          correct += 1
        }
        else if (key == "StatesSelect" && data["Add"][key].length == 1 && data["Add"][key][0] == "StatesSelect0") {
          correct += 1
        }
        else if (data["Add"][key].length > 0) {
          noElse = false;
        }
      }

      for (var key in data["Remove"]) {
        if (data["Remove"][key].length > 0) {
          noElse = false;
        }
      }

      if (noElse) {
        accuracy = correct / 3 * 100
      }
      else {
        accuracy = correct / 4 * 100
      }
    }

    this.drillDownService.post("Accuracy", accuracy, this, this.userID, this.task, this.treatment, 0, this.trainingMode)


    document.getElementById("accuracyMessage").innerText = accuracy + "%"

    document.getElementById("finishBox").style.display = "block";
    document.getElementById("interactionBlocker").style.display = "block";
    document.getElementById("interactionBlocker").style.zIndex = "40000";
    document.getElementById("interactionBlocker").style.opacity = "1";
  }
}


