import {
  Component,
  OnInit,
  ElementRef,
  ViewEncapsulation,
  ChangeDetectorRef,
  ViewChild,
  EventEmitter,
  Output,
  Input,
  AfterViewInit
} from "@angular/core";

import {
  Location
} from '@angular/common';
import {
  formatDate
} from '@angular/common';


import * as statesdata from "../data/states.json";

import * as d3 from "d3";

import {
  Subscription
} from "rxjs";
import {
  Router,
  NavigationEnd,
  ActivatedRoute
} from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { filter } from "rxjs/operators";
import { DrillDownService } from "../shared/drilldown.services";
import { SliderComponent } from '@progress/kendo-angular-inputs';
//import { DropDownListComponent } from '@progress/kendo-angular-dropdowns';


@Component({
  selector: "app-unitedstates-map",
  encapsulation: ViewEncapsulation.None,
  templateUrl: "./unitedstates-map.component.html",
  styleUrls: ["./unitedstates-map.component.scss"]
})
export class UnitedStatesMapComponent implements OnInit, AfterViewInit {

  //@ViewChild('slider', { static: true }) slider: SliderComponent;
  @Output() dateChanged = new EventEmitter<any>();
  @Output() toggleChanged = new EventEmitter<any>();

  @Input() filterValue = { Date: [new Date("2020-01-21").getTime(), new Date("2021-06-30").getTime()], Tests: [0, false], Cases: [0, false], Deaths: [0, false], Population: [0, false], PartialVaccinated: [0, false], FullyVaccinated: [0, false] };

  baseURL = "https://interactive-analytics.org:3001/"; //"http://127.0.0.1:5000/"
  hostElement; // Native element hosting the SVG container
  svg; // Top level SVG element
  g; // SVG Group element
  legend_Container;
  w = window;
  doc = document;
  el = this.doc.documentElement;
  body = this.doc.getElementsByTagName("body")[0];

  projection;
  path;
  that;

  stateScales = [];

  width = 600;
  height = 400;


  centered;

  legendContainerSettings = {
    x: 0,
    y: this.height,
    width: 520,
    height: 60,
    roundX: 10,
    roundY: 10
  };

  legendBoxSettings = {
    width: 80,
    height: 10,
    y: this.legendContainerSettings.y + 20
  };


  zoomSettings = {
    duration: 1000,
    ease: d3.easeCubicOut,
    zoomLevel: 5
  };

  formatDecimal = d3.format(",.0f");
  legendContainer;

  legendData = [0, 0.2, 0.4, 0.6, 0.8, 1, 2, 3];

  states: any[] = [];
  covid: any[] = [];
  merged: any[] = [];
  newCases: any[] = [];

  countriesBounds: any[] = [];

  zoom;
  active;

  legendLabels: any[] = [];

  numBars = 6;
  start = 1;
  end = 900000; //1300000

  statesSelect = [];
  datesSelect = [];
  dateSetting = "Selection";

  legendChanged: boolean = true;
  treatment: string;
  task: string;
  metric = "barChart";
  date = "2021-06-30";
  dateMin = "2020-01-21";
  dateMax = "2021-06-30";
  userID;
  legend_Values: string;
  y_Axis_Values: string[] = [];
  chartType: string = "barChart";

  sqrtScale;
  colorScaleSqrt;

  color_Scatter = ["#3957ff", "#c9080a", "#fec7f8", "#0b7b3e", "#0bf0e9", "#c203c8", "#fd9b39", "#888593", "#906407", "#98ba7f", "#fe6794", "#10b0ff", "#ac7bff", "#fee7c0", "#964c63", "#1da49c", "#0ad811", "#bbd9fd", "#fe6cfe", "#297192", "#d1a09c", "#78579e", "#81ffad", "#739400", "#ca6949", "#d9bf01", "#646a58", "#d5097e", "#bb73a9", "#ccf6e9", "#d3fe14", "#9cb4b6", "#b6a7d4", "#9e8c62", "#6e83c8", "#01af64", "#a71afd", "#cfe589", "#d4ccd1", "#fd4109", "#bf8f0e", "#2f786e", "#4ed1a5", "#d8bb7d", "#a54509", "#6a9276", "#a4777a", "#fc12c9", "#606f15", "#3cc4d9", "#f31c4e", "#73616f", "#f097c6", "#fc8772", "#92a6fe", "#875b44", "#699ab3"]
  unqiueGroupArray: string[] = [];

