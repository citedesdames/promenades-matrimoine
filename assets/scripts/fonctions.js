function onMapClick(e) {
    L.marker([e.latlng.lat, e.latlng.lng]).addTo(mymap)
        .bindPopup("Vous avez clické sur la carte à " + e.latlng.toString()).openPopup()
}

// function onMarkerClick(coord) {
//     let GPSMark = L.latLng(coord.latlng.lat + .005, coord.latlng.lng);
    
//     mymap.flyTo(GPSMark, 16, {
//         animate: true,
//         duration: 0.5
//     });

//     let knowMore = document.querySelector(".know-more");
//     knowMore.addEventListener('click', event => {
//         this.closePopup();
//         let markerRankNumber = markerArray.indexOf(mark);
        
//         // console.log(knowMore.getAttribute("ordre"));
//         // console.log(markerArray.indexOf(mark));
//         openShutter(shutter, markerRankNumber);
//     });
// }


function addStep(stepArray) {
    let markerArray = [];

    stepArray.map(step => {
        let mark = L.marker([`${step.latitude}`, `${step.longitude}`], {icon: stepIcon}).addTo(mymap)
            .bindPopup(`
                <div class="popup-photo">
                    <img src="./assets/images/paris-min.jpeg" alt="">
                    <span class="source-photo">${step.sourcePhoto}<span>
                </div>
                <div class="step">
                    <div class="popup-header">
                        <div class="step-icon">
                            <img src="./assets/images/maps-and-flags.svg" alt="">
                        </div>
                        <div class="step-name">
                            <h3>${step.nom}</h3>
                        </div>
                    </div>
                    
                    <div class="popup-description">
                        <p>${step.description}</p>
                        <div class="author">${step.auteur}</div>
                    </div>

                    <button class="know-more" ordre="${step.ordre}">En savoir plus</button>
                </div>
            `).on("click", function(coord) {
                let GPSMark = L.latLng(coord.latlng.lat + .005, coord.latlng.lng);
    
                mymap.flyTo(GPSMark, 16, {
                    animate: true,
                    duration: 0.5
                });
            
                let knowMore = document.querySelector(".know-more");
                knowMore.addEventListener('click', event => {
                    this.closePopup();
                    let markerRankNumber = markerArray.indexOf(mark);
                    
                    // console.log(knowMore.getAttribute("ordre"));
                    // console.log(markerArray.indexOf(mark));
                    openShutter(shutter, markerRankNumber);
                });

            });

            let shutterContent = document.createElement("div");
            shutterContent.classList.add('shutter-content');
            shutterContent.setAttribute("shuter_id_etape", `${step.ordre}`);

            let newContent = `
                <div class="step-address">
                    <img src="assets/images/gps.svg" alt="">
                    <div class="address">${step.adresse}</div>
                </div>
                <h2>L’<span>héritage</span> culturel du <span>${step.nom}</span>.</h2>

                <div class="doc-header">
                    <h3>Documents sur ce lieu</h3>
                    <div class="doc-list"><span class="doc-number"></span></div>
                </div>

                <div class="step-document" document_id_etape=${step.ordre}></div>
                <a href="" class="augmented-reality-link">
                    <div class="augmented-reality-btn">
                        <img src="assets/images/photo-camera.svg" alt="">
                        <span>Appareil photo</span>
                    </div>
                </a>`;

            let stepRoute = document.createElement("div");
            stepRoute.classList.add('step-route');
            let newStep = `
                <div class="dot"></div>
                <div class="step-route-info">

                        <div class="step-photo">
                            <img src="assets/images/photo-camera.svg" alt="">
                        </div>
                        <div class="step-route-address">
                            <div>
                                <span class="location">${step.nom}</span>
                                <span class="distance">2 Km</span>
                            </div>
                            <p>${step.adresse}</p>
                        </div>
                </div>
            `;

            shutterContent.innerHTML = newContent;
            shutterPage.append(shutterContent);
            stepRoute.innerHTML = newStep;
            route.append(stepRoute);
        
            markerArray.push(mark);
    });

    console.log(markerArray);
    
    for (let i = 0; i < stepArray.length - 1; i++) {
        var latlngs = [
            [`${stepArray[i].latitude}`, stepArray[i].longitude],
            [`${stepArray[i+1].latitude}`, stepArray[i+1].longitude],
        ];

        L.polyline(latlngs, {
            color: '#DD6262',
            // color: '#B55050'
        }).addTo(mymap);
    }
}

