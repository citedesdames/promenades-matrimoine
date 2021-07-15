// import { startApp } from './fonctions.js';

// ============================================================
//
// Déclaration des variables essentielles au bon fonctionnement
// de l'application.
//
// Initialisation et paramétrage de la carte Leaflet
//
// =============================================================

const STORAGE_KEY = 'matrimoine:promenade';
let PROMENADE = getPromenadeFromStorage();

let sudOuest,
    nordEst,
    stepIcon,
    bounds,
    mymap,
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

let isClose = false,
    isCloseArray = [],
    firstGeoloc = true;

let etapeData,
    etapeDataReverse,
    documentData,
    damesData,
    strollData,
    markerArray;

let fondsDeCarte = {};
let enabledSettings = [];


document.documentElement.style.setProperty('--inner-width', window.innerWidth + "px");
document.documentElement.style.setProperty('--inner-height', window.innerHeight + "px");



// ===============================
//
// Icônes, tiles et carte Leaflet.
//
// ===============================



let userIcon = L.icon({
    iconUrl: 'assets/images/user-marker-leaflet.png',

    iconSize:     [25, 28], // size of the icon
    iconAnchor:   [12.5, 27], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, -24] // point from which the popup should open relative to the iconAnchor
});

let googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
    maxZoom: 19,
    subdomains:['mt0','mt1','mt2','mt3']
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
});



// ============================================================
//
// Principales fonctionnalités liés à des écouteurs d'évènement.
//
// ============================================================



notchBtn.addEventListener('click', event => {
    toggleShutter(shutter);
});
closeBtn.addEventListener('click', event => {
    toggleShutter(shutter);
});
layerBtn.addEventListener('click', function() {
    toggleLayers(this);
});
fullScreenBtn.addEventListener('click', event => {
    toggleFullScreen(appUserInterface);
});
locateBtn.addEventListener('click', event => {
    mymap.locate({maxZoom: 16});
    mymap.on('locationfound', onLocationFound);
    mymap.on('locationerror', onLocationError);
    if (positionUser) {
        mymap.setView(positionUser._latlng, 16, {
            "animate": true,
            "pan": {
              "duration": 10
            }
        });
        // console.log(positionUser._latlng);
    }
    if(firstGeoloc == true) {
        console.log('passed');
        setInterval(function(){ 
            mymap.locate({maxZoom: 16});
            mymap.on('locationfound', onLocationFound);
            mymap.on('locationerror', onLocationError);
        }, 4000);
    }
});



// ===================================================================================
//
// *IMPORTANT* Démarrage de l'application
// 
// Chargement des données depuis le fichier CONFIG.JSON, dont celle à parser, détection
// de la position de l'utilisateur.
//
// ====================================================================================



let url = window.location.href.split('?'),
    url2,
    params;

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

fetch('./config.json')
  .then((response) => {
    //console.log(response)
    return response.json()
  })
  .then((data) => {
    Papa.parse(data[params.stroll], {
        download: true,
        header: true,
        complete: function (results) {
            console.log(PROMENADE[0]);
            //console.log("results");
            //console.log(results);
            strollData = convertToJson(results.data);
            //console.log("strollData");
            //console.log(strollData);
            startApp(strollData);
        }
    });
});

// fetchDataFromConfig()
//     .then((data) => {
//         console.log('c bueno');
//         // console.log(data)
//         startApp(data);
//         console.log(etapeData)
//     })


setTimeout(() => {
    console.log(etapeData);
    console.log(etapeDataReverse);
    
    for (var i = 0; i < etapeData.length; ++i) { isCloseArray.push(false); }

    addStepRoute(etapeDataReverse);
    addStep(etapeData);
    addDocuments(documentData, damesData);
    addDames(damesData);
    handlePermission();
    addFdC(fondsDeCarte);

    const checkboxes = document.querySelectorAll(".radio-layer"); 
    checkboxes.forEach(checkbox => checkbox.addEventListener('change', () => {
        onCheckboxClick(checkboxes, enabledSettings, fondsDeCarte)
    }));

    const documentDiv = document.querySelectorAll(".document");
    documentDiv.forEach(doc => doc.addEventListener('click', () => {
        onDocumentClick(doc)
    }));

    const cards = document.querySelectorAll('.dame-btn');
    cards.forEach(card => card.addEventListener('click', onCardClick));

    const routeStep = document.querySelectorAll('.step-route-info');
    routeStep.forEach(step => step.addEventListener('click', () => {
        onRouteStepClick(step)
    }));

    const photoDoc = document.querySelectorAll('.photo-doc');
    photoDoc.forEach(photo => photo.addEventListener('click', function() {
        onPhotoDocClick(photo.getAttribute('identifiant'));
    }));

}, 2500)