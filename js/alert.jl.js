
function addAlert(obj) {
    var alert = {
        alertId: obj.alertId,
        group: obj.group,
        condition: obj.expression,
        option: obj.option,
        topic: obj.name,
        userid: tempUserID,
        oncondition: obj.oncondition,
        offcondition: obj.offcondition
    }
    var ip = $("#alertIPPort").val();

    var randomstr = randomString(10);
    options = {
        clientId: randomstr,
        keepalive: 1,
        clean: false
    };
    var client = mqtt.connect(ip, options);
    payload = JSON.stringify(alert);
    
    client.publish("config/addalert", payload ,1);
    setTimeout(endClient.bind(this, client),2000);
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
}

function updateChannelCombo_alert() {
    var deviceId = $("#deviceCombo_alert").val();
    if (deviceId=="const") {
        $("#constDiv").show();
        $("#channelDiv").hide();
    } else {
        $("#constDiv").hide();
        $("#channelDiv").show();

        var ip = $("#alertIPPort").val();
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

            var operands = "=<>;";
            var expText = $("#equationText_alert").html();
            if ((expText != "") && !operands.includes(expText[expText.length - 2])) {
                expression = "+"+expression;
            }
            document.getElementById("equationText_alert").innerHTML += expression;
        }        
    }  
}

function parseExpression_alert(ar){
    var eq = "";
    if(!(ar.number == "1" && ar.op == "*")){
        eq += ar.number + " " + ar.op;
    }
    return eq + " " + ar.device + ":" + ar.channel;
}

function clearExpressions_alert() {
    tempExpressionsList_alert = [];
    document.getElementById("equationText_alert").innerHTML = "";
}

function addOperator(op) {
    var operands = "=<>; ";
    var expText = $("#equationText_alert").html();
    if (expText.includes("=") || expText.includes("&lt;") || expText.includes("&gt;")) return;
    if ((expText != "") && !operands.includes(expText[expText.length - 1])) {
        document.getElementById("equationText_alert").innerHTML += (" " + op + " ");
    }
}

function unescapeHTML(escapedHTML) {
  return escapedHTML.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
}

//For the entire expression
function addAlertExpression() {
    if (!document.getElementById("alertTitleText").value || $('#equationText_alert').is(':empty')) return;
    
    //var equation = parseEquation(tempExpressionsList_alert);
    var count = 0;
    for (i = 0; i < globalAlertList.length; i++) {
        if (globalAlertList[i]["alertId"].charAt(5) == count) {
            count++;
        }
        else break;
    }
    var alertIndex = count;

    var alertId = "alert" + alertIndex + "_" + tempUserID;
    var name = document.getElementById("alertTitleText").value;
    var group = document.getElementById("alertGroupCombo").value;
    var ip = $("#alertIPPort").val();
    var expression = unescapeHTML($("#equationText_alert").html());
    var option = document.getElementById("optionCombo_alert").value;
    var warningMsg = document.getElementById("warningMsgText").value;
    var normalMsg = document.getElementById("normalMsgText").value;
    console.log(expression);

    var item = [];
    for (i = 0; i < globalAlertList.length; i++) {
        item = globalAlertList[i];
        if (item.name == name) {
            addNote("Alert name already exists!");
            return;
        } else if (item.expression == expression) {
            addNote("Alert already exists!");
            return;
        }
    }

    $("#equationListDisp").append("<li id=\"li_"+alertId+"\" value=\""+alertId+"\" style=\"cursor:default\" data-toggle=\"tooltip\" data-placement=\"top\" title=\""+expression+"\">"+name+"<label class='toggle'><input type='checkbox' checked onclick='toggleAlert(this)'><span class='toggle-slider round'></span></label><span onclick=\"deleteAlertExpression('"+alertId+"')\" style='cursor:pointer' class=\"w3-closebtn w3-margin-right w3-medium\">&times;</span></li>");

    var alert = {
        alertId: alertId,
        name: name,
        group: group,
        ip: ip,
        expression: expression,
        option: option,
        state: "true",
        oncondition: warningMsg,
        offcondition: normalMsg
    };

    globalAlertList.push(alert);
    addAlert(alert);
    clearExpressions_alert();  
}

var deleteAlertExpression = function(alertId){
    var li = document.getElementById("li_"+alertId);
    li.remove();
    var _len = globalAlertList.length;
    for (var i = 0; i < _len; i++) {
        if(globalAlertList[i].alertId == alertId){
            globalAlertList.splice(i, 1);
            break;
        }
    }
}

