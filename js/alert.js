
function addAlert() {

}

function updateDeviceChannels_alert() {
    var deviceType = $("#deviceCombo_alert").val();
    if (deviceType=="const") {
        $("#constDiv").show();
        $("#channelDiv").hide();
    } else {
        $("#constDiv").hide();
        $("#channelDiv").show();
    }
}

function syncDevices_alert() {
    $("#deviceCombo_alert").empty();
    $('#deviceCombo_alert').append($('<option/>', {
                value: "const",
                text: "Const"
            }));
    $("#channelCombo_alert").empty();
    var ip = $("#alertIPPort").val();

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
        var _len = data.length;
        for (j = 0; j < _len; j++) {
            $('#deviceCombo_alert').append($('<option/>', {
                value: data[j],
                text: data[j]
            }));
        }
    });

    client.publish("request/getdevices", "",1);
    setTimeout(endClient.bind(this, client),2000);
    
    //setTimeout(updateChannelCombo_alert, 1000);
}

function updateChannelCombo_alert() {
    var ip = $("#alertIPPort").val();
    var deviceId = $("#deviceCombo_alert").val();
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
        $("#channelCombo_alert").empty();  
        var _len = data.length;
        for (j = 0; j < _len; j++) {
            $('#channelCombo_alert').append($('<option/>', {
                value: data[j],
                text: data[j]
            }));
        }
    });

    client.publish("request/getchannels", deviceId, 1);
    setTimeout(endClient.bind(this, client),2000);
}

//For parts of expressions
function addExpression_alert() { 
    var prefix = document.getElementById("prefixEquationText_alert").value;
    var device =  document.getElementById("deviceCombo_alert").value;      
    var channel =  document.getElementById("channelCombo_alert").value;
    var constant = document.getElementById("constValText").value;

    var n = prefix.length;
    var number = prefix.substring(0, n-1);
    if(!isNaN(number)){
        var op = prefix.substring(n-1, n);
        //if (op=="") op = "*";
        var operands = "+/*-";
        if(operands.includes(op)){
            
            if(prefix == ""){
                op = "*";
                number = "1";
            }

            var ex = {
                device: device,
                channel: channel,
                constant: constant,
                number: number,
                op: op,
                unit: ""
            };

            
            var expression = parseExpression(ex);
            expression = "(" + expression + ")";
            
            tempExpressionsList_alert.push(ex);

            //document.getElementById("equationText").innerHTML = parseEquation(tempExpressionsList);
            //var expText = $("#equationText_alert").html() + expression;
            //$("#equationText_alert").html(newexpTextStr);
            var operands = "=<>;";
            var expText = $("#equationText_alert").html();
            if ((expText!="") && !operands.includes(expText[expText.length-2])) {
                expression = "+"+expression;
            }
            document.getElementById("equationText_alert").innerHTML += expression;
        }        
    }  
}

function parseExpression_alert(ar){
    var eq = "";
    if(!(ar.number == "1" && ar.op == "*")){
        eq += ar.number+" "+ar.op;
    }
    return eq+" "+ar.device+":"+ar.channel;
}

function clearExpressions_alert() {
    tempExpressionsList_alert = [];
    document.getElementById("equationText_alert").innerHTML = "";
}

function addOperator(op) {
    var operands = "=<>;";
    var expText = $("#equationText_alert").html();
    if ((expText!="") && !operands.includes(expText[expText.length-1])) {
        document.getElementById("equationText_alert").innerHTML += (" " + op + " ");
    }
}

//For the entire expression
function addAlertExpression() {
    if (!document.getElementById("alertTitleText").value || $('#equationText_alert').is(':empty')) return;
    
    //var equation = parseEquation(tempExpressionsList_alert);
    var expression = $("#equationText_alert").html();
    var alertName = document.getElementById("alertTitleText").value;

    var eqList = $("#equationListDisp li");
    var exists = false;
    eqList.each(function(idx, li) {
        var eq = ($(li).attr('id')).substr(6);
        if (eq == expression) {
            addNote('Expression already exists!');
            exists = true;
            return;
        }
    });
    if (!exists) {
        $("#equationListDisp").append("<li id=\"alert_"+expression+"\" value=\""+expression+"\" style=\"cursor:default\" data-toggle=\"tooltip\" data-placement=\"top\" title=\""+expression+"\">"+alertName+"<span onclick=\"deleteAlertExpression('"+expression+"',this)\" class=\"w3-closebtn w3-margin-right w3-medium\">&times;</span></li>");

        var exp = {
            alertName: alertName,
            equation: expression
        };

        globalAlertList.push(exp);
        clearExpressions();
    }    
}

