# Neighborhood-Map
#### Author: Md Kamrul Hasan Pulok
#### This project is developed as a part of Udacity Full Stack Web Developer Nanodegree Project-7
[Github Page Link](https://github.com/hvpulok/Neighborhood-Map "Github Page Link")


##Instructions to run the Project:
* Just open index.html
* Search for any place of interest like pizza, bar, walmart, bus stop etc
* It will show a list of places, you can select any place and get detailed information including Yahoo weather data

##Tools used in this Project:
* javascript
* knockout.js MVVM framework
* jQuery
* Bootstrap
* JSON, AJAX
* GOOGLE MAPS API
* Yahoo Weather API
* CSS

## Feature Checklist complying Project Rubric:
* Interface Design:
    * Responsiveness
        * All application components render on-screen in a responsive manner. : __done__
    * Usability
        * All application components are usable across modern desktop, tablet, and phone browsers. : __done__

* App Functionality:
    * Filter Locations
        * Includes a text input field or dropdown menu that filters the map markers and list items to locations matching the text input or selection. Filter function runs error-free. : __done__
    * List View
        * A list-view of location names is provided which displays all locations by default, and displays the filtered subset of locations when a filter is applied.
          Clicking a location on the list displays unique information about the location, and animates its associated map marker (e.g. bouncing, color change.)
          List functionality is responsive and runs error free. : __done__
    * Map and Markers
        * Map displays all location markers by default, and displays the filtered subset of location markers when a filter is applied. : __done__
        * Clicking a marker displays unique information about a location in either an infoWindow or DOM element. : __done__
        * Markers should animate when clicked (e.g. bouncing, color change.) : __done__
        * Any additional custom functionality provided in the app functions error-free. : __done__

* App Architecture:
    * Proper Use of Knockout
        * Code is properly separated based upon Knockout best practices (follow an MVVM pattern, avoid updating the DOM manually with jQuery or JS, use observables rather than forcing refreshes manually, etc). Knockout should not be used to handle the Google Map API. : __done__
        * There are at least 5 locations in the model. These may be hard-coded or retrieved from a data API. : __done__

* Asynchronous Data Usage:
    * Asynchronous API Requests
        * Application utilizes the Google Maps API and at least one non-Google third-party API. : __done__
        * All data requests are retrieved in an asynchronous manner. : __done__
    * Error Handling
        * Data requests that fail are handled gracefully using common fallback techniques (i.e. AJAX error or fail methods). 'Gracefully' means the user isn’t left wondering why a component isn’t working. If an API doesn’t load there should be some visible indication on the page (an alert box is ok) that it didn’t load. Note: You do not need to handle cases where the user goes offline. : __done__

* Location Details Functionality:
    * Additional Location Data
        * Functionality providing additional data about a location is provided and sourced from a 3rd party API. Information can be provided either in the marker’s infoWindow, or in an HTML element in the DOM (a sidebar, the list view, etc.) : __done__
        * Provide attribution for the source of additional data. For example, if using Foursquare, indicate somewhere in your UI and in your README that you are using Foursquare data. : __done__
    * Error Free
        * Application runs without errors. : __done__
    * Usability
        * Functionality is presented in a usable and responsive manner. : __done__
        
* Documentation:
    * README
        * A README file is included detailing all steps required to successfully run the application. : __done__
    * Comments
        * Comments are present and effectively explain longer code procedures. : __done__
        


