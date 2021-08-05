import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { param } from 'jquery';

import {
  formatDate
} from '@angular/common';

@Injectable()
export class FunctionService {

  public x = 0;
  public y = 0;
  public scale = 0;
  public date;
  public tab;
  public fieldToColor = { "Visualizations": "#1F8FFF", "Legend": "#FF7738", "DataFields": "#00FFE6", "Filter": "#877AFF" };

  public countiesMapped = [
    { x: -205.73618706867472, y: -120.8440413577797, scale: 6.649404482685333, State: "Washington" }, { x: -8.785780244993873, y: -249.4466532931831, scale: 4.854484663057255, State: "Oregon" }, { x: 167.96098612456785, y: -242.00177410680072, scale: 2.3667009586876726, State: "California" }, { x: 14.309466348077763, y: -384.8974141913285, scale: 3.304011855212316, State: "Nevada" }, { x: -212.40394484010665, y: -819.3324382386521, scale: 4.091973885062643, State: "Arizona" }, { x: -342.72661460469226, y: -606.9319572025778, scale: 4.609290523753388, State: "Utah" }, { x: -119.55887346357639, y: -95.79957241963422, scale: 3.3676599753839076, State: "Idaho" }, { x: -538.4938226844387, y: -145.33870472436456, scale: 4.7796153753966895, State: "Montana" }, { x: -755.5293171996555, y: -538.3448045618981, scale: 5.5998798631768025, State: "Wyoming" }, { x: -848.4836220314221, y: -875.2178383348062, scale: 5.655619484264053, State: "Colorado" }, { x: -554.4035171653554, y: -939.9896524416026, scale: 4.483461271679277, State: "New Mexico" }, { x: 148.227717407787, y: -952.2334134015246, scale: 3.3778457847984233, State: "Alaska" }, { x: -1055.2284679791185, y: -2639.182947406429, scale: 7.882195159548647, State: "Hawaii" }, { x: -315.3170712354557, y: -522.8154797900911, scale: 2.3795775958183523, State: "Texas" }, { x: -1263.439487246948, y: -1192.2356192143354, scale: 5.655508306243363, State: "Oklahoma" }, { x: -1549.407083753378, y: -1128.9424810795547, scale: 6.58698795075904, State: "Kansas" }, { x: -1283.9770310996325, y: -738.2272860633302, scale: 5.907641523225743, State: "Nebraska" }, { x: -1534.4480449493387, y: -641.3352695099757, scale: 6.963588913957059, State: "South Dakota" }, { x: -1666.282182752111, y: -361.4157211354035, scale: 7.428896600527183, State: "North Dakota" }, { x: -1154.6288218865272, y: -202.3474716135405, scale: 4.3970159837541125, State: "Minnesota" }, { x: -1823.6632176398944, y: -460.9992752093533, scale: 5.806986334792256, State: "Wisconsin" }, { x: -1349.220428522859, y: -244.80216043966675, scale: 4.101286532342382, State: "Michigan" }, { x: -2367.3055752760374, y: -1025.6946352531495, scale: 8, State: "Iowa" }, { x: -1637.082792885701, y: -944.2153378378212, scale: 5.605097984959929, State: "Missouri" }, { x: -1424.4421557626683, y: -635.8170436279114, scale: 4.586521439603904, State: "Illinois" }, { x: -2178.5865600204147, y: -1605.932871775726, scale: 7.097376299972705, State: "Arkansas" }, { x: -2079.8835407843367, y: -1820.7745426990905, scale: 6.60136225766366, State: "Louisiana" }, { x: -1685.4654889747344, y: -1285.5122883090255, scale: 5.2513045144455495, State: "Mississippi" }, { x: -2101.851016013818, y: -1145.139108955037, scale: 5.74697092121211, State: "Tennessee" }, { x: -2527.334590796427, y: -1199.106312541743, scale: 6.737048216352523, State: "Kentucky" }, { x: -2734.918143644584, y: -940.3136357654926, scale: 6.816859361941855, State: "Ohio" }, { x: -2203.456667456366, y: -896.7895514295842, scale: 6.107276069178573, State: "Indiana" }, { x: -3143.945766600755, y: -1133.9842347693534, scale: 7.234632283037812, State: "West Virginia" }, { x: -3676.9592362809017, y: -1011.0168584241837, scale: 8, State: "Pennsylvania" }, { x: -2658.0724661107947, y: -468.92246175206003, scale: 5.766493550715145, State: "New York" }, { x: -3996.882506412917, y: -583.2665278905051, scale: 8, State: "Vermont" }, { x: -4108.066825716087, y: -556.2485314601263, scale: 8, State: "New Hampshire" }, { x: -2877.775252048038, y: -205.23501523100686, scale: 5.588389737455319, State: "Maine" }, { x: -4132.497679558311, y: -738.2870019077313, scale: 8, State: "Massachusetts" }, { x: -4159.28645800684, y: -808.03513348357, scale: 8, State: "Rhode Island" }, { x: -4065.1938575946588, y: -848.4859560718132, scale: 8, State: "Connecticut" }, { x: -3939.463815190882, y: -1033.534425252104, scale: 8, State: "New Jersey" }, { x: -3905.8593349052408, y: -1163.2809391659457, scale: 8, State: "Delaware" }, { x: -3751.682777610636, y: -1203.4339481207285, scale: 8, State: "Maryland" }, { x: -2694.9918374249273, y: -1007.4351191309825, scale: 6.151808662039494, State: "Virginia" }, { x: -2484.583458755866, y: -1109.283742201968, scale: 5.734235489352502, State: "North Carolina" }, { x: -3526.076978967004, y: -1866.180389582726, scale: 8, State: "South Carolina" }, { x: -2292.8399157656145, y: -1363.7147388171231, scale: 5.7117648846434514, State: "Georgia" }, { x: -1885.311521645016, y: -1271.7163611848555, scale: 5.252001824709952, State: "Alabama" }, { x: -1840.0661318980315, y: -1378.395602712204, scale: 4.68662785409465, State: "Florida" }
  ]


