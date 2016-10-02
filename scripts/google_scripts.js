// google scripts
console.log("goggle script is connected");

var map;
var infoWindow;
var service;
var markers = [];

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 39.746921, lng: -104.999433},
        zoom: 14,
        styles: [{
            stylers: [{ visibility: 'simplified' }]
        }, {
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
        }]
    });

    infoWindow = new google.maps.InfoWindow();
    service = new google.maps.places.PlacesService(map);

    // The idle event is a debounced event, so we can query & listen without
    // throwing too many requests at the server.
    map.addListener('idle', performSearch);
}

function performSearch() {
    var request = {
        bounds: map.getBounds(),
        keyword: currentPlace()
    };
    service.nearbySearch(request, callback);
}

function callback(results, status) {
    if (status !== google.maps.places.PlacesServiceStatus.OK) {
        console.error(status);
        return;
    }
    // remove all existing placenames in the array
    placeNames([]);
    // remove all existing markers from the map
    deleteMarkers();

    for (var i = 0, result; result = results[i]; i++) {
        addMarker(result);
        updatePlaceNames(result);
    }
    console.log(placeNames().length);
    unfilteredPlaceNames(placeNames());
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

    google.maps.event.addListener(marker, 'click', function() {
        service.getDetails(place, function(result, status) {
            if (status !== google.maps.places.PlacesServiceStatus.OK) {
                console.error(status);
                return;
            }
            infoWindow.setContent('<div><strong>' + result.name + '</strong><br>' +
                'Place ID: ' + result.place_id + '<br>' +
                result.formatted_address + '<br>' +
                result.formatted_phone_number + '<br>' +
                '</div>');
            infoWindow.open(map, marker);
        });
    });
}

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
    self.selectedPlace = ko.observable();
    currentPlace = ko.observable("pizza");
    placeNames = ko.observableArray([]);
    unfilteredPlaceNames = ko.observableArray([]);
    currentFilter = ko.observable();

    // Behaviours
    self.viewPlaceDetails = function(place)
        {
            console.log(place);
            self.selectedPlace(place.place_id);
            var request = {
                placeId: self.selectedPlace()
            };

            service.getDetails(request, function(result, status) {
                if (status !== google.maps.places.PlacesServiceStatus.OK) {
                    console.error(status);
                    return;
                }
                var marker = new google.maps.Marker({
                    map: map,
                    position: result.geometry.location,
                    icon: {
                        url: 'http://maps.gstatic.com/mapfiles/circle.png',
                        anchor: new google.maps.Point(10, 10),
                        scaledSize: new google.maps.Size(20, 34)
                    }
                });
                infoWindow.setContent('<div><strong>' + result.name + '</strong><br>' +
                    'Place ID: ' + result.place_id + '<br>' +
                    result.formatted_address + '<br>' +
                    result.formatted_phone_number + '<br>' +
                    '</div>');
                infoWindow.open(map, marker);
            });
        };

    self.updateMap = function () {
        placeNames([]);
        initMap();
    };

    self.resetMap = function () {
        currentPlace("pizza");
        placeNames([]);
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
    }

}
// Activates knockout.js
ko.applyBindings(new AppViewModel());