function loadAlertList() {
    // Load alerts to the display.
    var _len = globalAlertList.length;
    $("#equationListDisp").empty();
    for (var i = 0; i < _len; i++) {
        var alertId = globalAlertList[i].alertId;
        var name = globalAlertList[i].name; 
        var exp = globalAlertList[i].expression; 
        var state = globalAlertList[i].state;
        if (state == "true") $("#equationListDisp").append("<li id=\"li_"+alertId+"\" value=\""+alertId+"\" style=\"cursor:default\" data-toggle=\"tooltip\" data-placement=\"top\" title=\""+exp+"\">"+name+"<label class='toggle'><input type='checkbox' checked onclick='toggleAlert(this)'><span class='toggle-slider round'></span></label><span onclick=\"deleteAlertExpression('"+alertId+"')\" style='cursor:pointer' class=\"w3-closebtn w3-margin-right w3-medium\">&times;</span></li>");
        if (state == "false") $("#equationListDisp").append("<li id=\"li_"+alertId+"\" value=\""+alertId+"\" style=\"cursor:default\" data-toggle=\"tooltip\" data-placement=\"top\" title=\""+exp+"\">"+name+"<label class='toggle'><input type='checkbox' onclick='toggleAlert(this)'><span class='toggle-slider round'></span></label><span onclick=\"deleteAlertExpression('"+alertId+"')\" style='cursor:pointer' class=\"w3-closebtn w3-margin-right w3-medium\">&times;</span></li>");
    }  
}

function saveAlerts(){
    var alertData = {
        alertList: globalAlertList,
        alertGroupList: globalAlertGroupList
    }
    $.ajax({
        url: "back/user_data.php",
        method: "POST",
        data: {r_type: 'save_alerts', userID: tempUserID, alertData: alertData},
        dataType: "text",
        success: function(data, status) {
            console.log("Save Alert Data: " + status);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            console.log("Alert Data save error.")
            console.log(XMLHttpRequest);
        }    
    });

}

function loadAlerts(){
    globalAlertList = [];
    globalAlertGroupList = [];
    
    $.ajax({
        url: "back/user_data.php",
        method: "POST",
        data: {r_type: 'get_alerts', userID: tempUserID},
        dataType: "json",
        success: function(data, status) {
            console.log("Load Alerts: " + status);
            if (data["alertList"]) globalAlertList = data["alertList"];
            if (data["alertGroupList"]) globalAlertGroupList = data["alertGroupList"];
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            console.log("Load Alerts error");
            console.log(XMLHttpRequest);
        }    
    });
}

function toggleAlert(elm) {
    var alertId = $(elm).parent().parent().attr("id").substr(3);
    if (elm.checked) {
        changeAlertState(alertId, "true");
    } else {
        changeAlertState(alertId, "false");
    }
}

function changeAlertState(alertId, state) {
    var ip = "";
    for (i = 0; i < globalAlertList.length; i++) {
        if (globalAlertList[i].alertId == alertId) {
            ip = globalAlertList[i].ip;
            globalAlertList[i].state = state;
            break;
        }
    }

    var randomstr = randomString(10);
    options = {
        clientId: randomstr,
        keepalive: 1,
        clean: false
    };
    var client = mqtt.connect(ip, options);

    message = {
        state: state,
        alertId: alertId
    };
    payload = JSON.stringify(message);
    client.publish("config/updatestatealert", payload, 1); 
    
    setTimeout(endClient.bind(this, client),2000);
}

function openEditAlertGroupsModal() {
    loadAlertGroupsList();
    $("#editAlertGroupsModal").show();
    if ($("#alertGroupList li").length == 0) {
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

    if (tempAlertGroup != "") {
        var index = globalAlertGroupList.indexOf(tempAlertGroup);
        if (index > 0) {
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
    if (globalTheme == "light") bgColor = "#ffffff";
    else if (globalTheme == "dark") bgColor = "#2a2a2a"
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

    return equation + " " + expressionList[_len - 1].unit;
}

function toggleAlertMsg(type) {
    if (type == "warning") {
        $("#normalMsgText").hide();
        $("#warningMsgText").show();
        $("#warningMsgBtn").css("background-color", "#b3b3b3");
        $("#normalMsgBtn").css("background-color", "#cccccc");
    } else if (type == "normal") {        
        $("#warningMsgText").hide();
        $("#normalMsgText").show();
        $("#normalMsgBtn").css("background-color", "#b3b3b3");
        $("#warningMsgBtn").css("background-color", "#cccccc");
    }
}