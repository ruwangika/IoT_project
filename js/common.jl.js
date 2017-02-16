function updateDevicesCombo() {
    var defaultType = "ePro1000";
    var deviceType = document.getElementById("deviceTypeCombo").value;
    if (deviceType) {
        loadDevicesCombo(deviceType);
    } else {
        loadDevicesCombo(defaultType);
    }
}

function loadDevicesCombo(Type) {//private method
    var deviceCombo = $("#deviceCombo");
    deviceCombo.empty();
    $.ajax({
        url: "back/load_misc_data.php",
        method: "POST",
        data: {
            field: 'devices_'+Type
        },
        dataType: "json",
        success: function(data, status) {
            var _len = data.DeviceId.length;
            for (j = 0; j < _len; j++) {

                $('#deviceCombo').append($('<option/>', {
                    value: data.DeviceId[j],
                    text: data.DeviceId[j]
                }));
            }
            //updateEquationText();
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest);

        }
    });
}
///////////////Edited by Dileep(15-02-2017)
function loadDeviceTypes(){//load supported device types
    var deviceTypeCombo = $("#deviceTypeCombo");
    deviceTypeCombo.empty();
    $.ajax({
        url: "back/load_misc_data.php",
        method: "POST",
        data: {
            field: 'deviceTypes'
        },
        dataType: "json",
        success: function(data, status) {
            
            var _len = data.Type.length;
            for (j = 0; j < _len; j++) {
                $('#deviceTypeCombo').append($('<option/>', {
                    
                    value: data.Type[j],
                    text : data.Type[j]
                }));
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest);

        }
    });
}

function updateDeviceChannels() {
    var defaultType = "ePro1000";
    var defaultDevice = "1076";

    var deviceType = document.getElementById("deviceTypeCombo").value;
    var deviceId = document.getElementById("deviceCombo").value;
    if (!deviceType) {
        loadDeviceChannels(defaultType, defaultDevice);
    } else {
        loadDeviceChannels(deviceType, deviceId);
    }    
}

function loadDeviceChannels(Type,id){
    if(Type=='ePro1000'){
        loadChannelComboEpro();
    }
    else if(Type=='Custom'){
        var deviceCombo = $("#channelCombo");
        deviceCombo.empty();
        $.ajax({
            url: "back/load_misc_data.php",
            method: "POST",
            data: {
                field: 'custom_channels',
                id: id
            },
            dataType: "json",
            success: function(data, status) {
                window.alert(status,data);
                var _len = data.Channel.length;
                for (j = 0; j < _len; j++) {
                    var channel = data.Channel[j];
                    $('#channelCombo').append($('<option/>', {
                        value: channel,
                        text: channel
                    }));
                }
                //updateEquationText();
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.log(XMLHttpRequest);

            }
        });
    }
}
///////////////////////////////////////////////////////////


function loadChannelComboEpro() {//Private method
    var deviceCombo = $("#channelCombo");
    deviceCombo.empty();
    $.ajax({
        url: "back/load_misc_data.php",
        method: "POST",
        data: {
            field: 'epro_channels'
        },
        dataType: "json",
        success: function(data, status) {
            var _len = data.Channel.length;
            for (j = 0; j < _len; j++) {
                var channel = data.Channel[j];
                
                if (channel.substring(0, 3) == "ph1") {         // Total 
                    var ch_postfix = channel.substring(4);
                    var ch_total = '(ph1_'+ ch_postfix + '+ph2_'+ch_postfix + '+ph3_'+ch_postfix+')'; 
                    $('#channelCombo').append($('<option/>', {
                        value: ch_total,
                        text: ch_postfix
                    }));
                }
                $('#channelCombo').append($('<option/>', {
                    value: channel,
                    text: channel
                }));
            }
            //updateEquationText();
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest);

        }
    });
}

function loadPieChartTotalCombo() {

    var totalCombo = $("#pieChartTotalCombo");
    totalCombo.empty();
    var _len = globalEqList.length;
    totalCombo.append($('<option/>', {
        text: "Undefined",
        val: -1
    }));
    for (j = 0; j < _len; j++) {

        if ((parseEquation(globalEqList[j])).includes("energy")) {
            var eq = globalEqList[j];
            var eqStr = parseEquation(eq);
            totalCombo.append($('<option/>', {
                text: eqStr,
                val: eq.device
            }));
        }
    }

}