  aggregate = "D";
  cumulative = "Total";
  groupBy = "OR"

  private _routerSub = Subscription.EMPTY;

  tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  /* slider */
  public value: any[] = ["2020-01-01", "2021-06-30"];


  constructor(
    private elRef: ElementRef,
    public router: Router,
    public route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private drillDownService: DrillDownService,
    private location: Location,
    private http: HttpClient
  ) {

    this.location = location;
    this.hostElement = this.elRef.nativeElement;

    this._routerSub = router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.route.params.subscribe(params => {

          if (this.route.snapshot.params['userID']) {
            this.userID = this.route.snapshot.params['userID'];
          }
          else {
            this.userID = "0000000"
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

          if (this.route.snapshot.params['selectedMetric']) {
            this.metric = this.route.snapshot.params['selectedMetric'];
          }
          /*
          if (this.route.snapshot.params['selectedDate']) {
            //this.date = this.route.snapshot.params['selectedDate'];
            var value = new Date(this.date);
            value.setHours(23, 59, 59, 999);
            this.value[1] = value.getTime();
            //this.slider.value[1] = value.getTime();
          }
          else {
            this.date = formatDate(new Date().setDate(new Date().getDate() - 1), 'yyyy-MM-dd', 'en');
          }
          */

          // Go to homepage default
          if (this.router.url === "/") {
            this.location.go('unitedstates/' + this.metric + "/" + this.date + "/" + this.userID + "/" + this.treatment + "/" + this.task);
          }

          if (this.router.url.indexOf('/unitedstates') != -1 || this.router.url === "/") {
            this.removeExistingMapFromParent();
            this.updateMap();
          }
          /**/




        });
      });
  }

  ngOnInit() {
  }

  public ngAfterViewInit(): void {
    parent.postMessage("IframeLoaded", "*")
    //console.log('Site Loaded')


  }

  public removeExistingMapFromParent() {
    // !!!!Caution!!!
    // Make sure not to do;
    //     d3.select('svg').remove();
    // That will clear all other SVG elements in the DOM
    d3.select(this.hostElement)
      .selectAll("svg")
      .remove();

    d3.select("#testSVG")
      .selectAll("svg")
      .remove();
  }

  public createSVG() {
    this.active = d3.select(null);

    this.svg = d3
      .select(this.hostElement)
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height + 75)
      .attr("style", 'display: block; margin: auto; position: absolute; left: 10px; top: 200px;')
      .on("click", this.stopped, true);
  }

  async updateMap() {
    document.getElementById("loading")["style"]["display"] = "block"
    this.childUpdateMap()
  }

  async childUpdateMap() {

    this.width = document.getElementById("map").clientWidth
    document.getElementById("testSVG").style.left = String(this.width - 130) + 'px'


    var that = this;
    //if(this.metric == "Total Cases") { //Total Cases
    that.end = 900000;
    //}
    //else if(this.metric == "Total Deaths"){ //Total Deaths
    //that.end = 20000;
    //}



    // Set date to max date if no data available
    if (new Date(that.date) > new Date(that.dateMax)) {
      that.date = that.dateMax;
      //that.value[1] = that.max;
      this.location.go('unitedstates/' + this.metric + "/" + that.date + "/" + that.userID + "/" + this.treatment + "/" + this.task);
    }



    if (this.chartType == "barChart") {

      var dataColumns = this.y_Axis_Values//[that.treatment, "Stage_PartialVaccinateds"]//['Cases', 'Deaths']; 
      var legend = this.legend_Values//that.task//"State"

      var z = d3.scaleOrdinal().domain(["Cases", "Deaths", "Population", "PartialVaccinated", "FullyVaccinated", "Tests"]).range(["blue", "orange", "purple", "darkseagreen", "green", "#22cee0"])


      if (this.legendChanged) {
        this.legendChanged = false;
        await $.post(this.baseURL + '/barChart', { y: dataColumns, legend: legend, Aggregate: this.aggregate, Cumulative: this.cumulative, GroupBy: this.groupBy, Date: formatDate(new Date(this.filterValue["Date"][1]), 'yyyy-MM-dd', 'en') }, function (dataMax) {
          var dataTransfer = {
            TestsMax: d3.max(dataMax, d => d['Tests']),
            CasesMax: d3.max(dataMax, d => d['Cases']),
            DeathsMax: d3.max(dataMax, d => d['Deaths']),
            PopulationMax: d3.max(dataMax, d => d['Population']),
            PartialVaccinatedMax: d3.max(dataMax, d => d['PartialVaccinated']),
            FullyVaccinatedMax: d3.max(dataMax, d => d['FullyVaccinated'])
          }
          that.dateChanged.emit(dataTransfer)
        }, "json");


      }

      var filterBar = {
        0: { dataField: 'State', target: that.statesSelect },
        1: { dataField: 'Date', target: that.datesSelect },
        2: { dataField: 'Tests', From: this.filterValue["Tests"][0], To: this.filterValue["Tests"][1] },
        3: { dataField: 'Cases', From: this.filterValue["Cases"][0], To: this.filterValue["Cases"][1] },
        4: { dataField: 'Deaths', From: this.filterValue["Deaths"][0], To: this.filterValue["Deaths"][1] },
        5: { dataField: 'Population', From: this.filterValue["Population"][0], To: this.filterValue["Population"][1] },
        6: { dataField: 'PartialVaccinated', From: this.filterValue["PartialVaccinated"][0], To: this.filterValue["PartialVaccinated"][1] },
        7: { dataField: 'FullyVaccinated', From: this.filterValue["FullyVaccinated"][0], To: this.filterValue["FullyVaccinated"][1] }
      }

      console.log(filterBar)
      await $.post(this.baseURL + 'barChart', { y: dataColumns, legend: legend, DateSetting: this.dateSetting, Aggregate: this.aggregate, Cumulative: this.cumulative, GroupBy: this.groupBy, Date: formatDate(new Date(this.filterValue["Date"][1]), 'yyyy-MM-dd', 'en'), Filter: JSON.stringify(filterBar) }, function (data) {
        that.newCases = data
        that.removeExistingMapFromParent()
      }, "json");







      this.createSVG()

      that.g = this.svg.append("g")
        .attr("transform", `translate(${60},${30})`);

      var xScale0 = d3.scaleBand().range([0, this.width - 60 - 50]).padding(.2)
      var xScale1 = d3.scaleBand()
      var yScale = d3.scaleLinear().range([this.height - 10 - 30, 0])

      //var z = d3.scaleOrdinal()
      //  .range(color);



      var sorted = false

      if (sorted) {
        that.newCases.sort(function (b, a) {
          return a[dataColumns[0]] - b[dataColumns[0]];
        });
      }

      xScale0.domain(that.newCases.map(d => d[legend]))

      var state_name = that.g.selectAll("." + legend)
        .data(that.newCases)
        .enter().append("g")
        .attr("class", legend)
        .attr("transform", d => `translate(${xScale0(d[legend])},0)`);

      var max_Value = 1.25 * d3.max(that.newCases, d => Math.max.apply(null, Object.keys(d).map(function (x) { if (typeof d[x] != "string" && dataColumns.includes(x)) { return d[x] } else { return 0 } })))
      yScale.domain([0, max_Value]) //d3.max(that.newCases, d => d[dataColumns[0]] > d[dataColumns[1]] ? d[dataColumns[0]] : d[dataColumns[1]])]


      var formatSimpleNumber = d3.format(".1f");

      var xAxis = d3.axisBottom(xScale0).ticks(10).tickSizeOuter(0);
      var yAxis = d3.axisLeft(yScale).ticks(10).tickSizeOuter(0)
        .tickFormat(function (d: number) {

          if (max_Value > 700000) {
            var s = formatSimpleNumber(d / 1e6);
            return this.parentNode.nextSibling
              ? "\xa0" + s
              : "" + s + " M";
          }
          else if (max_Value > 700) {
            var s = formatSimpleNumber(d / 1e3);
            return this.parentNode.nextSibling
              ? "\xa0" + s
              : "" + s + " K";
          }
          else {
            var s = formatSimpleNumber(d);
            return this.parentNode.nextSibling
              ? "\xa0" + s
              : "" + s;
          }
        });

      /**
       * Added for new UI
       */
      var groupByLegend;
      if (legend == "Date") {
        groupByLegend = "State"
      }
      else if (legend == "State") {
        groupByLegend = "Date"
      }


      var unqiueLegendArray = []

      for (var i = 0, n = this.newCases.length; i < n; i++) {
        if (!unqiueLegendArray.includes(this.newCases[i][legend])) {
          unqiueLegendArray.push(this.newCases[i][legend])
        }
      }

      var interval = Math.ceil(unqiueLegendArray.length / 20)

      this.unqiueGroupArray = []

      for (var i = 0, n = this.newCases.length; i < n; i++) {
        if (!this.unqiueGroupArray.includes(this.newCases[i][groupByLegend])) {
          this.unqiueGroupArray.push(this.newCases[i][groupByLegend])
        }
      }


      /**Ended */


      xScale1.domain(dataColumns).range([0, xScale0.bandwidth()])

      for (var i = 0, n = dataColumns.length; i < n; i++) {
        var width = xScale1.bandwidth() / this.unqiueGroupArray.length
        state_name.selectAll(".bar." + dataColumns[i])
          .data(d => [d])
          .enter()
          .append("rect")
          .attr("class", d => {
            return "bar " + dataColumns[i] + "|" + d["Date"]
          })
          .attr("fill", z(dataColumns[i]))
          .attr("x", d => xScale1(dataColumns[i]) + this.unqiueGroupArray.indexOf(d["Date"]) * width)
          .attr("y", d => yScale(d[dataColumns[i]]))
          .attr("width", width)
          .attr("height", d => {
            if (d[dataColumns[i]] == 0) {
              return 0
            }
            else {
              return this.height - 10 - 30 - yScale(d[dataColumns[i]])
            }
          })
          .on("mouseover", function (d, unknown, bar) {
            that.tooltip
              .transition()
              .duration(200)
              .style("opacity", 0.9);
            var dateText = d["Date"]
            if (that.aggregate == "M") {
              dateText = dateText.replace("-01", "");
            }
            else if (that.aggregate == "Y") {
              dateText = dateText.replace("-01-01", "");
            }
            that.tooltip
              .html(

                d["State"] + "<br/>" + dateText + "<br/><b>" + bar[0].classList[1].split("|")[0] + ":</b> " + that.formatDecimal(d[bar[0].classList[1].split("|")[0]])
              )
              .style("left", d3.event.pageX + "px")
              .style("top", d3.event.pageY + "px");

            that.changeDetectorRef.detectChanges();
          })
          .on("mouseout", function (d) {
            that.tooltip
              .transition()
              .duration(300)
              .style("opacity", 0);

            that.changeDetectorRef.detectChanges();
          });

      }


      this.legend_Container = d3
        .select("#testSVG");

      var legend_Axis = this.legend_Container.append("svg")
        .attr("font-family", "sans-serif")
        .attr("font-size", 9)
        .attr("text-anchor", "end")
        .attr("height", 20 * dataColumns.length)
        .selectAll("g")
        .data(dataColumns.slice())
        .enter().append("g")
        .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

      legend_Axis.append("rect")
        .attr("x", 80) //this.width - 19 - 60
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", function (d) { return z(d) });

      legend_Axis.append("text")
        .attr("x", 75)//this.width - 24 - 60
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text(function (d) { return d; });






      // Add the X Axis
      var xAxis_Vis = that.g.append("g");

      xAxis_Vis.attr("class", "x axis")
        .attr("transform", `translate(0,${this.height - 10 - 30})`)
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)")
        .each(function (d, i) {
          if (i % interval != 0 && legend !== "State") {
            d3.select(this).attr("visibility", "hidden")
          }
        });

      xAxis_Vis.selectAll("line")
        .each(function (d, i) {
          if (i % interval != 0 && legend == "Date") {
            d3.select(this).attr("visibility", "hidden")
          }
        });

      // Add the Y Axis
      that.g.append("g")
        .attr("class", "y axis")
        .call(yAxis);




      this.removeAllExceptOne()

      /**/

    }
    /**/


    if (this.chartType == "scatter") {


      //that.g = this.svg.append("g")
      //.attr("transform", `translate(${0},${30})`);





      if (this.y_Axis_Values.length == 1) {
        var x_Axis = this.y_Axis_Values[0]
        var y_Axis = ""
      }
      else if (this.y_Axis_Values.length > 1) {
        var x_Axis = this.y_Axis_Values[0]
        var y_Axis = this.y_Axis_Values[1]
      }



      var legend = this.legend_Values

      var groupByLegend;
      if (legend == "Date") {
        groupByLegend = "State"
      }
      else if (legend == "State") {
        groupByLegend = "Date"
      }

      if (this.legendChanged) {
        await $.post(this.baseURL + 'scatter', { x: x_Axis, y: y_Axis, legend: legend, Aggregate: this.aggregate, Cumulative: this.cumulative, GroupBy: this.groupBy, Date: formatDate(new Date(that.filterValue["Date"][1]), 'yyyy-MM-dd', 'en') }, function (data) {
          var dataTransfer = {
            TestsMax: d3.max(data, d => d['Tests']),
            CasesMax: d3.max(data, d => d['Cases']),
            DeathsMax: d3.max(data, d => d['Deaths']),
            PopulationMax: d3.max(data, d => d['Population']),
            PartialVaccinatedMax: d3.max(data, d => d['PartialVaccinated']),
            FullyVaccinatedMax: d3.max(data, d => d['FullyVaccinated'])
          }
          that.dateChanged.emit(dataTransfer)
        }, "json");

        this.legendChanged = false;
      }

      var filterScatter = {
        0: { dataField: 'State', target: that.statesSelect },
        1: { dataField: 'Date', target: that.datesSelect },
        2: { dataField: 'Tests', From: this.filterValue["Tests"][0], To: this.filterValue["Tests"][1] },
        3: { dataField: 'Cases', From: this.filterValue["Cases"][0], To: this.filterValue["Cases"][1] },
        4: { dataField: 'Deaths', From: this.filterValue["Deaths"][0], To: this.filterValue["Deaths"][1] },
        5: { dataField: 'Population', From: this.filterValue["Population"][0], To: this.filterValue["Population"][1] },
        6: { dataField: 'PartialVaccinated', From: this.filterValue["PartialVaccinated"][0], To: this.filterValue["PartialVaccinated"][1] },
        7: { dataField: 'FullyVaccinated', From: this.filterValue["FullyVaccinated"][0], To: this.filterValue["FullyVaccinated"][1] }
      }
      await $.post(this.baseURL + 'scatter', { x: x_Axis, y: y_Axis, legend: legend, DateSetting: this.dateSetting, Aggregate: this.aggregate, Cumulative: this.cumulative, GroupBy: this.groupBy, Date: formatDate(new Date(that.filterValue["Date"][1]), 'yyyy-MM-dd', 'en'), Filter: JSON.stringify(filterScatter) }, function (data) {
        that.newCases = data
        that.removeExistingMapFromParent()
      }, "json");







      this.createSVG()

      var legend_Data = that.newCases.map(d => d[legend])
      legend_Data = [...new Set(legend_Data)]
      var z = d3.scaleOrdinal().domain(legend_Data)
        .range(this.color_Scatter);

      // Add X axis
      const x = d3.scaleLinear()
        .domain([0, 1.1 * d3.max(that.newCases, d => d[x_Axis])])
        .range([60, this.width - 50]);
      this.svg.append("g")
        .attr("transform", "translate(0," + this.height + ")")
        .call(d3.axisBottom(x).ticks(5).tickFormat(d3.format("d")));

      // text label for the x axis
      this.svg.append("text")
        .attr("transform",
          "translate(" + (this.width - 50) + " ," +
          (this.height - 10) + ")")
        .style("text-anchor", "middle")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("font-weight", "bold")
        .text(x_Axis);

      // Add Y axis
      const y = d3.scaleLinear()
        .domain([0, 1.1 * d3.max(that.newCases, d => d[y_Axis])])
        .range([this.height, 0]);
      this.svg.append("g")
        .attr("transform", "translate(60,0)")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("x", 2)
        .attr("y", y(y.ticks().pop()) + 0.5)
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "start")
        .text(y_Axis);

      // Add dots
      const dots = this.svg.append('g');
      dots.selectAll("dot")
        .data(that.newCases)
        .enter()
        .append("circle")
        .attr("cx", d => { if (typeof d[x_Axis] != 'undefined') { return x(d[x_Axis]) } else { return 60 } })
        .attr("cy", d => { if (typeof d[y_Axis] != 'undefined') { return y(d[y_Axis]) } else { return 400 } })
        .attr("r", 7)
        .style("opacity", .5)
        .style("fill", function (d) { return z(d[legend]) })
        .on("mouseover", function (d) {
          that.tooltip
            .transition()
            .duration(200)
            .style("opacity", 0.9);

          var dateText = d["Date"]
          if (that.aggregate == "M") {
            dateText = dateText.replace("-01", "");
          }
          else if (that.aggregate == "Y") {
            dateText = dateText.replace("-01-01", "");
          }

          that.tooltip
            .html(
              d["State"] + "<br/>" + dateText + "<br/><b>" + x_Axis + "</b>: " + that.formatDecimal(d[x_Axis]) + "<br/><b>" + y_Axis + "</b>: " + that.formatDecimal(d[y_Axis])
            )
            .style("left", d3.event.pageX - 70 + "px")
            .style("top", d3.event.pageY + 10 + "px");

          that.changeDetectorRef.detectChanges();
        })
        .on("mouseout", function (d) {
          that.tooltip
            .transition()
            .duration(300)
            .style("opacity", 0);

          that.changeDetectorRef.detectChanges();
        });

      this.legend_Container = d3
        .select("#testSVG");

      console.log(legend_Data.slice())

      var legend_Axis = this.legend_Container.append("svg")
        .attr("height", 3 * this.height - 60)
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
        .attr("height", 20 * legend_Data.length)
        .selectAll("g")
        .data(legend_Data.slice())
        .enter().append("g")
        .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

      legend_Axis.append("rect")
        //.data(that.newCases)
        .attr("x", 80) //this.width - 19 - 60
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", function (d) { return z(d) });

      legend_Axis.append("text")
        .attr("x", 75) //this.width - 24 - 60
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text(function (d) { return d; });


      this.removeAllExceptOne()


    }



    if (this.chartType == "Map") {

      if (this.y_Axis_Values.length >= 1) {
        var y_Axis = this.y_Axis_Values[0]
      }

      if (this.legendChanged) {
        await $.post(this.baseURL + 'mapChart', { value: y_Axis, Aggregate: this.aggregate, Cumulative: this.cumulative }, function (data) {
          var dataTransfer = {
            TestsMax: d3.max(data, d => d['Tests']),
            CasesMax: d3.max(data, d => d['Cases']),
            DeathsMax: d3.max(data, d => d['Deaths']),
            PopulationMax: d3.max(data, d => d['Population']),
            PartialVaccinatedMax: d3.max(data, d => d['PartialVaccinated']),
            FullyVaccinatedMax: d3.max(data, d => d['FullyVaccinated'])
          }
          that.dateChanged.emit(dataTransfer)
        }, "json");

        this.legendChanged = false;
      }

      var filterMap = {
        0: { dataField: 'State', target: that.statesSelect },
        1: { dataField: 'Date', target: that.datesSelect },
        2: { dataField: 'Tests', From: this.filterValue["Tests"][0], To: this.filterValue["Tests"][1] },
        3: { dataField: 'Cases', From: this.filterValue["Cases"][0], To: this.filterValue["Cases"][1] },
        4: { dataField: 'Deaths', From: this.filterValue["Deaths"][0], To: this.filterValue["Deaths"][1] },
        5: { dataField: 'Population', From: this.filterValue["Population"][0], To: this.filterValue["Population"][1] },
        6: { dataField: 'PartialVaccinated', From: this.filterValue["PartialVaccinated"][0], To: this.filterValue["PartialVaccinated"][1] },
        7: { dataField: 'FullyVaccinated', From: this.filterValue["FullyVaccinated"][0], To: this.filterValue["FullyVaccinated"][1] }
      }

      await $.post(this.baseURL + 'mapChart', { value: y_Axis, DateSetting: this.dateSetting, Aggregate: this.aggregate, Cumulative: this.cumulative, Filter: JSON.stringify(filterMap) }, function (data) {
        that.newCases = data
      }, "json");






      this.createSVG()

      that.g = this.svg.append("g");

      that.states = statesdata.features;

      that.merged = that.join(that.newCases, that.states, "State", "name", function (
        state,
        covid
      ) {
        var metric;
        metric = covid ? covid[y_Axis] : 0;

        return {
          name: state.properties.name,
          metric: metric,
          geometry: state.geometry,
          type: state.type,
          abbrev: state.properties.name
        };
      });

      this.projection = d3
        .geoAlbersUsa()
        .scale(800)
        .translate([this.width / 2, this.height / 2]);


      this.path = d3.geoPath().projection(this.projection);

      // Sqrt Scale

      that.sqrtScale = d3.scaleSqrt().domain([1, 0.9 * d3.max(that.merged, d => d["metric"])]).range([0, 1]);

      that.colorScaleSqrt = d3.scaleSequential(d =>
        d3.interpolateReds(that.sqrtScale(d))
      );


      that.legendLabels = [
        "<" + that.getMetrics(0.2),
        ">" + that.getMetrics(0.2),
        ">" + that.getMetrics(0.4),
        ">" + that.getMetrics(0.6),
        ">" + that.getMetrics(0.8),
        ">" + that.getMetrics(1)
      ];


      that.g
        .attr("class", "county")
        .selectAll("path")
        .data(that.merged)
        .enter()
        .append("path")
        .attr("d", that.path)
        .attr("id", function (d) { return d.name.replace(" ", "_"); })
        .attr("class", "feature")
        .on("click", function (d) {
          console.log("drillDownMouseUS")
          //that.clicked(d, that, this);
        })
        .attr("class", "county")
        .attr("stroke", function (d) {
          if (that.statesSelect.includes(d.abbrev)) {
            return "#877AFF"//"#ffa500"
          }
          else {
            return "grey";
            //return "#f2f2f2";
          }
        })
        .attr("stroke-width", function (d) {
          if (that.statesSelect.includes(d.abbrev)) {
            return 3
          }
          else {
            return 0.3;
          }
        })
        .attr("cursor", "pointer")
        .attr("fill", function (d) {
          var metric = d.metric;
          var metric = metric ? metric : 0;
          if (false) {//that.statesSelect.includes(d.abbrev)) {
            return "#1e90ff"//"#ffa500"
          }
          else if (metric > 0) {
            return that.colorScaleSqrt(metric);
          } else {
            return "#d6d3d3";
            //return "#f2f2f2";
          }
        })
        .on("mouseover", function (d) {
          that.tooltip
            .transition()
            .duration(200)
            .style("opacity", 0.9);

          that.tooltip
            .html(
              d.name + "<br/><b>Total " + y_Axis + ":</b> " + that.formatDecimal(d.metric)
            )
            .style("left", d3.event.pageX + "px")
            .style("top", d3.event.pageY + "px");

          that.changeDetectorRef.detectChanges();
        })
        .on("mouseout", function (d) {
          that.tooltip
            .transition()
            .duration(300)
            .style("opacity", 0);

          that.changeDetectorRef.detectChanges();
        });

      /*  
      that.legendContainer = that.svg
        .append("rect")
        .attr("x", that.legendContainerSettings.x)
        .attr("y", that.legendContainerSettings.y)
        .attr("rx", that.legendContainerSettings.roundX)
        .attr("ry", that.legendContainerSettings.roundY)
        .attr("width", that.legendContainerSettings.width)
        .attr("height", that.legendContainerSettings.height)
        .attr("id", "legend-container");
        */
      var legend_Axis = that.svg.selectAll("g.legend")
        .data(that.legendData)
        .enter().append("g")
        .attr("class", "legend")

      legend_Axis
        .append("text")
        .attr("x", that.legendContainerSettings.x + 13)
        .attr("y", that.legendContainerSettings.y + 14)
        .style("font-size", 14)
        .text("COVID-19 " + y_Axis + " by State");

      legend_Axis
        .append("rect")
        .attr("x", function (d, i) {
          return (
            that.legendContainerSettings.x + that.legendBoxSettings.width * i + 20
          );
        })
        .attr("y", that.legendBoxSettings.y)
        .attr("width", that.legendBoxSettings.width)
        .attr("height", that.legendBoxSettings.height)
        .style("fill", function (d, i) {
          if (d <= 1) {
            return that.colorScaleSqrt(that.sqrtScale.invert(d));
          }
          else {
            return "#ffffff";
          }
        })
        .style("opacity", 1);



      legend_Axis
        .append("text")
        .attr("x", function (d, i) {
          return (
            that.legendContainerSettings.x + that.legendBoxSettings.width * i + 30
          );
        })
        .attr("y", that.legendContainerSettings.y + 50)
        .style("font-size", 12)
        .text(function (d, i) {
          if (d <= 1) {
            return that.legendLabels[i];
          }
          else {
            return "";
          }
        });

      this.removeAllExceptOne()


    }
    document.getElementById("loading")["style"]["display"] = "none"
  }

  getMetrics(rangeValue) {
    return this.formatDecimal(this.sqrtScale.invert(rangeValue));
  }

  reset(d, p) {
    p.active.classed("active", false);
    p.active = d3.select(null);

    p.svg
      .transition()
      .duration(750)
      // .call( zoom.transform, d3.zoomIdentity.translate(0, 0).scale(1) ); // not in d3 v4
      .call(p.zoom.transform, d3.zoomIdentity); // updated for d3 v4
  }

  // If the drag behavior prevents the default click,
  // also stop propagation so we don’t click-to-zoom.
  stopped() {
    if (d3.event.defaultPrevented) d3.event.stopPropagation();
  }

  getDate(value) {
    return new Date(value)
  }

  zoomed(d, p) {
    p.g.style("stroke-width", 1.5 / d3.event.transform.k + "px");
    // g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")"); // not in d3 v4
    p.g.attr("transform", d3.event.transform); // updated for d3 v4
  }

  clicked(d, p, e) {
    if (p.active.node() === e) return p.reset(d, p);
    //p.active.classed("active", false);
    p.active = d3.select(e).classed("active", true);


    var stateParameters = this.drillDownService.countiesMapped.find(stateElement => stateElement.State === d.abbrev)

    // Clean up tool tips
    p.tooltip
      .transition()
      .duration(300)
      .style("opacity", 0);


    p.svg
      .transition()
      .duration(750)
      .call(
        p.zoom.transform,
        d3.zoomIdentity.translate(stateParameters.x, stateParameters.y).scale(stateParameters.scale)
      )
      .on("end", p.drillDown(d.abbrev, p.metric, p.date)); // updated for d3 v4


  }

  select(state) {
    d3.select('path#' + state).dispatch('click');
  }

  drillDown(state, metric, date) {
    var stateParameters = this.drillDownService.countiesMapped.find(stateElement => stateElement.State === state)


    this.drillDownService.scale = stateParameters.scale;
    if (state == "Alaska" || state == "Hawaii") {
      this.drillDownService.x = (stateParameters.x - 300);
      this.drillDownService.y = stateParameters.y - 50;
    } else {
      this.drillDownService.x = stateParameters.x;
      this.drillDownService.y = stateParameters.y;
    }

    this.router.navigate(["/counties/" + state + "/" + metric + "/" + date + "/" + this.userID + "/" + this.treatment + "/" + this.task]);
  }

  join(lookupTable, mainTable, lookupKey, mainKey, select) {
    var l = lookupTable.length,
      m = mainTable.length,
      lookupIndex = [],
      output = [];
    for (var i = 0; i < l; i++) {
      // loop through l items
      var row = lookupTable[i];
      lookupIndex[row[lookupKey]] = row; // create an index for lookup table
    }
    for (var j = 0; j < m; j++) {
      // loop through m items
      var y = mainTable[j];
      var x = lookupIndex[y.properties[mainKey]]; // get corresponding row from lookupTable
      output.push(select(y, x)); // select only the columns you need
    }
    return output;
  }


  removeAllExceptOne() {
    while (document.getElementById("testSVG").childNodes.length > 1) {
      document.getElementById("testSVG").removeChild(document.getElementById("testSVG").lastChild);
    }

    while (document.getElementById("unitedStatesMap").childNodes.length > 2 && document.getElementById("unitedStatesMap").lastChild["id"] !== "Header") {
      document.getElementById("unitedStatesMap").removeChild(document.getElementById("unitedStatesMap").lastChild);
    }

    while (document.getElementById("unitedStatesMap").childNodes.length > 2 && document.getElementById("unitedStatesMap").firstChild["id"] !== "Header") {
      document.getElementById("unitedStatesMap").removeChild(document.getElementById("unitedStatesMap").firstChild);
    }

  }


  switchToggled(event) {
    if (typeof this.legend_Values == 'undefined' && event.target == "GroupBy") {
      document.getElementById('GroupBy')["checked"] = true
    }
    else {
      this.toggleChanged.emit({ [event["target"]["id"]]: event["target"]["checked"] })
    }

  }





}
