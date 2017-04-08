
function addBot(widgetID, graphID, data) {
    
    $('#deploywidget_'+graphID).show();
    var chart = initBotGraph(graphID, data);

    graphs[graphID] = {};
    graphs[graphID]["chart"] = chart;
    graphs[graphID]["type"] = "bot";
    graphs[graphID]["chartData"] = data;

    initMQTTClientBot(graphID, data, chart, data.model);

}

function initBotGraph(graphID, data) {
    var backgroundColor, fontColor, theme;
    if (!globalTheme) globalTheme = "light";
    if (globalTheme == "dark") {        
        backgroundColor = "#2A2A2A";
        theme = "theme2";
        fontColor = "lightgray";
    } else if (globalTheme == "light") {        
        backgroundColor = "white";
        theme = "theme1";
        fontColor = "#0d1a26";
    }
    var data_output= [];
    var data_mse = [];

    var chart = new CanvasJS.Chart(graphID,{
        zoomEnabled: true,
        backgroundColor: backgroundColor,
        theme: theme,
        title: {
            text: data.chartTitle,
            fontColor: fontColor,
            fontStyle: "normal",
            fontWeight: "lighter",
            fontFamily: "calibri",
            fontSize: 24		
        },
        subtitles: {

        },
        legend:{
            cursor: "pointer",
            fontColor: fontColor,
            itemclick: function(e) {
                if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                    e.dataSeries.visible = false;
                } else {
                    e.dataSeries.visible = true;
                }
                e.chart.render();
            }
        },
        axisX: {
            title: ""
        },
        axisY:{
            includeZero: false
        }, 
        data: [{ 
            type: "line",
            xValueType: "dateTime",
            showInLegend: true,
            name: "Prediction",
            connectNullData:true,
            nullDataLineDashType:"dot",
            dataPoints: data_output
        },
        {				
            type: "line",
            xValueType: "dateTime",
            showInLegend: true,
            name: "MSE" ,
            connectNullData:true,
            nullDataLineDashType:"dot",
            dataPoints: data_mse
        }]
    });
    chart.render();
    return chart;
}

function initMQTTClientBot(graphID, data, chart, model){
    
    var modelId = model["modelId"];
    var output_field = model["output_field"];
    var ip = data.ip;
    

    var temp_classes=[];
    try{
        temp_classes = model["output_classes"].map(Number);
    }catch(e){}
    model["output_classes"]=temp_classes;
    var modelStr = JSON.stringify(model);
    var randomstr=randomString(10);
    options={
        clientId: randomstr,
        keepalive: 1,
        clean: false
    };
    var client = mqtt.connect(ip,options);
    client.subscribe(modelId+"/"+output_field);
    client.subscribe(modelId+"/mse");
    client.on("message", function(topic, payload) {
        var msg_ = [payload].join("");  

        var y_output;
        var y_mse;
        var time = new Date();
        
        if (topic==modelId+"/"+output_field) {
            y_output = parseFloat(msg_);
            document.getElementById(graphID+"_deployBtn").innerHTML = "Train";
        } else if (topic==modelId+"/mse") {
            var arr = msg_.split(',');
            y_mse = parseFloat(arr[arr.length-1].split(':')[1]);
            document.getElementById(graphID+"_deployBtn").innerHTML = "Deploy";
        }
        xVal = time.getTime();
        updateBotData(chart, xVal, y_output, y_mse);
    });
    
    client.on("reconnect", function() {
        
        client.subscribe(modelId+"/"+output_field);
        client.subscribe(modelId+"/mse");
    });

    client.publish("config/addmodel", modelStr, 1); 

}

function updateBotData(chart, xVal, yVal1, yVal2) {
    var data_output = chart.options.data[0].dataPoints;
    var data_mse = chart.options.data[1].dataPoints;
    
    data_output.push({
        x: xVal,
        y: yVal1
    });
    data_mse.push({
        x: xVal,
        y: yVal2
    });

    chart.render();

};

