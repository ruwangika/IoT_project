<?php 
    session_start();
?>
<!DOCTYPE html>
<html>
<?php
    if(isset($_SESSION["id"])){
        $id = $_SESSION["id"];
    }else{
        $_SESSION['msg'] = "Please log in first";
        $id = "none";
    }
?>
<title>JL Portal</title>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv=”Pragma” content=”no-cache”>
<meta http-equiv=”Expires” content=”-1″>
<meta http-equiv=”CACHE-CONTROL” content=”NO-CACHE”>


<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Montserrat">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.6.3/css/font-awesome.min.css">
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css">
<link rel="stylesheet" href="css/gridstack.css"/>
<link rel="stylesheet" href="css/epoch.css">
<link rel="stylesheet" href="css/w3.css">
<link rel="stylesheet" href="css/common.jl.css">
<link rel="stylesheet" href="css/color-light.jl.css">

<link href="css/datepicker.css" rel="stylesheet" type="text/css"/>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.0/jquery-ui.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.5.0/lodash.min.js"></script>
<script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>
<script src="js/gridstack.js"></script>
<script src="js/canvasjs.min.js"></script>
<script src="js/gridstack.jQueryUI.js"></script>
<script src="js/linechart-light.jl.js"></script>
<script src="js/columnchart-light.jl.js"></script>
<script src="js/piechart-light.jl.js"></script>
<script src="js/equations.jl.js"></script>
<script src="js/common.jl.js"></script>
<script src="js/epoch.js"></script>
<script src="js/browserMqtt.js"></script>