function loadUserCombo() {
    var userCombo = $("#userCombo");
    userCombo.empty();
    $.ajax({
        url: "back/load_user_data.php",
        method: "POST",
        data: {
            field: 'users'
        },
        dataType: "json",
        success: function(data, status) {
            var _len = data.id.length;
            for (j = 0; j < _len; j++) {

                userCombo.append($('<option/>', {
                    val: data.id[j],
                    text: data.username[j]
                }));
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest);

        }
    });
}

function userChanged() {
    userID = $('#userCombo option:selected').val();
    chageUserEnvironment();

}

function logout() {
    $.ajax({
        url: "back/close_session.php",
        method: "GET",
        dataType: "text",
        success: function(data, status) {
            console.log("Logout : " + status);
            location.href = 'login.php';
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest);

        }
    });

}

function generateChartDiv(id) {
    //var loading_div = '<img src="img/loading.gif" style="height: 400px;width: 100%;">';
    var loading_div = '<div style="height:100%; background-color: #272727"><div class="loader"></div></div>';    
    return '<div id="' + id + '" style="height: 100%; width: 100%;" class="widget-color" ondblclick="graphdbclick(this,id,parent)">'+loading_div+'</div>'
}

function graphdbclick(graph, id) {
    
    if(graphs[id].chart == null){
        return;
    }

    if(document.getElementById("graphnav").style.display == "none"){    // to focus in
        tempParent = $("#" + id).parent();
        tempGraph = graph;
        tempId = id;
        graphnav_open();
        $("#graphContainer").empty();                                       
        document.getElementById("graphContainer").appendChild(graph);
        graphs[id].chart.render();
    }else{                                                              // To focus out
        tempParent.html(tempGraph);
        graphs[tempId].chart.render();
        document.getElementById("graphnav").style.display = "none";
    }
}

function graphFilterDay() {
    $(".filter-button").attr("disabled", "disabled");
    var graphID = tempId;
    var endDate = todayTime();
    var startDate = todayDate();
    var data = graphs[graphID]["chartData"];
    data.startDate = startDate;
    data.endDate = endDate;
    loadChartData(graphs[graphID].type, graphID, data,"day");
}

function graphFilterWeek() {
    $(".filter-button").attr("disabled", "disabled");
    var graphID = tempId;
    var endDate = todayTime();
    var startDate = getStartDate(7);
    var data = graphs[graphID]["chartData"];
    data.startDate = startDate;
    data.endDate = endDate;
    loadChartData(graphs[graphID].type, graphID, data,"week");
}

function graphFilterMonth() {
    $(".filter-button").attr("disabled", "disabled");
    var graphID = tempId;
    var endDate = todayTime();
    var startDate = getStartDate(30);
    var data = graphs[graphID]["chartData"];
    data.startDate = startDate;
    data.endDate = endDate;
    loadChartData(graphs[graphID].type, graphID, data,"month");
}

function graphFilterYear() {
    $(".filter-button").attr("disabled", "disabled");
    var graphID = tempId;
    var endDate = todayTime();
    var startDate = getStartDate(365);
    var data = graphs[graphID]["chartData"];
    data.startDate = startDate;
    data.endDate = endDate;
    loadChartData(graphs[graphID].type, graphID, data,"year");
}

function loadChartData(type, chartID, data,period) {
    if (type == "lineChart") {
        loadlineChartData(chartID, data.title, data.equationList, data.xAxis, data.startDate, data.endDate, data.interval, data.type);
    } else if (type == "colChart") {
        var accInt = "DAY";
        if(period == "day"){
            accInt = "HOUR";
        }else if(period == "week"){
            accInt = "DAY";
        }else if(period == "month"){
            accInt = "WEEK";
        }else if(period == "year"){
            accInt = "MONTH";
        }
        loadBarChartData(chartID, data.title, data.equationList, data.xAxis, data.startDate, data.endDate, accInt, data.tarrifs, data.type)
    } else if (type == "pieChart") {
        loadPieChartData(chartID, data.title, data.equationList, data.total, data.startDate, data.endDate, data.dataType, data.type);
    }
}

// Open and close sidenav
function w3_open() {
    if (!admin) {
        alert("Sorry. You don't have access to this feature.");
        return;
    }
    document.getElementById("equationNav").style.width = "100%";
    document.getElementById("equationNav").style.display = "block";
}

function w3_close() {
    document.getElementById("equationNav").style.display = "none";
    saveEquations();
}

