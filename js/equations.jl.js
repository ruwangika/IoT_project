function addEquation(){
    
    var equation = parseEquation(tempExpressionsList);
    var eqName = document.getElementById("equationNameText").value;
    if (!eqName) eqName = equation;
    $("#equationList").append("<li id=\"li"+equation+"\" value=\""+equation+"\" style=\"cursor:default\" data-toggle=\"tooltip\" data-placement=\"top\" title=\""+equation+"\">"+eqName+"<span onclick=\"deleteEquation('"+equation+"',this)\" class=\"w3-closebtn w3-margin-right w3-medium\">&times;</span></li>");

    var eqn = {
        eqName: eqName,
        equation: tempExpressionsList
    };

    globalEqList.push(eqn);
}

function clearExpressions(){
    tempExpressionsList = [];
    document.getElementById("equationText").innerHTML = "";
}

function addExpression(){
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

            var ex = {
                device: device,
                channel: channel,
                number: number,
                op: op,
                unit: unit
            };

            
            var expression = parseExpression(ex);
            
            tempExpressionsList.push(ex);

            document.getElementById("equationText").innerHTML = parseEquation(tempExpressionsList);
        }
        
    }
}

function updateEquationText() {
}


function showEquations(){
    
    var graphType =  document.getElementById("graphTypeCombo").value;
    var eqList = [];
    var _len = globalEqList.length;
    
    $("#equationListDisp").empty();
    $("#selectedEquationList").empty();
    $("#barChartConfigPanel").hide();
    $("#pieChartConfigPanel").hide();
    $("#gaugeConfigPanel").hide();
    $("#indicatorConfigPanel").hide();
    $("#dateRangeChooser").show();
    if(graphType == "line"){
        for (var i = 0; i < _len; i++) {
        $("#barChartConfigPanel").show();
            var eq = globalEqList[i].equation;
            var eqStr = parseEquation(eq);
            var eqName = globalEqList[i].eqName;
            $("#equationListDisp").append("<li onclick=\"selectEquation('"+eqStr+"','"+i+"',this)\" id=\""+eqStr+"\" index=\""+i+"\" data-toggle=\"tooltip\" data-placement=\"top\" title=\""+eqStr+"\">"+eqName+"<span class=\"w3-closebtn w3-margin-right w3-medium\">+</span></li>");
        }
    }else if(graphType == "bar"){
        $("#barChartConfigPanel").show();
        for (var i = 0; i < _len; i++) {
            if((parseEquation(globalEqList[i].equation)).includes("")){
                var eq = globalEqList[i].equation;
                var eqStr = parseEquation(eq);
                var eqName = globalEqList[i].eqName;
                $("#equationListDisp").append("<li onclick=\"selectEquation('"+eqStr+"','"+i+"',this)\" id=\""+eqStr+"\" index=\""+i+"\" data-toggle=\"tooltip\" data-placement=\"top\" title=\""+eqStr+"\">"+eqName+"<span class=\"w3-closebtn w3-margin-right w3-medium\">+</span></li>");    
            }
        }   
    }else if(graphType == "pie"){
        $("#pieChartConfigPanel").show();
        loadPieChartTotalCombo();
        for (var i = 0; i < _len; i++) {
            if((parseEquation(globalEqList[i].equation)).includes("energy")){
                var eq = globalEqList[i].equation;
                var eqStr = parseEquation(eq);
                var eqName = globalEqList[i].eqName;
                $("#equationListDisp").append("<li onclick=\"selectEquation('"+eqStr+"','"+i+"',this)\" id=\""+eqStr+"\" index=\""+i+"\" data-toggle=\"tooltip\" data-placement=\"top\" title=\""+eqStr+"\">"+eqName+"<span class=\"w3-closebtn w3-margin-right w3-medium\">+</span></li>");    
            }
        }   
    }else if(graphType == "guage"){
        $("#gaugeConfigPanel").show();
        $("#dateRangeChooser").hide();
    }else if(graphType == "led"){
        
    }else if(graphType == "ind"){
        $("#indicatorConfigPanel").show();
        $("#dateRangeChooser").hide();
    }
}

var selectEquation =function(eqStr,index,object){  
    var li = document.getElementById(eqStr);
    li.style.display = "none";
    // var parent = document.getElementById("equationListDisp");
    // parent.removeChild(li);    
    li.remove();
    var eqName = globalEqList[index].eqName;
    $("#selectedEquationList").append("<li onclick=\"removeEquation('"+eqStr+"','"+index+"',this)\" id=\""+eqStr+"\" index=\""+index+"\" data-toggle=\"tooltip\" data-placement=\"top\" title=\""+eqStr+"\">"+eqName+"<span class=\"w3-closebtn w3-margin-right w3-medium\">-</span></li>");
};  

var removeEquation =function(eqStr,index,object){  
    var li = document.getElementById(eqStr);
    li.style.display = "none";
    li.remove();
    var eqName = globalEqList[index].eqName;
    $("#equationListDisp").append("<li onclick=\"selectEquation('"+eqStr+"','"+index+"',this)\" id=\""+eqStr+"\" index=\""+index+"\" data-toggle=\"tooltip\" data-placement=\"top\" title=\""+eqStr+"\">"+eqName+"<span class=\"w3-closebtn w3-margin-right w3-medium\">+</span></li>");
}; 

var deleteEquation = function(eqStr,object){
    var li = document.getElementById("li"+eqStr);
    li.remove();
    var _len = globalEqList.length;
    for (var i = 0; i < _len; i++) {
        if(parseEquation(globalEqList[i].equation) == eqStr){
            globalEqList.splice(i, 1);
            break;
        }
    }
}

function parseExpression(ar){
    var eq = "";
    if(!(ar.number == "1" && ar.op == "*")){
        eq += ar.number+" "+ar.op;
    }
    return eq+" "+ar.device+":"+ar.channel;
}

function parseEquation(expressionList){
    
    var equation = "";
    var _len = expressionList.length;
    for (var i = 0; i < _len; i++) {
        equation += "("+parseExpression(expressionList[i])+")";
        if(i != _len-1){
            equation += " + ";
        }
    }

    return equation+" "+ expressionList[_len-1].unit;
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
    var tempUserID = 1;
    if (userID == 1) {
        if ($('#userCombo option:selected').val())  
            tempUserID = $('#userCombo option:selected').val();
    }
    
    $.ajax({
        url: "back/user_data.php",
        method: "POST",
        data: {r_type: 'get_equations', userID: tempUserID},
        dataType: "json",
        success: function(data, status) {
            console.log("Load Equations: " + status);
            globalEqList = data;
            loadEquationList();
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            globalEqList = [];
            loadEquationList();
            console.log("Load equations error");
            console.log(XMLHttpRequest);
        }    
    });

}

function searchEquation(eq){
    var _len = globalEqList.length;
    var eqStr = parseEquation(eq);
    for (var i = 0; i < _len; i++) {
        if(parseEquation(globalEqList[i].equation) == eqStr){
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
        var eq = globalEqList[i].equation;
        var eqName = globalEqList[i].eqName;  
        var eqStr = parseEquation(eq);
        $("#equationList").append("<li id=\"li"+eqStr+"\" value=\""+eqStr+"\" style=\"cursor:default\" data-toggle=\"tooltip\" data-placement=\"top\" title=\""+eqStr+"\">"+eqName+"<span onclick=\"deleteEquation('"+eqStr+"',this)\" class=\"w3-closebtn w3-margin-right w3-medium\">&times;</span></li>");
    }

}