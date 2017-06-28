<?php
    session_start();
?>
<!DOCTYPE html>
<html>
<?php
    if(isset($_SESSION["id"])){
        $id = $_SESSION["id"];
    }else{
        $_SESSION['msg'] = "Welcome";
        $id = "none";
        echo "<script>location.href = 'login.php';</script>";
    }
?>
<title>IoTPlus</title>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<!--<meta http-equiv=”Pragma” content=”no-cache”>
<meta http-equiv=”Expires” content=”-1″>
<meta http-equiv=”CACHE-CONTROL” content=”NO-CACHE”>-->


<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Montserrat">
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Share+Tech+Mono">
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.6.3/css/font-awesome.min.css">
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css">
<link rel="stylesheet" href="css/gridstack.css"/>
<link rel="stylesheet" href="css/epoch.css">
<link rel="stylesheet" href="css/w3.css">
<link rel="stylesheet" href="css/common.jl.css">
<link rel="stylesheet" href="css/bootstrap-colorpicker.min.css">
<link rel="stylesheet" href="css/rangeslider.css">
<!--<link rel="stylesheet" href="css/color-light.jl.css">-->

<link href="css/datepicker.css" rel="stylesheet" type="text/css"/>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.0/jquery-ui.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.5.0/lodash.min.js"></script>
<script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>
<script src="js/gridstack.js"></script>
<script src="js/canvasjs.min.js"></script>
<script src="js/gridstack.jQueryUI.js"></script>
<script src="js/linechart.jl.js"></script>
<script src="js/columnchart.jl.js"></script>
<script src="js/piechart.jl.js"></script>
<script src="js/bot.jl.js"></script>
<script src="js/equations.jl.js"></script>
<script src="js/common.jl.js"></script>
<script src="js/epoch.js"></script>
<script src="js/browserMqtt.js"></script>
<script src="js/colorpicker.js"></script>
<script src="js/bootstrap-colorpicker.js"></script>
<script src="js/rangeslider.js"></script>
<script src="js/rangeslider.min.js"></script>

<style>
#savePan{
  position: absolute;
  bottom: 0;
}
</style>