function widgetnav_open() {
    if (!admin) {
        alert("Sorry. You don't have access to this feature.");
        return;
    }
    document.getElementById("widgetNav").style.width = "100%";
    document.getElementById("widgetNav").style.display = "block";
}

function widgetnav_close() {
    document.getElementById("widgetNav").style.display = "none";
}

function graphnav_open() {
    document.getElementById("graphnav").style.width = "100%";
    document.getElementById("graphnav").style.display = "block";
}

function graphnav_close() {
    tempParent.html(tempGraph);
    if(graphs[tempId].chart != null){
        graphs[tempId].chart.render();
    }
    document.getElementById("graphnav").style.display = "none";
}


function addWidget() {
    widgetnav_open();
    showEquations();
}

function saveGrid() {
    var nodes = $('.grid-stack > .grid-stack-item:visible');
    var _len = nodes.length;
    var user_grid = [];
    var theme = document.getElementById("themeCombo").value;
    for (var i = 0; i < _len; i++) {
        var el = $(nodes[i]);
        var node = el.data('_gridstack_node');
        var widgetID = node.el[0].id;

        var grid_node = {
            widgetID: node.el[0].id,
            x: node.x,
            y: node.y,
            w: node.width,
            h: node.height,
            graphID: widgetID.substring(7),
            chartData: graphs[widgetID.substring(7)]["chartData"]

        }
        user_grid.push(grid_node);
    }
    $.ajax({
        url: "back/user_data.php",
        method: "POST",
        data: {
            r_type: 'save_grid',
            userID: userID,
            grid: user_grid,
            theme: theme
        },
        dataType: "text",
        success: function(data, status) {
            addNote("Grid saved!");
            gridSaved = true;
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("Grid save: error!")
            console.log(XMLHttpRequest);
        }
    });
}

function loadGrid() {
    $.ajax({
        url: "back/user_data.php",
        method: "POST",
        data: {
            r_type: 'load_grid',
            userID: userID
        },
        dataType: "json",
        success: function(data, status) {
            console.log("Load grid: " + status);
            loadGridWidgets(data);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("Load grid: error");
            console.log(XMLHttpRequest);
        }
    });
}

function loadTheme() {
    $.ajax({
        url: "back/user_data.php",
        method: "POST",
        data: {
            r_type: 'load_theme',
            userID: userID,
        },
        dataType: "json",
        success: function(data, status) {
            console.log("Load theme: " + status);
            changeTheme(data);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("Load theme: error");
            console.log(XMLHttpRequest);
        }
    });
}

function loadGridWidgets(user_grid) {
    $(".grid-stack").empty();
    graphy = 0;
    var _len = user_grid.length;
    for (var i = 0; i < _len; i++) {
        var grid_node = user_grid[i];
        loadGraph(grid_node.widgetID, grid_node.graphID, grid_node.chartData, grid_node.w, grid_node.h, grid_node.x, grid_node.y);
        if (graphy <= grid_node.y) {
            graphy = parseInt(grid_node.y) + 6;
        }
    }
    // Set line col pie chart indexes substring final index
}

function loadGraph(widgetID, graphID, data, w, h, x, y) {
    var endDate = todayTime();
    var type = data.type;
    if (type == "line") {
        loadlineChartData(graphID, data.title,data.equationList, data.xAxis, data.startDate, endDate, data.interval, data.type);
        var div = generateChartDiv(graphID);
        addDivtoWidget(div, w, h, x, y, widgetID);
        var l_i = parseInt(graphID.substring(9));
        if (l_i >= lineChartIndex) {
            lineChartIndex = l_i + 1;
        }
    } else if (type == "column") {
        loadBarChartData(graphID, data.title, data.equationList,data.xAxis, data.startDate, endDate, data.accInt, data.tarrifs, data.type);
        var div = generateChartDiv(graphID);
        addDivtoWidget(div, w, h, x, y, widgetID);
        var c_i = parseInt(graphID.substring(8));
        if (c_i >= colChartIndex) {
            colChartIndex = c_i + 1;
        }
    } else if (type == "pie") {
        loadPieChartData(graphID, data.title, data.equationList, data.total, data.startDate, endDate, data.dataType, type);
        var div = generateChartDiv(graphID);
        addDivtoWidget(div, w, h, x, y, widgetID);
        var p_i = parseInt(graphID.substring(8));
        if (p_i >= pieChartIndex) {
            pieChartIndex = p_i + 1;
        }
    }else if (type == "gauge") {
        addGauge(widgetID, graphID, data, w, h, x, y);
    }else if (type == "indicator") {
        addIndicator(widgetID, graphID, data, w, h, x, y);
    }


}