function onLocationFound(e) {
    // radius = 0;
    // positionUser.removeLayer();
    // accuracy.removeLayer();

    window.navigator.vibrate(300);
    radius = e.accuracy;
    positionUser = L.marker(e.latlng, {icon: userIcon}).addTo(mymap)
        .bindPopup("Vous êtes ici ! à " + e.latlng).openPopup();
    accuracy = L.circle(e.latlng, radius).addTo(mymap);

    if (firstGeoloc == true) {
        mymap.setView(e.latlng, 16, {
            "animate": true,
            "pan": {
              "duration": 10
            }
        });
    }

    dataEtape.map(step => {
        // console.log(step);
        let start = positionUser.getLatLng();
        let end = {
            lat: step.latitude,
            lng: step.longitude
        };
        distance = Math.round(start.distanceTo(end));
        console.log(distance);

        verifyPosition(step);
    });


    // let distanceStroke = L.polyline([]).addTo(mymap);
    // let marker2 = L.marker([48.853364, 2.428365], {draggable: "true"}).bindPopup("").addTo(mymap);
    
    // positionUser.on('dragend', findrag);
    // marker2.on('dragend', findrag);
    // positionUser.on('drag', deplacement);
    // marker2.on('drag', deplacement);

    // function findrag(e) {
    //     console.log(e);
    //     let mark = e.target;
    //     let start = positionUser.getLatLng();
    //     let end = marker2.getLatLng();
    //     // console.log(end);
    //     distance = Math.round(start.distanceTo(end));
    //     mark.getPopup().setContent('Distance = '+distance+' m');
    //     mark.openPopup();
        
    //     verifyPosition();
    // }
        
    // function deplacement(e) {
    //     distanceStroke.setLatLngs([positionUser.getLatLng(), marker2.getLatLng()]);
    // }
    
    firstGeoloc = false;
}

function onLocationError(e) {
    alert(e.message);
}

function locateUser() {
    if (positionUser) {
        // mymap.removeLayer(positionUser);
        // mymap.removeLayer(accuracy);
        mymap.locate({maxZoom: 16});
        console.log("Position utilisateur mise à jour")
    }
}

function verifyPosition(step) {
    let notif = document.querySelector('.notification');
    let allAugRealLinks = document.querySelectorAll('.augmented-reality-link');
    let stepAddress = document.querySelector('.position');

    if(distance < 5599 && isClose == false) {
        stepAddress.innerHTML = step.nom;
        notif.style.top = "12px";
        allAugRealLinks.forEach(function(i) {
            i.style.display = "initial";
        });

        // Ne marche que si l'utilisateur attends que les étapes soient chargées
        document.querySelector('.btn-close').addEventListener('click', function () {
            notif.style.top = "-20%";
        })
        setTimeout(() => {
            notif.style.top = "-20%";
        }, 5000)
        isClose = true;
    } else if (distance < 5599 && isClose == true) {
        isClose = true;
    } else if(distance > 5599) {
        isClose = false;
        allAugRealLinks.forEach(function(i) {
            i.style.display = "none";
        });
    }
    
    console.log(isClose);
}

function updateOpacity(value) {
    for (const property in fondsDeCarte) {
        // console.log(`${property}: ${fondsDeCarte[property]}`);
        console.log(value);
        fondsDeCarte[property].setOpacity(value)
        document.querySelector('.range-value').innerHTML = value;
      }
}

function openShutter(element, rank) {
    let stepDocumentChildrens = document.querySelectorAll(".shutter-content");
    if(!element.classList.contains("open")) {
        header.classList.add("closed");
        setTimeout(() => {
            element.classList.add("open");
        }, 350)
        
        for (let i = 0; i < stepDocumentChildrens.length; i++) {
            if(stepDocumentChildrens[i].getAttribute("shuter_id_etape") == rank + 1) {
                routeSection.classList.add("hidden");
                stepDocumentChildrens[i].classList.add("reveal");
                
                let elementList = stepDocumentChildrens[i].childNodes;
                let docNumber = elementList[7].childNodes.length;
                let childNumber = elementList[5].childNodes;
                childNumber[3].firstChild.innerHTML = docNumber;
            }
        }
    } else {
        element.classList.remove("open");
        setTimeout(() => {
            header.classList.remove("closed");
        }, 350)
        setTimeout(() => {
            for (let i = 0; i < stepDocumentChildrens.length; i++) {
                stepDocumentChildrens[i].classList.remove("reveal");
            }
            routeSection.classList.remove("hidden");
        }, 1200)

        mymap.flyTo(mymap.getCenter(), 13, {
            animate: true,
            duration: 1.5
        });
    }
}