  //[{"x": -850.3577045178033, "y": -151.05505169722517, "scale": 6.649404482685333, "State": "Washington"}, {"x": -415.7031149272542, "y": -311.80831661647915, "scale": 4.854484663057255, "State": "Oregon"}, {"x": 66.4476319935041, "y": -302.502217633501, "scale": 2.3667009586876726, "State": "California"}, {"x": -224.0344118621956, "y": -481.1217677391601, "scale": 3.304011855212314, "State": "Nevada"}, {"x": -196.07855522323837, "y": -1538.7027280511045, "scale": 4.1949569591934, "State": "Alaska"}, {"x": -2041.6660767265062, "y": -3298.978684258036, "scale": 7.882195159548647, "State": "Hawaii"}, {"x": -590.1621889817111, "y": -1024.1655477983154, "scale": 4.091973885062644, "State": "Arizona"},{"x": -807.383773249971, "y": -758.664946503222, "scale": 4.609290523753387, "State": "Utah"}, {"x": -398.0528892447817, "y": -119.74946552454321, "scale": 3.3676599753839107, "State": "Idaho"}, {"x": -1145.6979748642486, "y": -202.7619375574405, "scale": 5.013114113278854, "State": "Montana"}, {"x": -1427.3990321331332, "y": -672.9310057023724, "scale": 5.599879863176801, "State": "Wyoming"}, {"x": -1549.444573387005, "y": -1094.0222979185091, "scale": 5.655619484264058, "State": "Colorado"}, {"x": -1058.7678299830184, "y": -1174.9870655520033, "scale": 4.4834612716792765, "State": "New Mexico"}, {"x": -539.001986605247, "y": -653.5193497376141, "scale": 2.379577595818353, "State": "Texas"}, {"x": -2759.5310702615275, "y": -1962.5021885286505, "scale": 7.190061413234994, "State": "Oklahoma"}, {"x": -3167.6673246992423, "y": -1767.5268134905518, "scale": 8, "State": "Kansas"}, {"x": -2848.350270480951, "y": -1251.1636577013278, "scale": 7.561781149728949, "State": "Nebraska"}, {"x": -2544.2368921521697, "y": -801.6690868874709, "scale": 6.963588913957071, "State": "South Dakota"}, {"x": -2954.0951177636603, "y": -494.2952238230848, "scale": 7.8790700721604745, "State": "North Dakota"}, {"x": -1799.9727056523388, "y": -252.93433951692515, "scale": 4.397015983754108, "State": "Minnesota"}, {"x": -3694.1319690950468, "y": -1282.118294066437, "scale": 8, "State": "Iowa"}, {"x": -3363.457711522657, "y": -2007.4160897196602, "scale": 7.097376299972713, "State": "Arkansas"}, {"x": -2529.88877952792, "y": -1180.2691722972768, "scale": 5.605097984959931, "State": "Missouri"}, {"x": -3187.9974630351044, "y": -2275.9681783738624, "scale": 6.601362257663659, "State": "Louisiana"}, {"x": -2553.2188352351995, "y": -1606.8903603862811, "scale": 5.251304514445548, "State": "Mississippi"}, {"x": -4135.354517433016, "y": -1902.2225743280587, "scale": 7.3561227791515, "State": "Tennessee"}, {"x": -4556.696386903941, "y": -1826.734895774914, "scale": 8, "State": "Kentucky"}, {"x": -2157.137445861743, "y": -794.7713045348885, "scale": 4.586521439603899, "State": "Illinois"}, {"x": -2784.3125872030605, "y": -576.2490940116928, "scale": 5.806986334792266, "State": "Wisconsin"}, {"x": -2012.1606215495235, "y": -306.00270054958355, "scale": 4.101286532342381, "State": "Michigan"}, {"x": -3290.5848215842075, "y": -1120.9869392869803, "scale": 6.107276069178573, "State": "Indiana"}, {"x": -2803.0995936508148, "y": -1589.6454514810696, "scale": 5.252001824709952, "State": "Alabama"}, {"x": -2687.178589552477, "y": -1722.9945033902545, "scale": 4.686627854094649, "State": "Florida"}, {"x": -3360.7852075945807, "y": -1704.6434235214047, "scale": 5.711764884643452, "State": "Georgia"}, {"x": -5142.596223708755, "y": -2332.7254869784074, "scale": 8, "State": "South Carolina"}, {"x": -4746.014783778367, "y": -1844.8539875231504, "scale": 7.339821426371208, "State": "North Carolina"}, {"x": -4765.5481988754955, "y": -1553.5652764521035, "scale": 7.351244511236118, "State": "Virginia"}, {"x": -4584.568597969923, "y": -1417.4802934616946, "scale": 7.234632283037824, "State": "West Virginia"}, {"x": -5424.603472013296, "y": -1504.292435150911, "scale": 8, "State": "Maryland"}, {"x": -5617.324168631552, "y": -1454.1011739574328, "scale": 8, "State": "Delaware"}, {"x": -5331.199045351126, "y": -1263.7710730302301, "scale": 8, "State": "Pennsylvania"}, {"x": -4029.417912559621, "y": -1175.392044706865, "scale": 6.81685936194185, "State": "Ohio"}, {"x": -5659.329768988603, "y": -1291.9180315651297, "scale": 8, "State": "New Jersey"}, {"x": -3823.072405463585, "y": -586.1530771900749, "scale": 5.766493550715145, "State": "New York"}, {"x": -5816.492321993324, "y": -1060.6074450897668, "scale": 8, "State": "Connecticut"}, {"x": -5934.10807250855, "y": -1010.0439168544626, "scale": 8, "State": "Rhode Island"}, {"x": -5900.622099447889, "y": -922.8587523846645, "scale": 8, "State": "Massachusetts"}, {"x": -5731.103133016146, "y": -729.0831598631316, "scale": 8, "State": "Vermont"}, {"x": -5870.0835321451095, "y": -695.3106643251585, "scale": 8, "State": "New Hampshire"}, {"x": -4078.9999874928562, "y": -256.54376903875885, "scale": 5.588389737455319, "State": "Maine"}]


