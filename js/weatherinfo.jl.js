function loadMap(mapDiv) {
    var locations = [];
    var weather = [];
    var Latitude = undefined;
    var Longitude = undefined;
    var marker;

    function getMapLocation() {
        navigator.geolocation.getCurrentPosition
            (onMapSuccess, onMapError, { enableHighAccuracy: true });
    }

    var onMapSuccess = function (position) {
        Latitude = position.coords.latitude;
        Longitude = position.coords.longitude;
        console.log("Geolocation : " + "\n" + "Latitude  : " + Latitude + "\n" + "Longitude : " + Longitude);
        myLocation.push(Latitude, Longitude);
        initMap(mapDiv);
    }

    function onMapError(error) {
        console.log('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
    }

    getMapLocation();

    function initMap(divStr) {
        var map = new google.maps.Map(document.getElementById(divStr), {
            zoom: 15,
            center: new google.maps.LatLng(myLocation[0], myLocation[1]),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        var infowindow = new google.maps.InfoWindow();

        var markers = [];
        myLocation = [];

        google.maps.event.addListener(map, 'click', function (event) {
            var latitude = event.latLng.lat();
            var longitude = event.latLng.lng();
            myLocation = {latitude, longitude};
            var marker = placeMarker(event.latLng);
            markers.push(marker);
            // console.log("Selected Location Data:");
            // console.log(myLocation);

        });

        function placeMarker(location) {
            deleteMarkers();
            markers = [];
            var marker = new google.maps.Marker({
                position: location,
                map: map
            });
            return marker;
        }
        // Sets the map on all markers in the array.
        function setMapOnAll(map) {
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(map);
            }
        }

        // Removes the markers from the map, but keeps them in the array.
        function clearMarkers() {
            setMapOnAll(null);
        }

        // Deletes all markers in the array by removing references to them.
        function deleteMarkers() {
            clearMarkers();
            markers = [];
        }
    }  
}

function addWeatherInfo(widgetID, graphID, data, w, h, x, y) {
    var div = 
    '<div class="widget-color weather-div"><p id="title_'+graphID+'" class="chart-title-font">'+data.chartTitle+'</p><div id="'+graphID+'" class="widget-color" style="display: block;margin: 0 auto;background-color: inherit;"></div>'+
        '<div class="w3-row w3-padding-2 loc-details" style="height:30%; padding-left: 15px;">'+
            '<p id="'+graphID+'_locName" class="label-4" style="font-size: 20px;"></p>'+
            '<p id="'+graphID+'_latlong" class="label-4"></p>'+
        '</div>'+
        '<div class="w3-row w3-padding-2" style="height:50%; padding-left: 15px">'+
            '<div class="w3-col w3-container" style="width:40%; font-size: 20px;">'+
                '<p id="'+graphID+'_temp" class="label-4"></p>'+
                '<div id="'+graphID+'_weathericon" style="height: 40px;width: 55px;"></div>'+
            '</div>'+
            '<div class="w3-col w3-container"  style="width:60%">'+
                '<div class="w3-row"><p id="'+graphID+'_weather" class="label-4"></p></div>'+
                '<div class="w3-row"><p id="'+graphID+'_wind" class="label-4"></p></div>'+
                '<div class="w3-row"><p id="'+graphID+'_humidity" class="label-4"></p></div>'+
                '<div class="w3-row"><p id="'+graphID+'_pressure" class="label-4"></p></div>'+
            '</div>'+
        '</div>'
    '</div>';
    addDivtoWidget(div, w, h, x, y, widgetID);
    weatherinfoIndex++;
    graphs[graphID] = {};
    graphs[graphID]["type"] = "weatherinfo";
    graphs[graphID]["chartData"] = data;
    updateWeather(graphID);
    setInterval(updateWeather, 5000, graphID);
}

function updateWeather(graphID) {
    var location = graphs[graphID].chartData.location;
    var latitude = location.latitude;
    var longitude = location.longitude;

    // if (!latitude || latitude == "") {
    //     latitude = 6.89;
    //     longitude = 79.92;
    // }
    var weather = {};
    var OpenWeatherAppKey = "c9acdd420e05d02a6986427cb81d6c6c";

    var queryString =
        'http://api.openweathermap.org/data/2.5/weather?lat='
        + latitude + '&lon=' + longitude + '&appid=' + OpenWeatherAppKey + '&units=imperial';

    $.getJSON(queryString, function (results) {

        if (results.weather.length) {

            $.getJSON(queryString, function(results) {
                if (results.weather.length) {
                    weather = {
                        latitude: latitude,
                        longitude: longitude,
                        area: results.name,
                        temperature: (parseFloat(results.main.temp) - 32) / 1.8,
                        weathertype: results.weather[0].main,
                        wind: results.wind.speed,
                        humidity: results.main.humidity,
                        pressure: results.main.pressure / 2,
                        icon: results.weather[0].icon,
                    };
                    console.log("Weather Data:");
                    console.log(weather);
                    var iconstr = 'http://openweathermap.org/img/w/'+weather.icon+'.png'
                    $("#"+graphID+"_locName").html(weather.area);
                    $("#"+graphID+"_latlong").html((Number(latitude)).toFixed(4)+", "+(Number(longitude)).toFixed(4));
                    $("#"+graphID+"_temp").html((Number(weather.temperature)).toFixed(2) + '&deg;C');
                    $("#"+graphID+"_weather").html('<b>Weather:&nbsp;</b>' + weather.weathertype);
                    $("#"+graphID+"_wind").html('<b>Wind:&nbsp;</b>' + weather.wind + '&nbsp;m/s')
                    $("#"+graphID+"_humidity").html('<b>Humidity:&nbsp;</b>' + weather.humidity + '&nbsp;%');
                    $("#"+graphID+"_pressure").html('<b>Pressure:&nbsp;</b>' + weather.pressure + '&nbsp;kPa');
                    $("#"+graphID+"_weathericon").css('background-image', 'url("'+iconstr+'")');
                }
            });
        }
    }).fail(function () {
        console.log("error getting location");
    });
}