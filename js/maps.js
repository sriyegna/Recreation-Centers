//Global variables
//List of community centers
var listRecs = [{"name":"Carlisle Community Centre & Arena","address":"1496 Centre Road","city":"Carlisle","phone":"905-689-7283","latitude":"43.39606","longtitude":"-79.98293"},{"name":"Chedoke Twin Pad Arena","address":"91 Chedmac Dr.","city":"Hamilton","phone":"905-546-2429","latitude":"43.23889","longtitude":"-79.92077"},{"name":"Coronation Arena and Pool","address":"81 Macklin St. North","city":"Hamilton","phone":"905-546-3109","latitude":"43.2646","longtitude":"-79.89598"},{"name":"Eastwood Arena","address":"111 Burlington St. East","city":"Hamilton","phone":"905-546-3152","latitude":"43.27171","longtitude":"-79.85564"},{"name":"Glanbrook Arena & Auditorium","address":"4300 Binbrook Road","city":"Binbrook","phone":"905-692-9331","latitude":"43.12911","longtitude":"-79.83908"},{"name":"Inch Park Arena & Pool","address":"400 Queensdale Ave.","city":"Hamilton","phone":"905-546-4922","latitude":"43.23712","longtitude":"-79.85937"},{"name":"Lawfield Arena","address":"150 Folkstone Ave.","city":"Hamilton","phone":"905-546-4923","latitude":"43.21464","longtitude":"-79.85116"},{"name":"Market Street (J.L. Grightmire) Arena","address":"35 Market St. South","city":"Dundas","phone":"905-540-6678","latitude":"43.26596","longtitude":"-79.96339"},{"name":"Mohawk 4 Ice Centre","address":"710 Mountain Brow Blvd.","city":"Hamilton","phone":"905-318-5111","latitude":"43.21037","longtitude":"-79.81616"},{"name":"Morgan Firestone Arena","address":"385 Jerseyville Road West","city":"Ancaster","phone":"905-546-3769","latitude":"43.21674","longtitude":"-80.00733"},{"name":"Mountain (Dave Andreychuk) Arena","address":"25 Hester St.","city":"Hamilton","phone":"905-546-4938","latitude":"43.22558","longtitude":"-79.88101"},{"name":"North Wentworth Twin-Pad Arena","address":"27 Hwy 5","city":"Flamborough","phone":"905-689-6666","latitude":"43.3102291","longtitude":"-79.9202291"},{"name":"Olympic Arena","address":"70 Olympic Dr.","city":"Dundas","phone":"905-540-6686","latitude":"43.27292","longtitude":"-79.93426"},{"name":"Parkdale (Pat Quinn) Arena and Pool","address":"1770 Main St. East","city":"Hamilton","phone":"905-546-4785","latitude":"43.2366018","longtitude":"-79.7939014"},{"name":"Rosedale Arena and Pool","address":"100 Greenhill Ave.","city":"Hamilton","phone":"905-546-4805","latitude":"43.21986","longtitude":"-79.80896"},{"name":"Saltfleet Arena","address":"24 Sherwood Park Road","city":"Stoney Creek","phone":"905-643-3883","latitude":"43.21851","longtitude":"-79.70443"},{"name":"Scott Park Arena","address":"876 Cannon St. East","city":"Hamilton","phone":"905-546-4919","latitude":"43.25033","longtitude":"-79.83038"},{"name":"Spring Valley Arena","address":"29 Orchard Dr.","city":"Ancaster","phone":"905-648-4404","latitude":"43.217","longtitude":"-79.99774"},{"name":"Stoney Creek Arena","address":"37 King St. West","city":"Stoney Creek","phone":"905-662-2426","latitude":"43.26648","longtitude":"-79.95509"},{"name":"Valley Park Arena & Rec Centre","address":"970 Paramount Dr.","city":"Stoney Creek","phone":"905-573-3600","latitude":"43.19332","longtitude":"-79.79796"}];
//Array of pushpins of length of community centers
var pushpins = new Array(listRecs.length);
//Various other variables like map, users location, location flag, infobox, jsonDataShown flag
var map, userGeoLocation, locationFound = false, infobox, jsonDataOnScreen = false;

//Parse the list of Recreational centers and put it in #jsonData and hide the element
$("#jsonData").html(JSON.stringify(listRecs, null, '\t'))
$("#jsonData").hide();

