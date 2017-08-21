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
        ip: locIP
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
        var map = new google.maps.Map(document.getElementById(chartID), {
        zoom: 1,
        center: { lat: 0, lng: -180 },
        mapTypeId: 'roadmap'
    });

    var client;
    var location;
    //client = initMQTTClientMap(graphID, data.ip, data.title, data.interval);
    for (var i = 0; i < data.locations.length; i++) {
        location = data.locations[i];
        client = initMQTTClientMap(graphID, location["ip"], location["id"], map);
    }

    mapIndex++;
    graphs[graphID] = {};
    graphs[graphID]["type"] = "map";
    graphs[graphID]["chartData"] = data;
}

function initMQTTClientMap(id, ip, title, map){

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
        if(!isNaN(value_)){
            // value_ format: { lat: 37.772, lng: -122.214 }
            graphs[id]["chartData"]["coordinates"][title].push(value_);
            // graphs[id]["chartData"]["coordinates"] format:
            // var coordinates = {
            //     "L1":
            //     [{ lat: 37.772, lng: -122.214 },
            //     { lat: 21.291, lng: -157.821 },
            //     { lat: -18.142, lng: 178.431 },
            //     { lat: -27.467, lng: 153.027 }],
            //     "L2":
            //     [{ lat: 37.772, lng: -122.214 },
            //     { lat: 22.291, lng: -256.821 },
            //     { lat: -17.142, lng: 179.431 },
            //     { lat: -28.467, lng: 154.027 },
            //     { lat: -9.142, lng: 140.431 },],
            //     "L3":
            //     [{ lat: 37.772, lng: -122.214 },
            //     { lat: 12.291, lng: -235.821 },
            //     { lat: -27.142, lng: 210.431 },
            //     { lat: -18.467, lng: 200.027 }]
            // }
            updateMap(id, title, map);
        }
    });
    client.on("reconnect", function() {
        client.subscribe(title);
    });
    
    return client;    
}

function updateMap(chartID, title, map) {
    //var colCount = 0;
    // var map = new google.maps.Map(document.getElementById(chartID), {
    //     zoom: 1,
    //     center: { lat: 0, lng: -180 },
    //     mapTypeId: 'roadmap'
    // });

    //var colors = ["#FF0000", "#FFFF00", "#FF00FF", "#00FF00"];


    var flightPath = new google.maps.Polyline({
        path: graphs[chartID]["chartData"]["coordinates"][title],
        geodesic: true,
        //strokeColor: colors[colCount],
        strokeOpacity: 1.0,
        strokeWeight: 2
    });
    //colCount++;
    flightPath.setMap(map);

    disableDrag();
}