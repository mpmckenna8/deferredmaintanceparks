//
mapboxgl.accessToken = 'pk.eyJ1IjoibXBtY2tlbm5hOCIsImEiOiJfYWx3RlJZIn0.v-vrWv_t1ytntvWpeePhgQ';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v9',
    center: [ -77.0413, 38.888 ], //[-96, 37.8],
    zoom: 8
});

let reqgeo = new Request('./nps_boundary_DM_FY15.geojson');

const myURL = reqgeo.url; // http://localhost/flowers.jpg
const myMethod = reqgeo.method; // GET




map.on('load', function () {


  fetch(reqgeo)
    .then(response => {
      if (response.status === 200) {
      //  console.log('theres some json', response.json())
        return response.json();
      } else {
        throw new Error('Something went wrong on api server!');
      }
    })
    .then(geoparks => {
      console.debug(geoparks);
            
        map.addLayer({
          "id": "parks",
          "type": "fill",
          "source": {
            "type": "geojson",
            "data": geoparks
          },
          'layout': {},
          'paint': {
              'fill-color': '#088',
              'fill-opacity': 0.4
          }
      });
      
      map.on('click', 'parks', function (e) {
        
      new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(e.features[0].properties.UNIT_NAME)
          .addTo(map);
        
  });
  
  let comfortreq = new Request('./comfortdc.geojson');
  
  const comURL = comfortreq.url; // http://localhost/flowers.jpg
  const comMethod = comfortreq.method; // GET
  
  console.log('req comforts');
  
  fetch(comfortreq)
  .then(response => {
    console.log('req the comforts')
    if (response.status === 200) {
    //  console.log('theres some json', response.json())
      return response.json();
    } else {
      throw new Error('Something went wrong on api server!');
    }
  })
  .then(stations => {
    
      console.log('got the stations', stations);
      map.addLayer({
    "id": "points",
    "type": "symbol",
    "source": {
        "type": "geojson",
        "data": stations
    },
    "layout": {
    //    "icon-image": "{icon}-15",
  //      "text-field": "{title}",
        "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
        "text-offset": [0, 0.6],
        "text-anchor": "top"
    }
});

  stations.features.forEach(function(marker) {
    var el = document.createElement('div');
     el.className = 'marker';
     
     el.innerHTML = '💩';
     //console.log(marker.dc_comfort_stations_priority);
    // el.style = "width:20px;height:40px";
    
         el.style =  el.style+ "font-size:35rem;width:30px;text-align:center;";

     if(marker.properties.dc_comfort_stations_priority === '2. High' ) {
       
       el.className = 'high';

    
     }
     else if(marker.properties.dc_comfort_stations_priority === '1. Highest') {
       
       el.className = 'worst'
     }
     
     el.addEventListener('click', function() {
       window.alert('marker clicked');
   });

   // add marker to map
   new mapboxgl.Marker(el)
       .setLngLat(marker.geometry.coordinates)
       .addTo(map);
    
    
  })


      
      
      
  })
  .catch(error => {
    console.error(error);
  });
      
      
      // ...
    }).catch(error => {
      console.error(error);
    });
    
    

    
});