  constructor(private http: HttpClient) {

  }

  processAction(that, globalAction) {

    var action = globalAction
    console.log(action)

    if (action["Add"]["Visualizations"] != "none" && action["Add"]["Visualizations"].length != 0) {
      this.changeVisualization(that, action["Add"]["Visualizations"])
    }
    if (action["Remove"]["Legend"] != "none" && action["Remove"]["Legend"].length != 0) {
      this.removeLegend(that, action["Remove"]["Legend"])
    }
    if (action["Add"]["Legend"] != "none" && action["Add"]["Legend"].length != 0) {
      this.addLegend(that, action["Add"]["Legend"])
    }
    if (action["Remove"]["DataFields"] == "All") {
      this.removeAllMetrics(that)
    }
    if (action["Add"]["DataFields"] == "All") {
      this.addAllMetrics(that)
    }
    if (action["Remove"]["DataFields"] != "none" && action["Remove"]["DataFields"].length != 0 && action["Remove"]["DataFields"] != "All") {
      this.removeMetric(that, action["Remove"]["DataFields"])
    }
    if (action["Add"]["DataFields"] != "none" && action["Add"]["DataFields"].length != 0 && action["Add"]["DataFields"] != "All") {
      this.addMetric(that, action["Add"]["DataFields"])
    }
    console.log(typeof action["Add"]["Filter"][0]["State"])
    if(typeof action["Add"]["Filter"][0]["State"] !== 'undefined' && action["Add"]["Filter"][0]["State"][0] == 'All'){
      this.addFilter(that, action["Add"]["Filter"])
    }

    if (action["Remove"]["Filter"] != "none" && action["Remove"]["Filter"].length != 0) {
      this.removeFilter(that, action["Remove"]["Filter"])
    }
    if (action["Add"]["Filter"] != "none" && action["Add"]["Filter"].length != 0 && !(typeof action["Add"]["Filter"][0]["State"] !== 'undefined' && action["Add"]["Filter"][0]["State"][0] == 'All')) {
      this.addFilter(that, action["Add"]["Filter"])
    }

    if (action["Add"]["Aggregate"] != "none" && action["Add"]["Aggregate"].length != 0) {
      this.changeAggregate(that, action["Add"]["Aggregate"])
    }

    if (action["Add"]["Cumulative"] != "none" && action["Add"]["Cumulative"].length != 0) {
      this.changeCumulative(that, action["Add"]["Cumulative"])
    }

    if (action["Add"]["GroupBy"] != "none" && action["Add"]["GroupBy"].length != 0) {
      this.changeGroupBy(that, action["Add"]["GroupBy"])
    }




  }


