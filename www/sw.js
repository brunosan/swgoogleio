//Read data

function readAllData() {
	//read documentation JSON
	d3.json("events.geojson", function(json) {
		// Put the object into storage
		localStorage.setItem('locations', JSON.stringify(json));
		// Retrieve the object from storage
		var retrievedObject = localStorage.getItem('locations');
		console.log('locations saved in local storage: ', JSON.parse(retrievedObject));
	});
	addMeasureInput()
}

//search function
function addMeasureInput() {
	YUI().use("autocomplete", "autocomplete-filters", "autocomplete-highlighters", function(Y) {
		//skin
		Y.one('body').addClass('yui3-skin-sam');
		//Array source
		var locs = getLocationsList();
		Y.one('#ac-input').plug(Y.Plugin.AutoComplete, {
			resultFilters: 'phraseMatch',
			resultHighlighter: 'phraseMatch',
			source: locs,
			on: {
				select: function() {
					console.log("Locations Selected!");
				}
			},
			after: {
				select: function(o) {
					showLoc(o.result.raw);
				}
			}
		});
	});
};
function checkEnter(e) {
	var key = e.keyCode || e.which;
	if (key == 13) {
		console.log('Enter!');
	}
}

function getLocationsList() {
	var locs = JSON.parse(localStorage.getItem('locations'));
	
	var locs_list = [];
	for (l in locs["features"]) {
		var li = locs["features"][l]["properties"]["title"];
		if (locs_list.indexOf(li) == -1){
			locs_list.push(li);
		}
	}
	return locs_list;
}

function showLoc(loc){
	var locs = JSON.parse(localStorage.getItem('locations'));
	var la,lo;
	var locs_list = [];
	for (l in locs["features"]) {
		var li = locs["features"][l]["properties"]["title"];
		if (loc==li){
			la=locs["features"][l]["geometry"]["coordinates"][0];
			lo=locs["features"][l]["geometry"]["coordinates"][1];
			var map = mapbox.map('map');
			map.ease.location({ lat: la, lon: lo }).zoom(10).optimal();
			return; //to avoid when more than one place is present
		}
	}
}

// Create map
  mapbox.auto('map', 'mapbox.world-light', function(map, tiledata) {

    //Add GeoJSON markers


	var markerLayer = mapbox.markers.layer().url('events.geojson');
	var interaction = mapbox.markers.interaction(markerLayer);
	map.addLayer(markerLayer);
 
 	//description on the side
	var alert = document.getElementById('alert');

	// Set a custom formatter for tooltips
	// Provide a function that returns html to be used in tooltip
	interaction.formatter(function(feature) {
	        var o = feature.properties.title+' (' +feature.properties.description+')';
	
			  //Push GA values
			  var dimensionValue = feature.properties.title;
			  
			  _gaq.push(['_trackEvent', 'tooltip', 'show', dimensionValue]);
			
			return o;
	});
	
	markerLayer.factory(function(f) {
	      var elem = mapbox.markers.simplestyle_factory(f);		
		  MM.addEvent(elem, 'click', function(e) {
		          // clear the alert box
		          alert.innerHTML = '';
		          // add a header and paragraph, and fill them with content
		          // from the feature, which we've stored as the variable 'f'
		          var h2 = alert.appendChild(document.createElement('h2'));
		          var p = alert.appendChild(document.createElement('p'));
		          h2.innerHTML = "<a href='"+f.properties.website+"' target='_blank'>"+"Sartup Weekend "+f.properties.title+"</a>";
		          p.innerHTML = f.properties.description ;
		
				  // GA
				 _gaq.push(['_trackEvent', 'tooltip', 'click', f.properties.title]);
		          // prevent this event from bubbling down to the map and clearing
		          // the content

		          e.stopPropagation();
		   });
		   return elem;
		});
		//Cycle through markers? http://mapbox.com/mapbox.js/example/cycle-markers/

 	//emtpy on parent 
	MM.addEvent(map.parent, 'click', function() {
      alert.innerHTML = '';
  	});

	// Attribute map
  	map.ui.attribution.add()
      .content('<a href="http://mapbox.com/about/maps">Terms &amp; Feedback</a>');
  
	
	//location
	map.centerzoom({
        lat: 27.6,
        lon: -20.07
    }, 2,true);

	var xlat,xlon,xz;
	if (navigator.geolocation)
	    {
	    navigator.geolocation.getCurrentPosition(showPosition);
	    };
	function showPosition(position)
	  {
	  xlat= position.coords.latitude;
	  xlon= position.coords.longitude;
	  xz=6;
	  _gaq.push(['_trackEvent', 'geotag', 'Zooming', ""+xlat+","+xlon+""]);
	  map.centerzoom({
        lat: xlat,
        lon: xlon
      }, xz,true); 
	  }
});

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-39677446-1']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();


