function addEquation(){
    var device =  document.getElementById("deviceCombo").value;      
    var channel =  document.getElementById("channelCombo").value;      
    var prefix = document.getElementById("prefixEquationText").value;
    var unit = document.getElementById("equationUnitText").value;

    var n = prefix.length;
    var number = prefix.substring(0, n-1);
    if(!isNaN(number)){
        var op = prefix.substring(n-1, n);
        var operands = "+/*-";
        if(operands.includes(op)){
            
            if(prefix == ""){
                op = "*";
                number = "1";
            }

            var eq = {
                device: device,
                channel: channel,
                number: number,
                op: op,
                unit: unit
            };

            if(searchEquation(eq) == -1){
                console.log(globalEqList);
                var equation = parseEquation(eq);
                $("#equationList").append("<li id=\"li"+equation+"\" value=\""+equation+"\">"+equation+"<span onclick=\"deleteEquation('"+equation+"',this)\" class=\"w3-closebtn w3-margin-right w3-medium\">&times;</span></li>");
                globalEqList.push(eq);
            }
        }
        
    }
    
}

function showEquations(){
    
    var graphType =  document.getElementById("graphTypeCombo").value;
    var eqList = [];
    var _len = globalEqList.length;
    $("#equationListDisp").empty();
    $("#barChartConfigPanel").hide();
    $("#pieChartConfigPanel").hide();
    $("#gaugeConfigPanel").hide();
    $("#indicatorConfigPanel").hide();
    $("#dateRangeChooser").show();
    if(graphType == 'line chart'){
        for (var i = 0; i < _len; i++) {
            var eq = globalEqList[i];    
            var eqStr = parseEquation(eq);
            $("#equationListDisp").append("<li id=\""+eqStr+"\" index=\""+i+"\">"+eqStr+"<span onclick=\"selectEquation('"+eqStr+"','"+i+"',this)\" class=\"w3-closebtn w3-margin-right w3-medium\">+</span></li>");
        }
    }else if(graphType == 'bar chart'){
        $("#barChartConfigPanel").show();
        for (var i = 0; i < _len; i++) {
            if((globalEqList[i].channel).includes("energy")){
                var eq = globalEqList[i];
                var eqStr = parseEquation(eq);
                $("#equationListDisp").append("<li id=\""+eqStr+"\" index=\""+i+"\">"+eqStr+"<span onclick=\"selectEquation('"+eqStr+"','"+i+"',this)\" class=\"w3-closebtn w3-margin-right w3-medium\">+</span></li>");    
            }
        }   
    }else if(graphType == 'pie chart'){
        $("#pieChartConfigPanel").show();
        loadPieChartTotalCombo();
        for (var i = 0; i < _len; i++) {
            if((globalEqList[i].channel).includes("energy")){
                var eq = globalEqList[i];
                var eqStr = parseEquation(eq);
                $("#equationListDisp").append("<li id=\""+eqStr+"\" index=\""+i+"\">"+eqStr+"<span onclick=\"selectEquation('"+eqStr+"','"+i+"',this)\" class=\"w3-closebtn w3-margin-right w3-medium\">+</span></li>");    
            }
        }   
    }else if(graphType == 'gauge'){
        $("#gaugeConfigPanel").show();
        $("#dateRangeChooser").hide();
    }else if(graphType == 'led'){
        
    }else if(graphType == 'indicator'){
        $("#indicatorConfigPanel").show();
        $("#dateRangeChooser").hide();
    }
}

var selectEquation =function(eqStr,index,object){  
    var li = document.getElementById(eqStr);
    li.style.display = "none";
    li.remove();
    $("#selectedEquationList").append("<li id=\""+eqStr+"\" index=\""+index+"\">"+eqStr+"<span onclick=\"removeEquation('"+eqStr+"','"+index+"',this)\" class=\"w3-closebtn w3-margin-right w3-medium\">-</span></li>");
};  

var removeEquation =function(eqStr,index,object){  
    var li = document.getElementById(eqStr);
    li.style.display = "none";
    li.remove();
    $("#equationListDisp").append("<li id=\""+eqStr+"\" index=\""+index+"\">"+eqStr+"<span onclick=\"selectEquation('"+eqStr+"','"+index+"',this)\" class=\"w3-closebtn w3-margin-right w3-medium\">+</span></li>");
}; 

var deleteEquation = function(eqStr,object){
    var li = document.getElementById("li"+eqStr);
    li.style.display = "none";
    var _len = globalEqList.length;
    for (var i = 0; i < _len; i++) {
        if(parseEquation(globalEqList[i]) == eqStr){
            globalEqList.splice(i, 1);
            break;
        }
    }
}

function parseEquation(ar){
    var eq = "";
    if(!(ar.number == "1" && ar.op == "*")){
        eq += ar.number+" "+ar.op;
    }
    return eq+" "+ar.device+":"+ar.channel+" "+ar.unit;
}

function saveEquations(){
    
    $.ajax({
        url: "back/user_data.php",
        method: "POST",
        data: {r_type: 'save_equations', userID: userID, eqList: globalEqList},
        dataType: "text",
        success: function(data, status) {
            console.log("Save Equations: " + status);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            console.log("Equations save error.")
            console.log(XMLHttpRequest);
        }    
    });

}

function loadEquations(){
    
    $.ajax({
        url: "back/user_data.php",
        method: "POST",
        data: {r_type: 'get_equations', userID: userID},
        dataType: "json",
        success: function(data, status) {
            console.log("Load Equations: " + status);
            globalEqList = data;
            loadEquationList();
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            console.log("Load equations error");
            console.log(XMLHttpRequest);
        }    
    });

}

function searchEquation(eq){
    var _len = globalEqList.length;
    var eqStr = parseEquation(eq);
    for (var i = 0; i < _len; i++) {
        if(parseEquation(globalEqList[i]) == eqStr){
            return i;
        }
    }
    return -1;
}

function loadEquationList(){
    // Load equations to the display. add equation pane onload->decComponents->loadEquations
    var _len = globalEqList.length;
    $("#equationList").empty();
    for (var i = 0; i < _len; i++) {
        var eq = globalEqList[i];    
        var eqStr = parseEquation(eq);
        $("#equationList").append("<li id=\"li"+eqStr+"\" value=\""+eqStr+"\">"+eqStr+"<span onclick=\"deleteEquation('"+eqStr+"',this)\" class=\"w3-closebtn w3-margin-right w3-medium\">&times;</span></li>");
    }

}