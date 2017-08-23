function addLocName() {
    var locName = $("#locNameText").val();
    var locID = $("#locIDText").val();
    var locIP = $("#locIPText").val();
    if (!locName || !locID || !locIP) return;
    
    if ($.inArray(locName, $.map(globalLocationList, function(v) { return v["name"]; })) > -1 || $.inArray(locID, $.map(globalLocationList, function(v) { return v["id"]; })) > -1) {
        addNote("Location already added.");
        return;
    }

    $("#equationListDisp").append("<li id=\"li_loc_"+locName+"\">"+locName+"<span class=\"w3-closebtn w3-margin-right w3-medium\" onclick=\"removeLoc('"+locName+"')\">&times;</span></li>");

    var location = {
        name: locName,
        id: locID,
        ip: locIP,
        coordinates: [null]
    };
    globalLocationList.push(location);   
    $("#locNameText").val("");
    $("#locIDText").val("");
    $("#locIPText").val("");
}

function removeLoc(locName) {
    var li = document.getElementById("li_loc_"+locName);
    li.remove();
    for(var i = 0; i < globalLocationList.length; i++) {
        if( globalLocationList[i]["name"] == locName) {
            break;
        }
    }
    globalLocationList.splice(i, 1);
}

function addMap(widgetID, graphID, data, w, h, x, y) {
    var div = '<div class="widget-color"><p id="title_'+graphID+'" class="chart-title-font">'+data.chartTitle+'</p><div class="widget-color" id="'+graphID+'"style="display: block; margin: 0px auto; height: 285px; overflow: hidden;"><div id="'+graphID+'_" class="widget-color map-div" style=""></div></div></div>';
    
    addDivtoWidget(div, w, h, x, y, widgetID);
    var map = new google.maps.Map(document.getElementById(graphID), {
        zoom: 1,
        center: { lat: 0, lng: -180 },
        mapTypeId: 'roadmap'
    });
    
    graphs[graphID] = {};
    graphs[graphID]["type"] = "map";
    graphs[graphID]["chartData"] = data;

    var client;
    var location;
    
    for (var i = 0; i < data.locations.length; i++) {
        location = data.locations[i];
        client = initMQTTClientMap(graphID, i, map);
    }

    mapIndex++;
}

function initMQTTClientMap(id, i, map){
    updateMap(id, i, map);
    var ip = graphs[id]["chartData"]["locations"][i]["ip"];
    var title = graphs[id]["chartData"]["locations"][i]["id"];
    //var payload = JSON.stringify(locIDList);
    var payload = -1;
    var port = parseInt(ip.substr(ip.length - 4));
    mqttPub(payload, ip, port, title);

    var randomstr = randomString(10);
    options = {
        clientId: randomstr,
        keepalive: 1,
        clean: false
    };
    var client = mqtt.connect(ip, options);
    client.subscribe(title);
    client.on("message", function(topic, payload) {
        var msg_ = [payload].join("");
        var value_ = JSON.parse(msg_);
        if((value_) && value_ != -1){
            // value_ format: { lat: 37.772, lng: -122.214 } | {"lat": "-27", "lng": "210"}
            graphs[id]["chartData"]["locations"][i]["coordinates"].push(value_);
            updateMap(id, i, map);
        }
    });
    client.on("reconnect", function() {
        client.subscribe(title);
    });
    
    return client;    
}

function updateMap(chartID, i, map) {
    var location = {};
    var locationArr = graphs[chartID]["chartData"]["locations"][i]["coordinates"].filter(Boolean);
    for (j = 0; j < locationArr.length; j++) {
        locationArr[j].lat = parseFloat(locationArr[j].lat);
        locationArr[j].lng = parseFloat(locationArr[j].lng);
    }
    //console.log(locationArr);

    var flightPath = new google.maps.Polyline({
        path: locationArr,
        geodesic: true,
        strokeColor: '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6),
        strokeOpacity: 1.0,
        strokeWeight: 2
    });
    flightPath.setMap(map);

    disableDrag();
}