  /**
* 
* Changing Visualization
* 
* 
* 
*/

  public changeVisualization(that, visualization) {
    var current = document.getElementsByClassName("btn active");
    if (current.length > 0) {
      current[0].className = current[0].className.replace(" active", "");
    }
    document.getElementById(visualization)["className"] += " active";

    that.addElementtoITL('ChangeVis', visualization);

    that.unitedStatesMap.chartType = visualization



    if (visualization == "barChart") {
      that.legendLabel = "x-Axis"
      that.metricLabel = "y-Axis"
      document.getElementById("scatterUnused")["style"]["display"] = " none";
    }
    else if (visualization == "scatter") {
      that.legendLabel = "Legend"
      that.metricLabel = "Axis"
      document.getElementById("scatterUnused")["style"]["display"] = " block";
    }
    else if (visualization == "Map") {
      that.legendLabel = "States"
      that.metricLabel = "Filling"
      document.getElementById("scatterUnused")["style"]["display"] = " block";
    }

    var metricFields = document.getElementsByClassName("trainMetric");

    for (var m = 0; m < metricFields.length; m++) {
      metricFields[m]["innerHTML"] = that.metricLabel
    }

    var legendFields = document.getElementsByClassName("trainLegend");

    for (var l = 0; l < legendFields.length; l++) {
      legendFields[l]["innerHTML"] = that.legendLabel
    }

    document.getElementById("legend_Text").innerHTML = "<b>" + that.legendLabel + "</b>"

    document.getElementById("metric_Text").innerHTML = "<b>" + that.metricLabel + "</b>"
  }


  /**
 * 
 * Changing Legends
 * 
 * 
 * 
 */


  public addLegend(that, legend) {

    document.getElementById("legend").appendChild(document.getElementById(legend));


    if (document.getElementById("legend").childNodes.length >= 2) {
      // If more than one Legend is present delete the previous one
      var oldData = document.getElementById("legend").childNodes[0]["id"]
      this.removeLegend(that, oldData)
    }
    if (legend !== that.unitedStatesMap.legend_Values) {
      that.addElementtoITL('AddLegend', legend);
      that.unitedStatesMap.legendChanged = true;
      that.unitedStatesMap.legend_Values = legend
    }

    document.getElementById(legend + "_Filter").className = document.getElementById(legend + "_Filter").className.replace(" closed", "")
    if (document.getElementById("No_Filter")["className"] != "col closed") {
      document.getElementById("No_Filter")["className"] += " closed";
    }
    this.checkToggleBotton(that)
  }

