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

 	// Attribute map
  	map.ui.attribution.add()
      .content('<a href="http://mapbox.com/about/maps">Terms &amp; Feedback</a>');
  
	
	//location
	map.centerzoom({
        lat: 27.6,
        lon: -20.07
    }, 2);

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


