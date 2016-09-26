// google scripts
console.log("goggle script is connected");

var map;
var infoWindow;
var service;


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
        keyword: 'rtd'
    };
    service.radarSearch(request, callback);
}

function callback(results, status) {
    if (status !== google.maps.places.PlacesServiceStatus.OK) {
        console.error(status);
        return;
    }

    for (var i = 0, result; result = results[i]; i++) {
        addMarker(result);
        updatePlaceNames(result);
    }
    // console.log(placeNames);
    console.log(placeNames().length);
}

function addMarker(place) {
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        title: place.name,
        icon: {
            url: 'http://maps.gstatic.com/mapfiles/circle.png',
            anchor: new google.maps.Point(10, 10),
            scaledSize: new google.maps.Size(20, 34)
        }
    });

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
    if (placeNames.indexOf(place.place_id) === -1) {
        placeNames.push(place.place_id);
    }
}

// This is a simple *viewmodel* - JavaScript that defines the data and behavior of your UI
function AppViewModel() {
    self.placeNames = ko.observableArray([]);
}

// Activates knockout.js
ko.applyBindings(new AppViewModel());