  public removeLegend(that, legend) {
    var entity = document.getElementById(legend)
    document.getElementById("data_Field").appendChild(entity);

    //Check if Filter is not relevant
    if (legend == 'State' && that.statesSelect.length == 0) {
      if (document.getElementById(legend + "_Filter")["className"] != "col closed") {
        document.getElementById(legend + "_Filter")["className"] += " closed";
      }
    }
    else if (legend !== 'State' && that.filterValue[legend][0] == that.minSlider[legend] && that.filterValue[legend][1] == that.maxSlider[legend]) {
      if (document.getElementById(legend + "_Filter")["className"] != "col closed") {
        document.getElementById(legend + "_Filter")["className"] += " closed";
      }
    }

    that.unitedStatesMap.legend_Values = null
    that.unitedStatesMap.legendChanged = true;
    that.addElementtoITL('RemoveLegend', legend);
  }



  /**
   * 
   * Changing Metrics
   * 
   * 
   * 
   */

  public addMetric(that, metric) {

    if (metric == "All") {
      metric = ["Tests", "Cases", "Deaths", "Population", "PartialVaccinated", "FullyVaccinated"]
    }

    for (var i = 0; i < metric.length; i++) {
      that.addElementtoITL('AddMetric', metric[i]);
      document.getElementById("y_Axis").appendChild(document.getElementById(metric[i]));
      document.getElementById(metric[i] + "_Filter").className = document.getElementById(metric[i] + "_Filter").className.replace(" closed", "")
      if (document.getElementById("No_Filter")["className"] != "col closed") {
        document.getElementById("No_Filter")["className"] += " closed";
      }

    }

    that.unitedStatesMap.y_Axis_Values = []

    for (var i = 0; i < document.getElementById("y_Axis").childNodes.length; i++) {
      that.unitedStatesMap.y_Axis_Values.push(document.getElementById("y_Axis").childNodes[i]["id"])
    }



  }

  public removeMetric(that, metric) {

    for (var i = 0; i < metric.length; i++) {
      that.unitedStatesMap.y_Axis_Values.splice(that.unitedStatesMap.y_Axis_Values.indexOf(metric[i]), 1)
      document.getElementById("data_Field").appendChild(document.getElementById(metric[i]));
      if (document.getElementById(metric[i] + "_Filter")["className"] != "col closed") {
        document.getElementById(metric[i] + "_Filter").className += " closed"
      }
      that.filterValue[metric[i]] = [that.minSlider[metric[i]], that.maxSlider[metric[i]]]

      that.addElementtoITL('RemoveMetric', metric[i]);
    }


    /*that.unitedStatesMap.y_Axis_Values = [];

    for (var i = 0; i < document.getElementById("y_Axis").childNodes.length; i++) {
      that.unitedStatesMap.y_Axis_Values.push(document.getElementById("y_Axis").childNodes[i]["id"])
    }
    */


  }

  public removeAllMetrics(that) {
    that.addElementtoITL('RemoveMetric', 'all');

    that.unitedStatesMap.y_Axis_Values = [];
    for (var i = document.getElementById("y_Axis").childNodes.length - 1; 0 <= i; i--) {

      document.getElementById("data_Field").appendChild(document.getElementById("y_Axis").childNodes[i])
    }
  }

  public addAllMetrics(that) {
    that.addElementtoITL('AddMetric', 'all');

    that.unitedStatesMap.y_Axis_Values = [];
    for (var i = document.getElementById("data_Field").childNodes.length - 1; 0 <= i; i--) {
      if (document.getElementById("data_Field").childNodes[i]["id"] != "State" && document.getElementById("data_Field").childNodes[i]["id"] != "Date") {
        document.getElementById("y_Axis").appendChild(document.getElementById("data_Field").childNodes[i])
      }
    }

    for (var i = 0; i < document.getElementById("y_Axis").childNodes.length; i++) {
      that.unitedStatesMap.y_Axis_Values.push(document.getElementById("y_Axis").childNodes[i]["id"])
    }
  }