<body class="dashboard-background-color">

    <!-- Sidenav -->
    <nav class="w3-sidenav w3-card-2 w3-animate-zoom widget-font widget-background-color" style="display:none;padding-top:20px" id="sideNav">
        <a href="javascript:void(0)" onclick="w3_close()" class="w3-closenav w3-large w3-right w3-display-topright" style="padding:12px;" onmouseover="this.style.backgroundColor='inherit'">
            <i class="fa fa-remove"></i>
        </a>

        <div class="w3-panel widget-background-color w3-small" style="padding: 10px 20px 0px 0px">
            <div id="changeUserDiv" class="nav-label w3-row">
                <div class="w3-col w3-container" style="width:30%">
                    <p class="label-1">Select a User Environment to Edit
                    </p>
                </div>
                <div class="w3-col" style="width:70%">
                    <select id="userCombo" onchange="userChanged()" class="nav-combo"></select>
                </div>
            </div>
            <div id="linkBtnDiv" style="display:none">
                <button id="linkAccBtn" class="portal-button button-background" onclick="openLinkModal()" data-toggle="tooltip" data-placement="left" title="Link ePro account">ePro<br><i class="fa fa-link" aria-hidden="true"></i></button>
            </div>
        </div>
        <!--Equation Nav-->
        <div id="equationNav" class="w3-panel widget-background-color w3-large">
            <div class="w3-row w3-padding-4">
                <div class="nav-button-selected w3-col container-1" style="width:50%">
                    <p><div style="text-align: center;" onclick="">Manage Equations</div></p>
                </div>
                <div class="nav-button w3-col container-1" style="width:50%">
                    <p><div style="text-align: center;" onclick="equationNav_close(); deviceNav_open()">Manage Devices</div></p>
                </div>
            </div>
            <div class="w3-row w3-padding-8 widget-color">
                <div class="w3-col container-1" style="width:2%">
                </div>
                <div class="w3-col container-1" style="width:8%">
                    <input type="text" id="prefixEquationText" data-toggle="tooltip" data-placement="top" title="Expression prefix" placeholder="prefix" style="width:100%" >
                </div>
                <div class="w3-col container-1" style="width:11%">
                    <p class="label-2">Device type</p>
                </div>
                <div class="w3-col container-1" style="width:12%">
                    <select id="deviceTypeCombo" class="combo-1" onchange="updateDevicesCombo(); updateDeviceChannels()">
                    </select>
                </div>
                <div class="w3-col container-1" style="width:8%">
                    <p class="label-2">Device</p>
                </div>
                <div class="w3-col container-1" style="width:15%">
                    <select id="deviceCombo" class="combo-1" onchange="updateDeviceChannels()"></select>
                </div>
                <div class="w3-col container-1" style="width:2%">
                    <button id="deviceToggleButton" class="toggle-button" value="0"; onclick="toggleDeviceDisplay()" data-toggle="tooltip" data-placement="top" title="Display device IDs/Names" style="padding:6px 0px"><i class="fa fa-toggle-off" aria-hidden="true"></i></button>
                </div>
                <div class="w3-col container-1" style="width:2%">
                </div>
                <div class="w3-col container-1" style="width:8%">
                    <p class="label-2">Channel</p>
                </div>
                <div class="w3-col container-1" style="width:18%">
                    <select id="channelCombo" class="combo-1"></select>
                </div>
                <div class="w3-col container-1" style="width:6%">
                   <input type="text" size="6" id="equationUnitText" placeholder="unit" style="width:100%">
                </div>
                <div class="w3-col container-1" style="width:8%; float:right">
                   <p><button class="portal-pane-button" onclick="addExpression()" data-toggle="tooltip" data-placement="top" title="Add Expression"><i class="fa fa-plus-square-o fa-2x" aria-hidden="true"></i></button></p>
                </div>

            </div>

            <div class="w3-row w3-padding-8 widget-color">
                <div class="w3-col w3-container" style="width:80%">
                    <p id="equationText"></p>
                </div>
                <div class="w3-col w3-container w3-right" style="width:8%">
                    <p><button class="portal-pane-button" onclick="clearExpressions()" data-toggle="tooltip" data-placement="top" title="Clear Expressions"><i class="fa fa-trash-o fa-2x" aria-hidden="true"></i></button></p>
                </div>
            </div>

            <div class="w3-row w3-padding-8 widget-color">
                <div class="w3-col w3-container" style="width:15%">
                    <p class="label-1">Equation Name</p>
                </div>
                <div class="w3-col w3-container" style="width:20%">
                   <input type="text" size="6" id="equationNameText" style="width:100%">
                </div>
                <div class="w3-col w3-container" style="width:8%; float:right">
                    <p><button class="portal-pane-button" onclick="addEquation()" data-toggle="tooltip" data-placement="top" title="Add Equation"><i class="fa fa-check fa-2x" aria-hidden="true"></i></button></p>
                </div>
            </div>

            <div class="w3-container">
              <ul class="w3-ul w3-card-4" id="equationList">

              </ul>
            </div>
        </div>

        <!--Device Nav-->
        <div id="deviceNav" class="w3-panel widget-background-color w3-large" style="display:none">
            <div class="w3-row w3-padding-4">
                <div class="nav-button w3-col w3-container" style="width:50%;">
                    <p><div style="text-align: center;" onclick="deviceNav_close(); equationNav_open()">Manage Equations</div></p>
                </div>
                <div class="nav-button-selected w3-col w3-container" style="width:50%">
                    <p><div style="text-align: center;" onclick="">Manage Devices</div></p>
                </div>
            </div>
            <div class="w3-row w3-padding-8 widget-color">
                <div class="w3-col w3-container" style="width:12%">
                    <p class="label-2">Device type</p>
                </div>
                <div class="w3-col w3-container" style="width:12%">
                    <select id="deviceNavTypeCombo" class="combo-1" onchange="">
                        <option value="custom">Custom</option>
                        <!--<option>Other</option>-->
                    </select>
                </div>
                <div class="w3-col w3-container" style="width:12%">
                    <p class="label-2">Device ID</p>
                </div>
                <div class="w3-col w3-container" style="width:12%">
                   <input type="text" size="6" id="deviceIdText" style="width:100%">
                </div>
                <div class="w3-col w3-container" style="width:12%">
                    <p class="label-2">PSK</p>
                </div>
                <div class="w3-col w3-container" style="width:15%">
                   <input type="text" size="6" id="PSKText" placeholder="PSK" style="width:100%" readonly>
                </div>
                <div class="w3-col w3-container" style="width:8%; float:right">
                   <p><button class="portal-pane-button" onclick="addDevice()" data-toggle="tooltip" data-placement="top" title="Add Device"><i class="fa fa-plus-square-o fa-2x" aria-hidden="true"></i></button></p>
                </div>

            </div>

            <div class="w3-row w3-padding-8 widget-color">
            </div>

            <div class="w3-container">
              <ul class="w3-ul w3-card-4" id="deviceList">

              </ul>
            </div>
        </div>
    </nav>

    <!-- WidgetNav -->
    <nav class="w3-sidenav w3-card-2 w3-animate-zoom widget-font widget-background-color" style="display:none;padding-top:20px" id="widgetNav">
        <a href="javascript:void(0)" onclick="widgetnav_close()" class="w3-closenav w3-xlarge w3-right w3-display-topright" style="padding:12px;" onmouseover="this.style.backgroundColor='inherit'">
            <i class="fa fa-remove"></i>
        </a>

        <div class="w3-panel w3-padding-jumbo widget-background-color w3-large">

            <div id="settingsMain" class="w3-row w3-padding-8 widget-color">
                <div class="w3-col w3-container" style="width:10%">
                    <p class="label-1">Graph Category</p>
                </div>
                <div class="w3-col w3-container" style="width:20%">
                      <select id="graphCategoryCombo" onchange="loadGraphTypes(); showEquations()" class="combo-1">
                        <option value="historical" selected>Historical</option>
                        <option value="realtime">Real-time</option>
                    </select>
                </div>
                <div class="w3-col w3-container" style="width:10%">
                    <p class="label-1">Graph Type</p>
                </div>
                <div class="w3-col w3-container" style="width:20%">
                      <select id="graphTypeCombo" onchange="showEquations()" class="combo-1">
                        <option value="line">Line Chart</option>
                        <option value="bar">Bar Chart</option>
                        <option value="pie">Pie Chart</option>
                        <option value="doughnut">Doughnut Chart</option>
                        <option value="spline">Spline Chart</option>
                        <option value="stepLine">Step Line Chart</option>
                        <option value="splineArea">Area Chart</option>
                        <option value="scatter">Scatter chart</option>
                    </select>
                </div>
                <div id="graphWidthLabel" class="w3-col w3-container" style="width:10%">
                    <p class="label-1">Widget Size</p>
                </div>
                <div class="w3-col w3-container" style="width:20%">
                    <select id="graphWidthCombo" class="combo-1">
                        <option>3</option><option>4</option>
                        <option>5</option><option>6</option>
                        <option>7</option><option>8</option>
                        <option>9</option><option>10</option>
                    </select>
                </div>
                <div class="w3-col w3-container" style="width:30%; align-content: right;">
                </div>
            </div>
            <div class="w3-row w3-padding-8 widget-color">
                <div class="w3-col w3-container" style="width:10%">
                    <p class="label-1">Chart title</p>
                </div>
                <div class="w3-col w3-container" style="width:20%">
                    <input id="chartTitleText" type="text" value="chart">
                </div>
                <div id="dateRangeChooser">
                    <div id="startDateLbl" class="w3-col w3-container" style="width:10%; display:none">
                        <p class="label-1">Start Date</p>
                    </div>
                    <div id="startDateText" class="w3-col w3-container" style="width:20%; display:none">
                        <input type="text" id="startDatePicker" >
                    </div>
                    <div class="w3-col w3-container" style="width:10%">
                        <p class="label-1">End Date</p>
                    </div>
                    <div class="w3-col w3-container" style="width:15%">
                        <input type="text" id="endDatePicker">
                    </div>
                </div>
                <div class="w3-col w3-container w3-right" style="width:15%">
                </div>
            </div>

            <div class="w3-row w3-padding-8 widget-color" id="barChartConfigPanel">
                <div class="w3-col w3-container" style="width:10%">
                    <p class="label-1">Interval</p>
                </div>
                <div class="w3-col w3-container" style="width:20%">
                    <select id="intervalCombo" class="combo-1">
                        <option value = "day" selected>DAY</option>
                        <option value = "week">WEEK</option>
                        <option value = "month">MONTH</option>
                        <option value = "year">YEAR</option>
                    </select>
                </div>
            </div>

            <div class="w3-row w3-padding-8 widget-color" id="pieChartConfigPanel">
                <div class="w3-col w3-container" style="width:10%">
                    <p class="label-1">Set Total</p>
                </div>
                <div class="w3-col container-1" style="width:2%">
                    <button id="toggleTotalComboBtn" class="toggle-button" value="0"; onclick="showTotalCombo()" style="padding:6px 0px"><i class="fa fa-toggle-off" aria-hidden="true"></i></button>
                </div>
                <div id="pieChartTotalComboDiv" class="w3-col w3-container" style="width:80%; display:none">
                    <select id="pieChartTotalCombo" class="combo-1" style="width: 600px">s
                    </select>
                </div>
            </div>
            <div class="w3-row w3-padding-8 widget-color widget-font" id="indicatorConfigPanel">
                <div class="w3-row w3-padding-8">
                    <div class="w3-col w3-container" style="width:10%">
                        <p class="label-1">IP Address</p>
                    </div>
                    <div class="w3-col w3-container" style="width:20%">
                        <input id="indicatorIPAddress" type="text" value="ws://192.168.1.50:8080">
                    </div>
                    <div class="w3-col w3-container" style="width:10%">
                        <p class="label-1">MQTT Topic</p>
                    </div>
                    <div class="w3-col w3-container" style="width:20%">
                        <input id="indicatorTopic" type="text" value="0001/temperature">
                    </div>
                </div>
                <div id="timeIntDiv" class="w3-row w3-padding-8">
                    <div class="w3-col w3-container" style="width:10%">
                        <p class="label-1">Time Interval</p>
                    </div>
                    <div class="w3-col w3-container" style="width:20%">
                        <input id="indicatorInteravl" type="text" value="3">
                    </div>
                    <div class="w3-col w3-container" style="width:10%">
                        <p class="label-1"><i>seconds</i></p>
                    </div>
                </div>
            </div>
            <div class="w3-row w3-padding-8 widget-color widget-font" id="gaugeConfigPanel">
                <div class="w3-row w3-padding-8">
                    <div class="w3-col w3-container" style="width:10%">
                        <p class="label-1">IP Address</p>
                    </div>
                    <div class="w3-col w3-container" style="width:20%">
                        <input id="gaugeIPAddress" type="text" value="ws://192.168.1.50:8080">
                    </div>
                    <div class="w3-col w3-container" style="width:10%">
                        <p class="label-1">Min</p>
                    </div>
                    <div class="w3-col w3-container" style="width:20%">
                        <input id="gaugeMin" type="text" value="0">
                    </div>
                    <div class="w3-col w3-container" style="width:10%">
                        <p class="label-1">Max</p>
                    </div>
                    <div class="w3-col w3-container" style="width:20%">
                        <input id="gaugeMax" type="text" value="100">
                    </div>

                </div>
                <div class="w3-row w3-padding-8">
                    <div class="w3-col w3-container" style="width:10%">
                        <p class="label-1">MQQT Title</p>
                    </div>
                    <div class="w3-col w3-container" style="width:20%">
                        <input id="gaugeTitle" type="text" value="0001/temperature">
                    </div>
                    <div class="w3-col w3-container" style="width:10%">
                        <p class="label-1">Unit</p>
                    </div>
                    <div class="w3-col w3-container" style="width:20%">
                        <input id="gaugeUnit" type="text" value=" C">
                    </div>
                </div>
            </div>
            <div class="w3-row w3-padding-8 widget-color widget-font" id="stateControllerConfigPanel">
                <div class="w3-row w3-padding-8">
                    <div class="w3-col w3-container" style="width:10%">
                        <p class="label-1">IP Address</p>
                    </div>
                    <div class="w3-col w3-container" style="width:20%">
                        <input id="controllerIPAddress" type="text" value="ws://192.168.1.50:8080">
                    </div>
                    <div class="w3-col w3-container" style="width:10%">
                        <p class="label-1">MQTT Topic</p>
                    </div>
                    <div class="w3-col w3-container" style="width:20%">
                        <input id="controllerTopic" type="text" value="0001/temperature">
                    </div>
                </div>
                <div id="" class="w3-row w3-padding-8">
                    <div class="w3-col w3-container" style="width:10%">
                        <p class="label-1">Option</p>
                    </div>
                    <div class="w3-col w3-container" style="width:20%">
                        <input id="optionNameText" placeholder="name" type="text">
                    </div>
                    <div class="w3-col w3-container" style="width:20%">
                        <input id="optionValueText" placeholder="value" type="text">
                    </div>
                    <div class="w3-col w3-container" style="width:8%; float:right">
                        <p><button class="portal-pane-button" onclick="addOption()" data-toggle="tooltip" data-placement="top" title="Add Option"><i class="fa fa-plus-square-o fa-2x" aria-hidden="true"></i></button></p>
                    </div>
                </div>
            </div>
            <div class="w3-row w3-padding-8 widget-color widget-font" id="botConfigPanel">
                <div class="w3-row w3-padding-8">
                    <div class="w3-col w3-container" style="width:10%">
                        <p class="label-1">IP Port</p>
                    </div>
                    <div class="w3-col w3-container" style="width:20%">
                        <input id="botIPPort" type="text" value="ws://development.enetlk.com:1885">
                    </div>
                    <div class="w3-col w3-container" style="width:8%">
                        <p><button class="portal-pane-button" onclick="syncDevices()" data-toggle="tooltip" data-placement="top" title="Sync"><i class="fa fa-refresh fa-2x" aria-hidden="true"></i></button></p>
                    </div>
                    <!--<div class="w3-col w3-container" style="width:4%">
                    </div>
                    <div class="w3-col w3-container" style="width:12%">
                        <p class="label-1">Learner Type</p>
                    </div>
                    <div class="w3-col w3-container" style="width:15%">
                        <select id="learnerTypeCombo" class="combo-1" onchange="loadLearners()">
                            <option value="classifier">Classifier</option>
                            <option value="regressor">Regressor</option>
                        </select>
                    </div>
                    <div class="w3-col w3-container" style="width:8%">
                        <p class="label-1">Learner</p>
                    </div>
                    <div class="w3-col w3-container" style="width:20%">
                        <select id="learnerCombo" class="combo-1" onchange="">
                        </select>
                    </div>-->
                </div>
                <div class="w3-row w3-padding-8">
                    <div class="w3-col w3-container" style="width:12%">
                        <p class="label-1">Learner Type</p>
                    </div>
                    <div class="w3-col w3-container" style="width:15%">
                        <select id="learnerTypeCombo" class="combo-1" onchange="loadLearners()">
                            <option value="classifier">Classifier</option>
                            <option value="regressor">Regressor</option>
                        </select>
                    </div>
                    <div class="w3-col w3-container" style="width:8%">
                        <p class="label-1">Learner</p>
                    </div>
                    <div class="w3-col w3-container" style="width:20%">
                        <select id="learnerCombo" class="combo-1" onchange="">
                        </select>
                    </div>
                    <div id="classLbl" class="w3-col w3-container" style="width:8%; display:none">
                        <p class="label-1">Classes</p>
                    </div>
                    <div id="classDiv" class="w3-col w3-container" style="width:36%; display:none">
                        <div class="w3-row">
                            <div class="w3-col w3-container" style="width:35%; padding-right:0px">
                                <input id="classNameText" type="text" style="width:100%">
                            </div>
                            <div class="w3-col w3-container" style="width:35%; padding-left:2px">
                                <input id="classValueText" type="text" style="width:100%"   >
                            </div>
                            <div class="w3-col w3-container" style="width:24%">
                                <p><button class="portal-pane-button" onclick="addClass()" data-toggle="tooltip" data-placement="top" title="Add Class"><i class="fa fa-plus fa-lg" aria-hidden="true"></i></button></p>
                            </div>
                        </div>
                        <div id="classListDiv" class="w3-row w3-padding-8" style="display:none; width:90%">
                            <div class="w3-col container-1" style="">
                                <ul id="classList" class="w3-ul w3-card">
                                </ul>
                            </div>
                        </div>
                    </div>

                </div>

                <div class="w3-row w3-padding-8">
                    <div class="w3-col w3-container" style="width:50%">
                        <p class="label-1 w3-center">Controllers</p>
                    </div>
                    <div class="w3-col w3-container" style="width:50%">
                        <p class="label-1 w3-center">Target</p>
                    </div>
                </div>
                <div id="" class="w3-row w3-padding-8">
                    <div class="w3-col container-1" style="width:50%">
                        <div class="w3-col container-1" style="width:35%">
                            <select id="deviceComboControl" class="combo-1" onchange="updateChannelComboControl()"></select>
                        </div>
                        <div class="w3-col w3-container" style="width:40%">
                            <select id="channelComboControl" class="combo-1" onchange=""></select>
                        </div>
                        <div class="w3-col w3-container" style="width:16%">
                            <p><button class="portal-pane-button" onclick="addControllerDevice()" data-toggle="tooltip" data-placement="top" title="Add Device"><i class="fa fa-plus-square-o fa-2x" aria-hidden="true"></i></button></p>
                        </div>
                    </div>
                    <div class="w3-col container-1" style="width:50%">
                        <div class="w3-col container-1" style="width:35%">
                            <select id="deviceComboTarget" class="combo-1" onchange="updateChannelComboTarget()"></select>
                        </div>
                        <div class="w3-col w3-container" style="width:40%">
                            <select id="channelComboTarget" class="combo-1" onchange=""></select>
                        </div>
                        <div class="w3-col w3-container" style="width:16%">
                            <p><button class="portal-pane-button" onclick="addTarget()" data-toggle="tooltip" data-placement="top" title="Select Target Device"><i class="fa fa-plus-square-o fa-2x" aria-hidden="true"></i></button></p>
                        </div>
                    </div>
                </div>
                <div id="" class="w3-row w3-padding-8">
                    <div class="w3-col container-1" style="width:50%">
                        <div class="w3-col container-1" style="width:70%">
                            <ul class="w3-ul w3-card-4" id="controllersList">
                            </ul>
                        </div>
                    </div>
                    <div class="w3-col container-1" style="width:50%">
                        <div class="w3-col container-1" style="width:70%">
                            <ul class="w3-ul w3-card-4" id="targetList">
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div class="w3-row w3-padding-8 widget-color w3-center">
                <button id="addGraphBtn" class="portal-pane-button" style="font-size:22px; width:auto" onclick="addGraph()">Done</button>
            </div>
            <div class="w3-row w3-padding-8 widget-color w3-center">
                <button id="updateBotBtn" class="portal-pane-button" style="font-size:22px; width:auto; display:none" onclick="changeBotSettings()">Apply</button>
            </div>

            <div class="w3-container">
                <ul class="w3-ul w3-card-4" id="selectedEquationList">
                </ul>
            </div>
            <div class="w3-container">
                <ul class="w3-ul w3-card-4" id="optionList">
                </ul>
            </div>
            <div id="eqListHeader" class="w3-row w3-padding-8">
                <center><p class="w3-large">Select Equations From Here</p></center>
            </div>
            <div class="w3-container">
                <ul class="w3-ul w3-card-4" id="equationListDisp">

                </ul>
            </div>

        </div>
    </nav>

    <nav class="w3-sidenav w3-card-4 w3-animate-top w3-center widget-background-color" style="display:none;padding-top:5%;" id="graphnav">
        <a href="javascript:void(0)" onclick="graphnav_close()" class="w3-closenav w3-xlarge w3-right w3-display-topright" style="padding: 12px; background-color: inherit;">
            <i class="fa fa-remove"></i>
        </a>
        <div id="chartIntDiv" style="padding-bottom:10px;opacity: 1;" class="">
            <button class="portal-button filter-button" onclick="graphPrevInterval()"><i class="fa fa-arrow-left" aria-hidden="true"></i></button>
            <button class="portal-button filter-button" onclick="graphFilterDay()">Day</button>
            <button class="portal-button filter-button" onclick="graphFilterWeek()">Week</button>
            <button class="portal-button filter-button" onclick="graphFilterMonth()">Month</button>
            <button class="portal-button filter-button" onclick="graphFilterYear()">Year</button>
            <button class="portal-button filter-button" onclick="graphNextInterval()"><i class="fa fa-arrow-right" aria-hidden="true"></i></button>
        </div>
        <div id="graphContainer" class="w3-center" style="width: 100%; padding-right:50px; padding-left:50px;opacity: 1;"></div>
        <div id="downloadBtnDiv" class="w3-panel widget-background-color w3-large" style="padding: 400px 64px 0px 64px; float: right">
            <button class="portal-button filter-button" onclick="downloadData()" data-toggle="tooltip" data-placement="top" title="Download data"><i class="fa fa-download fa-2x" aria-hidden="true"></i></button>
        </div>
    </nav>

    <!-- !PAGE CONTENT! -->
    <div id="notification" style="display: none;">
      <span class="dismiss"><a title="dismiss this notification">x</a></span>
    </div>
    <div id="settingsModal" class="settings-modal">
        <!-- Modal content -->
        <div class="settings-modal-content widget-font w3-round-large">
            <span id="settingsCloseBtn" class="settings-close margin-right"><img src="img/delete.png"></span>
            <p class="settings-modal-title">Edit Widget</p>

            <div class="w3-row widget-color">
                <div class="w3-col w3-container" style="width:20%">
                    <p class="label-1">Chart title</p>
                </div>
                <div class="w3-col w3-container" style="width:60%">
                    <input id="chartTitleTextWS" type="text" value="chart">
                </div>
                <div class="w3-col w3-container w3-right" style="width:10%">
                </div>
            </div>
            <div id="settingsModelDateDiv" class="w3-row widget-color">
                <div class="w3-col w3-container" style="width:20%">
                    <p class="label-1">Start Date</p>
                </div>
                <div class="w3-col w3-container" style="width:30%">
                    <input type="text" id="startDatePickerWS" >
                </div>
                <div class="w3-col w3-container" style="width:20%">
                    <p class="label-1">End Date</p>
                </div>
                <div class="w3-col w3-container" style="width:30%">
                    <input type="text" id="endDatePickerWS">
                </div>
            </div>
            <button id="" class="portal-button settings-modal-button" onclick="changeWidgetSettings()">Apply</button>

        </div>
    </div>
    <div id="addLogoModal" class="settings-modal">
        <div class="link-modal-content widget-font w3-round-large">
            <span id="addLogoModalCloseBtn" class="settings-close margin-right"><img src="img/delete.png"></span>
            <p class="link-modal-title">Add Logo</p>
            <span class="widget-color">
                Browse <input id="logoInput" type="file">
                <button class="portal-button settings-modal-button" style="width:100px" onclick="uploadLogo()">Upload</button>
            </span>
        </div>
    </div>
    <!--Link ePro modal-->
    <div id="linkModal" class="settings-modal">
        <div class="link-modal-content widget-font w3-round-large">
            <span id="linkModalCloseBtn" class="settings-close margin-right" onclick="closeLinkModal()"><img src="img/delete.png"></span>
            <p class="link-modal-title" style="font-size:19px">Link ePro Account</p>

            <div class="w3-row widget-color">
                <div class="w3-col w3-container" style="width:20%">
                    <p class="label-3">Username</p>
                </div>
                <div class="w3-col w3-container" style="width:60%">
                    <input id="usernameTextLink" type="text" style="padding:0px 0px">
                </div>
                <div class="w3-col w3-container w3-right" style="width:10%">
                </div>
            </div>
            <div class="w3-row widget-color">
                <div class="w3-col w3-container" style="width:20%">
                    <p class="label-3">Password</p>
                </div>
                <div class="w3-col w3-container" style="width:30%">
                    <input id="passwordTextLink" type="password" style="padding:0px 0px">
                </div>
            </div>
            <button id="linkSubmitBtn" class="portal-button settings-modal-button" onclick="eproConnect('link')">Link</button>
        </div>
    </div>
    <!--Unlink epro confirmation modal-->
    <div id="unlinkModal" class="settings-modal">
        <div class="unlink-modal-content widget-font w3-round-large">
            <span id="" class="settings-close margin-right" onclick="closeUnlinkModal()"><img src="img/delete.png"></span>
            <p id="unlinkPrompt" style="font-size:16px"></p>
            <div class="w3-row widget-color">
                <div class="w3-col w3-container" style="width:50%; text-align:center">
                    <button id="" class="portal-button" onclick="closeUnlinkModal()">Cancel</button>
                </div>
                <div class="w3-col w3-container" style="width:50%; text-align:center">
                    <button id="" class="portal-button" onclick="eproConnect('remove')">Yes</button>
                </div>
            </div>
        </div>
    </div>
    <!--Loader modal-->
    <div id="divLoading" class="loader-modal" style="display:none">
            <img src="img/loadinggif.gif">
    </div>


    <div class="w3-content" style="max-width:100%">


        <!-- Header -->
        <header class="portal-header widget-color w3-padding-48">
            <img id="logo" src="img/logo.png" class="jllogo" style="top:15px;left:10px;">
            <div class="w3-clear"></div>
            <p id="pagetitle" class="page-title" style="font-family: 'Share Tech Mono', monospace;">Visualize, Compare, Control</p>
            <button id="addWidgetButton" class="portal-button" onclick="addWidget()">ADD PANE</button>
            <button id="settingsButton" class="portal-button" onclick="w3_open()">ADMIN CONSOLE</button>
            <button id="logoutButton" class="portal-button" onclick="logout()">LOGOUT</button>
            <select id="themeCombo" class="portal-button" onchange="changeTheme(this.value);">
                <option value="light" class="option-background">LIGHT</option>
                <option value="dark" class="option-background">DARK</option>
            </select>
        </header>



        <div class="w3-row" style="margin-bottom:64px; background-color : transparent;">
            <!-- Grid -->
            <div class="w3-col" id="myGrid" style="width:100%" >
                <div id = "gridDiv" style="background-color : transparent;">
                    <div class="grid-stack" style="background-color : transparent"></div>
                </div>
            </div>
            <!-- Sidebar -->
            <div  id="sidebar" class="w3-col" style="width:20%; float: right; display: none">
                <!-- Weather widget -->
                <div class="sidebar-widget" style="pointer-events:none">
                    <div class="sidebar-widget-header"><span class="w3-margin-right">Weather</span></div>
                    <div class="sidebar-widget">
                        <iframe id="weatherWidget" src="https://www.meteoblue.com/en/weather/widget/three?geoloc=detect&nocurrent=1&days=4&tempunit=CELSIUS&windunit=KILOMETER_PER_HOUR&layout=bright"  frameborder="0" scrolling="NO" allowtransparency="false" sandbox="allow-same-origin allow-scripts allow-popups" style="width: 210px;height: 210px"></iframe><div><!-- DO NOT REMOVE THIS LINK --><a href="https://www.meteoblue.com/en/weather/forecast/week?utm_source=weather_widget&utm_medium=linkus&utm_content=three&utm_campaign=Weather%2BWidget" target="_blank"></a></div>
                    </div>
                </div>

                <!-- Client Logo -->
                <div class="widget-background-color">
                    <div class="sidebar-widget-header w3-margin-bottom">
                        <span id="addLogoBtn" class="closebtn" data-toggle="tooltip" data-placement="left" title="Upload your logo"><img src="img/upload.png"></span>
                    </div>
                    <div class="sidebar-widget" style="height: 120px">
                        <img id="customerLogo" style="max-width:100%; max-height:100%;; "/>
                    </div>
                </div>
                <!-- Environmental Factors widget -->
                <div class="widget-background-color">
                    <div class="sidebar-widget-header"><span class="w3-margin-right">Environmental Benefits</span></div>
                    <div class="sidebar-widget">
                        <table style="width:100%">
                            <tr>
                                <td><p class="siteInfoLabel" style="text-align:center">CO2 Emission Saved</p></td>
                                <td><p class="siteInfoLabel" style="text-align:center">Bulbs Powered</p></td>
                            </tr>
                            <tr>
                                <td><img src="img/co2.png" style="display: block;margin-left: auto;margin-right: auto"></td>
                                <td><img src="img/bulb.png" style="display: block;margin-left: auto;margin-right: auto"></td>
                            </tr>
                            <tr style="height:20px">
                                <td></td>
                            </tr>
                            <tr style="margin-top:20px;">
                                <td><p id="environmentalFactorsCO2" style="text-align:center"></p></td>
                                <td><p id="environmentalFactorsBulbs" style="text-align:center"></p></td>
                            </tr>
                        </table>
                    </div>
                </div>
                <!-- End of Environmental Factors widget -->

            </div>

        </div>

        <!-- Draggable Grid -->



    </div>

    <!-- Footer -->
    <div class="w3-container w3-padding-8 widget-color w3-center w3-margin-top w3-opacity" style="margin-top:60px;position: relative">