var deleteAlertExpression = function(eqStr, object){
    var li = document.getElementById("alert_"+eqStr);
    li.remove();
    var _len = globalAlertList.length;
    for (var i = 0; i < _len; i++) {
        if(parseEquation(globalAlertList[i].equation) == eqStr){
            globalAlertList.splice(i, 1);
            break;
        }
    }
}

function loadAlertList() {
    
}

function openEditAlertGroupsModal() {
    loadAlertGroupsList();
    $("#editAlertGroupsModal").show();
    if ($("#alertGroupList li").length==0) {
        $("#noAlertGroupsText").show();
    } else {
        $("#noAlertGroupsText").hide();
    }
}

function closeEditAlertGroupsModal() {
    $("#editAlertGroupsModal").hide();
    loadAlertGroupsCombo();
}

function loadAlertGroupsCombo() {
    $("#alertGroupCombo").empty();
    var groupName = "";
    for (var i = 0; i < globalAlertGroupList.length; i++) {
        groupName = globalAlertGroupList[i];
        $("#alertGroupCombo").append($('<option/>', {
            text: groupName,
            value: groupName
        }));
    }
}

function loadAlertGroupsList() {
    $("#alertGroupList").empty();
    var groupName = "";
    for (var i = 0; i < globalAlertGroupList.length; i++) {
        groupName = globalAlertGroupList[i];
        $("#alertGroupList").append("<li id=\"li_group_"+groupName+"\" style=\"cursor:default\" onclick=\"selectItem(this)\">"+groupName+"</li>");
    }
}

// function saveAlertGroups() {
//     closeEditAlertGroupsModal();
// }

function showAddAlertGroupDiv() {
    $("#addAlertGroupDiv").show();
    $("#noAlertGroupsText").hide();
}

function hideAddAlertGroupDiv() {
    $("#addAlertGroupDiv").hide();
    if (tempAlertGroup!="") {
        loadAlertGroupsList();
        tempAlertGroup="";
    }
}

function addAlertGroup() {
    var groupName = $("#alertGroupNameText").val();
    if (!groupName) return;

    if (tempAlertGroup!="") {
        var index = globalAlertGroupList.indexOf(tempAlertGroup);
        if (index>0) {
            globalAlertGroupList[index] = groupName;
        }
    } else {
        if (globalAlertGroupList.indexOf(groupName) > 0) return;
        globalAlertGroupList.push(groupName);
    }
    
    $("#noAlertGroupsText").hide();
    $("#alertGroupList").append("<li id=\"li_group_"+groupName+"\" style=\"cursor:default\" onclick=\"selectItem(this)\">"+groupName+"</li>");
    $("#alertGroupNameText").val("");

    tempAlertGroup = "";
}

function selectItem(elm) {
    var bgColor = "";
    if (globalTheme=="light") bgColor = "#ffffff";
    else if (globalTheme=="dark") bgColor = "#2a2a2a"
    $(elm).css("background-color", "#f0ad4e");
    $(elm).val(1);
    $(elm).siblings().css("background-color", bgColor);
    $(elm).siblings().val(0);
    tempAlertGroup = $(elm).html();
}

function deleteAlertGroup() {
    var groupName = "";
    var idx = 0;
    $('#alertGroupList li').each(function () { 
        if ($(this).attr("value") == 1) {
            groupName = $(this).attr("id").substr(9);
            this.remove();
        }
    });
    idx = globalAlertGroupList.indexOf(groupName);
    globalAlertGroupList.splice(idx, 1);
}

function editAlertGroup() {
    var item;
    var groupName;
    $('#alertGroupList li').each(function () { 
        if ($(this).attr("value") == 1) item = this;
    });
    groupName = $(item).attr("id").substr(9);
    $("#alertGroupNameText").val(groupName);
    showAddAlertGroupDiv();
    $(item).remove();
    //idx = globalAlertGroupList.indexOf(groupName);
    //globalAlertGroupList.splice(idx, 1);
}

// function parseExpression_alert(ar){
//     var eq = "";
//     if(!(ar.number == "1" && ar.op == "*")){
//         eq += ar.number+" "+ar.op;
//     }
//     return eq+" "+ar.device+":"+ar.channel;
// }

function parseEquation_alert(expressionList){
    
    var equation = "";
    var operands = "=<>";
    var _len = expressionList.length;
    for (var i = 0; i < _len; i++) {
        if (operands.includes(expressionList[i])) {
            equation += expressionList[i];
        }  
        else {
            equation += "("+parseExpression(expressionList[i])+")";
            if(i != _len-1){
                equation += " + ";
            }
        }          
    }

    return equation+" "+ expressionList[_len-1].unit;
}