  public removeFilter(that, filters) {

    for (var index in filters) {

      if (filters[index][Object.keys(filters[index])[0]][0] == "close") {
        that.addElementtoITL('RemoveFilter', Object.keys(filters[index])[0]);

        if (document.getElementById(Object.keys(filters[index])[0] + "_Filter")["className"] != "col closed") {
          document.getElementById(Object.keys(filters[index])[0] + "_Filter")["className"] += " closed";
        }
        if (Object.keys(filters[index])[0] == "State") {
          that.statesSelect = []
          that.unitedStatesMap.statesSelect = that.statesSelect
        }
        else {
          that.filterValue[Object.keys(filters[index])[0]] = [that.minSlider[Object.keys(filters[index])[0]], that.maxSlider[Object.keys(filters[index])[0]]]
          if (Object.keys(filters[index])[0] == "Date") {
            console.log(String(formatDate(new Date(that.filterValue[Object.keys(filters[index])[0]][1]), 'yyyy-MM-dd', 'en')))
            document.getElementById("Date-To")["value"] = String(formatDate(new Date(that.filterValue[Object.keys(filters[index])[0]][1]), 'yyyy-MM-dd', 'en'))
          }
          else {
            document.getElementById(String(Object.keys(filters[index])[0]) + "-From")["value"] = String(that.filterValue[Object.keys(filters[index])[0]][0])
            document.getElementById(String(Object.keys(filters[index])[0]) + "-To")["value"] = String(that.filterValue[Object.keys(filters[index])[0]][1])
          }
          that.unitedStatesMap.filterValue = that.filterValue
        }
      }
      else if (Object.keys(filters[index])[0] == "State") {
        this.removeState(that, filters[index])
      }
      else{
        var newFilters = {[Object.keys(filters[index])[0]]: [0, "max"]}
        if(filters[index][Object.keys(filters[index])[0]][0] == 0){
          newFilters[Object.keys(filters[index])[0]][0] = filters[index][Object.keys(filters[index])[0]][1]
          newFilters[Object.keys(filters[index])[0]][1] = "max"
        }
        else{
          newFilters[Object.keys(filters[index])[0]][1] = filters[index][Object.keys(filters[index])[0]][0]
          newFilters[Object.keys(filters[index])[0]][0] = 0

        }
        this.changeFilter(that, newFilters)
      }
    }

    var open = true;
    for (var child in document.getElementById("FilterField").childNodes) {
      if (document.getElementById("FilterField").childNodes[child]["className"] == "col") {
        open = false
      }
    }
    if (open) {
      document.getElementById("No_Filter").className = document.getElementById("No_Filter").className.replace(" closed", "")
    }
  }

  public changeFilter(that, filter) {

    console.log(Object.keys(filter))
    var key = Object.keys(filter)[0]
    that.addElementtoITL('ChangeFilter', filter);

    if (key == "State") {
      for (var state in filter[key]) {
        if(filter[key][state] == "All"){
          for(var index in that.scaleButtons){
            if (that.statesSelect.indexOf(that.scaleButtons[index]) == -1) {
              that.statesSelect.push(that.scaleButtons[index])
            }
          }
        }
        else if (that.statesSelect.indexOf(filter[key][state]) == -1) {
          that.statesSelect.push(filter[key][state])
        }
      }

      that.unitedStatesMap.statesSelect = that.statesSelect
      if(that.statesSelect.length > 0){
        $("input[id^='k']")[0]["placeholder"] = "  +"
      }
    }
    else if (key == "Date") {
      that.filterValue[String(key)][0] = new Date(filter[key][0])
      that.filterValue[String(key)][1] = new Date(filter[key][1])
      document.getElementById("Date-To")["value"] = String(formatDate(new Date(filter[key][1]), 'yyyy-MM-dd', 'en'))
      that.filterValue[key] = [that.filterValue[String(key)][0], that.filterValue[String(key)][1]];
    }
    else {
      var filterValue = that.filterValue[String(key)]

      if (filter[key][0] !== "none") {
        document.getElementById(String(key) + "-From")["value"] = String(filter[String(key)][0])
        filterValue[0] = parseInt(filter[key][0])

      }
      else {
        document.getElementById(String(key) + "-From")["value"] = String(0)
        filterValue[0] = parseInt(that.filterValue[String(key)][0])
      }
      if (filter[key][1] !== "none" && filter[key][1] !== "max") {
        document.getElementById(String(key) + "-To")["value"] = String(filter[String(key)][1])
        filterValue[1] = parseInt(filter[key][1])
      }
      else if(filter[key][1] == "max"){
        document.getElementById(String(key) + "-To")["value"] = String(that.maxSlider[key])
        filterValue[1] = parseInt(that.maxSlider[key])
      }
      else {
        document.getElementById(String(key) + "-To")["value"] = String(that.maxSlider[key])
        filterValue[1] = parseInt(that.filterValue[String(key)][1])
      }

      that.filterValue[key] = [filterValue[0], filterValue[1]];


    }

    that.unitedStatesMap.filterValue = that.filterValue;

  }