function resizeWidget(id) {
    clearTimeout(resizeId);
    resizeId = setTimeout(function() {
        doneResizing(id);
    }, 500);
}

function dragWidget(){
    gridSaved = false;
}

function doneResizing(id) {
    var chartID = id.substring(7);
    if(chartID.includes("line") || chartID.includes("pie") || chartID.includes("col")){
        graphs[chartID].chart.render();
    }
    gridSaved = false;
}

function setGaugeLive(gaugeID) {
    $('#livewidget_'+gaugeID).show();
    if(gaugeID in gaugeLiveTimer){
        clearTimeout(gaugeLiveTimer[gaugeID]);
    }
    gaugeLiveTimer[gaugeID] = setTimeout(function() {
        $('#livewidget_'+gaugeID).hide();
    }, 20000);
}
function setIndicatorLive(indicatorID,interval) {
    if(indicatorID in indicatorLiveTimer){
        clearTimeout(indicatorLiveTimer[indicatorID]);
    }
    indicatorLiveTimer[indicatorID] = setTimeout(function() {
        $('#'+indicatorID+'_ON').hide();
        $('#'+indicatorID+'_OFF').hide();
        $('#'+indicatorID+'_DISCONNECT').show();
    }, parseInt(interval)*1000);
}

function addGraph() {
    gridSaved = false;  // New widget is being added
    var selEqs = []; // get the selected equations
    $('#selectedEquationList li').each(function() {
        selEqs.push(parseInt($(this).attr('index')));
    });
    var _len = selEqs.length;

    var width = parseInt($("#graphWidthCombo").val());

    var graphType = document.getElementById("graphTypeCombo").value;
    if (graphType == "line") {
        if (_len == 0) {
            console.log("No equations selected");
            return;
        }
        var equationList = [];
        for (var i = 0; i < _len; i++) {
            equationList.push(globalEqList[selEqs[i]]);
        }

        var chartID = "linechart" + lineChartIndex;
        var title = $("#chartTitleText").val();
        var xAxis = 'date_time';
        var startDate = $("#startDatePicker").val();
        var endDate = $("#endDatePicker").val();
        var interval = 1;
        var type = 'line';
        var data = loadlineChartData(chartID, title, equationList, xAxis, startDate, endDate, interval, type);

        var widgetID = "widget_" + "linechart" + lineChartIndex;
        var div = generateChartDiv("linechart" + lineChartIndex);
        lineChartIndex++;
        addDivtoWidget(div, width, 6, 0, graphy, widgetID);
        graphy += 6;


    } else if (graphType == "bar") {
        if (_len == 0) {
            console.log("No equations selected");
            return;
        }
        var equationList = [];
        for (var i = 0; i < _len; i++) {
            equationList.push(globalEqList[selEqs[i]]);
        }
        var chartID = "colchart" + colChartIndex;
        var title = $("#chartTitleText").val();
        var xAxis = 'date_time';
        var startDate = $("#startDatePicker").val();
        var endDate = $("#endDatePicker").val();
        var accInt = $("#accIntText").val();
        var type = 'column';
        var tarrifs = [
            ["0-0-0 00:00", "0-0-0 12:00"]
        ];

        var data = loadBarChartData(chartID, title, equationList, xAxis, startDate, endDate, accInt, tarrifs, type);

        var div = generateChartDiv("colchart" + colChartIndex);
        var widgetID = "widget_" + "colchart" + colChartIndex + "";
        colChartIndex++;
        addDivtoWidget(div, width, 6, 0, graphy, widgetID);
        graphy += 6;

    } else if (graphType == "pie") {
        if (_len == 0) {
            console.log("No equations selected");
            return;
        }
        var chartID = "piechart" + pieChartIndex;
        var title = $("#chartTitleText").val();
        var equationList = [];
        for (var i = 0; i < _len; i++) {
            equationList.push(globalEqList[selEqs[i]]);
        }
        var total = $('#pieChartTotalCombo option:selected').val();
        var startDate = $("#startDatePicker").val();
        var endDate = $("#endDatePicker").val();
        var dataType = 'acc';
        var type = 'pie';

        loadPieChartData(chartID, title, equationList, total, startDate, endDate, dataType, type);

        var div = generateChartDiv("piechart" + pieChartIndex);
        var widgetID = "widget_" + "piechart" + pieChartIndex + "";
        pieChartIndex++;
        addDivtoWidget(div, width, 6, 0, graphy, widgetID);
        graphy += 6;
    } else if (graphType == "guage") {
        
        var ip = $("#gaugeIPAddress").val();
        var title = $("#gaugeTitle").val();
        var chartTitle = $("#chartTitleText").val();
        var unit = $("#gaugeUnit").val();
        var widgetID = "widget_gauge"+gaugeIndex;
        var chartID = "gauge"+gaugeIndex;
        var min = parseInt($("#gaugeMin").val());
        var max = parseInt($("#gaugeMax").val());
        var cData = {
            min: min,
            max: max,
            unit: unit,
            ip: ip,
            title: title,
            type: "gauge",
            chartTitle: chartTitle
        };
        addGauge(widgetID, chartID, cData, 3, 3, 0, graphy);
        graphy += 3;
        
    } else if (graphType == "led") {

    }else if (graphType == "ind") {
        var ip = $("#indicatorIPAddress").val();
        var title = $("#indicatorTitle").val();
        var chartTitle = $("#chartTitleText").val();
        var widgetID = "widget_indicator"+indicatorIndex;
        var chartID = "indicator"+indicatorIndex;
        var interval = $("#indicatorInteravl").val();
        var cData = {
            ip: ip,
            title: title,
            interval: interval,
            type: "indicator",
            chartTitle: chartTitle
        };
        addIndicator(widgetID, chartID, cData, 2, 2, 0, graphy);
        graphy += 2;
    }
    $("#selectedEquationList").empty();
    widgetnav_close();
}


