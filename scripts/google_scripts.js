// google scripts
console.log("goggle script is connected");

var map;
var infoWindow;
var service;
var markers = [];
var currentSearchTerm = ko.observable("pizza");
var placeNames = ko.observableArray([]);
var unfilteredPlaceNames = ko.observableArray([]);
var currentFilter = ko.observable();
var currentLat = ko.observable();
var currentlong = ko.observable();
var isAlertMessage = ko.observable(false);
var alertMessage = ko.observable("Alert Message");
var markerClicked = false;
var idleEventSearch;
var selectedPlace = ko.observable();

// A global function to store key-value pairs in local storage
updateLocalStorage = function(name, value){

    if(typeof(Storage) == 'undefined'){
        return "No HTML5 localStorage support"
    }
    else{
        // Try this
        try {
            localStorage.setItem(name, value);
        }

        catch (e) {
            // If any errors, catch and alert the user
            if (e == "QUOTA_EXCEEDED_ERR") {
                isAlertMessage(true);
                alertMessage("Local storage Quota exceeded!");
                localStorage.clear();
            }

        }
    }
};

// code to initialize currentSearchTerm based on users previous history utilizing local storage
if(localStorage.getItem('searchTerm'))
    currentSearchTerm(localStorage.getItem('searchTerm'));
else
    currentSearchTerm("pizza");

// code to initialize lat and log based on users previous history utilizing local storage
if(localStorage.getItem('currentLat'))
    {
        currentLat(Number(localStorage.getItem('currentLat')));
        currentlong(Number(localStorage.getItem('currentlong')));
    }
else
    {
        currentLat(39.746921);
        currentlong(-104.999433);
    }

function googleErrorFunction(){
    isAlertMessage(true);
    alertMessage("Error in loading Google Maps... Please try again by refreshing this page");
}

function initMap() {
    isAlertMessage(false);
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: currentLat(), lng: currentlong()},
        zoom: 14,
        styles: [{
            stylers: [{ visibility: 'simplified' }]
        }, {
            elementType: 'labels',
            stylers: [{ visibility: 'on' }]
        }]
    });

    infoWindow = new google.maps.InfoWindow();
    service = new google.maps.places.PlacesService(map);

    // The idle event is a debounced event, so we can query & listen without
    // throwing too many requests at the server.
    // idleEventSearch = map.addListener('idle', performSearch);

    if(markerClicked){
        google.maps.event.removeListener(idleEventSearch);
        map.addListener('dragend', performSearch);
        map.addListener('zoom_changed', performSearch);
        markerClicked = false;
    }else
    {
        idleEventSearch = map.addListener('idle', performSearch);
        map.addListener('dragend', performSearch);
        map.addListener('zoom_changed', performSearch);
    }

}

function performSearch() {
    console.log("performing search...");
    var request = {
        bounds: map.getBounds(),
        keyword: currentSearchTerm()
    };
    service.nearbySearch(request, callback);
    // reset markerClicked flag to false

}

function callback(results, status) {
    if (status !== google.maps.places.PlacesServiceStatus.OK) {
        isAlertMessage(true);
        alertMessage("No Result Found for the area, Please zoom out little bit");
        console.log("No Result Found");
        return;
    }
    isAlertMessage(false); //code to remove any exiting alert message
    // remove all existing placenames in the array
    placeNames([]);
    // remove all existing markers from the map
    deleteMarkers();
    for (var i = 0, result; result = results[i]; i++) {
        addMarker(result);
        updatePlaceNames(result);
    }
    console.log(placeNames().length);

    // code to alert user the usage restrctions of Google MAPS API in Search results
    if(placeNames().length >19){
        isAlertMessage(true);
        alertMessage("Since it is using free Google MAPs API search result is restricted to only 20.");
    }

    unfilteredPlaceNames(placeNames());

    // code to store current location in local storage
    currentLat (results[0].geometry.location.lat());
    currentlong (results[0].geometry.location.lng());
    updateLocalStorage('currentLat', currentLat());
    updateLocalStorage('currentlong', currentlong());
    google.maps.event.removeListener(idleEventSearch);
}

function addMarker(place) {
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        icon: {
            url: 'http://maps.gstatic.com/mapfiles/circle.png',
            anchor: new google.maps.Point(10, 10),
            scaledSize: new google.maps.Size(20, 34)
        }
    });
    markers.push(marker);
    // console.log(place);

    google.maps.event.addListener(marker, 'click', function() {
        showPlaceDetails(place);
    });
}

function showPlaceDetails(place)
{
    markerClicked = true;
    isAlertMessage(false);
    // console.log(place);
    selectedPlace(place.place_id);
    var request = {
        placeId: selectedPlace()
    };

    service.getDetails(request, function(result, status) {
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
            console.error(status);
            return;
        }
        //function to get yahoo weather data for that location
        var yahooUrlForWeather = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22" + result.formatted_address + "%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
        $.ajax({url: yahooUrlForWeather})
            .done(function( weatherData ) {
                yahooWeatherData = weatherData.query.results.channel;
                var marker = new google.maps.Marker({
                    map: map,
                    position: result.geometry.location,
                });
                infoWindow.setContent('<div><strong>' + result.name + '</strong><br>' +
                    // 'Place ID: ' + result.place_id + '<br>' +
                    result.formatted_address + '<br>' +
                    result.formatted_phone_number + '<br><hr>' +
                    '<strong>'+ yahooWeatherData.title+ '</strong><br>' +
                    yahooWeatherData.lastBuildDate + '<br> Temperature: ' +
                    yahooWeatherData.item.condition.temp + '&degF<br>' +
                    yahooWeatherData.item.description +
                    "<a href='https://www.yahoo.com/?ilc=401' target='_blank'> <img src='https://poweredby.yahoo.com/purple.png' width='134' height='29'/> </a>"+
                    '</div>');
                infoWindow.open(map, marker);
            })
            .fail(function() {
                console.log( "Failed to get yahoo weather data" );
                isAlertMessage(true);
                alertMessage("Failed to get yahoo weather data");

            });
    });
};


function updatePlaceNames(place) {
    placeNames.push(place);
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

function deleteMarkers() {
    setMapOnAll(null);
    markers = [];
}



// This is a simple *viewmodel* - JavaScript that defines the data and behavior of your UI
function AppViewModel() {
    var self = this;
    // self.selectedPlace = ko.observable();

    // Behaviours
    self.viewPlaceDetails = function (place) {
        showPlaceDetails(place);
    };

    self.updateMap = function () {
        placeNames([]);
        updateLocalStorage('searchTerm', currentSearchTerm());
        markerClicked = false;
        initMap();
    };

    self.resetMap = function () {
        placeNames([]);
        markerClicked = false;
        initMap();
    };
    
    self.filterPlaces = function () {
        placeNames([]);
        if(!currentFilter()) {
            placeNames(unfilteredPlaceNames());
        } else {
            var filter = currentFilter();
            ko.utils.arrayFilter(unfilteredPlaceNames(), function(prod) {
                if(prod.name.toLowerCase().includes(filter.toLowerCase())){
                    placeNames.push(prod);
                }
            });
        }
        // code to filter map
        deleteMarkers();
        for (var i = 0, result; result = placeNames()[i]; i++) {
            addMarker(result);
        }
        updateLocalStorage('searchTerm', currentSearchTerm());
    };

    // code to use local storage to store user search term and filter values


}
// Activates knockout.js
ko.applyBindings(new AppViewModel());