function changeBotSettings() {
    gridSaved = false;
    var widgetID = tempwidget;
    var chartID = tempwidget.substring(7);

    var ip = $("#botIPPort").val();
    var chartTitle = $("#chartTitleText").val();
    var learner_class = $("#learnerTypeCombo").val();
    var learner = $("#learnerCombo").val();
    
    var controllers = [];
    $("#controllersList li").each(function(idx, li) {
        controllers.push(li.id.substring(5));
    });
    var target = "";
    $("#targetList li").each(function(idx, li) {
        target = li.id.substring(5);
    });

    var classes = [];
    // $("#classList li").each(function(idx, li) {
    //     classes.push(parseInt(li.id.substring(3)));
    // });
    $("#classList li").each(function(idx, li) {
        var _class = [document.getElementById(li.id).innerHTML.split('<span')[0], parseInt(li.id.substring(3))]
        classes.push(_class);
    });

    var model = {};
    model["modelId"] = userID+"_"+chartID;
    model["input_fields"] = controllers;
    model["output_field"] = target;
    model["learner_type"] = learner;
    if (learner_class=="classifier") {
        for (var i; i < classes.length; i++) {
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
    $("#classList").empty();
    widgetnav_close();

}

function addClass() {
    var className = $("#classNameText").val();
    var classValue = $('#classValueText').val();
    if (!className || !classValue) return;
    $("#classListDiv").show();
    $("#classList").append("<li id=\"li_"+classValue+"\" style=\"cursor:default\" data-toggle=\"tooltip\" data-placement=\"top\" title=\""+classValue+"\">"+className+"<span onclick=\"removeClass('"+classValue+"')\" class=\"w3-closebtn w3-margin-right w3-medium\">&times;</span></li>");    
}

function removeClass(str) {
    var li = document.getElementById("li_"+str);
    li.remove();
    if ($("ul#classList li").length==0) 
       $("#classListDiv").hide(); 
}

function loadLearners() {
    $("#classLbl").hide();
    $("#classDiv").hide();
    var ip = $("#botIPPort").val();
    var learnerType = $("#learnerTypeCombo").val();
    if (learnerType=="classifier") {
        $("#classLbl").show();
        $("#classDiv").show();
    }
    var randomstr=randomString(10);
    options={
        clientId: randomstr,
        keepalive: 1,
        clean: false
    };
    var client = mqtt.connect(ip,options);
    client.subscribe("request/"+learnerType+"/receivelearners");
    client.on("message", function(topic, payload) {
        var msg_ = [payload].join("");  
        var data = JSON.parse(msg_);
        if (!data) return;
        $('#learnerCombo').empty();
        var _len = data.length;
        for (j = 0; j < _len; j++) {
            $('#learnerCombo').append($('<option/>', {
                value: data[j],
                text: data[j]
            }));
        }
    });

    client.publish("request/getlearners", learnerType, 1);
    setTimeout(endClient.bind(this, client),2000);    
}

function syncDevices() {
    $("#learnerCombo").empty();
    $("classList").empty();
    $("#classListDiv").hide();
    $("#deviceComboControl").empty();
    $("#channelComboControl").empty();
    $("#deviceComboTarget").empty();
    $("#channelComboTarget").empty();
    $("#controllersList").empty();
    $("#targetList").empty();
    var ip = $("#botIPPort").val();

    var randomstr=randomString(10);
    options={
        clientId: randomstr,
        keepalive: 1,
        clean: false
    };
    var client = mqtt.connect(ip,options);
    client.subscribe("request/receivedevices");
    client.on("message", function(topic, payload) {
        var msg_ = [payload].join("");   

        var data = JSON.parse(msg_);
        if (!data) return;        
        $("#deviceComboControl").empty();
        $("#deviceComboTarget").empty();
        var _len = data.length;
        for (j = 0; j < _len; j++) {
            $('#deviceComboControl').append($('<option/>', {
                value: data[j],
                text: data[j]
            }));
            $('#deviceComboTarget').append($('<option/>', {
                value: data[j],
                text: data[j]
            }));
        }
    });

    client.publish("request/getdevices", "",1);
    setTimeout(endClient.bind(this, client),2000);

    
    loadLearners();
    setTimeout(updateChannelComboControl, 1000);
    setTimeout(updateChannelComboTarget, 1000);
}

function endClient(client){
    client.end();
}

function updateChannelComboControl() {
    var ip = $("#botIPPort").val();
    var deviceId = $("#deviceComboControl").val();
    var randomstr=randomString(10);
    options={
        clientId: randomstr,
        keepalive: 1,
        clean: false
    };
    var client = mqtt.connect(ip,options);
    client.subscribe("request/"+deviceId+"/receivechannels");
    client.on("message", function(topic, payload) {
        var msg_ = [payload].join("");

        var data = JSON.parse(msg_);
        if (!data) return;
        $("#channelComboControl").empty();  
        var _len = data.length;
        for (j = 0; j < _len; j++) {
            $('#channelComboControl').append($('<option/>', {
                value: data[j],
                text: data[j]
            }));
        }
    });

    client.publish("request/getchannels", deviceId, 1);
    setTimeout(endClient.bind(this, client),2000);
}

function updateChannelComboTarget() {
    var ip = $("#botIPPort").val();
    var deviceId = $("#deviceComboTarget").val();
    var randomstr=randomString(10);
    options={
        clientId: randomstr,
        keepalive: 1,
        clean: false
    };
    var client = mqtt.connect(ip,options);
    client.subscribe("request/"+deviceId+"/receivechannels");
    client.on("message", function(topic, payload) {
        var msg_ = [payload].join("");

        var data = JSON.parse(msg_);
        if (!data) return;
        $("#channelComboTarget").empty();
        var _len = data.length;
        for (j = 0; j < _len; j++) {
            $('#channelComboTarget').append($('<option/>', {
                value: data[j],
                text: data[j]
            }));
        }
    });

    client.publish("request/getchannels", deviceId, 1);
    setTimeout(endClient.bind(this, client),2000);    
}

function addControllerDevice() {
    var device = $('#deviceComboControl').val();
    var channel = $('#channelComboControl').val();
    if (!device || !channel) return;
    var str = device+"."+channel;
    $("#controllersList").append("<li id=\"li_c_"+str+"\">"+str+"<span onclick=\"removeController('"+str+"')\" class=\"w3-closebtn w3-margin-right w3-medium\">&times;</span></li>");
}

function addTarget() {
    var device = $('#deviceComboTarget').val();
    var channel = $('#channelComboTarget').val();
    if (!device || !channel) return;
    var str = device+"."+channel;
    $("#targetList").empty();
    $("#targetList").append("<li id=\"li_t_"+str+"\">"+str+"<span onclick=\"removeTarget('"+str+"')\" class=\"w3-closebtn w3-margin-right w3-medium\">&times;</span></li>");
}

function removeController(str) {
    var li = document.getElementById("li_c_"+str);
    li.remove();
}
function removeTarget(str) {
    var li = document.getElementById("li_t_"+str);
    li.remove();
}
function deployBot(modelId, command){
    var graphID=modelId.split("_")[1];
    console.log(graphID);
    var ip = graphs[graphID]["chartData"].ip;

    if(command=="Train")
        command="train";
    else
        command="deploy";
    var randomstr=randomString(10);
    options={
        clientId: randomstr,
        keepalive: 1,
        clean: true
    };
    var client = mqtt.connect(ip,options);
    message={
        state:command,
        modelId:modelId
    };
    payload=JSON.stringify(message);
    client.publish("config/updatestatemodel", payload, 1); 

}