function onMapClick(e) {
    L.marker([e.latlng.lat, e.latlng.lng]).addTo(mymap)
        .bindPopup("Vous avez clické sur la carte à " + e.latlng.toString()).openPopup()
}

function onLocationFound(e) {
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
        let mark = L.marker([`${step.latitude}`, `${step.longitude}`], {icon: icon}).addTo(mymap)
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

                        <div class="photo-doc">
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

function verifyPosition() {
    if(distance < 150) {
        let btn = document.getElementById("btn");
        btn.classList.add("active");
    } else if(distance > 150) {
        let btn = document.getElementById("btn");
        btn.classList.remove("active");
    }
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

function addDocuments(docArray) {
    let shutterChildrens = document.querySelectorAll(".step-document");
    let docContent = docArray.map(doc => {
        for (let i = 0; i < shutterChildrens.length; i++) {

            if(shutterChildrens[i].getAttribute("document_id_etape") == `${doc.id_etape}`) {
                let docContent = document.createElement("div");
                docContent.classList.add('document');
                docContent.setAttribute("id_etape", `${doc.id_etape}`);
        
                let cardContent = `
                    <div>
                        <div class="dot"></div>
                        <div class="photo-doc">
                            <img src="assets/images/photo-camera.svg" alt="">
                        </div>
                        <div class="doc-content">
                            <span>${doc.type}</span>
                            <p>${doc.description}</p>
                        </div>
                    </div>`;

                let mainContent;

                if(`${doc.type}` == 'citation') {
                    mainContent = `
                    <article class="informations hidden">
                        <div class="main-information">
                            <p>${doc.texte}</p>
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
                            <span>${doc.source}</span>
                        </div>
                    </article>`;
                } else if (`${doc.type}` == 'article') {
                    mainContent = `
                    <article class="informations hidden">
                    <div class="card-preview">
                        <div class="preview">
                            <iframe src="${doc.URL}" frameborder="0"></iframe>
                        </div>
                    </div>
                    </article>`;
                } else {
                    mainContent = `
                    <article class="informations hidden">
                        <div class="main-information">
                            <p>${doc.source}</p>
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