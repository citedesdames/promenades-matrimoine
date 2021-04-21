let sudOuest = L.latLng(48.815003, 2.227135);
let nordEst = L.latLng(48.902724, 2.488421);
let bounds = L.latLngBounds(sudOuest, nordEst);

let positionUser, accuracy;

let mymap = new L.Map('mapid', {
    center: bounds.getCenter(),
    zoom: 12,
    maxBounds: bounds,
    maxBoundsViscosity: 1.0
});

// mymap.setView([48.861779, 2.343521], mymap.getZoom(), {
//     "animate": true,
//     "pan": {
//       "duration": 10
//     }
//   });

// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '',
//     maxZoom: 18,
//     id: 'mapbox/streets-v11',
// }).addTo(mymap);

let googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
}).addTo(mymap);

L.tileLayer('https://mapwarper.net/maps/tile/26642/{z}/{x}/{y}.png', {
  attribution: 'Tiles by <a href="http://mapwarper.net/maps/20531">Map Warper user sarahsimpkin</a>',
  maxZoom: 20,
  minZoom: 1
}).addTo(mymap);

const demarre = new Promise((resolve, reject) => {

    Papa.parse('https://docs.google.com/spreadsheets/d/e/2PACX-1vTMejdM_tVXKPm0vpS45-8CnHVQCtjGPUCl_G_7OoCm9uXhZY7TS7EnfBokrf-LQMyEgKMuR91MEGui/pub?gid=2098688852&single=true&output=csv', {
        download: true,
        header: true,
        complete: function (results) {
            console.log(results);
            addStep(results.data);
        }
    });

    setTimeout(() => {
        resolve()
    }, 2000)
})
demarre.then(() => {
    const detectPosition = new Promise((resolve, reject) => {
        // mymap.on('locationfound', onLocationFound);
        // mymap.on('locationerror', onLocationError);
    
        mymap.on('locationfound', (e) => {
            let radius = e.accuracy;
    
            positionUser = L.marker(e.latlng).addTo(mymap)
                .bindPopup("Vous êtes ici ! à " + e.latlng).openPopup();
        
            accuracy = L.circle(e.latlng, radius).addTo(mymap);
        });
    
        mymap.on('onLocationError', (e) => {
            alert(e.message);
        });
    
        mymap.locate({maxZoom: 16});

        setTimeout(() => {
            resolve()
        }, 2000)
    })
    detectPosition.then(() => {

        let distanceStroke = L.polyline([]).addTo(mymap);
    
        let marker2 = L.marker([48.855228, 2.431798], {draggable: 'true'}).bindPopup("").addTo(mymap);
    
        positionUser.on('dragend', findrag);
        marker2.on('dragend', findrag);
        positionUser.on('drag', deplacement);
        marker2.on('drag', deplacement);
    
        function findrag(e) {
            let mark = e.target;
            let start = positionUser.getLatLng();
            let end = marker2.getLatLng();
            distance = Math.round(start.distanceTo(end));
            mark.getPopup().setContent('Distance = '+distance+' m');
            mark.openPopup();
    
            verifyPosition();
    
        }
        
        function deplacement(e) {
            distanceStroke.setLatLngs([positionUser.getLatLng(), marker2.getLatLng()]);
        }

        // Recherche la position de l'utilisateur à interval de 3 secondes
        // setInterval(locate, 3000);
        
    })



})

mymap.on('click', onMapClick);