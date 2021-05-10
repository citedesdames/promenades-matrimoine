/*
    Déclaration des variabls relatives aux limites de la carte pour
    la première balades, déclaration de variables pour ciblage d'éléments.

    Initialisation et paramétrage de la carte Leaflet
*/

let sudOuest = L.latLng(48.815003, 2.227135),
    nordEst = L.latLng(48.902724, 2.488421),
    bounds = L.latLngBounds(sudOuest, nordEst);

let positionUser, accuracy;

let opacityCursor = document.querySelector("#opacityCursor");

let mymap = new L.Map('mapid', {
    center: bounds.getCenter(),
    zoom: 12,
    maxBounds: bounds,
    maxBoundsViscosity: 0.5
});

let shutter = document.querySelector(".shutter"),
    notchBtn = document.querySelector(".notch"),
    closeBtn = document.querySelector(".close");

notchBtn.addEventListener('click', event => {
    openShutter(shutter);
});
closeBtn.addEventListener('click', event => {
    openShutter(shutter);
});

/*
    Chargements des tiles, déclaration des fonds de cartes via calques Leaflet
    et initialisation du bouton de contrôle des calques historiques.
*/

// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '',
//     maxZoom: 18,
//     id: 'mapbox/streets-v11',
// }).addTo(mymap);

var icon = L.icon({
    iconUrl: 'assets/images/marker-leaflet.png',

    iconSize:     [25, 39.1], // size of the icon
    iconAnchor:   [13, 38], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, -34] // point from which the popup should open relative to the iconAnchor
});

let googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
    // maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
}).addTo(mymap);

let paris17 =  L.tileLayer('https://mapwarper.net/maps/tile/26642/{z}/{x}/{y}.png', {
    attribution: 'Tiles by <a href="http://mapwarper.net/maps/20531">Map Warper user sarahsimpkin</a>',
    // maxZoom: 20,
    minZoom: 1
});

let paris19 =  L.tileLayer('https://mapwarper.net/maps/tile/42383/{z}/{x}/{y}.png', {
    attribution: 'Tiles by <a href="http://mapwarper.net/maps/20531">Map Warper user sarahsimpkin</a>',
    // maxZoom: 20,
    minZoom: 1
});

let fondsDeCarte = {
    "Paris XVII": paris17,
    "Paris XIX": paris19
};

paris19.on('click', function(e) {
    alert('I have been clicked ')
});

let control = L.control.layers(fondsDeCarte).addTo(mymap);
let checkboxes = document.querySelectorAll(".leaflet-control-layers-selector"); 
let enabledSettings = []

checkboxes.forEach(function(checkbox) {
    checkbox.addEventListener('change', function() {
      enabledSettings = 
        Array.from(checkboxes)
        .filter(i => i.checked)
        .map(i => i.value)
        
      if (enabledSettings == "on") {
          opacityCursor.classList.add("reveal");
      }
    })
  });



/*
    Initialisation des prommesses et démarrage de l'application
    
    Chargement des données des CSV via la librairie Papa Parse, détection de la position
    de l'utilisateur et test provisoire de distance entre celle-ci et un marqueur donné
*/


const demarre = new Promise((resolve, reject) => {
    let dataEtape = [];
    let dataDocument = [];
    Papa.parse('https://docs.google.com/spreadsheets/d/e/2PACX-1vTMejdM_tVXKPm0vpS45-8CnHVQCtjGPUCl_G_7OoCm9uXhZY7TS7EnfBokrf-LQMyEgKMuR91MEGui/pub?gid=2098688852&single=true&output=csv', {
        download: true,
        header: true,
        complete: function (results) {
            console.log(results);
            const items = results.data;
            items.sort((a, b) => a.ordre - b.ordre);
            dataEtape.push(results.data);
            addStep(items);
        }
    });

    Papa.parse(' https://docs.google.com/spreadsheets/d/e/2PACX-1vTMejdM_tVXKPm0vpS45-8CnHVQCtjGPUCl_G_7OoCm9uXhZY7TS7EnfBokrf-LQMyEgKMuR91MEGui/pub?gid=954920506&single=true&output=csv', {
        download: true,
        header: true,
        complete: function (results) {
            dataDocument.push(results.data);
            console.log(dataDocument);
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

            // mymap.setView(e.latlng, 14, {
            //     "animate": true,
            //     "pan": {
            //       "duration": 10
            //     }
            // });
        });
    
        mymap.on('onLocationError', (e) => {
            alert(e.message);
        });
    
        mymap.locate({maxZoom: 16});

        setTimeout(() => {
            resolve()
        }, 4000)
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


/*
    Détectection des coordonnées GPS au clique de l'utilisateur => provisoire
*/

// mymap.on('click', onMapClick);