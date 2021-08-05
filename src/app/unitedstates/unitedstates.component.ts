import { Component, OnInit, OnDestroy, ElementRef, AfterViewInit, AfterContentInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ViewChild } from '@angular/core';
import { UnitedStatesMapComponent } from '../unitedstates-map/unitedstates-map.component';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MetricSummaryComponent } from '../metric-summary/metric-summary.component';
import { DrillDownService } from "../shared/drilldown.services";
import { FunctionService } from "../shared/function.services";

import {
  formatDate
} from '@angular/common';
import { send } from 'process';

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

  //Relevant for Training Mode
  public initialState;
  public trainableEntites: any;
  public stateList;
  public metricList;
  public actionSequence = [];
  public recommendationList = [];
  public trainingMode = false;
  public addToSequence = false;
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

  public possibleDates = [];
  public legendLabel = "x-Axis"
  public metricLabel = "y-Axis"

  /* Filter */
  public minSlider = { Date: new Date(this.dateMin).getTime(), Tests: 0, Cases: 0, Deaths: 0, Population: 0, PartialVaccinated: 0, FullyVaccinated: 0 }
  public maxSlider = { Date: new Date(this.dateMax).getTime(), Tests: 0, Cases: 0, Deaths: 0, Population: 0, PartialVaccinated: 0, FullyVaccinated: 0 } //.setHours(23, 59, 59, 999)
  public filterValue = { Date: [new Date(this.dateMin).getTime(), new Date(this.dateMax).getTime()], Tests: [0, false], Cases: [0, false], Deaths: [0, false], Population: [0, false], PartialVaccinated: [0, false], FullyVaccinated: [0, false] };
  public updateVisualization = false;
  public fieldToColor = { "Visualizations": "#1F8FFF", "Legend": "#FF7738", "DataFields": "#00FFE6", "Filter": "#877AFF" };




  constructor(
    private router: Router,
    public route: ActivatedRoute,
    private drillDownService: DrillDownService,
    private functionService: FunctionService
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
          subscriptionKey: '08c0fdef029e44a8a2893676f6f1035c'
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

        document.getElementById("FilterField").style.width = '25%';
        document.getElementById("botWin").style.width = '75%';

        document.getElementById("FilterField").style.height = '100%';
        document.getElementById("botWin").style.height = '34%';

        //$('.filterTitle').css('display','block');
      }
      else {
        document.getElementById("itl-container").style.display = 'none';

        document.getElementById("FilterField").style.width = '100%';
        document.getElementById("botWin").style.width = '100%';

        document.getElementById("FilterField").style.height = '50%';
        document.getElementById("botWin").style.height = '50%';
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

      if(this.statesSelect.length > 0){
        $("input[id^='k']")[0]["placeholder"] = "  +"
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
      else if (key == "Date") {
        document.getElementById(String(key) + "-From")["value"] = String(formatDate(new Date(this.filterValue[key][0]), 'yyyy-MM-dd', 'en'))
        document.getElementById(String(key) + "-To")["value"] = String(formatDate(new Date(this.filterValue[key][1]), 'yyyy-MM-dd', 'en'))
      }
    }
    this.unitedStatesMap.filterValue = this.filterValue
  }


  toggleChanged(data) {

    for (var key in data) {
      if (key == "Cumulative") {
        this.functionService.changeCumulative(this, data["Cumulative"])
      }
      else if (key == "GroupBy") {
        console.log(data["GroupBy"])
        if (data["GroupBy"] == true) {
          this.functionService.changeGroupBy(this, "Metric")
        }
        else if (data["GroupBy"] == false) {
          this.functionService.changeGroupBy(this, "Legend")
        }
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

  resetFilter(event) {

    if (event.path[4]["className"] == "col") {

      var data = event.path[4]["id"].split("_")[0]

      if (data == "State") {
        this.functionService.removeState(this, { "State": ["All"] })
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
          if(this["innerText"].indexOf("Bot said:Processing") !== -1){
            this["style"]["display"] = "none";
          }
        });
        if ((<any>event).data.name == "Generic") {
          try {
            this.functionService.processAction(this, <any>event.data.value)
            this.update();
          }
          catch (e) {

          }
        }
        else if ((<any>event).data.name == "Help") {
          this.functionService.visualizeUnderstanding(this, (<any>event).data.value)
        }
        else if ((<any>event).data.name == "Start Demonstration") {
          this.startDemonstration((<any>event).data.value);
        }
        else if ((<any>event).data.name == "ConfirmRecommendation") {
          this.confirmRecommendation((<any>event).data.value);
        }
        else if ((<any>event).data.name == "Refuse") {
          this.refuse();
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
    if (ev.target["className"] == "interactiveField") {
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
      this.functionService.addFilter(this, [{ "State": selected }])
    }
    else {
      selected = this.unitedStatesMap.statesSelect.filter(x => !value.includes(x));
      this.functionService.removeFilter(this, [{ "State": selected }])
    }
    this.update();
  }


  selectedDateChange(value: any) {
    var selected = value.filter(x => !this.unitedStatesMap.datesSelect.includes(x));
    if (selected.length != 0) {
      this.functionService.addFilter(this, [{ "Date": selected }])
    }
    else {
      selected = this.unitedStatesMap.datesSelect.filter(x => !value.includes(x));
      this.functionService.removeFilter(this, [{ "Date": selected }])
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
    var id;

    if (event["path"][2].id.includes("ActionTemplate")) {
      id = event["path"][2].id.slice(14);
    }

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

    this.actionSequence[id] = previousAction

    this.updateDuringTraining();

  }

  changedStateAction(event) {
    var id;

    if (event["path"][2].id.includes("ActionTemplate")) {
      id = event["path"][2].id.slice(14);
    }

    var previousAction = this.actionSequence[id]



    console.log(previousAction["Add"]["Filter"][0]["State"])
    var states = []

    if (previousAction["Add"]["Filter"][0]["State"] != "none" && typeof previousAction["Add"]["Filter"][0]["State"] !== "undefined" && previousAction["Add"]["Filter"][0]["State"][0] != "All") {
      states = previousAction["Add"]["Filter"][0]["State"]
    }
    else if (previousAction["Remove"]["Filter"][0]["State"] != "none" && typeof previousAction["Remove"]["Filter"][0]["State"] !== "undefined" && previousAction["Remove"]["Filter"][0]["State"][0] != "All") {
      states = previousAction["Remove"]["Filter"][0]["State"]
    }

    if (event["target"]["value"] == "Add") {
      previousAction["Add"]["Filter"] = [{ "State": states }]
      previousAction["Remove"]["Filter"] = 'none'
    }
    else if (event["target"]["value"] == "Remove all except") {
      previousAction["Add"]["Filter"] = [{ "State": states }]
      previousAction["Remove"]["Filter"] = [{ "State": ['All'] }]
    }
    else if (event["target"]["value"] == "Remove") {
      previousAction["Add"]["Filter"] = 'none'
      previousAction["Remove"]["Filter"] = [{ "State": states }]
    }
    else if (event["target"]["value"] == "Select all except") {
      previousAction["Add"]["Filter"] = [{ "State": ['All'] }]
      previousAction["Remove"]["Filter"] = [{ "State": states }]
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
        name: "problemNotification",
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

  tagMapper(tags: any[]): any[] {
    return tags.length < 51 ? tags : [tags];
  }

  update() {
    this.unitedStatesMap.removeExistingMapFromParent();
    this.unitedStatesMap.updateMap();
  }

  inputCheck(ev) {
    var data = ev.target.id.split("-");
    var filters = []
    if (data[0] == "Date") {
      if (data[1] == "From") {
        filters.push({ [data[0]]: [new Date(ev.target.value).getTime(), this.filterValue['Date'][1]] })
      }
      else {
        filters.push({ [data[0]]: [this.filterValue['Date'][0], new Date(ev.target.value).getTime()] })
      }

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
    }
    this.functionService.addFilter(this, filters)
    this.update();
  }

  startDemonstration(value) {
    this.trainingMode = true;
    this.addToSequence = true;
    document.getElementById("trainUtterance").innerHTML = this.initialUtterance + document.getElementById("trainUtterance").innerHTML;

    this.trainableEntites = value;

    for (var fI in this.trainableEntites["Filter"]) {
      var filter = this.trainableEntites["Filter"][fI]
      if (Object.keys(filter)[Object.keys(filter).length - 1] == "State") {
        this.stateList = []
        for (var sI in filter["State"]) {
          var state = filter["State"][sI]
          var index = parseInt(state.charAt(0))
          if (this.stateList.length < index) {
            this.stateList[index - 1] = [state.substring(1)]
          }
          else {
            this.stateList[index - 1].push(state.substring(1))
          }
        }
      }
    }

    this.metricList = []
    for (var mI in this.trainableEntites["DataFields"]) {
      var metric = this.trainableEntites["DataFields"][mI]
      var index = parseInt(metric.charAt(0))
      if (this.metricList.length <= index) {
        this.metricList[index] = [metric.substring(1)]
      }
      else {
        this.metricList[index].push(metric.substring(1))
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
      'OpenFilters': activeFilters,
      'Aggregate': this.unitedStatesMap.aggregate,
      'Cumulative': this.unitedStatesMap.cumulative,
      'GroupBy': this.unitedStatesMap.groupBy
    }

    console.log(this.initialState)


  }


  closeRecommendationItem(event) {
    var index = parseInt(event.path[1].id.substring(19))
    var element = document.getElementById("RecommenderTemplate" + index);
    element.parentNode.removeChild(element);

    for (var rIndex in this.recommendationList) {
      var recommendation = this.recommendationList[rIndex]
      if (recommendation["id"] == index) {
        if (event.target.innerText == "Yes") {
          this.actionSequence[index] = recommendation["action"]
          document.getElementById("ActionTemplate" + index).childNodes[0]["innerHTML"] = recommendation["text"].replace("Do you want to: ", "")

        }
        else if (event.target.innerText == "No") {
          this.recommendationList.splice(parseInt(rIndex), 1)
        }
      }
    }

    this.updateDuringTraining();


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

    for (var i = id; i < this.actionSequence.length; i++) {
      var oldID = parseInt(i) + 1
      document.getElementById("ActionTemplate" + oldID).id = "ActionTemplate" + i
    }

    this.updateDuringTraining()


  }



  async updateDuringTraining() {

    this.addToSequence = false;
    this.functionService.changeVisualization(this, this.initialState["Visualization"])

    if (typeof this.initialState["Legend"] !== 'undefined' && this.initialState["Legend"] != null) {
      this.functionService.addLegend(this, this.initialState["Legend"])
    }
    else if (typeof this.unitedStatesMap.legend_Values !== 'undefined' && this.unitedStatesMap.legend_Values != null) {
      this.functionService.removeLegend(this, this.unitedStatesMap.legend_Values)
    }

    this.functionService.removeAllMetrics(this)

    this.functionService.addMetric(this, this.initialState["Metric"])



    var possibleFilter = ["Date", "State", "Tests", "Cases", "Deaths", "Population", "PartialVaccinated", "FullyVaccinated"]

    for (var index in possibleFilter) {
      this.functionService.removeFilter(this, [{ [possibleFilter[index]]: ["close"] }])
    }

    for (var index in this.initialState['OpenFilters']) {
      this.functionService.addFilter(this, [{ [this.initialState['OpenFilters'][index]]: ["open"] }])
    }
    this.functionService.changeFilter(this, { "State": this.initialState["States"] })

    this.functionService.changeFilter(this, this.initialState["Filters"])

    this.functionService.changeAggregate(this, this.initialState["Aggregate"])

    this.functionService.changeCumulative(this, this.initialState["Cumulative"])

    this.functionService.changeGroupBy(this, this.initialState["GroupBy"])



    for (var i = 0; i < this.actionSequence.length; i++) {
      await this.functionService.processAction(this, this.actionSequence[i])
    }
    this.addToSequence = true;

    this.update()

  }

  addElementtoITL(action, target) {

    if (this.addToSequence) {
      var returnValues = this.drillDownService.processUserInput(this, action, target, this.actionSequence)

      this.actionSequence = returnValues[1];



      for (var i = 0; i < returnValues[0].length; i++) {
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

        if (document.getElementsByClassName("metricSwitch").length > 0) {
          document.getElementsByClassName("metricSwitch")[document.getElementsByClassName("metricSwitch").length - 1].addEventListener("change", this.changedMetricAction.bind(this));
        }
        if (document.getElementsByClassName("legendSwitch").length > 0) {
          document.getElementsByClassName("legendSwitch")[document.getElementsByClassName("legendSwitch").length - 1].addEventListener("change", this.changedLegendAction.bind(this));
        }
        if (document.getElementsByClassName("stateSwitch").length > 0) {
          document.getElementsByClassName("stateSwitch")[document.getElementsByClassName("stateSwitch").length - 1].addEventListener("change", this.changedStateAction.bind(this));
        }
        if (document.getElementsByClassName("filterSwitch").length > 0) {
          document.getElementsByClassName("filterSwitch")[document.getElementsByClassName("filterSwitch").length - 1].addEventListener("change", this.changedFilterAction.bind(this));
        }

      }
      $("div[id^='RecommenderTemplate']").each(function (i, el) {
        this["style"]["display"] = "none"
      });

      for (var index in returnValues[2]) {


        this.recommendationList.push(returnValues[2][index])

        if (this.treatment == "2") {
          this.sendRecommendation(returnValues[2][index]['id'], returnValues[2][index]['text'])
        }

        if (this.treatment == "0" || this.treatment == "1") {
          var RecClone;

          RecClone = document.getElementById('RecommenderTemplate' + returnValues[2][index]['id'])

          if (RecClone == null) {
            RecClone = document.getElementById('RecommenderTemplate').cloneNode(true);
            RecClone.lastChild.parentElement.id = "RecommenderTemplate" + returnValues[2][index]['id'];
          }
          RecClone.lastChild.parentElement.style["display"] = "block";
          RecClone.childNodes[2].onclick = this.closeRecommendationItem.bind(this);
          RecClone.childNodes[3].onclick = this.closeRecommendationItem.bind(this);

          RecClone.childNodes[0].innerHTML = returnValues[2][index]['text']
          document.getElementById('itl-pane').appendChild(RecClone);
        }

      }

      //document.getElementById('itl').appendChild(clone);
    }
  }

  endTrainingMode(sendActivity) {

    this.trainingMode = false;
    this.addToSequence = false;

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
    this.actionSequence = [];


    this.initialState = null;
    this.recommendationList = [];




    document.getElementById("trainUtterance").innerHTML = "";

    for (var i = document.getElementById("itl-pane").childNodes.length - 1; 0 <= i; i--) {
      var element = document.getElementById("itl-pane").childNodes[i];
      element.parentNode.removeChild(element);
    }

  }

}