  public addFilter(that, filters) {
    if (document.getElementById("No_Filter")["className"] != "col closed") {
      document.getElementById("No_Filter")["className"] += " closed";
    }

    for (var index in filters) {
      var key = Object.keys(filters[index])[0]

      document.getElementById(key + "_Filter").className = document.getElementById(key + "_Filter").className.replace(" closed", "")

      if (filters[index][key][0] == "open") {
        that.addElementtoITL('AddFilter', key);
      }
      else if ((!isNaN(filters[index][key][0]) && (!isNaN(filters[index][key][1]) || filters[index][key][1] == "max")) || key == "State") {
        this.changeFilter(that, filters[index])
      }
      else if (key == "Date") {
        this.changeFilter(that, filters[index])
      }
    }
  }

  public removeState(that, filter) {

    that.addElementtoITL('RemoveState', filter["State"]);

    if (filter["State"] == "All") {
      that.statesSelect = []
      that.unitedStatesMap.statesSelect = that.statesSelect
    }
    else {
      that.statesSelect = that.statesSelect.filter(element => !filter["State"].includes(element))
      that.unitedStatesMap.statesSelect = that.statesSelect
      
      if(that.statesSelect.length > 0){
        $("input[id^='k']")[0]["placeholder"] = "  +"
      }
    }



  }


  public changeAggregate(that, aggregate) {

    that.addElementtoITL('ChangeAggregate', aggregate);

    document.getElementById('Aggregate')["value"] = aggregate;

    that.unitedStatesMap.legendChanged = true;
    that.unitedStatesMap.aggregate = aggregate;

  }

  public changeCumulative(that, cumulate) {

    that.addElementtoITL('ChangeCumulative', cumulate);

    if (cumulate == "false" || !cumulate) {
      document.getElementById('Cumulative')["checked"] = false
    }
    else if (cumulate == "true" || cumulate) {
      document.getElementById('Cumulative')["checked"] = true
    }
    that.unitedStatesMap.legendChanged = true;
    that.unitedStatesMap.cumulative = cumulate;

  }

  public changeGroupBy(that, groupBy) {

    that.addElementtoITL('ChangeGroupBy', groupBy);

    if (groupBy == "Legend") {
      document.getElementById('GroupBy')["checked"] = false
    }
    else if (groupBy == "Metric") {
      document.getElementById('GroupBy')["checked"] = true
    }
    that.unitedStatesMap.legendChanged = true;
    that.unitedStatesMap.groupBy = groupBy;
  }

  public checkToggleBotton(that) {
    if (typeof that.unitedStatesMap.legend_Values != 'undefined') {
      if (that.unitedStatesMap.legend_Values == "Date") {
        document.getElementById('Second Legend').innerText = "State"
      }
      else if (that.unitedStatesMap.legend_Values == "State") {
        document.getElementById('Second Legend').innerText = " Date"
      }

      var groupFields = document.getElementsByClassName("groupLegend");

      for (var m = 0; m < groupFields.length; m++) {
        if (that.unitedStatesMap.legend_Values == "Date") {
          groupFields[m]["innerHTML"] = "State"
        }
        else if (that.unitedStatesMap.legend_Values == "State") {
          groupFields[m]["innerHTML"] = " Date"
        }

      }
    }
    else {
      document.getElementById('Second Legend').innerText = ""
    }

  }