<body class="dashboard-background-color">

    <!-- Sidenav -->
    <nav class="w3-sidenav w3-card-2 w3-animate-zoom widget-font widget-background-color" style="display:none;padding-top:20px" id="equationNav">
        <a href="javascript:void(0)" onclick="w3_close()" class="w3-closenav w3-xlarge w3-right w3-display-topright" style="padding:12px;" onmouseover="this.style.backgroundColor='inherit'">
            <i class="fa fa-remove"></i>
        </a>
        
        <div class="w3-panel w3-padding-jumbo widget-background-color w3-large">
            <div class="w3-row w3-padding-8 widget-color">
                <div class="w3-col w3-container" style="width:30%">
                    <p class="label-1">Select a User Environment to Edit
                    </p>
                </div>
                <div class="w3-col w3-container" style="width:30%">
                    <select id="userCombo" onchange="userChanged()" class="combo-1"></select>
                </div>
            </div>
            <div class="w3-row w3-padding-8 widget-color">
                <div class="w3-col w3-container" style="width:14%">
                    <input type="text" id="prefixEquationText" placeholder="Expression prefix" style="width:100%" >
                </div>   
                <div class="w3-col w3-container" style="width:11%">
                    <p class="label-2">Device type</p>
                </div>
                <div class="w3-col w3-container" style="width:12%">
                    <select id="deviceTypeCombo" class="combo-1" onchange="updateDevicesCombo(); updateDeviceChannels()">
                    </select>
                </div>                    
                <div class="w3-col w3-container" style="width:8%">
                    <p class="label-2">Device</p>
                </div>
                <div class="w3-col w3-container" style="width:8%">
                    <select id="deviceCombo" class="combo-1" onchange="updateDeviceChannels()"></select>
                </div>
                <div class="w3-col w3-container" style="width:10%">
                    <p class="label-2">Channel</p>
                </div>
                <div class="w3-col w3-container" style="width:18%">
                    <select id="channelCombo" class="combo-1"></select>
                </div>
                <div class="w3-col w3-container" style="width:9%">
                   <input type="text" size="6" id="equationUnitText" placeholder="Unit" style="width:100%">
                </div>
                <div class="w3-col w3-container" style="width:10%">
                   <p><button class="portal-pane-button" onclick="addExpression()">Add Expression</button></p>
                </div>

            </div>

            <div class="w3-row w3-padding-8 widget-color">
                <div class="w3-col w3-container" style="width:80%">
                    <p id="equationText"></p>
                </div>
                <div class="w3-col w3-container w3-right" style="width:10%">
                    <p><button class="portal-pane-button" onclick="clearExpressions()">Clear Expressions</button></p>
                </div>                
            </div>

            <div class="w3-row w3-padding-8 widget-color">
                <div class="w3-col w3-container" style="width:15%">
                    <p class="label-1">Equation Name</p>
                </div>            
                <div class="w3-col w3-container" style="width:20%">
                   <input type="text" size="6" id="equationNameText" style="width:100%">
                </div>
                <div class="w3-col w3-container" style="width:20%">
                    <p><button class="portal-pane-button" onclick="addEquation()" style="width:80%; height:35px; font-size:18px">Add Equation</button></p>
                </div>                
            </div>
                    
            <div class="w3-container">
              <ul class="w3-ul w3-card-4" id="equationList">
                
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
            
            <div class="w3-row w3-padding-8 widget-color">
                <div class="w3-col w3-container" style="width:10%">
                    <p class="label-1">Graph Type</p>
                </div>
                <div class="w3-col w3-container" style="width:20%">
                      <select id="graphTypeCombo" onchange="showEquations()" class="combo-1">
                        <option value="line">Line chart</option>
                        <option value="bar">Bar chart</option>
                        <option value="pie">Pie chart</option>
                        <option value="guage">Gauge</option>
                        <option value="led">LED</option>
                        <option value="ind">Indicator</option>
                    </select>
                </div>
                <div class="w3-col w3-container" style="width:10%">
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
            <div class="w3-row widget-color">
                <div class="w3-col w3-container" style="width:10%">
                    <p class="label-1">Chart title</p>
                </div>
                <div class="w3-col w3-container" style="width:20%">
                    <input id="chartTitleText" type="text" value="chart">
                </div>
                <div id="dateRangeChooser">
                <div class="w3-col w3-container" style="width:10%">
                    <p class="label-1">Start Date</p>
                </div>
                <div class="w3-col w3-container" style="width:20%">
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
                    <select id="accIntCombo" class="combo-1">
                        <option>HOUR</option>
                        <option selected>DAY</option>
                        <option>WEEK</option>
                        <option>MONTH</option>
                        <option>YEAR</option>
                    </select>
                </div>
            </div>
             
            <div class="w3-row w3-padding-8 widget-color" id="pieChartConfigPanel">
                <div class="w3-col w3-container" style="width:10%">
                    <p class="label-1">Total</p>
                </div>
                <div class="w3-col w3-container" style="width:90%">
                    <select id="pieChartTotalCombo" class="combo-1" style="width: 600px">
                        <option>Undefined</option>
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
                        <p class="label-1">MQQT Title</p>
                    </div>
                    <div class="w3-col w3-container" style="width:20%">
                        <input id="indicatorTitle" type="text" value="0001/temperature">
                    </div>
                </div>
                <div class="w3-row w3-padding-8">
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
            <div class="w3-row w3-padding-8 widget-color w3-center">
                <button class="portal-pane-button" style="font-size:22px; width:auto" onclick="addGraph()">Done</button>
            </div>

            <div class="w3-container">
                <ul class="w3-ul w3-card-4" id="selectedEquationList">

                </ul>
            </div>      
            <div class="w3-row w3-padding-8">
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
        <div style="padding-bottom:10px;opacity: 1;" class="">
            <button class="portal-button filter-button" onclick="graphFilterDay()">Day</button>
            <button class="portal-button filter-button" onclick="graphFilterWeek()">Week</button>
            <button class="portal-button filter-button" onclick="graphFilterMonth()">Month</button>
            <button class="portal-button filter-button" onclick="graphFilterYear()">Year</button>
        </div>
        <div id="graphContainer" class="w3-center" style="width: 100%; padding-right:50px; padding-left:50px;opacity: 1;"></div>
    </nav>

    <!-- !PAGE CONTENT! -->
    <div id="notification" style="display: none;">
      <span class="dismiss"><a title="dismiss this notification">x</a></span>
    </div>
    <div id="settingsModal" class="settings-modal">
        <!-- Modal content -->
        <div class="settings-modal-content widget-font">
            <span id="settingsCloseBtn" class="settings-close"><img src="img/delete.png"></span>
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
            <button id="settings-modal-button" class="portal-button" onclick="changeWidgetSettings()">Apply</button>

        </div>
    </div>
    <div id="addLogoModal" class="settings-modal">
        
        <div class="settings-modal-content widget-font">
            <span id="addLogoModalCloseBtn" class="settings-close"><img src="img/delete.png"></span>
            <p class="settings-modal-title">Add Icon</p>
            <span class="widget-color">
                Browse <input type="file">
            </span>
        </div>
    </div>
    <!--Loader modal-->
    <div id="divLoading" class="loader-modal" style="display:none">
            <img src="img/loadinggif.gif">
    </div>    


    <div class="w3-content" style="max-width:100%">
        
        
        <!-- Header -->
        <header class="portal-header widget-color w3-padding-48">
            <img src="img/logo.png" class="jllogo">
            <div class="w3-clear"></div>
            <p class="page-title">Visualize, Compare, Control</p>
            <button id="addWidgetButton" class="portal-button" onclick="addWidget()">ADD PANE</button>
            <button id="settingsButton" class="portal-button" onclick="w3_open()">ADMIN CONSOLE</button>
            <button id="logoutButton" class="portal-button" onclick="logout()">LOGOUT</button>
            <select id="themeCombo" class="portal-button" onchange="alertSaveGrid();">
                <option selected hidden>THEME</option>
                <option value="light" class="option-background">Light</option>
                <option value="dark" class="option-background">Dark</option>
            </select>
        </header>
        
        

        <div class="w3-row" style="margin-bottom:64px; background-color : transparent;">
            <!-- Grid -->
            <div class="w3-col" id="myGrid" style="width:80%" >
                <div style="background-color : transparent;">
                    <div class="grid-stack" style="background-color : transparent;"></div>
                </div>     
            </div>
            <!-- Sidebar -->
            <div  class="w3-col" style="width:20%; float: right;">
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
                        <span id="addLogoBtn" class="closebtn"><img src="img/upload.png"></span>
                    </div>
                    <div class="sidebar-widget" style="height: 120px">
                        <img id="customerLogo" src="img/eprologo.png" alt="img/eprologo.png" style="width:100%; "/>
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
        <button id="fullScreenButton" class="portal-button" onclick="toggleFullscreen()" >FULLSCREEN</button>
        <button id="saveGridButton" class="portal-button" onclick="saveGrid()">SAVE DASHBOARD</button>
        <div class="w3-xlarge w3-padding-16">

            <a href="#" class="w3-hover-text-indigo"><i class="fa fa-facebook-official"></i></a>
            <a href="#" class="w3-hover-text-red"><i class="fa fa-pinterest-p"></i></a>
            <a href="#" class="w3-hover-text-light-blue"><i class="fa fa-twitter"></i></a>
            <a href="#" class="w3-hover-text-grey"><i class="fa fa-flickr"></i></a>
            <a href="#" class="w3-hover-text-indigo"><i class="fa fa-linkedin"></i></a>
        </div>
    </div>
    </div> 
 
    <script>
        if (<?php echo '"'.$id.'"'?> == "none") {
            location.href = 'login.php';
        }   // Login Check
        var userID = "tdk";
        var widgetCount=0;
        var lineChartIndex = 0;
        var colChartIndex = 0;
        var pieChartIndex = 0;
        var gaugeIndex = 0;
        var indicatorIndex = 0; 
        var globalEqList = [];
        //new:
        var globalEqNameList = [];
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
        var defaultTheme = "THEME";
        

        window.onload = function(){
            decComponents();
            updateEquationText();
            loadDeviceTypes();
            updateDevicesCombo();
            updateDeviceChannels();


        }
        function decComponents() {
            var id = <?php echo '"'.$id.'"'?>;
            if (id == 5) {
                admin = true;
            }else{
                $("#addWidgetButton").hide();
                $("#settingsButton").hide();
            }
            userID = id;

            loadEquations();
            loadGrid();
            loadTheme();
            loadUserCombo();
        }
    </script>

</body>

</html>