function addDocuments(docArray, damesArray) {
    let shutterChildrens = document.querySelectorAll(".step-document");
    let docContent = docArray.map(doc => {
        // console.log(docArray.indexOf(`${doc.id_dame}`));
        console.log(`${doc.id_dame}`);
        // console.log(damesArray.map(function(e) { return e.identifiant; }).indexOf(`${doc.id_dame}`));

        let a = damesArray.map(e => { 
            return e.identifiant; 
        }).indexOf(`${doc.id_dame}`);
        console.log(a);

        for (let i = 0; i < shutterChildrens.length; i++) {

            if(shutterChildrens[i].getAttribute("document_id_etape") == `${doc.id_etape}`) {
                let docContent = document.createElement("div");
                docContent.classList.add('document');
                docContent.setAttribute("id_etape", `${doc.id_etape}`);
        
                let cardContent = `
                    <div>
                        <div class="dot"></div>
                        <div class="photo-doc">
                            <img src="${damesArray[a].portrait}" alt="">
                        </div>
                        <div class="doc-content">
                            <span>${doc.type}</span>
                            <p>${doc.titre}</p>
                        </div>
                    </div>`;

                let mainContent;

                if(`${doc.type}` == 'citation') {
                    mainContent = `
                    <article class="informations hidden">
                        <div class="main-information">
                            <p>${doc.texte}</p>
                            <p class="source">${doc.source}</p>
                            <span>${doc.licence}</span>
                        </div>
                    </article>`;
                } else if(`${doc.type}` == 'vidéo'){
                    mainContent = `
                    <article class="informations video-type">
                        <div class="touch-bar"></div>
                        <div class="embed-vid">
                            <iframe frameborder="0" width="640" height="360" 
                                src="https://www.dailymotion.com/embed/video/${doc.URL.slice(doc.URL.length - 7, doc.URL.length)}" 
                                allowfullscreen 
                                allow="autoplay; fullscreen">
                            </iframe>
                        </div>
                        <div class="additional-infos">
                            <p>${doc.description}</p>
                            <p class="source">${doc.source}</p>
                            <div class="marquee-rtl">
                                <div><span>${doc.licence}</span></div>
                            </div>
                        </div>
                    </article>`;
                } else if (`${doc.type}` == 'article') {
                    mainContent = `
                    <article class="informations hidden">
                        <div class="card-preview">
                            <div>
                                <h3>${doc.description}</h3>
                                <span class="source">${doc.licence}</span>
                            </div>
                            <div class="preview">
                                <div class="shadow">
                                    <a href="">Poursuivre vers le site</a>
                                </div>
                                <iframe src="${doc.URL}" frameborder="0">
                                </iframe>
                            </div>
                        </div>
                    </article>`;
                } else {
                    mainContent = `
                    <article class="informations hidden">
                        <div class="main-information">
                            <p>${doc.description}</p>
                            <p class="source">${doc.source}</p>
                            <span>${doc.licence}</span>
                        </div>
                    </article>`;
                }

                let newContent = cardContent + mainContent;
                docContent.innerHTML = newContent;
                shutterChildrens[i].append(docContent);
            }
        }
    });
}

function openFullscreen() {
    if (appUserInterface.requestFullscreen) {
        console.log('ok');
        appUserInterface.requestFullscreen();
    } else if (appUserInterface.webkitRequestFullscreen) { /* Safari */
        appUserInterface.webkitRequestFullscreen();
    } else if (appUserInterface.msRequestFullscreen) { /* IE11 */
        appUserInterface.msRequestFullscreen();
    }
}

function youtube_parser(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    console.log(match);
    return (match&&match[7].length==11)? match[7] : false;
}