<div class="navbar navbar-inverse navbar-fixed-bottom">
      <button id="saveGridButton" class="btn-success btn pull-left" onclick="saveGrid()">SAVE DASHBOARD</button>
      <button id="fullScreenButton" class="btn btn-warning pull-right" onclick="toggleFullscreen()" >FULLSCREEN</button>
</div>
      <!-- <button id="fullScreenButton" class="portal-button" onclick="toggleFullscreen()" >FULLSCREEN</button>
      <button id="saveGridButton" class="portal-button" onclick="saveGrid()">SAVE DASHBOARD</button> -->
        <!-- <div class="w3-xlarge w3-padding-16">

            <a href="#" class="w3-hover-text-indigo"><i class="fa fa-facebook-official"></i></a>
            <a href="#" class="w3-hover-text-red"><i class="fa fa-pinterest-p"></i></a>
            <a href="#" class="w3-hover-text-light-blue"><i class="fa fa-twitter"></i></a>
            <a href="#" class="w3-hover-text-grey"><i class="fa fa-flickr"></i></a>
            <a href="#" class="w3-hover-text-indigo"><i class="fa fa-linkedin"></i></a>
        </div> -->
    </div>
    </div>

    <script>
        if (<?php echo '"'.$id.'"'?> == "none") {
            location.href = 'login.php';
        }   // Login Check
        var userID = "tdk";
        var tempUserID = userID;
        var widgetCount=0;
        var lineChartIndex = 0;
        var colChartIndex = 0;
        var pieChartIndex = 0;
        var gaugeIndex = 0;
        var indicatorIndex = 0;
        var colorPickerIndex = 0;
        var switchIndex = 0;
        var stateControllerIndex = 0;
        var sliderIndex = 0;
        var botIndex = 0;
        var tempOptionList = [];

        var globalEqList = [];
        var tempExpressionsList=[];
        var gauges = [];
        var tempGraph;
        var tempParent;
        var tempId;
        var graphs = {};
        var admin = false;
        var graphy = 0;
        var resizeId;
        var gaugeLiveTimer = {};
        var indicatorLiveTimer = {};
        var tempWidget;
        var gridSaved = true;
        var globalTheme;
        var rgb_string = "";


        window.onload = function(){
            decComponents();
            updateEquationText();
            loadDeviceTypes();
            updateDevicesCombo();
            updateDeviceChannels();

        }
        function decComponents() {
            var id = <?php echo '"'.$id.'"'?>;
            if (id == 1) {
                admin = true;
            }else{
                //$("#addWidgetButton").hide();
                //$("#settingsButton").hide();
                $("#changeUserDiv").hide();
                $("#linkBtnDiv").show();
            }
            userID = id;
            tempUserID = userID;

            loadEquations();
            loadDevices();
            loadTheme();
            loadGrid();
            loadUserCombo();
            loadClientLogo();
            if (!admin)
                eproConnect("stat");
        }
        // $('body').tooltip({
        //     selector: '[data-toggle="tooltip"]',
        // });
    </script>

</body>

</html>