function loadMapScenario() {
	//Get users current location
	navigator.geolocation.getCurrentPosition(
		function (pos) {
			//Store coords globally, set location flag, and add pushpin
			userGeoLocation = pos.coords;
			locationFound = true;
			addCurrentLocationPushpin();
			//Update GPS location data to show user
			$("#gpsLocation").html("GPS puts you at:<br>Latitude: " + userGeoLocation.latitude + "<br>Longitude: " + userGeoLocation.longitude);
			$("#gpsLocation").css("color", "green");
		},
		//Control for errors, from w3schools
		function (error) {
			$("#gpsLocation").css("color", "red");
			switch(error.code) {
				case error.PERMISSION_DENIED:
					$("#gpsLocation").html("User denied the request for Geolocation.");
					break;
				case error.POSITION_UNAVAILABLE:
					$("#gpsLocation").html("Location information is unavailable.");
					break;
				case error.TIMEOUT:
					$("#gpsLocation").html("The request to get user location timed out.");
					break;
				case error.UNKNOWN_ERROR:
					$("#gpsLocation").html("An unknown error occurred.");
					break;
			}
		});
	//Create map with center point in hamilton
    map = new Microsoft.Maps.Map(document.getElementById('myMap'), {center: new Microsoft.Maps.Location(43.238879, -79.892548) });
	//For all the recreational centers
	for (i = 0; i < listRecs.length; i++) {
		//Create a location from the data
		var location = new Microsoft.Maps.Location(listRecs[i].latitude, listRecs[i].longtitude);
		//Create a pushpin from the location
		var pushpin = new Microsoft.Maps.Pushpin(location, null);
		//Add metadata from the listrecs info json such as name, address, image, bing maps link, xml lat long link
		pushpin.metadata = {
			title: listRecs[i].name,
			description: ("<img src='images/reccenter.png'><b>" + listRecs[i].address + "<br>" + listRecs[i].city + "<br>" + listRecs[i].phone 
				+ "</b><br>" + "<a href=https://bing.com/maps/default.aspx?cp=" + encodeURI(listRecs[i].latitude + "~" + listRecs[i].longtitude) + "&lvl=16&where1=" + encodeURI(listRecs[i].address + ", " + listRecs[i].city) + ">Bing Maps</a>  "
				+ "<a href=http://dev.virtualearth.net/REST/v1/Locations?o=xml&q=" + encodeURI(listRecs[i].address + " " + listRecs[i].city) + "&key=Ak-JUwgsz1X2W1gUOhqr_S2unJ75nIc8NXZKSLz2qDkQg8NlXvvOAxUuswWph8lM" + ">Lat/Lng</a>")
		};
		pushpins[i] = pushpin;
	}
	//Create infobox and set it
	infobox = new Microsoft.Maps.Infobox(pushpins[1].getLocation(), { visible: false, autoAlignment: true });
	infobox.setMap(map);
	//For all pushpins, add an infobox from the metadata
	for (var j = 0; j < pushpins.length; j++) {
		Microsoft.Maps.Events.addHandler(pushpins[j], 'click', function (args) {
			infobox.setOptions({
				location: args.target.getLocation(),
				title: args.target.metadata.title,
				description: args.target.metadata.description,
				visible: true
			}); 
		});
	}
	//Add all pushpins to map
	map.entities.push(pushpins);
}

//To add the users current location pin to the map
function addCurrentLocationPushpin() {
	//if location is found
	if (locationFound) {
		//Get the coords and create a pushpin
		var location = new Microsoft.Maps.Location(userGeoLocation.latitude, userGeoLocation.longitude);
		var pushpin = new Microsoft.Maps.Pushpin(location, null);
		//Add metadata to pushpin
		infobox.setMap(map);
		pushpin.metadata = {
			title: "Current Location",
			description: ""
		};
		//Add a pushpin click handler to invoke infobox with metadata from pushpin
		Microsoft.Maps.Events.addHandler(pushpin, 'click', function (args) {
			infobox.setOptions({
				location: args.target.getLocation(),
				title: args.target.metadata.title,
				description: args.target.metadata.description,
				visible: true
			}); 
		});
		//Add the pin to the map
		map.entities.push(pushpin);
	}
}

//Remove all pins from map. Used before we need to redraw pins
function removePins() {
	//For all pins in map, remove them
	for (var i = map.entities.getLength() - 1; i >= 0; i--) {
		var pushpin = map.entities.get(i);
		if (pushpin instanceof Microsoft.Maps.Pushpin) {
			map.entities.removeAt(i);
		}
	}
	//Add current location pin back
	addCurrentLocationPushpin();
}

//Toggle function for JSON data when user clicks jsonButton
$("#jsonButton").click(function() {
	if (jsonDataOnScreen) {
		$("#jsonData").hide();
		jsonDataOnScreen = false;
	} else {
		$("#jsonData").show();
		jsonDataOnScreen = true;
	}
});

//All City button which will draw all pushpins
$("#All").click(function() {
	removePins();
	map.entities.push(pushpins);
});

//Select all city buttons
var elements = document.querySelectorAll('#City');
//For any city button, add click event handler
elements.forEach(function(elem) {
	elem.addEventListener("click", function() {
		//Remove the pins
		removePins();
		//Redraw pins that match the city clicked
		for (var i = 0; i < pushpins.length; i++) {
			var description = pushpins[i].metadata.description;
			if (description.includes(this.innerHTML)) {
				map.entities.push(pushpins[i]);
			}
		}
	});
});