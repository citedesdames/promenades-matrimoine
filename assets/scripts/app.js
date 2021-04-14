Papa.parse("https://docs.google.com/spreadsheets/d/e/2PACX-1vSkCmkK4deLsljq7uT3B4E920bVAvbVXbie2xfn9DgQRkxsu4aIjkqDpKbqbfZ2wA42nsJgZW--pHM4/pub?gid=0&single=true&output=csv", {
	download: true,
  header: true,
	complete: function(results) {
		console.log(results);
	}
});

// let mymap = L.map('mapid')
    // .setView([48.863812, 2.448451], 12);

let sudOuest = L.latLng(48.815003, 2.227135);
let nordEst = L.latLng(48.902724, 2.488421);
let bounds = L.latLngBounds(sudOuest, nordEst);

let mymap = new L.Map('mapid', {
    center: bounds.getCenter(),
    zoom: 5,
    maxBounds: bounds,
    maxBoundsViscosity: 1.0
});

// L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
//     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
//     maxZoom: 18,
//     id: 'mapbox/streets-v11',
//     tileSize: 512,
//     zoomOffset: -1,
//     accessToken: 'pk.eyJ1IjoidWx5c3NlZ3J2IiwiYSI6ImNrbmVmdWk3ZDB4bWEycG83bzY5eGp6OHIifQ.QysIPlv3cFALwxm-Jx_UQA'
// }).addTo(mymap);



mymap.fitBounds(bounds);

L.tileLayer('https://a.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
}).addTo(mymap); 

L.tileLayer('https://mapwarper.net/maps/tile/26642/{z}/{x}/{y}.png', {
  attribution: 'Tiles by <a href="http://mapwarper.net/maps/20531">Map Warper user sarahsimpkin</a>',
  maxZoom: 20,
  minZoom: 1
}).addTo(mymap);

let marker = L.marker([48.863812, 2.448451]).addTo(mymap);
let marker2 = L.marker([48.865342, 2.327412]).addTo(mymap);

let circle = L.circle([48.852824, 2.426170], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 300
}).addTo(mymap);

let polygon = L.polygon([
    [48.862898, 2.423237],
    [48.859198, 2.424409],
    [48.861213, 2.432025]
]).addTo(mymap);

marker.bindPopup("<b>Bonjour !</b><br>Ici, la ville de Montreuil.").openPopup();
circle.bindPopup("Ici, un cercle.");
polygon.bindPopup("Ici, un polygon.");

// let homePopup = L.popup()
//     .setLatLng([48.856426, 2.432048])
//     .setContent("Ici, la ville de Montreuil.")
//     .openOn(mymap);


var popup = L.popup();
// let marker2 = L.marker();

function onMapClick(e) {
    // popup
    //     .setLatLng(e.latlng)
    //     .setContent("You clicked the map at " + e.latlng.toString())
    //     .openOn(mymap);
    let marker2 = L.marker([e.latlng.lat, e.latlng.lng]).addTo(mymap);
    marker2.bindPopup("Vous avez clické sur la carte à " + e.latlng.toString()).openPopup()
}

mymap.on('click', onMapClick);