function addIndicator(widgetID, graphID, data, w, h, x, y){
    var div = '<div class="widget-color"><p class="chart-title-font">'+data.chartTitle+'</p><div id="'+graphID+'" class="widget-color" style="display: block;margin: 0 auto;"><div id="'+graphID+'_ON" style="display: none"><div class="led-green"></div><h4>On</h4></div> <div id="'+graphID+'_OFF" style="display: none"><div class="led-blue"></div><h4>Off</h4></div><div id="'+graphID+'_DISCONNECT"><div class="led-red"></div><h6>Disconnected!</h6></div></div></div>';
    addDivtoWidget(div, w, h, x, y, widgetID);
    
    var client = initMQQTClientIndicator(graphID,data.ip,data.title,data.interval);
    var i_i = parseInt(graphID.substring(5));
    if (i_i >= indicatorIndex) {
        indicatorIndex = i_i + 1;
    }
    graphs[graphID] = {};
    graphs[graphID]["type"] = "indicator";
    graphs[graphID]["chartData"] = data;

}

function addGauge(widgetID, graphID, data, w, h, x, y){
    var div = '<div class="widget-color"><p id="title_'+graphID+'" class="chart-title-font">'+data.chartTitle+'</p><div id="gauge'+gaugeIndex+'" class="epoch gauge-small widget-color" style="display: block;margin: 0 auto;"></div></div>';
    addDivtoWidget(div, w, h, x, y, widgetID);
    var gauge = initGauge(graphID,data.min,data.max,data.unit);
    var client = initMQQTClient(graphID,data.ip,data.title,gauge);
    var g_i = parseInt(graphID.substring(5));
    if (g_i >= gaugeIndex) {
        gaugeIndex = g_i + 1;
    }
    graphs[graphID] = {};
    graphs[graphID]["chart"] = gauge;
    graphs[graphID]["type"] = "gauge";
    graphs[graphID]["chartData"] = data;
}



function chageUserEnvironment() {
    loadEquations();
    loadGrid();
    loadTheme();
}

function addNote(content) {

    $("#notification").fadeIn("slow").html(content);
    $("#notification").fadeOut("slow");
}

function openSettingsModal(widgetID){
    $("#settingsModal").show();
    tempwidget = widgetID;
    var graphID = widgetID.substring(7);
    var chartData = graphs[graphID]["chartData"];
    
    if(chartData["type"] == "gauge" || chartData["type"] == "indicator"){
        $("#settingsModelDateDiv").hide();
        $("#chartTitleTextWS").val(chartData["chartTitle"]);
    }else{
        $("#chartTitleTextWS").val(chartData["title"]);
        $("#settingsModelDateDiv").show();
        $("#startDatePickerWS").datepicker("setDate", chartData["startDate"]);
        $("#endDatePickerWS").datepicker("setDate", chartData["endDate"]);
    }
    
}

