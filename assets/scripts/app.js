/*
    Déclaration des variabls relatives aux limites de la carte pour
    la première balades, déclaration de variables pour ciblage d'éléments.

    Initialisation et paramétrage de la carte Leaflet
*/

let sudOuest = L.latLng(48.815003, 2.227135),
    nordEst = L.latLng(48.902724, 2.488421),
    bounds = L.latLngBounds(sudOuest, nordEst),
    radius, positionUser, accuracy;

let appUserInterface = document.querySelector('html'),
    header = document.querySelector('header'),
    layerBtn = document.querySelector('.layers-ctrl-btn');
    locateBtn = document.querySelector('.locate-ctrl-btn'),
    fullScreenBtn = document.querySelector('.fullScreen-ctrl-btn'),
    range = document.querySelector(".range"),
    shutter = document.querySelector(".shutter"),
    notchBtn = document.querySelector(".notch"),
    closeBtn = document.querySelector(".close"),
    shutterPage = document.querySelector(".shutter-page"),
    route = document.querySelector(".route"),
    routeSection = document.querySelector(".route-section"),
    notif = document.querySelector('.notification');

let isClose = false; 
let isCloseArray = [];
let firstGeoloc = true;

let dataEtape,
    dataDocument,
    dataDames;

let fondsDeCarte; // Peut être provisoire
let enabledSettings = [];


document.documentElement.style.setProperty('--inner-width', window.innerWidth + "px");
document.documentElement.style.setProperty('--inner-height', window.innerHeight + "px");



/*
    Icônes, tiles et carte Leaflet.
*/


var stepIcon = L.icon({
    iconUrl: 'assets/images/marker-leaflet.png',

    iconSize:     [25, 39.1], // size of the icon
    iconAnchor:   [13, 38], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, -34] // point from which the popup should open relative to the iconAnchor
});

var userIcon = L.icon({
    iconUrl: 'assets/images/user-marker-leaflet.png',

    iconSize:     [25, 28], // size of the icon
    iconAnchor:   [12.5, 27], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, -24] // point from which the popup should open relative to the iconAnchor
});

let mymap = new L.Map('mapid', {
    center: bounds.getCenter(),
    zoom: 12,
    minZoom: 5,
    zoomControl: false,
    // maxBounds: bounds,
    maxBoundsViscosity: 0.5
});

let googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
    maxZoom: 19,
    subdomains:['mt0','mt1','mt2','mt3']
});

let Jawg_Streets = L.tileLayer('https://{s}.tile.jawg.io/jawg-streets/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
	attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	minZoom: 0,
	maxZoom: 22,
	subdomains: 'abcd',
	accessToken: 'PyTJUlEU1OPJwCJlW1k0NC8JIt2CALpyuj7uc066O7XbdZCjWEL3WYJIk6dnXtps'
});

let CartoDB_Voyager = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 19
});

let CartoDB_Positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 19
}).addTo(mymap);

fetch('./assets/scripts/itineraire-marguerite.geojson')
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        L.geoJSON(data).addTo(mymap);
    });



/*
    Principales fonctionnalités liés à des écouteurs d'évènement
*/


notchBtn.addEventListener('click', event => {
    openShutter(shutter);
});
closeBtn.addEventListener('click', event => {
    openShutter(shutter);
});
layerBtn.addEventListener('click', function() {
    toggleLayers(this);
});
fullScreenBtn.addEventListener('click', event => {
    openFullscreen();
});
locateBtn.addEventListener('click', event => {
    // console.log(firstGeoloc);
    // if(firstGeoloc == true) {
    //     mymap.locate({maxZoom: 16});
    //     mymap.on('locationfound', onLocationFound);
    //     mymap.on('locationerror', onLocationError);
    // } else if (firstGeoloc == false) {
    //     setInterval(function(){ 
    //         mymap.locate({maxZoom: 16});
    //         mymap.on('locationfound', onLocationFound);
    //         mymap.on('locationerror', onLocationError);
    //     }, 5000);
    // }
    setInterval(function(){ 
        mymap.locate({maxZoom: 16});
        mymap.on('locationfound', onLocationFound);
        mymap.on('locationerror', onLocationError);
    }, 5000);
});





/*
    Démarrage de l'application
    
    Chargement des données des CSV via la librairie Papa Parse, détection de la position
    de l'utilisateur et test provisoire de distance entre celle-ci et un marqueur donné
*/




let url = window.location.href.split('?');
let url2;
let params;

