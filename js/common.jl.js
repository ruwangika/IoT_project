
// onload
$(function() {
    var options = {
        float: true,
        resizable: {
            handles: 'e,w' // To enable only east resizing
        },
        draggable: {
            
        }
    };
    $('.grid-stack').gridstack(options);
    $("#startDatePicker").datepicker();
    $("#endDatePicker").datepicker();
    $("#startDatePickerWS").datepicker();
    $("#endDatePickerWS").datepicker();

    
    
    $("#startDatePicker").datepicker("option", "dateFormat", "yy-mm-dd");
    $("#endDatePicker").datepicker("option", "dateFormat", "yy-mm-dd");
    $("#startDatePicker").datepicker("setDate", getIntDate(new Date(), "month", "start"));
    $("#endDatePicker").datepicker("setDate", todayDate());

    $("#startDatePickerWS").datepicker("option", "dateFormat", "yy-mm-dd");
    $("#endDatePickerWS").datepicker("option", "dateFormat", "yy-mm-dd");
    $("#startDatePickerWS").datepicker("setDate", getIntDate(new Date(), "month", "start"));
    $("#endDatePickerWS").datepicker("setDate", todayDate());


    $('#settingsCloseBtn').click(function(id) {            
        $("#settingsModal").hide();
    });

    $('#addLogoModalCloseBtn').click(function(id) {            
        $("#addLogoModal").hide();
    });

    $("#addLogoBtn").click(function(){
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

    $(window).resize(function(){
        //console.log("resize");
    });

});

////
function loadCategories(){
    $('#graphCategoryCombo').empty();

    var categories = [];
    var categories_graph = [
        ["Historical", "historical"],
        ["Real-time", "realtime"]
    ];
    var categories_ai = [
        ["Bot", "bot"]
    ];
    var categories_alert = [
        ["Alert", "alert"]
    ];

    var obj_type = $("#objTypeCombo").val();

    if (obj_type=="graph") {
        $("#settingsMain").show();
        $("#graphInfoDiv").show();
        $("#eqListHeader").show();
        $("#equationListDisp").empty();
        categories = categories_graph;
    }
    else if (obj_type=="ai_agent") {
        $("#settingsMain").show();
        $("#graphInfoDiv").hide();
        $("#eqListHeader").hide();
        $("#equationListDisp").empty();
        categories = categories_ai;
    }
    else if (obj_type=="alert_agent") {
        $("#settingsMain").hide();
        $("#graphInfoDiv").hide();
        $("#eqListHeader").hide();
        $("#equationListDisp").empty();
        categories = categories_alert;  
    }  
     
    for (var i=0; i<categories.length; i++){
        $('#graphCategoryCombo').append($('<option/>', {
            text: categories[i][0],
            value: categories[i][1]
        }));        
    }
    loadGraphTypes();
    showEquations();
}
////


function loadGraphTypes(){
    $('#graphTypeCombo').empty();

    var graphTypes = [];
    var graphTypes_historical = [
        ["Line Chart", "line"],
        ["Bar Chart", "bar"],
        ["Pie Chart", "pie"],
        ["Doughnut Chart", "doughnut"],
        ["Spline Chart", "spline"],
        ["Step Line Chart", "stepLine"],
        ["Area Chart", "splineArea"],
        ["Scatter Chart", "scatter"],
        ["Stacked Bar Chart", "stackedColumn"]
    ];
    var graphTypes_realtime = [
        ["Gauge", "gauge"],
        ["Indicator", "ind"],
        ["Switch", "switch"],
        ["Color Picker", "colorpicker"],
        ["State Controller", "statecontroller"],
        ["Multi-state Indicator", "stateind"],
        //["Slider", "slider"],
        //["Bot", "bot"]
    ];
    var graphTypes_ai = [
        ["Bot", "bot"]
    ];
    var graphTypes_alert = [
        ["Alert", "alert"]
    ];
    var graphCategory = $("#graphCategoryCombo").val();
    if (graphCategory=="historical") 
        graphTypes = graphTypes_historical;
    else if (graphCategory=="realtime")
        graphTypes = graphTypes_realtime;
    else if (graphCategory=="bot") 
        graphTypes = graphTypes_ai;
    else if (graphCategory=="alert")
        graphTypes = graphTypes_alert;    
    for (var i=0; i<graphTypes.length; i++){
        $('#graphTypeCombo').append($('<option/>', {
            text: graphTypes[i][0],
            value: graphTypes[i][1]
        }));        
    }
}

function uploadLogo() {
    var file_data = $('#logoInput').prop('files')[0];   
    var form_data = new FormData();                  
    form_data.append('file', file_data);
    form_data.append('user_id', userID);                           
    $.ajax({
            url: 'back/upload.php',                       
            method: 'POST',
            dataType: 'json',
            cache: false,
            contentType: false,
            processData: false,
            data: form_data,  
            success: function(php_script_response){
                console.log(php_script_response);
            }
    });
    var inputEl = document.getElementById("logoInput");
    var reader = new FileReader();
    reader.onload = imageIsLoaded;
    reader.readAsDataURL(inputEl.files[0]);
    $("#addLogoModal").hide();
    $("#loaderModal").hide();
}

function loadClientLogo() {
    var logoURL = 'img/clientlogos/'+userID+'.png';
    $.ajax({
        url: logoURL,
        type:'HEAD',
        error: function() {
            $('#customerLogo').attr('src', 'img/eprologo.png');
        },
        success: function() {
            $('#customerLogo').attr('src', logoURL);
        }
    });
    
}

function updateDevicesCombo() {
    var defaultType = "ePro1000";
    var val = document.getElementById("deviceToggleButton").value;
    
    var deviceType = document.getElementById("deviceTypeCombo").value;
    if (!deviceType) deviceType = defaultType;
    
    if (val==1) {
        loadDevicesIdCombo(deviceType);
    } else if (val==0) {
        loadDevicesCombo(deviceType);
    }   
}

function updateGraphColor(backgroundColor, fontColor, theme) {
    var nodes = $('.grid-stack > .grid-stack-item:visible');
    var _len = nodes.length;
    for (var i = 0; i < _len; i++) {
        var el = $(nodes[i]);
        var node = el.data('_gridstack_node');
        var widgetID = node.el[0].id;
        if (graphs[widgetID.substring(7)]["type"].includes("Chart") || graphs[widgetID.substring(7)]["type"] == "bot") {
            var chart =  graphs[widgetID.substring(7)]["chart"];
            chart.options.backgroundColor = backgroundColor;
            chart.options.theme = theme;
            chart.options.title.fontColor = fontColor;
            chart.options.legend.fontColor = fontColor;
            if (chart.options.subtitles[0])
                chart.options.subtitles[0].fontColor = fontColor;
            chart.render();    
        }
    }
}

function loadDevicesCombo(Type) {//private method
    var deviceCombo = $("#deviceCombo");
    deviceCombo.empty();
    $.ajax({
        url: "back/load_misc_data.php",
        method: "POST",
        data: {
            field: 'devices_' + Type,
            user_id: userID
        },
        dataType: "json",
        success: function(data, status) {
            if (data == "Null Data") return;
            var _len = data.DeviceId.length;
            for (j = 0; j < _len; j++) {

                $('#deviceCombo').append($('<option/>', {
                    value: data.DeviceId[j],
                    text: data.DeviceName[j]
                }));
            }
            //updateEquationText();
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest);

        }
    });
}

function loadDevicesIdCombo(Type) {//private method
    var deviceCombo = $("#deviceCombo");
    deviceCombo.empty();
    $.ajax({
        url: "back/load_misc_data.php",
        method: "POST",
        data: {
            field: 'devices_' + Type,
            user_id: userID
        },
        dataType: "json",
        success: function(data, status) {
            if (data == "Null Data") return;
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
    var selEqs = []; 
    $('#selectedEquationList li').each(function() {
        selEqs.push(parseInt($(this).attr('index')));
    });

    var _len = selEqs.length;
    for (j = 0; j < _len; j++) {
        if ((parseEquation(globalEqList[selEqs[j]].equation)).includes("")) {
            var eq = globalEqList[selEqs[j]].equation;
            var eqName = globalEqList[selEqs[j]].eqName;
            var eqStr = parseEquation(eq);
            totalCombo.append($('<option/>', {
                text: eqName,
                val: j
            }));
        }
    }
}

function showTotalCombo() {
    var val = document.getElementById("toggleTotalComboBtn").value;
    if (val==0) {
        $("#pieChartTotalComboDiv").show();
        document.getElementById("toggleTotalComboBtn").innerHTML = '<i class="fa fa-toggle-on" aria-hidden="true"></i>';
        document.getElementById("toggleTotalComboBtn").setAttribute("value", "1");
        loadPieChartTotalCombo();
    } else if (val==1) {
        $("#pieChartTotalComboDiv").hide();
        document.getElementById("toggleTotalComboBtn").innerHTML = '<i class="fa fa-toggle-off" aria-hidden="true"></i>';
        document.getElementById("toggleTotalComboBtn").setAttribute("value", "0");
        $("#pieChartTotalCombo").empty();
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
            $("#userCombo").val('1');
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest);

        }
    });
}

function userChanged() {
    if(!gridSaved){
        if (confirm("Proceed without saving changes?") == false) {
            document.getElementById("userCombo").value = tempUserID;
            return;
        }
    }
    saveEquations();
    tempUserID = $('#userCombo option:selected').val();
    changeUserEnvironment();
    gridSaved = true;

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
    var loading_div = '<div class="widget-background-color" style="height:100%"><div class="loader">  <div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5"></div></div></div>';    
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
        if (graphs[id].type=="bot") {
            $("#chartIntDiv").hide();
            $("#downloadBtnDiv").hide();
        }
        else if (graphs[id].type=="pieChart") {
            $("#chartIntDiv").show();
            $("#downloadBtnDiv").hide();
        }
        else {
            $("#chartIntDiv").show();
            $("#downloadBtnDiv").show();
        }

        if (graphs[id]["chartData"].type=="stackedColumn") {
            $("#dayFilterBtn").hide();
            $("#yearFilterBtn").hide();
        } else {
            $("#dayFilterBtn").show();
            $("#yearFilterBtn").show();
        }

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
    //$("#divLoading").show();
    $(".filter-button").attr("disabled", "disabled");
    var graphID = tempId;
    var data = graphs[graphID]["chartData"];
    var endDate = data.endDate;
    var startDate = getIntDate(endDate, "day", "start");
    data.startDate = startDate;
    data.endDate = endDate;
    loadChartData(graphs[graphID].type, graphID, data,"day");
}

function graphFilterWeek() {
    //$("#divLoading").show();
    $(".filter-button").attr("disabled", "disabled");
    var graphID = tempId;
    var data = graphs[graphID]["chartData"];
    var endDate = data.endDate;
    var startDate = getIntDate(endDate, "week", "start");
    data.startDate = startDate;
    data.endDate = endDate;
    loadChartData(graphs[graphID].type, graphID, data,"week");
}

function graphFilterMonth() {
    //$("#divLoading").show();
    $(".filter-button").attr("disabled", "disabled");
    var graphID = tempId;
    var data = graphs[graphID]["chartData"];
    var endDate = data.endDate;
    var startDate = getIntDate(endDate, "month", "start");
    data.startDate = startDate;
    data.endDate = endDate;
    loadChartData(graphs[graphID].type, graphID, data,"month");
}

function graphFilterYear() {
    //$("#divLoading").show();
    $(".filter-button").attr("disabled", "disabled");
    var graphID = tempId;
    var data = graphs[graphID]["chartData"];
    var endDate = data.endDate;
    var startDate = getIntDate(endDate, "year", "start");
    data.startDate = startDate;
    data.endDate = endDate;
    loadChartData(graphs[graphID].type, graphID, data,"year");
}

// New ** 08-03-17
function graphPrevInterval() {
    //$("#divLoading").show();
    $(".filter-button").attr("disabled", "disabled");
    var graphID = tempId;
    var data = graphs[graphID]["chartData"];
    var endDate = data.startDate;
    var interval = data.interval;
    var startDate = getIntDate(endDate, interval, "start");
    data.startDate = startDate;
    data.endDate = endDate;
    loadChartData(graphs[graphID].type, graphID, data,interval);
}

function graphNextInterval() {
    //$("#divLoading").show();
    $(".filter-button").attr("disabled", "disabled");
    var graphID = tempId;
    var data = graphs[graphID]["chartData"];
    var startDate = data.endDate;
    var interval = data.interval;
    var endDate = getIntDate(startDate, interval, "end");
    data.startDate = startDate;
    data.endDate = endDate;
    loadChartData(graphs[graphID].type, graphID, data,interval);
}

function loadChartData(type, chartID, data, period) {
    if (type == "lineChart") {
        loadlineChartData(chartID, data.title, data.equationList, data.xAxis, data.startDate, data.endDate, period, data.type);
    } else if (type == "colChart") {
        loadBarChartData(chartID, data.title, data.equationList, data.xAxis, data.startDate, data.endDate, period, data.tarrifs, data.type)
    } else if (type == "pieChart") {
        loadPieChartData(chartID, data.title, data.equationList, data.total_index, data.startDate, data.endDate, data.dataType, data.type);
    }
    //$("#divLoading").hide();
}

// Open and close sidenav
function w3_open() {
    /*if (!admin) {
        alert("Sorry. You don't have access to this feature.");
        return;
    }
    */
    document.getElementById("sideNav").style.width = "100%";
    document.getElementById("sideNav").style.display = "block";
}

function w3_close() {
    document.getElementById("sideNav").style.display = "none";
    saveEquations();
}

// Open and close device nav
function deviceNav_open() {
    document.getElementById("deviceNav").style.width = "100%";
    document.getElementById("deviceNav").style.display = "block";
}

function deviceNav_close() {
    document.getElementById("deviceNav").style.display = "none";
}

// Open and close equation nav
function equationNav_open() {
    document.getElementById("equationNav").style.width = "100%";
    document.getElementById("equationNav").style.display = "block";
}

function equationNav_close() {
    document.getElementById("equationNav").style.display = "none";
}

function widgetnav_open() {
    /*if (!admin) {
        alert("Sorry. You don't have access to this feature.");
        return;
    }
    */
    $("#settingsMain").show();
    $("#controllersList").empty();
    $("#targetList").empty();
    $("#updateBotBtn").hide();
    $("#addGraphBtn").show();
    document.getElementById("widgetNav").style.width = "100%";
    document.getElementById("widgetNav").style.display = "block";
}

function widgetnav_close() {
    document.getElementById("widgetNav").style.display = "none";
    saveAlerts();
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
        if (node.el[0]) {
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
    }
    window.location = "#";
    $.ajax({
        url: "back/user_data.php",
        method: "POST",
        data: {
            r_type: 'save_grid',
            userID: tempUserID,
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
    // Reloading the div for grid-stack
    $("#gridDiv").html('<div class="grid-stack" style="background-color:transparent;"></div>');
    var options = {
        float: true,
        resizable: {
            handles: 'e,w' // To enable only east resizing
        }
    };
    $('.grid-stack').gridstack(options);
    //

    $.ajax({
        url: "back/user_data.php",
        method: "POST",
        data: {
            r_type: 'load_grid',
            userID: tempUserID
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
            document.getElementById("themeCombo").value = data;
            globalTheme = data;
            if (!data) {
                data = "light";
            }
            if (data == "dark") {
                document.getElementById("weatherWidget").src="https://www.meteoblue.com/en/weather/widget/three/colombo_sri-lanka_1248991?geoloc=detect&nocurrent=1&days=4&tempunit=CELSIUS&windunit=KILOMETER_PER_HOUR&layout=dark";
                loadCSS("css/color-dark.jl.css");
            } else if (data == "light") {
                document.getElementById("weatherWidget").src="https://www.meteoblue.com/en/weather/widget/three/colombo_sri-lanka_1248991?geoloc=detect&nocurrent=1&days=4&tempunit=CELSIUS&windunit=KILOMETER_PER_HOUR&layout=bright";
                loadCSS("css/color-light.jl.css");
            }
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
    //graphs = [];
    var _len = user_grid.length;
    for (var i = 0; i < _len; i++) {
        var grid_node = user_grid[i];
        loadGraph(grid_node.widgetID, grid_node.graphID, grid_node.chartData, grid_node.w, grid_node.h, grid_node.x, grid_node.y);
        if (graphy <= grid_node.y) {
            graphy = graphy + parseInt(grid_node.h);
           // graphy = parseInt(grid_node.y) + parseInt(grid_node.h);
        }
    }
    // Set line col pie chart indexes substring final index
}

function loadGraph(widgetID, graphID, data, w, h, x, y) {
    var endDate = todayTime();
    var startDate = getIntDate(endDate, data.interval, "start");
    var type = data.type;
    if (type == "line" || type == "spline" || type =="stepLine" || type == "splineArea" || type == "scatter") {
        loadlineChartData(graphID, data.title,data.equationList, data.xAxis, startDate, endDate, data.interval, data.type);
        var div = generateChartDiv(graphID);
        addDivtoWidget(div, w, h, x, y, widgetID);
        // var l_i = parseInt(graphID.substring(9));
        // if (l_i >= lineChartIndex) {
        //     lineChartIndex = l_i + 1;
        // }
        lineChartIndex++;
    } else if (type == "column" || type == "stackedColumn") {
        loadBarChartData(graphID, data.title, data.equationList,data.xAxis, startDate, endDate, data.interval, data.tarrifs, data.type);
        var div = generateChartDiv(graphID);
        addDivtoWidget(div, w, h, x, y, widgetID);
        // var c_i = parseInt(graphID.substring(8));
        // if (c_i >= colChartIndex) {
        //     colChartIndex = c_i + 1;
        // }
        colChartIndex++;
    } else if (type == "pie" || type == "doughnut") {
        loadPieChartData(graphID, data.title, data.equationList, data.total_index, data.startDate, data.endDate, data.dataType, type);
        var div = generateChartDiv(graphID);
        addDivtoWidget(div, w, h, x, y, widgetID);
        // var p_i = parseInt(graphID.substring(8));
        // if (p_i >= pieChartIndex) {
        //     pieChartIndex = p_i + 1;
        // }
        pieChartIndex++;
    } else if (type == "gauge") {
        addGauge(widgetID, graphID, data, w, h, x, y);
    } else if (type == "indicator") {
        addIndicator(widgetID, graphID, data, w, h, x, y);
    } else if (type == "switch") {
        addSwitch(widgetID, graphID, data, w, h, x, y);
    } else if (type == "colorpicker") {
        addColorPicker(widgetID, graphID, data, w, h, x, y);
    } else if (type == "statecontroller") {
        addStateController(widgetID, graphID, data, w, h, x, y);
    } else if (type == "slider") {
        addSlider(widgetID, graphID, data, w, h, x, y);
    } else if (type == "stateindicator") {
        addStateIndicator(widgetID, graphID, data, w, h, x, y);
    } else if (type == "bot") {
        var div = generateChartDiv(graphID);
        addDivtoWidget(div, w, h, x, y, widgetID);
        addBot(widgetID, graphID, data);
        // var b_i = parseInt(graphID.substring(3));
        // if (b_i >= botIndex) {
        //     botIndex = b_i + 1;
        // }
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
    }, 2000);
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

function setStateIndicatorLive(indicatorID,interval) {
    if(indicatorID in indicatorLiveTimer){
        clearTimeout(indicatorLiveTimer[indicatorID]);
    }
    indicatorLiveTimer[indicatorID] = setTimeout(function() {
        $('#'+indicatorID+'_DISCONNECT').show();
        $('#'+indicatorID).not(":eq(#"+indicatorID+"_DISCONNECT)").hide();   

    }, parseInt(interval)*1000);
}

function addGraph() {
    var selEqs = []; // get the selected equations
    $('#selectedEquationList li').each(function() {
        selEqs.push(parseInt($(this).attr('index')));
    });

    var _len = selEqs.length;

    // var optionList = []; // get the options
    // $('#optionList li').each(function() {
    //     optionList.push($(this).attr('id'));
    // });
    var width = parseInt($("#graphWidthCombo").val());

    var graphType = document.getElementById("graphTypeCombo").value;
    
    if (graphType == "line" || graphType == "spline" || graphType =="stepLine" || graphType == "splineArea" || graphType == "scatter") {
        if (_len == 0) {
            addNote("Select equations!");
            console.log("No equations selected");
            return;
        }
        var equationList = [];
        for (var i = 0; i < _len; i++) {
            equationList.push(globalEqList[selEqs[i]]);
        }
        var widgetIndex = getIndex("linechart");
        var chartID = "linechart" + widgetIndex;
        var title = $("#chartTitleText").val();
        var xAxis = 'date_time';
        var interval = $("#intervalCombo").val();
        var endDate = $("#endDatePicker").val();

        var currentDate = getCurrentDate();
        if (endDate == currentDate) {
            var currentTime = getCurrentTime();
            endDate = endDate + ' ' + currentTime;
        }

        var startDate = getIntDate(endDate, interval, "start");
        var type = graphType;
        var data = loadlineChartData(chartID, title, equationList, xAxis, startDate, endDate, interval, type);

        var widgetID = "widget_" + "linechart" + widgetIndex;
        var div = generateChartDiv("linechart" + widgetIndex);
        lineChartIndex++;
        addDivtoWidget(div, width, 6, 0, graphy, widgetID);
        graphy += 6;


    } else if (graphType == "bar") {
        if (_len == 0) {
            addNote("Select equations!");
            console.log("No equations selected");
            return;
        }
        var equationList = [];
        for (var i = 0; i < _len; i++) {
            equationList.push(globalEqList[selEqs[i]]);
        }
        var widgetIndex = getIndex("colchart");
        var chartID = "colchart" + widgetIndex;
        var title = $("#chartTitleText").val();
        var xAxis = 'date_time';
        var endDate = $("#endDatePicker").val();
        var interval = $("#intervalCombo").val();
        var startDate = getIntDate(endDate, interval, "start");
        //var accInt = $("#intervalCombo").val();
        var type = 'column';
        var tarrifs = [
            ["0-0-0 00:00", "0-0-0 12:00"]
        ];

        var data = loadBarChartData(chartID, title, equationList, xAxis, startDate, endDate, interval, tarrifs, type);

        var div = generateChartDiv("colchart" + widgetIndex);
        var widgetID = "widget_" + "colchart" + widgetIndex + "";
        colChartIndex++;
        addDivtoWidget(div, width, 6, 0, graphy, widgetID);
        graphy += 6;

    } else if (graphType == "pie" || graphType == "doughnut") {
        if (_len == 0) {
            addNote("Select equations!");
            console.log("No equations selected");
            return;
        }
        var widgetIndex = getIndex("piechart");
        var chartID = "piechart" + widgetIndex;
        var title = $("#chartTitleText").val();
        var equationList = [];
        for (var i = 0; i < _len; i++) {
            equationList.push(globalEqList[selEqs[i]]);
        }
        var totalIndex = -1;
        if ($('#pieChartTotalCombo option:selected').length != 0) {
            totalIndex = parseInt($('#pieChartTotalCombo option:selected').attr('value'));
        }
        var startDate = $("#startDatePicker").val();
        var endDate = $("#endDatePicker").val();
        var dataType = 'acc';
        var type = graphType;

        loadPieChartData(chartID, title, equationList, totalIndex, startDate, endDate, dataType, type);

        var div = generateChartDiv("piechart" + widgetIndex);
        var widgetID = "widget_" + "piechart" + widgetIndex + "";
        pieChartIndex++;
        addDivtoWidget(div, width, 6, 0, graphy, widgetID);
        graphy += 6;
    } else if (graphType == "stackedColumn") {
        if (_len == 0) {
            addNote("Select equations!");
            console.log("No equations selected");
            return;
        }
        var equationList = [];
        for (var i = 0; i < _len; i++) {
            equationList.push(globalEqList[selEqs[i]]);
        }

        var startTime = $("#startTime").val();
        var endTime = $("#endTime").val();
        var intArray = [];
        intArray.push(startTime);
        $("#intList").find('input:text').each(function(){
            var val = $(this).val();
            if (val) intArray.push(val);
        });
        intArray.push(endTime);

        var isValid = true;
        for (i = 0; i < intArray.length - 1; i++) {
            isValid = validateTime(intArray[i], intArray[i + 1]);
            if (!isValid) break;
        }

        if (!isValid) {
            addNote("Invalid time values. Check again!");
            alertColor(i, intArray.length);
            return;
        }

        var widgetIndex = getIndex("colchart");
        var chartID = "colchart" + widgetIndex;
        var title = $("#chartTitleText").val();
        var xAxis = 'date_time';
        var endDate = $("#endDatePicker").val();
        var interval = $("#intervalCombo").val();
        var startDate = getIntDate(endDate, interval, "start");
        var type = graphType;
        var tarrifs = intArray;

        var data = loadBarChartData(chartID, title, equationList, xAxis, startDate, endDate, interval, tarrifs, type);

        var div = generateChartDiv("colchart" + widgetIndex);
        var widgetID = "widget_" + "colchart" + widgetIndex + "";
        colChartIndex++;
        addDivtoWidget(div, width, 6, 0, graphy, widgetID);
        graphy += 6;
    }     
    else if (graphType == "gauge") {
        var widgetIndex = getIndex("gauge");
        var ip = $("#gaugeIPAddress").val();
        var title = $("#gaugeTitle").val();
        var chartTitle = $("#chartTitleText").val();
        var unit = $("#gaugeUnit").val();
        var widgetID = "widget_gauge"+widgetIndex;
        var chartID = "gauge"+widgetIndex;
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

    } else if (graphType == "ind") {
        var widgetIndex = getIndex("indicator");
        var ip = $("#indicatorIPAddress").val();
        var title = $("#indicatorTopic").val();
        var chartTitle = $("#chartTitleText").val();
        var widgetID = "widget_indicator"+widgetIndex;
        var chartID = "indicator"+widgetIndex;
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
    } else if (graphType == "switch") {
        var widgetIndex = getIndex("switch");
        var ip = $("#indicatorIPAddress").val();
        var title = $("#indicatorTopic").val();
        var chartTitle = $("#chartTitleText").val();
        var widgetID = "widget_switch"+widgetIndex;
        var chartID = "switch"+widgetIndex;
        var cData = {
            ip: ip,
            title: title,
            type: "switch",
            chartTitle: chartTitle
        };
        addSwitch(widgetID, chartID, cData, 2, 2, 0, graphy);
        graphy += 2;
    } else if (graphType == "colorpicker") {
        var widgetIndex = getIndex("colorpicker");
        var ip = $("#indicatorIPAddress").val();
        var title = $("#indicatorTopic").val();
        var chartTitle = $("#chartTitleText").val();
        var widgetID = "widget_colorpicker"+widgetIndex;
        var chartID = "colorpicker"+widgetIndex;
        var cData = {
            ip: ip,
            title: title,
            type: "colorpicker",
            chartTitle: chartTitle
        };
        addColorPicker(widgetID, chartID, cData, 2, 3, 0, graphy);
        graphy += 3;
    } else if (graphType == "statecontroller") {
        var widgetIndex = getIndex("statecontroller");
        var ip = $("#controllerIPAddress").val();
        var title = $("#controllerTopic").val();
        var chartTitle = $("#chartTitleText").val();
        var widgetID = "widget_statecontroller"+widgetIndex;
        var chartID = "statecontroller"+widgetIndex;
        var cData = {
            ip: ip,
            title: title,
            type: "statecontroller",
            chartTitle: chartTitle,
            optionList: tempOptionList
        };
        var _h = 3;
        if (tempOptionList.length <= 2) _h = 2;
        else if (tempOptionList.length <= 4) _h = 3;
        else _h = 4;
        addStateController(widgetID, chartID, cData, 3, _h, 0, graphy);
        tempOptionList = [];     
        graphy += _h;
    } else if (graphType == "slider") {
        var widgetIndex = getIndex("slider");
        var ip = $("#gaugeIPAddress").val();
        var title = $("#gaugeTitle").val();
        var chartTitle = $("#chartTitleText").val();
        var unit = $("#gaugeUnit").val();
        var widgetID = "widget_slider"+widgetIndex;
        var chartID = "slider"+widgetIndex;
        var min = parseInt($("#gaugeMin").val());
        var max = parseInt($("#gaugeMax").val());
        var cData = {
            min: min,
            max: max,
            unit: unit,
            ip: ip,
            title: title,
            type: "slider",
            chartTitle: chartTitle
        };
        addSlider(widgetID, chartID, cData, 3, 4, 0, graphy);  
        graphy += 4;
    } else if (graphType == "stateind") {        
        var widgetIndex = getIndex("stateindicator");
        var ip = $("#indicatorIPAddress").val();
        var title = $("#indicatorTopic").val();
        var chartTitle = $("#chartTitleText").val();
        var widgetID = "widget_stateindicator"+widgetIndex;
        var chartID = "stateindicator"+widgetIndex;
        var interval = $("#indicatorInteravl").val();
        var stateList = tempStateList;
        var cData = {
            ip: ip,
            title: title,
            states: stateList,
            interval: interval,
            type: "stateindicator",
            chartTitle: chartTitle
        };
        addStateIndicator(widgetID, chartID, cData, 2, 2, 0, graphy);
        tempStateList = [];
        graphy += 2;
    } else if (graphType == "bot") {
        var widgetIndex = getIndex("bot");
        var ip = $("#botIPPort").val();
        var chartTitle = $("#chartTitleText").val();
        var learner = $("#learnerCombo").val();
        var widgetID = "widget_bot"+widgetIndex;
        var chartID = "bot"+widgetIndex;
        var learner_class = $("#learnerTypeCombo").val();

        var div = generateChartDiv(chartID);
        //botIndex++;
        addDivtoWidget(div, width, 6, 0, graphy, widgetID);
        graphy += 6;

        var controllers = [];
        $("#controllersList li").each(function(idx, li) {
            controllers.push(li.id.substring(5));
        });
        var target = "";
        $("#targetList li").each(function(idx, li) {
            target = li.id.substring(5);
        });
        var classes = [];
        $("#classList li").each(function(idx, li) {
            var _class = [document.getElementById(li.id).innerHTML.split('<span')[0], parseInt(li.id.substring(3))]
            classes.push(_class);
        });

        var model = {};
        model["modelId"] = userID+"_"+chartID;
        model["input_fields"] = controllers;
        model["output_field"] = target;
        model["learner_type"] = learner;

        var classIDs = [];
        if (learner_class=="classifier") {
            for (var i = 0; i < classes.length; i++) {
                classIDs.push(classes[i][1]);
            }
            model["output_classes"] = classIDs;
        }

        var cData = {
            ip: ip,
            type: "bot",
            chartTitle: chartTitle,
            learner_class: learner_class,
            classes: classes,
            model: model
        };
        addBot(widgetID, chartID, cData);
    } else if (graphType == "alert") {
        //saveAlerts();
    }

    gridSaved = false;  // New widget is being added
    $("#classList").empty();
    $("#classListDiv").hide();
    $("#selectedEquationList").empty();
    $("#optionList").empty();
    widgetnav_close();
}


function addIndicator(widgetID, graphID, data, w, h, x, y){
    var div = '<div class="widget-color"><p id="title_'+graphID+'" class="chart-title-font">'+data.chartTitle+'</p><div id="'+graphID+'" class="widget-color" style="display: block;margin: 0 auto;"><div id="'+graphID+'_ON" style="display: none"><div class="led-green"></div><h4>On</h4></div> <div id="'+graphID+'_OFF" style="display: none"><div class="led-blue"></div><h4>Off</h4></div><div id="'+graphID+'_DISCONNECT"><div class="led-red"></div><h4>Disconnected!</h4></div></div></div>';
    addDivtoWidget(div, w, h, x, y, widgetID);
    
    var client = initMQTTClientIndicator(graphID,data.ip,data.title,data.interval);
    // var i_i = parseInt(graphID.substring(9));
    // if (i_i >= indicatorIndex) {
    //     indicatorIndex = i_i + 1;
    // }
    indicatorIndex++;
    graphs[graphID] = {};
    graphs[graphID]["type"] = "indicator";
    graphs[graphID]["chartData"] = data;

}

function addGauge(widgetID, graphID, data, w, h, x, y){
    var div = '<div class="widget-color"><p id="title_'+graphID+'" class="chart-title-font">'+data.chartTitle+'</p><div id="gauge'+graphID.substring(5)+'" class="epoch gauge-small widget-color" style="display: block;margin: 0 auto;"></div></div>';
    addDivtoWidget(div, w, h, x, y, widgetID);
    var gauge = initGauge(graphID,data.min,data.max,data.unit);
    var client = initMQTTClient(graphID,data.ip,data.title,gauge);
    var g_i = parseInt(graphID.substring(5));
    // if (g_i >= gaugeIndex) {
    //     gaugeIndex = g_i + 1;
    // }
    gaugeIndex++;
    graphs[graphID] = {};
    graphs[graphID]["chart"] = gauge;
    graphs[graphID]["type"] = "gauge";
    graphs[graphID]["chartData"] = data;
}

// Added 2017-03-20
function addColorPicker(widgetID, graphID, data, w, h, x, y) {
    var divStr = '<div id="'+graphID+'_cpDiv" class="inl-bl"></div>';
    var port = parseInt(data.ip.substr(data.ip.length - 4));

    var div = '<div class="widget-color colorpicker" style="  -webkit-border-radius: 0px;-moz-border-radius: 0px;border-radius: 0px;"><p id="title_'+graphID+'" class="chart-title-font">'+data.chartTitle+'</p><div id="colorpicker'+graphID.substring(11)+'" class="" style="display: block;margin: 0 auto;">'+divStr+'<div><button id="setColorBtn" class="" style="" onclick="setColor(\''+graphID+'\')">Set Color</button></div></div></div>';
    addDivtoWidget(div, w, h, x, y, widgetID);
     $('#'+graphID+'_cpDiv').colorpicker({
        color: '#ffaa00',
        container: true,
        inline: true,
    });

    $('.colorpicker').colorpicker().on('changeColor', function(ev){
        var rgb = ev.color.toRGB();
        rgb_string = rgb.r+','+rgb.g+','+rgb.b;
    });

    // var c_i = parseInt(graphID.substring(11));
    // if (c_i >= colorPickerIndex) {
    //     colorPickerIndex = c_i + 1;
    // }
    colorPickerIndex++;
    graphs[graphID] = {};
    graphs[graphID]["type"] = "colorpicker";
    graphs[graphID]["chartData"] = data;
}

function setColor(graphID) {
    console.log(rgb_string);
    var colorPickerData = graphs[graphID]["chartData"];
    var port = parseInt(colorPickerData.ip.substr(colorPickerData.ip.length - 4));
    mqttPub(rgb_string, colorPickerData.ip, port, colorPickerData.title)
}

function addSwitch(widgetID, graphID, data, w, h, x, y){
    var div = '<div class="widget-color"><p id="title_'+graphID+'" class="chart-title-font">'+data.chartTitle+'</p><div id="'+graphID+'" class="widget-color" style="display: block;margin: 0 auto;background-color: inherit;"><div id="'+graphID+'_ON" style="display: none"><div class="switch-off" onclick="switchOff(\''+graphID+'\')" style="cursor:pointer"></div><h6 style="padding-bottom:7px">On</h6></div><div id="'+graphID+'_OFF" style="display: none"><div class="switch-on" onclick="switchOn(\''+graphID+'\')" style="cursor:pointer"></div><h6 style="padding-bottom:7px">Off</h6></div><div id="'+graphID+'_UNIDENTIFIED"><div class="switch" style="cursor:pointer" onclick="setSwitch(\''+graphID+'\')"></div><h6 style="padding-bottom:7px">Pending</h6></div></div></div>';
    addDivtoWidget(div, w, h, x, y, widgetID);
    var port = parseInt(data.ip.substr(data.ip.length - 4));
    var client = initMQTTClientSwitch(graphID, data.ip, port, data.title);
    // var s_i = parseInt(graphID.substring(6));
    // if (s_i >= switchIndex) {
    //     switchIndex = s_i + 1;
    // }
    switchIndex++;
    graphs[graphID] = {};
    graphs[graphID]["type"] = "switch";
    graphs[graphID]["chartData"] = data;

}

function setSwitch(graphID) {
    var switchData = graphs[graphID]["chartData"];
    var port = parseInt(switchData.ip.substr(switchData.ip.length - 4));
    mqttPub(-1, switchData.ip, port, switchData.title)
}


function addOption() {
    var optionName = $("#optionNameText").val();
    var optionValue = $("#optionValueText").val();

    $("#optionList").append("<li onclick=\"\" id=\"li_option_"+optionValue+"\" data-toggle=\"tooltip\" data-placement=\"top\" title=\""+optionValue+"\">"+optionName+"<span class=\"w3-closebtn w3-margin-right w3-medium\" onclick=\"removeOption('"+optionName+"','"+optionValue+"',this)\">-</span></li>");
    tempOptionList.push([optionName, optionValue]);
}

var removeOption = function(optionName, optionValue, object){
    var li = document.getElementById("li_option_"+optionValue);
    li.remove();
    var option = [optionName, optionValue];
    var index = tempOptionList.map(function(el){return el[1];}).indexOf(optionValue);
    if (index > -1) {
        tempOptionList.splice(index, 1);
    }   
}

function addStateController(widgetID, graphID, data, w, h, x, y){

    var div = '<div class="widget-color"><p id="title_'+graphID+'" class="chart-title-font" style="margin-bottom:5px">'+data.chartTitle+'</p><div id="'+graphID+'" class="widget-color" style="display: block;margin: 0 auto;background-color: inherit;"></div><div><ul class="w3-ul" id="optionListDisp'+graphID+'"></ul></div></div>';
    addDivtoWidget(div, w, h, x, y, widgetID);
    var port = parseInt(data.ip.substr(data.ip.length - 4));

    var _len = data.optionList.length;
    for (i = 0; i < _len; i++) {
        optionName = data.optionList[i][0];
        optionValue = data.optionList[i][1];
        $("#optionListDisp"+graphID).append("<li class=\"widget-li\"><label for=\""+graphID+"_"+optionValue+"\" style=\"width:90%\">"+optionName+"</label><input type=\"radio\" id=\""+graphID+"_"+optionValue+"\" name=\""+graphID+"stateOption\" style=\"float:right; width:10%\"></li>");
    }
    var client = initMQTTClientStateController(graphID, data.ip, port, data.title);

    $(document).ready(function() {
        $("input[name='"+graphID+"stateOption']").on("change", function() {
            $("input:checked").each(function(key, val) {
                var index = val.id.indexOf("_");
                var optionVal = val.id.substr(index + 1);
                mqttPub(optionVal, data.ip, port, data.title); 
                $('#'+graphID+'_'+optionVal).prop("checked", false);
            });
        });
    });

    // var sc_i = parseInt(graphID.substring(15));
    // if (sc_i >= stateControllerIndex) {
    //     stateControllerIndex = sc_i + 1;
    // }
    stateControllerIndex++;
    graphs[graphID] = {};
    graphs[graphID]["type"] = "statecontroller";
    graphs[graphID]["chartData"] = data;

}

function addSlider(widgetID, graphID, data, w, h, x, y){

    var sliderStr = '<div id="'+graphID+'_command" style="padding-left:15px"><input type="range" min="0" max="5" data-rangeslider="" data-orientation="vertical" style="position: absolute; width: 1px; height: 1px; overflow: hidden; opacity: 0;"><div class="rangeslider rangeslider--vertical" id="js-rangeslider-6"><div class="rangeslider__fill" style="height: 86px;"></div><div class="rangeslider__handle" style="bottom: 66px;"></div></div> <output style="display:inline-block; margin-bottom: 0;">3</output></div>';

    var div = '<div class="widget-color"><p id="title_'+graphID+'" class="chart-title-font">'+data.chartTitle+'</p><div id="'+graphID+'" class="widget-color" style="display: block;margin: 0 auto;background-color: inherit;"></div>'+sliderStr+'</div>';
    addDivtoWidget(div, w, h, x, y, widgetID);

    var port = parseInt(data.ip.substr(data.ip.length - 4));

    //var client = initMQTTClientSlider(graphID, data.ip, port, data.title);

    $(document).ready(function() {
        $('input[type="range"]').rangeslider();
    });

    // var sl_i = parseInt(graphID.substring(6));
    // if (sl_i >= sliderIndex) {
    //     sliderIndex = sl_i + 1;
    // }
    sliderIndex++;
    graphs[graphID] = {};
    graphs[graphID]["type"] = "slider";
    graphs[graphID]["chartData"] = data;

}

function addStateIndicator(widgetID, graphID, data, w, h, x, y) {
    //To do
    var div = '<div class="widget-color"><p id="title_'+graphID+'" class="chart-title-font">'+data.chartTitle+'</p><div id="'+graphID+'" class="widget-color" style="display: block;margin: 0 auto;"><div id="'+graphID+'_DISCONNECT" style=""><div class="led-red"></div><h4>Disconnected!</h4></div></div></div>';
    addDivtoWidget(div, w, h, x, y, widgetID);
    
    var indStr = $("#"+graphID).html();
    var _len = data.states.length;
    for (i = 0; i < _len; i++) {
        var name = data.states[i][0];
        var state = data.states[i][1];
        var color = data.states[i][2];
         indStr += '<div id="'+graphID+'_'+state+'" style="display:none"><div class="led" style="background-color:#'+color+'"></div><h4>'+name+'</h4></div>';
         $("#"+graphID).html(indStr);
    }

    var client = initMQTTClientStateIndicator(graphID,data.ip,data.title,data.interval);

    stateIndicatorIndex++;
    graphs[graphID] = {};
    graphs[graphID]["type"] = "stateindicator";
    graphs[graphID]["chartData"] = data;
}

function initMQTTClientStateIndicator(id, ip, title, interval){
    var randomstr=randomString(10);
    options={
        clientId: randomstr,
        keepalive: 1,
        clean: false};
    var client = mqtt.connect(ip,options); // you add a ws:// url here
    client.subscribe(title);
    client.on("message", function(topic, payload) {
        var msg_ = [payload].join("");
        var value_ = parseFloat(msg_);        // Messege is given by [packetID,value];
        console.log(value_);
        if(!isNaN(value_)) {                
            $('#'+id+'_'+value_).show(); 
            $('#'+id).not(":eq(#"+id+"_"+value_+")").hide();           
            
            setStateIndicatorLive(id, interval);
        }
    });
    client.on("reconnect", function() {
        client.subscribe(title);
    });
    return client;
}

function addState() {
    var stateName = $("#stateNameText").val();
    var stateValue = $("#stateValueText").val();
    var stateColor = $("#stateColorPicker").spectrum("get").toHex();
    if (!stateValue) return;
    if (!stateName) stateName = stateValue;

    for (var i = 0; i < tempStateList.length; i++) {
        if (tempStateList[i][0] == stateName) {
            addNote("State name already exists!");
            return;
        } else if (tempStateList[i][1] == stateValue) {
            addNote("State already exists!");
            return;
        } else if (tempStateList[i][2] == stateColor) {
            addNote("Color already used for another state!");
            return;
        }
    }

    $("#equationListDisp").append("<li onclick=\"\" id=\"li_state_"+stateValue+"\" data-toggle=\"tooltip\" data-placement=\"top\" title=\""+stateValue+"\">"+stateName+"<span class=\"colorind\" style=\"background-color:#"+stateColor+"\"></span><span class=\"w3-closebtn w3-margin-right w3-medium\" onclick=\"removeState('"+stateName+"','"+stateValue+"',this)\">-</span></li>");
    tempStateList.push([stateName, stateValue, stateColor]);    
}

function removeState(stateName, stateValue, object) {
    var li = document.getElementById("li_state_"+stateValue);
    li.remove();
    var state = [stateName, stateValue];
    var index = tempStateList.map(function(el){return el[1];}).indexOf(stateValue);
    if (index > -1) {
        tempStateList.splice(index, 1);
    }      
}

function addIntBox(elm) {
    var index = $(elm).parent().index();
    $("#intList li:eq("+index+")").after('<li class="input-append"><input class="add-on" data-format="hh:mm:ss" onclick="removeBGColor(this)" type="text"></input><button class="portal-pane-button" style="width:10%; padding:3px 0px" onclick="addIntBox(this)" data-toggle="tooltip" data-placement="top" title="Add new interval here"><i class="fa fa-plus-circle" aria-hidden="true"></i></button><button class="portal-pane-button" style="width:10%; padding:3px 0px" onclick="removeIntBox(this)" data-toggle="tooltip" data-placement="top" title="Remove intervel"><i class="fa fa-times-circle" aria-hidden="true"></i></button></li>');
    
    initDateTimePicker();
}

function removeIntBox(elm) {
    $(elm).parent().remove();
}

///

function changeUserEnvironment() {
    loadEquations();
    loadDevices();
    loadGrid();
}

function addNote(content) {
    $("#notification").fadeIn("slow").html(content);
    setTimeout(function(){ $("#notification").fadeOut("slow") }, 1500);
}

function openLinkModal() {
    $("#linkModal").show();
}

function closeLinkModal() {
    $("#linkModal").hide();
}

function openUnlinkModal() {
    $("#unlinkModal").show();
}

function closeUnlinkModal() {
    $("#unlinkModal").hide();
}

function submitDetailsEPro() {
    closeLinkModal();
}

function eproConnect(optionStr) {
    console.log("id:"+userID);
    var data = {};
    var username = $("#usernameTextLink").val();
    var password = $("#passwordTextLink").val();
    if (optionStr=="stat") {
        data = {
            type: optionStr, 
            id: userID
        };
    } else if (optionStr=="link") {
        data = {
            type: optionStr,
            username: username,
            pwd: password,
            id:userID
        }
    } else if (optionStr=="remove") {
        data = {
            type: optionStr,
            id: userID
        }
    }
    $.ajax({
        url: "back/ePro_authenticate.php",
        method: "POST",
        data: data,
        dataType: "text",
        success: function(data, status) {
            console.log("ePro connect: " + status);
            //window.alert("Username: "+data);

            if (!data) return;
            else if (data=="Invalid login!") {
                addNote(data);
            } else if (data=="success!") {
                document.getElementById("linkBtnDiv").innerHTML = '<button id="linkAccBtn" class="portal-button button-background" onclick="openLinkModal()" data-toggle="tooltip" data-placement="left" title="Link ePro account">ePro<br><i class="fa fa-link" aria-hidden="true"></i></button>';
                addNote("ePro account disconnected")
            } else {
                document.getElementById("linkBtnDiv").innerHTML = '<button id="linkAccBtn" class="portal-button button-background" onclick="openUnlinkModal()" data-toggle="tooltip" data-placement="left" title="Disconnect ePro account">ePro<br><i class="fa fa-trash-o" aria-hidden="true"></i></button>';
                document.getElementById("unlinkPrompt").innerHTML = 'Are you sure you want to disconnect ' + data + '?';
                addNote("Linked with ePro account " + data);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("ePro connect.");
            console.log(XMLHttpRequest);
        }
    });
    $("#usernameTextLink").empty();
    $("#passwordTextLink").empty();
    closeLinkModal();
    closeUnlinkModal();
    toggleDeviceDisplay();
}

function openSettingsModal(widgetID){
    tempwidget = widgetID;
    var graphID = widgetID.substring(7);
    var chartData = graphs[graphID]["chartData"];
    
    if(chartData["type"] == "gauge" || chartData["type"] == "indicator" || chartData["type"] == "switch" || chartData["type"] == "colorpicker" || chartData["type"] == "statecontroller" || chartData["type"] == "slider"){
        $("#settingsModal").show();
        $("#settingsModelDateDiv").hide();
        $("#chartTitleTextWS").val(chartData["chartTitle"]); 

    }else if (chartData["type"] == "bot") {
        $("#classList").empty();
        widgetnav_open();
        $("#settingsMain").hide();
        $("#botConfigPanel").show();
        $("#equationListDisp").empty();
        $("#updateBotBtn").show();
        $("#addGraphBtn").hide();
        $("#barChartConfigPanel").hide();
        $("#pieChartConfigPanel").hide();
        $("#gaugeConfigPanel").hide();
        $("#indicatorConfigPanel").hide();
        $("#stateControllerConfigPanel").hide();
        $("#dateRangeChooser").hide();
        $("#eqListHeader").hide();
        $("#chartTitleText").val(chartData["chartTitle"]);  
        $("#botIPPort").val(chartData.ip);
        syncDevices();
        $("#learnerTypeCombo").val(chartData["learner_class"]);
        //loadLearners();    
        setTimeout(function() {
            $("#learnerCombo").val(chartData.model["learner_type"]);
        }, 1200);   
        

        if (chartData.learner_class == "classifier") {
            var classes = chartData.classes;
            if (classes.length > 0) {
                $("#classListDiv").show();
                var className, classValue;
                for (var i = 0; i < classes.length; i++) {
                    className = classes[i][0];
                    classValue = classes[i][1];
                    $("#classList").append("<li id=\"li_"+classValue+"\" style=\"cursor:default\" data-toggle=\"tooltip\" data-placement=\"top\" title=\""+classValue+"\">"+className+"<span onclick=\"removeClass('"+classValue+"')\" class=\"w3-closebtn w3-margin-right w3-medium\">&times;</span></li>"); 
                }
            }
        }

        var controllers = chartData.model.input_fields;
        var target = chartData.model.output_field;
        var str;
        for (var i = 0; i < controllers.length; i++) {
            str = controllers[i];
            $("#controllersList").append("<li id=\"li_c_"+str+"\">"+str+"<span onclick=\"removeController('"+str+"')\" class=\"w3-closebtn w3-margin-right w3-medium\">&times;</span></li>");
        }
        $("#targetList").append("<li id=\"li_t_"+target+"\">"+target+"<span onclick=\"removeTarget('"+target+"')\" class=\"w3-closebtn w3-margin-right w3-medium\">&times;</span></li>");   
    }else{
        $("#settingsModal").show();
        $("#chartTitleTextWS").val(chartData["title"]);
        $("#settingsModelDateDiv").show();
        $("#startDatePickerWS").datepicker("setDate", chartData["startDate"]);
        $("#endDatePickerWS").datepicker("setDate", chartData["endDate"]);
    }
    
}

function changeWidgetSettings(){
    gridSaved = false;
    var title = $("#chartTitleTextWS").val();
    var graphID = tempwidget.substring(7);
    var chartData = graphs[graphID]["chartData"];
    if(chartData["type"] == "gauge" || chartData["type"] == "indicator" || chartData["type"] == "switch" || chartData["type"] == "colorpicker" || chartData["type"] == "statecontroller" || chartData["type"] == "slider"){
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
    if(data.type == "gauge" || data.type == "indicator" || data.type == "switch" || data.type == "colorpicker" || data.type == "statecontroller" || data.type == "slider"){
        
        $("#title_"+chartID).text(data.chartTitle);

    }else{
        if (data.type == "line" || data.type == "spline" || data.type == "stepLine" || data.type == "splineArea" || data.type == "scatter") {
            loadlineChartData(chartID, data.title, data.equationList, data.xAxis, data.startDate, data.endDate, data.interval, data.type);
        } else if (data.type == "column" || data.type == "stackedColumn") {
            loadBarChartData(chartID, data.title, data.equationList, data.xAxis, data.startDate, data.endDate, data.interval, data.tarrifs, data.type)
        } else if (data.type == "pie" || data.type == "doughnut") {
            loadPieChartData(chartID, data.title, data.equationList, data.total_index, data.startDate, data.endDate, data.dataType, data.type);
        }
    }
    gridSaved = false;
}

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

            this.grid.addWidget($(['<div id="' + widgetID + '" style="display: flex;" onresize="resizeWidget(id)" ondrag="dragWidget()"><div class="grid-stack-item-content widget-background-color w3-round">',
                    '<span id="close' + widgetID + '" class="closebtn margin-right" data-toggle=\"tooltip\" data-placement=\"top\" title="Remove"><img src="img/delete.png"></span>',
                    '<span id="settings' + widgetID + '" class="settingsbtn margin-right" data-toggle=\"tooltip\" data-placement=\"top\" title="Settings"><img src="img/settings1.png"></span>',
                    '<span id="live' + widgetID + '" class="livebtn w3-medium margin-right" style="display:none"><div class="spinner"></div></span>', 
                    '<div id="deploy' + widgetID + '" class="margin-right" style="display:none"><button id="'+widgetID.substring(7)+'_deployBtn" class="deploybtn button-background">Undefined</button></div>',
                    '<div class="w3-widget-content">',
                    div,
                    '</div>',
                    '<div/> <div/> '
                ].join('')),
                node.x, node.y, node.width, node.height);



            $('#close' + widgetID).click(function() {
                //$('#widget'+widgetCount).remove();
                $(this).parent().parent().remove();
                updateIndex(widgetID);
                //widgetCount--;
                gridSaved = false;
            });

            $('#settings' + widgetID).click(function(id) {
                var widgetID = $(this).attr("id").substring(8);
                openSettingsModal(widgetID);
            });

            $('#deploy' + widgetID).click(function(id) {
                var widgetID = $(this).attr("id").substring(6);
                var command = $("#"+widgetID.substring(7)+"_deployBtn").text();
                deployBot(userID+"_"+widgetID.substring(7), command);
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
function randomString(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function initMQTTClient(id,ip,title,gauge){
    //var client  = mqtt.connect('mqtt://karunasinghe.com')
    var randomstr=randomString(10);
    options={
        clientId: randomstr,
        keepalive: 1,
        clean: false
    };
    var client = mqtt.connect(ip,options); // you add a ws:// url here
    client.subscribe(title);
    client.on("message", function(topic, payload) {
        var msg_ = [payload].join("");
        var value_ = parseFloat(msg_);        // Messege is given by [packetID,value];
        console.log(value_);
        if(!isNaN(value_)){
            gauge.update(value_);
            setGaugeLive(id);
        }
    });
    client.on("reconnect", function() {
        client.subscribe(title);
    });

    
    return 1;
}

function test(){
    // Create a client instance
    client = new Paho.MQTT.Client("development.enetlk.com", 1885, "clientId");

    // set callback handlers
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;

    // connect the client
    client.connect({onSuccess:onConnect});


    // called when the client connects
    function onConnect() {
    // Once a connection has been made, make a subscription and send a message.
    console.log("onConnect");
    client.subscribe("World");
    message = new Paho.MQTT.Message("Hello");
    message.destinationName = "World";
    client.send(message);
    }

    // called when the client loses its connection
    function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:"+responseObject.errorMessage);
    }
    }

    // called when a message arrives
    function onMessageArrived(message) {
    console.log("onMessageArrived:"+message.payloadString);
    }
    return 0;
}

function initMQTTClientIndicator(id,ip,title,interval){

    var randomstr=randomString(10);
    options={
        clientId: randomstr,
        keepalive: 1,
        clean: false};
    var client = mqtt.connect(ip,options); // you add a ws:// url here
    client.subscribe(title);
    client.on("message", function(topic, payload) {
        var msg_ = [payload].join("");
        var value_ = parseFloat(msg_);        // Messege is given by [packetID,value];
        console.log(value_);
        if(!isNaN(value_)){
            if(value_ == 1){
                
                $('#'+id+'_ON').show();
                $('#'+id+'_DISCONNECT').hide();
                $('#'+id+'_OFF').hide();
            }else{
                $('#'+id+'_ON').hide();
                $('#'+id+'_DISCONNECT').hide();
                $('#'+id+'_OFF').show();
            }
            
            setIndicatorLive(id,interval);
        }
    });
    client.on("reconnect", function() {
        client.subscribe(title);
    });
    return client;
}

function initMQTTClientSwitch(id, ip, port, title) {
    var payload = -1;
    $('#'+id+'_UNIDENTIFIED').show();
    mqttPub(payload, ip, port, title);


    var randomstr=randomString(10);
    options={
        clientId: randomstr,
        keepalive: 1,
        clean: false};
    var client = mqtt.connect(ip,options); // you add a ws:// url here
    client.subscribe(title+"_ack");
    client.on("message", function(topic, payload) {
        var msg_ = [payload].join("");
        var value_ = parseFloat(msg_);        // Messege is given by [packetID,value];
        console.log(value_);
        if(!isNaN(value_)){
            if(value_ == 1){
                
                $('#'+id+'_ON').show();
                $('#'+id+'_UNIDENTIFIED').hide();
                $('#'+id+'_OFF').hide();
            }else{
                $('#'+id+'_ON').hide();
                $('#'+id+'_UNIDENTIFIED').hide();
                $('#'+id+'_OFF').show();
            }
        }
    });
    client.on("reconnect", function() {
        client.subscribe(title+"_ack");
    });
    return client;
}

function switchOff(graphID) {
    var switchData = graphs[graphID]["chartData"];
    var port = parseInt(switchData.ip.substr(switchData.ip.length - 4));
    $('#'+graphID+'_ON').hide();
    $('#'+graphID+'_OFF').hide();
    $('#'+graphID+'_UNIDENTIFIED').show();
    mqttPub(0, switchData.ip, port, switchData.title);
}

function switchOn(graphID) {
    var switchData = graphs[graphID]["chartData"];
    var port = parseInt(switchData.ip.substr(switchData.ip.length - 4));
    $('#'+graphID+'_ON').hide();
    $('#'+graphID+'_OFF').hide();
    $('#'+graphID+'_UNIDENTIFIED').show();
    mqttPub(1, switchData.ip, port, switchData.title);
}

function initMQTTClientStateController(id, ip, port, title) {
    var payload = -1;
    mqttPub(payload, ip, port, title);

    var randomstr=randomString(10);
    options={
        clientId: randomstr,
        keepalive: 1,
        clean: false};
    var client = mqtt.connect(ip,options); // you add a ws:// url here
    client.subscribe(title+"_ack");
    client.on("message", function(topic, payload) {
        var msg_ = [payload].join("");
        var value_ = parseFloat(msg_);        // Messege is given by [packetID,value];
        console.log(value_);
        if(!isNaN(value_)){
            if ($('#'+id+'_'+value_))
                $('#'+id+'_'+value_).prop("checked", true);
        }
    });
    client.on("reconnect", function() {
        client.subscribe(title+"_ack");
    });
    return client;
}

function mqttPub(payload, ip, port, topic){
    var randomstr=randomString(10);
    options={
        clientId: randomstr,
        keepalive: 1,
        clean: false
    };
    var client = mqtt.connect(ip,options); // you add a ws:// url here
    //window.alert(payload);
    client.publish(topic, ''+payload,1);

    client.end();
    return 1;
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

function downloadData() {
    var data = [];
    var cData = graphs[tempId].chart.options.data;
    var obj = [];
    var name = "";
    var dataPoints = [];
    var chartName = graphs[tempId].chart.options.title.text;

    for (i = 0; i < cData.length; i++) {
        obj = cData[i];
        name = obj.name.split(",")[0];
        dataPoints = obj.dataPoints;
        data.push([name]);
        
        data.push(["Timestamp", "Value"]);

        for (j = 0; j < dataPoints.length; j++) {
            data.push([dataPoints[j]["x"].toString().split("G")[0], dataPoints[j]["y"]]);
        }
        //.toString().split("G")[0]
        data.push(["",""]);
    }
    //data=[["this","is","a","test"],["this","is","a","test"],["this","is","a","test"],["this","is","a","test"]];
    var csvContent = "";
    data.forEach(function(infoArray, index){
        dataString = infoArray.join(",");
        csvContent += index < data.length ? dataString+ "\n" : dataString;
    }); 
    var pom = document.createElement('a');
    var blob = new Blob([csvContent],{type: 'text/csv;charset=utf-8;'});
    var url = URL.createObjectURL(blob);
    pom.href = url;
    pom.setAttribute('download', chartName+".csv");
    pom.click();
}

function changeTheme(themeId) {
    if (!themeId) {
        themeId = "light";
    }
    var backgroundColor, fontColor, theme;
    if (themeId == "dark") {
        backgroundColor = "#2A2A2A";
        theme = "theme2";
        fontColor = "lightgray";
        document.getElementById("weatherWidget").src="https://www.meteoblue.com/en/weather/widget/three/colombo_sri-lanka_1248991?geoloc=detect&nocurrent=1&days=4&tempunit=CELSIUS&windunit=KILOMETER_PER_HOUR&layout=dark";
        loadCSS("css/color-dark.jl.css");
        globalTheme = "dark";
    } else if (themeId == "light") {
        backgroundColor = "white";
        theme = "theme1";
        fontColor = "#0d1a26";
        document.getElementById("weatherWidget").src="https://www.meteoblue.com/en/weather/widget/three/colombo_sri-lanka_1248991?geoloc=detect&nocurrent=1&days=4&tempunit=CELSIUS&windunit=KILOMETER_PER_HOUR&layout=bright";
        loadCSS("css/color-light.jl.css");
        globalTheme = "light";
    }
    updateGraphColor(backgroundColor, fontColor, theme);
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

// Gets the start or end date for a chart
function getIntDate(endDate, interval, type){
    if (type == "start") diff = 1;
    else if (type == "end") diff = -1;
    var start =new Date(endDate);
    
    if (interval == "day") {
        start.setDate(start.getDate() - diff);
    } else if (interval == "week") {
        start.setDate(start.getDate() - diff*7);
    } else if (interval == "month") {
        start.setMonth(start.getMonth() - diff);
    } else if (interval == "year") {
        start.setYear(start.getFullYear() - diff);
    }
    var day = start.getDate();
    if (day < 10) {
        day = '0' + day
    }
    var month=start.getMonth() + 1;
    if (month < 10) {
        month = '0' + month
    }
    var year=start.getFullYear();
    return year + '-' + month + '-' + day;
}

//Format Date variable to yyyy-mm-dd
function formatDate(date){
    var day = date.getDate();
    if (day < 10) {
        day = '0' + day
    }
    var month=date.getMonth() + 1;
    if (month < 10) {
        month = '0' + month
    }
    var year=date.getFullYear();
    return year + '-' + month + '-' + day;
}

// Device functions

function toggleDeviceDisplay() {
    var val = document.getElementById("deviceToggleButton").value;
    var deviceType = document.getElementById("deviceTypeCombo").value;
    if (!deviceType) deviceType = "ePro1000";
    if (val==0) {
        loadDevicesIdCombo(deviceType);
        document.getElementById("deviceToggleButton").innerHTML = '<i class="fa fa-toggle-on" aria-hidden="true"></i>';
        document.getElementById("deviceToggleButton").setAttribute("value", "1");
    } else if (val==1) {
        loadDevicesCombo(deviceType);
        document.getElementById("deviceToggleButton").innerHTML = '<i class="fa fa-toggle-off" aria-hidden="true"></i>';
        document.getElementById("deviceToggleButton").setAttribute("value", "0");
    }
}

function addDevice() {
    deviceName = $('#deviceIdText').val();
    if (!deviceName) return;
    $.ajax({
        url: "back/load_misc_data.php",
        method: "POST",
        data: {
            field: 'device_Register',
            user_id: userID,
            user_device_id: deviceName
        },
        dataType: "text",
        success: function(data, status) {
            console.log("Add Device: " + status);
            var psk = data.substr(data.length - 10);
            $('#PSKText').val(psk);

            $("#deviceList").append("<li id=\"li"+psk+"\" value=\""+psk+"\" style=\"cursor:default\" data-toggle=\"tooltip\" data-placement=\"top\" title=\""+psk+"\">"+deviceName+"<button class=\"li-button\" onclick=\"copyToClipboard('"+psk+"')\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Copy key\"><i class=\"fa fa-clipboard\" aria-hidden=\"true\"></i></button><span onclick=\"removeDevice('"+psk+"')\" class=\"w3-closebtn w3-margin-right w3-medium\">&times;</span></li>");
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("Add Device error.");
            console.log(XMLHttpRequest);
        }
    })

}

function removeDevice(deviceId) {
    $.ajax({
        url: "back/load_misc_data.php",
        method: "POST",
        data: {
            field: 'device_Remove',
            psk: deviceId
        },
        dataType: "text",
        success: function(data, status) {
            console.log("Remove Device: " + status);
            var li = document.getElementById("li"+deviceId);
            li.remove();
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("Remove Device error.");
            console.log(XMLHttpRequest);
        }
    }) 
}

function loadDevices() {
    var deviceList = [];
    $.ajax({
        url: "back/load_misc_data.php",
        method: "POST",
        data: {
            field: 'device_CustomList',
            user_id: tempUserID
        },
        dataType: "json",
        success: function(data, status) {
            if (data!="Null Data" && data) {
                console.log("Load Devices: " + status);
                $("#deviceList").empty();
                var _len = data["DeviceId"].length;
                for (j = 0; j < _len; j++) {
                    var deviceName = data["DeviceName"][j];
                    var deviceId = data["DeviceId"][j];
                    $("#deviceList").append("<li id=\"li"+deviceId+"\" value=\""+deviceId+"\" style=\"cursor:default\" data-toggle=\"tooltip\" data-placement=\"top\" title=\""+deviceId+"\">"+deviceName+"<button class=\"li-button\" onclick=\"copyToClipboard('"+deviceId+"')\" data-toggle=\"tooltip\" data-placement=\"top\" title=\"Copy key\"><i class=\"fa fa-clipboard\" aria-hidden=\"true\"></i></button><span onclick=\"removeDevice('"+deviceId+"')\" class=\"w3-closebtn w3-margin-right w3-medium\">&times;</span></li>");
                }
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("Load Devices error");
            console.log(XMLHttpRequest);
        }
    });
}

function copyToClipboard(text) {
    if (window.clipboardData && window.clipboardData.setData) {
        // IE specific code path to prevent textarea being shown while dialog is visible.
        return clipboardData.setData("Text", text); 

    } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
        var textarea = document.createElement("textarea");
        textarea.textContent = text;
        textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
        document.body.appendChild(textarea);
        textarea.select();
        try {
            return document.execCommand("copy");  // Security exception may be thrown by some browsers.
        } catch (ex) {
            console.warn("Copy to clipboard failed.", ex);
            return false;
        } finally {
            document.body.removeChild(textarea);
        }
    }
}

function getCurrentDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    if(dd<10) {
        dd='0'+dd
    } 

    if(mm<10) {
        mm='0'+mm
    } 

    today = yyyy+'-'+mm+'-'+dd;
    return today;
}

function getCurrentTime() {
    var today = new Date();
    var hh = today.getHours();
    var mm = today.getMinutes();
    var ss = today.getSeconds();

    if(hh<10) {
        dd='0'+dd
    } 
    if(mm<10) {
        mm='0'+mm
    } 
    if(ss<10) {
        ss='0'+mm
    } 

    var now = hh+':'+mm+':'+ss;
    return now;    
}

/////
function setOriginalSelect ($select) {
    if ($select.data("originalHTML") == undefined) {
        $select.data("originalHTML", $select.html());
    } // If it's already there, don't re-set it
}

function removeOptions ($select, $options) {
    setOriginalSelect($select);
    $options.remove();
}

function restoreOptions ($select) {
    var ogHTML = $select.data("originalHTML");
    if (ogHTML != undefined) {
        $select.html(ogHTML);
    }
}

function initDateTimePicker() {
    $('.input-append').datetimepicker({
        pickDate: false
    });

    // $('.input-append').find('.dropdown-menu').css("background-color", "#ccc");

    // $( ".input-append" ).each(function(index) {
    //     var x = $(this).find('.dropdown-menu');
    //     console.log(this);
    // });
}

function validateTime(timeStr_lower, timeStr_upper) {
    var valid = true;

    var time_lower = timeStr_lower.split(":").map(Number);
    var time_upper = timeStr_upper.split(":").map(Number);

    if (time_upper[0] - time_lower[0] < 0) {
        valid = false;
    }
    else if (time_upper[0] - time_lower[0] == 0) {
        if (time_upper[1] - time_lower[1] < 0) {
            valid = false;
        }
        else if (time_upper[1] - time_lower[1] == 0) { 
            if (time_upper[2] - time_lower[2] <= 0) {
                valid = false;
            }      
        }
    }
    
    return valid;
}

function alertColor(i, len) {
    if (i == 0) {
        $("#startTime").css("background-color", "#ffbaba");
        $("#intList li").eq(0).find("input").css("background-color", "#ffbaba");
    } else if (i == len) {
        $("#startTime").css("background-color", "#ffbaba");
        $("#intList li").eq(0).find("input").css("background-color", "#ffbaba");
    } else {
        $("#intList li").eq(i - 1).find("input").css("background-color", "#ffbaba");
        $("#intList li").eq(i).find("input").css("background-color", "#ffbaba");
    }
}

function removeBGColor(elm) {
    $(elm).css("background-color", "#ffffff");
}

function getIndex(type) {
    var count = 0;
    for (var key in graphs) {
        if (key.includes(type)) {
            if (key.charAt(type.length) == count) {
                count++;
            }
            else break;
        }
    }
    return count;
}

function updateIndex(widgetID) {
    if (widgetID.includes("linechart")) lineChartIndex--;
    else if (widgetID.includes("colchart")) colChartIndex--;
    else if (widgetID.includes("piechart")) pieChartIndex--;
    else if (widgetID.includes("gauge")) gaugeIndex--;
    else if (widgetID.includes("indicator")) indicatorIndex--;
    else if (widgetID.includes("switch")) switchIndex--;
    else if (widgetID.includes("colorpicker")) colorpickerIndex--;
    else if (widgetID.includes("statecontroller")) stateControllerIndex--;
    else if (widgetID.includes("slider")) sliderIndex--;
    else if (widgetID.includes("stateindicator")) stateIndicatorIndex--;
}

// function escapeHtml(text) {
//   return text
//       .replace(/&/g, "&amp;")
//       .replace(/</g, "&lt;")
//       .replace(/>/g, "&gt;")
//       .replace(/"/g, "&quot;")
//       .replace(/'/g, "&#039;");
// }