function changeWidgetSettings(){
    var title = $("#chartTitleTextWS").val();
    var graphID = tempwidget.substring(7);
    var chartData = graphs[graphID]["chartData"];
    if(chartData["type"] == "gauge"){
        chartData["chartTitle"] = title;
    }else{
        var startDate = $("#startDatePickerWS").val();
        var endDate = $("#endDatePickerWS").val();
        chartData["startDate"] = startDate;
        chartData["endDate"] = endDate;
        chartData["title"] = title;
    }
    //graphs[graphID]["chartData"] = chartData;
    refreshGraph(graphID,chartData); 
    $("#settingsModal").hide();

}

function refreshGraph(chartID,data){
    if(data.type == "gauge" || data.type == "indicator"){
        
        $("#title_"+chartID).text(data.chartTitle);

    }else{
        if (data.type == "line") {
            loadlineChartData(chartID, data.title, data.equationList, data.xAxis, data.startDate, data.endDate, data.interval, data.type);
        } else if (data.type == "column") {
            loadBarChartData(chartID, data.title, data.equationList, data.xAxis, data.startDate, data.endDate, data.accInt, data.tarrifs, data.type)
        } else if (data.type == "pie") {
            loadPieChartData(chartID, data.title, data.equationList, data.total, data.startDate, data.endDate, data.dataType, data.type);
        }
    }
    gridSaved = false;
}

// onload
$(function() {
    var options = {
        float: true,
        resizable: {
            handles: 'e,w' // To enable only east resizing
        }
    };
    $('.grid-stack').gridstack(options);
    $("#startDatePicker").datepicker();
    $("#endDatePicker").datepicker();
    $("#startDatePickerWS").datepicker();
    $("#endDatePickerWS").datepicker();

    
    
    $("#startDatePicker").datepicker("option", "dateFormat", "yy-mm-dd");
    $("#endDatePicker").datepicker("option", "dateFormat", "yy-mm-dd");
    $("#startDatePicker").datepicker("setDate", getStartDate(30));
    $("#endDatePicker").datepicker("setDate", todayDate());

    $("#startDatePickerWS").datepicker("option", "dateFormat", "yy-mm-dd");
    $("#endDatePickerWS").datepicker("option", "dateFormat", "yy-mm-dd");
    $("#startDatePickerWS").datepicker("setDate", getStartDate(30));
    $("#endDatePickerWS").datepicker("setDate", todayDate());


    $('#settingsCloseBtn').click(function(id) {            
        $("#settingsModal").hide();
    });

    $('#addLogoModalCloseBtn').click(function(id) {            
        $("#addLogoModal").hide();
    });
    

        
    $(":file").change(function () {
        if (this.files && this.files[0]) {
            var reader = new FileReader();
            reader.onload = imageIsLoaded;
            reader.readAsDataURL(this.files[0]);
        }
        $("#addLogoModal").hide();
    });

    $("#addLogoBtn").click(function(){
        console.log("Add Logo Btn");
        $("#addLogoModal").show();
    });
    
    window.onbeforeunload = function() {
        console.log("Grid Saved : "+gridSaved);
        if(gridSaved){
            
        }else{
            window.scrollTo(0,document.body.scrollHeight);
            return "Data will be lost if you leave the page, Please press the save button to save your configuration.";
        }
    };

});

function addDivtoWidget(div, w, h, x, y, widgetID) {
    var options = {
        float: true
    };
    $('.grid-stack').gridstack(options);

    new function() {
        this.items = [];

        this.grid = $('.grid-stack').data('gridstack');


        this.addNewWidget = function() {

            var node = this.items.pop() || {
                x: x,
                y: y,
                width: w,
                height: h
            };

            this.grid.addWidget($(['<div id="' + widgetID + '" style="display: flex;" onresize="resizeWidget(id)" ondrag="dragWidget()"><div class="grid-stack-item-content widget-background-color">',
                    '<span id="close' + widgetID + '" class="closebtn w3-margin-right"><img src="img/delete.png"></span>',
                    '<span id="settings' + widgetID + '" class="settingsbtn w3-margin-right"><img src="img/settings1.png"></span>',
                    '<span id="live' + widgetID + '" class="livebtn w3-medium w3-margin-right" style="display:none"><div class="spinner"></div></span>',
                    '<div class="w3-widget-content">',
                    div,
                    '</div>',
                    '<div/> <div/> '
                ].join('')),
                node.x, node.y, node.width, node.height);



            $('#close' + widgetID).click(function() {
                //$('#widget'+widgetCount).remove();
                $(this).parent().parent().remove();
                //widgetCount--;
            });

            $('#settings' + widgetID).click(function(id) {
                var widgetID = $(this).attr("id").substring(8);
                openSettingsModal(widgetID);
            });

            
            return false;
        }.bind(this);


        this.addNewWidget();
    };
}