if(typeof url[1] == "undefined") {
    window.history.pushState({stroll: 0}, '', "?stroll=lesMarguerites");
    url2 = window.location.href.split('?');
  
    params = {
        "stroll": url2[1].split("=")[1],
    }
} else {
    url = url[1].split("&");
    if(url.length>1) {
        etape = url[1].split("=")[1];
    }
    params = {
        "stroll": url[0].split("=")[1],
    }
}

// Import des données depuis le fichier .JSON
fetch('./config.json')
  .then((response) => {
    return response.json()
  })
  .then((data) => {
      console.log(data);
        console.log(data[params.stroll][0]);
        Papa.parse(data[params.stroll][0].data[0], {
            download: true,
            header: true,
            complete: function (results) {
                const items = results.data;
                items.sort((a, b) => a.ordre - b.ordre);
                dataEtape = items;
                console.log(dataEtape);
                // addStep(items);
            }
        });
    
        Papa.parse(data[params.stroll][0].data[1], {
            download: true,
            header: true,
            complete: function (results) {
                dataDocument = results.data;
                console.log(dataDocument);
                // dataDocument.push(results.data);
            }
        })
        
        Papa.parse(data[params.stroll][0].data[2], {
            download: true,
            header: true,
            complete: function (results) {
                dataDames = results.data;
                console.log(dataDames);
                // dataDocument.push(results.data);
            }
        })

    if(params.stroll == "lesMarguerites") {
        let paris17 =  L.tileLayer('https://mapwarper.net/maps/tile/26642/{z}/{x}/{y}.png', {
            attribution: 'Tiles by <a href="http://mapwarper.net/maps/20531">Map Warper user sarahsimpkin</a>',
            minZoom: 1
        });

        let paris19 =  L.tileLayer('https://mapwarper.net/maps/tile/42383/{z}/{x}/{y}.png', {
            attribution: 'Tiles by <a href="http://mapwarper.net/maps/20531">Map Warper user sarahsimpkin</a>',
            minZoom: 1
        });

        fondsDeCarte = {
            "Paris17": paris17,
            "Paris19": paris19,
        };

        document.querySelector("header h1").textContent = "Promenade des Marguerite";
        document.querySelector(".premonade-rank").textContent = "01";
        
    } else if (params.stroll == "marcelineADouai") {
        let douais1824 =  L.tileLayer('https://mapwarper.net/maps/tile/57306/{z}/{x}/{y}.png', {
            attribution: 'Tiles by <a href="http://mapwarper.net/maps/57306">Map Warper user Gambette</a>',
            minZoom: 1
        });

        let douais1850 =  L.tileLayer('https://mapwarper.net/maps/tile/57303/{z}/{x}/{y}.png', {
            attribution: 'Tiles by <a href="http://mapwarper.net/maps/57303">Map Warper user Gambette</a>',
            minZoom: 1
        });

        fondsDeCarte = {
            "Douai en 1824": douais1824,
            "Douai en 1850": douais1850,
        };

        document.querySelector("header h1").textContent = "Sur les pas de Marceline Desbordes";
        document.querySelector(".premonade-rank").textContent = "02";
    }

    console.log(fondsDeCarte);
    addFdC(fondsDeCarte);
    let checkboxes = document.querySelectorAll(".radio-layer"); 
    checkboxes.forEach(checkbox => checkbox.addEventListener('change', function() {
        onCheckboxClick(checkboxes, enabledSettings, fondsDeCarte)
    }));
});


setTimeout(() => {
    for (var i = 0; i < dataEtape.length; ++i) { 
        isCloseArray.push(false);
    }
    // console.log(isCloseArray);
    addStep(dataEtape);
    addDocuments(dataDocument, dataDames);
    addDames(dataDames);
    handlePermission();

    let stepAddress = document.querySelector(".address");
    let documentDiv = document.querySelectorAll(".document");
    documentDiv.forEach(doc => doc.addEventListener('click', function() {
        onDocuemntClick(doc)
    }));

    const cards = document.querySelectorAll('.dame-btn');
    cards.forEach(card => card.addEventListener('click', onCardClick));

    const photoDoc = document.querySelectorAll('.photo-doc');
    photoDoc.forEach(photo => photo.addEventListener('click', function() {
        onPhotoDocClick(photo.getAttribute('identifiant'));
    }));

}, 2000)

/*
    Détectection des coordonnées GPS au clique de l'utilisateur => provisoire
*/

// mymap.on('click', onMapClick);