  public visualizeUnderstanding(that, eventValue) {
    $('.plain').eq(-1).each(function (index) {

      var characters = $(this).text();
      console.log(characters)
      var start = 0;



      var htmltext = "";



      $.each(eventValue, function (i, element) {
        console.log(element)
        if (element["Feature"][0] == "Visualizations") {
          var startOfElement = parseInt(element["Start"])
          var endOfElement = parseInt(element["End"])
          if (startOfElement == start) {
            htmltext += "<span title='Visualizations'  style='background-color:" + that.fieldToColor[element["Feature"][0]] + "; margin-top: 60px;'>" + characters.substring(startOfElement, endOfElement) + ' ' + "</span>"
          }
          else if (startOfElement > start) {
            var inbet = element["ID"] - 1
            htmltext += "<span id='" + inbet + "' >" + characters.substring(start, startOfElement) + ' ' + "</span>"
            htmltext += "<span title='Visualizations'  style='background-color:" + that.fieldToColor[element["Feature"][0]] + "'>" + characters.substring(startOfElement, endOfElement) + ' ' + "</span>"
          }
          start = endOfElement + 1

        }
        else if (element["Feature"][0] == "DataFields") {
          var startOfElement = parseInt(element["Start"])
          var endOfElement = parseInt(element["End"])
          if (startOfElement == start) {
            htmltext += "<span title='Metric'  style='background-color:" + that.fieldToColor[element["Feature"][0]] + "'>" + characters.substring(startOfElement, endOfElement) + ' ' + "</span>"
          }
          else if (startOfElement > start) {
            var inbet = element["ID"] - 1
            htmltext += "<span id='" + inbet + "'>" + characters.substring(start, startOfElement) + ' ' + "</span>"
            htmltext += "<span title='Metric'  style='background-color:" + that.fieldToColor[element["Feature"][0]] + "'>" + characters.substring(startOfElement, endOfElement) + ' ' + "</span>"
          }
          start = endOfElement + 1
        }
        else if (element["Feature"][0] == "Legend") {
          var startOfElement = parseInt(element["Start"])
          var endOfElement = parseInt(element["End"])
          if (startOfElement == start) {
            htmltext += "<span title='Legend'  style='background-color:" + that.fieldToColor[element["Feature"][0]] + "'>" + characters.substring(startOfElement, endOfElement) + ' ' + "</span>"
          }
          else if (startOfElement > start) {
            var inbet = element["ID"] - 1
            htmltext += "<span id='" + inbet + "' >" + characters.substring(start, startOfElement) + ' ' + "</span>"
            htmltext += "<span title='Legend'  style='background-color:" + that.fieldToColor[element["Feature"][0]] + "'>" + characters.substring(startOfElement, endOfElement) + ' ' + "</span>"
          }
          start = endOfElement + 1
        }
        else if (element["Feature"][0] == "NumFilter" || element["Feature"][0] == "Range" || element["Feature"][0] == "datetime" || element["Feature"][0] == "State") {
          var startOfElement = parseInt(element["Start"])
          var endOfElement = parseInt(element["End"])
          if (startOfElement == start) {
            htmltext += "<span title='Filter: " + element["Feature"][0] + "'  style='background-color:" + that.fieldToColor["Filter"] + "'>" + characters.substring(startOfElement, endOfElement) + ' ' + "</span>"
          }
          else if (startOfElement > start) {
            var inbet = element["ID"] - 1
            htmltext += "<span id='" + inbet + "' >" + characters.substring(start, startOfElement) + ' ' + "</span>"
            htmltext += "<span title='Filter: " + element["Feature"][0] + "'  style='background-color:" + that.fieldToColor["Filter"] + "'>" + characters.substring(startOfElement, endOfElement) + ' ' + "</span>"
          }
          start = endOfElement + 1
        }



      });
      if (characters.length > start) {
        htmltext += "<span>" + characters.substring(start) + ' ' + "</span>"
      }

      if (htmltext != "") {
        that.initialUtterance = htmltext;
        var chatfield = $(this);
        chatfield.empty();
        chatfield.append(htmltext)
      }

      //$('.markdown').eq(-1).each(function (index, element) {$(this).html($(this).html().split("Visualizations").join("<span id='Visualizations' style='background-color:rgba(0, 255, 0, 0.3)'> Visualizations </span>").split("Legend").join("<span id='Legend' style='background-color:rgba(0, 255, 255, 0.3)'> Legend </span>").split("DataFields").join("<span id='DataFields' style='background-color:rgba(0, 0, 255, 0.3)'> Metric </span>").split("Filter").join("<span id='Filter' style='background-color:rgba(255, 255, 0, 0.3)'> Filter </span>"))})

    });
  }



}