function initGauge(id,min,max,unit){
    var chart = $('#'+id).epoch({
        type: 'time.gauge',
        value: 0.0,
        domain: [min, max],
        format: function(v) { return v.toFixed(1)+unit; }
    });
    return chart;
}

function initMQQTClient(id,ip,title,gauge){
    //var client  = mqtt.connect('mqtt://karunasinghe.com')
    var client = mqtt.connect(ip); // you add a ws:// url here
    client.subscribe(title);
    client.on("message", function(topic, payload) {
        var msg_ = [payload].join("");
        console.log(msg_);
        var value_ = parseFloat(msg_.split(",")[1]);        // Messege is given by [packetID,value];
        gauge.update(value_);
        setGaugeLive(id);
    });

    return client;
}

function initMQQTClientIndicator(id,ip,title,interval){
    var client = mqtt.connect(ip); // you add a ws:// url here
    client.subscribe(title);
    client.on("message", function(topic, payload) {
        var msg_ = [payload].join("");
        var value_ = parseFloat(msg_.split(",")[1]);        // Messege is given by [packetID,value];
        if(value_ == 0){
            $('#'+id+'_ON').hide();
            $('#'+id+'_DISCONNECT').hide();
            $('#'+id+'_OFF').show();
        }else{
            $('#'+id+'_ON').show();
            $('#'+id+'_DISCONNECT').hide();
            $('#'+id+'_OFF').hide();
        }
        setIndicatorLive(id,interval);
    });
    return client;
}

function showLed(value) {
    if (value > 30 && value < 36) {
        $('.led-green').hide();
        $('.led-yellow').show();
        $('.led-red').hide();
        $('.led-blue').hide();

    } else if (value < 31) {
        $('.led-green').show();
        $('.led-yellow').hide();
        $('.led-red').hide();

    } else if (value > 35) {
        $('.led-green').hide();
        $('.led-yellow').hide();
        $('.led-red').show();
    }
}

function imageIsLoaded(e) {
    $('#customerLogo').attr('src', e.target.result);
}

function changeTheme(themeId) {

    if (themeId=="dark") {
        document.getElementById("weatherWidget").src="https://www.meteoblue.com/en/weather/widget/three/colombo_sri-lanka_1248991?geoloc=detect&nocurrent=1&days=4&tempunit=CELSIUS&windunit=KILOMETER_PER_HOUR&layout=dark";
        loadCSS("css/color-dark.jl.css");
        loadJS("js/linechart-dark.jl.js");
        loadJS("js/columnchart-dark.jl.js");
        loadJS("js/piechart-dark.jl.js");
        loadGrid();
    } else {
        document.getElementById("weatherWidget").src="https://www.meteoblue.com/en/weather/widget/three/colombo_sri-lanka_1248991?geoloc=detect&nocurrent=1&days=4&tempunit=CELSIUS&windunit=KILOMETER_PER_HOUR&layout=bright";
        loadCSS("css/color-light.jl.css");
        loadJS("js/linechart-light.jl.js");
        loadJS("js/columnchart-light.jl.js");
        loadJS("js/piechart-light.jl.js");
        loadGrid();
    }
}

/** Function to dynamically load JavaScript files */
function loadJS(file) {
    var jsElm = document.createElement("script");
    jsElm.type = "text/javascript";
    jsElm.src = file;
    document.body.appendChild(jsElm);
}

function loadCSS(file) {
    var cssElm = document.createElement("link");
    cssElm.rel = "stylesheet";
    cssElm.type = "text/css";
    cssElm.href = file;
    document.body.appendChild(cssElm);
}

function fullscreen() {
    var elem = document.documentElement;
    if (elem.requestFullscreen) {
    elem.requestFullscreen();
    } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
    elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
    }
}

function toggleFullscreen() {
  if (!document.fullscreenElement &&    // alternative standard method
      !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}
;