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


function addDames(damesArray) {
    damesArray.map(dame => {
        let cardContent = document.createElement("div");
        cardContent.classList.add('dame-card');
        cardContent.setAttribute("id_dames", `${dame.identifiant}`);

        let dameCard = `
            <div class="dame-portrait" style="background-image: url('${dame.portrait}'); background-repeat: no-repeat; background-size: cover; center;"></div>
            <div class="dame-infos">
                <h3>${dame.prenom} ${dame.nom}</h3>
                <p>${dame.biographie.slice(0,100)}...</p>
            </div>
            <a href="">
                <div class="dame-btn">
                    <span>En savoir plus</span>
                </div>
            </a>`

        cardContent.innerHTML = dameCard;
        document.querySelector('.dame-slider').append(cardContent);
        // document.querySelector('.dame-portrait').style.backgroundImage = `url('${dame.portrait}')`;
    })
}


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
                // if(innerHeight < 500) {
                //     header.classList.add("closed");
                //     console.log(document.querySelector('.popup-description'));
                // }

                // if(!document.querySelector('.dame-slider-container').classList.contains('hidden-card')) {
                //     document.querySelector('.dame-slider-container').classList.add('hidden-card');
                // } else {
                //     document.querySelector('.dame-slider-container').classList.remove('hidden-card');
                // }

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
                // setTimeout(() => {
                //     document.querySelector("*:not([leaflet-popup])").addEventListener('click', function() {
                //         console.log("lkhlkusd");
                //         header.classList.remove("closed");
                //         document.querySelector("*:not([leaflet-popup])").removeEventListener('click', function() {})
                //     })
                // }, 100)
            }).on('remove', function() {
                console.log("lkhlkusd");
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
                <div class="step-indicator"></div>
                <div class="step-route-info">

                        <div class="step-photo">
                            <img src="assets/images/photo-camera.svg" alt="">
                        </div>
                        <div class="step-route-address">
                            <div>
                                <span class="location">${step.nom}</span>
                                <span class="distance"></span>
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
    if(radius && positionUser && accuracy) {
        radius = 0;
        mymap.removeLayer(positionUser);
        mymap.removeLayer(accuracy);
    } else if (firstGeoloc == true) {
        mymap.setView(e.latlng, 16, {
            "animate": true,
            "pan": {
              "duration": 10
            }
        });
    }

    window.navigator.vibrate(300);
    let distanceArray = [],
        allDstIndicator = document.querySelectorAll('.distance');

    radius = e.accuracy;
    accuracy = L.circle(e.latlng, radius, {
        weight: 0,
        fillOpacity: 0.35
    }).addTo(mymap);
    positionUser = L.marker(e.latlng, {icon: userIcon}).addTo(mymap);
    // positionUser = L.circle(e.latlng, {
    //     stroke: false,
    //     fillOpacity: 1,
    //     fillColor: '#589CF8',
    //     radius: 10
    // }).addTo(mymap);
    allDstIndicator.forEach(function(i) {
        i.style.display = "block";
    });

    dataEtape.map(step => {
        let start = positionUser.getLatLng();
        let end = {
            lat: step.latitude,
            lng: step.longitude
        };
        distance = Math.round(start.distanceTo(end));
        console.log(distance);
        // console.log(allDstIndicator[step.ordre]);
        if(distance > 1000) {
            allDstIndicator[step.ordre - 1].innerHTML = Math.round((distance/1000)*10)/10+ " Km";
        } else if (distance < 1000) {
            allDstIndicator[step.ordre - 1].innerHTML = distance + " m";
        }
        distanceArray.push(distance);
        verifyPosition(step);
    });

    let closest = distanceArray.indexOf(Math.min(...distanceArray));
    positionUser.bindPopup(`
        <div class="user-location">
            <h2> Vous êtes ici !</h2>
            <p>Étape la plus proche : ${dataEtape[closest].nom}.</p>
        </div>
    `).openPopup();
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
    let allAugRealLinks = document.querySelectorAll('.augmented-reality-link');
    let stepAddress = document.querySelector('.position');

    let test1 = 5599;
    let test2 = 17500;

    if(distance < test2 && isClose == false) {
        window.navigator.vibrate(300);
        stepAddress.innerHTML = step.nom;
        // notif.style.top = "12px";
        allAugRealLinks.forEach(function(i) {
            i.style.display = "initial";
        });

        Notification.requestPermission( function(status) {
            console.log(status); // les notifications ne seront affichées que si "autorisées"
            var n = new Notification(`À proximité de : ${step.nom}`, {
                body: "Accedez à des documents exclusifs via l'appareil photo de votre smartphone !"
            }); // this also shows the notification
        });

        // Ne marche que si l'utilisateur attends que les étapes soient chargées
        document.querySelector('.btn-close').addEventListener('click', function () {
            notif.style.top = "-24%";
        })
        setTimeout(() => {
            notif.style.top = "-24%";
        }, 5000)
        isClose = true;
    } else if (distance < test2 && isClose == true) {
        isClose = true;
    } else if(distance > test2) {
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
        document.querySelector('body').classList.remove("overflow");
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
        document.querySelector('body').classList.add("overflow");
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
        // console.log(`${doc.id_dame}`);
        let a = damesArray.map(e => { 
            return e.identifiant; 
        }).indexOf(`${doc.id_dame}`);
        // console.log(a);

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
                                allow="autoplay; fullscreen">
                            </iframe>
                        </div>
                        <div class="additional-infos">
                            <div class="marquee-rtl">
                                <div><span>${doc.licence}</span></div>
                            </div>
                            <p>${doc.description}</p>
                            <p class="source">${doc.source}</p>
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
                                    <a href="${doc.URL}" target="_blank">Poursuivre vers le site</a>
                                </div>
                                <iframe src="${doc.URL}" sandbox="allow-scripts" frameborder="0">
                                </iframe>
                            </div>
                        </div>
                    </article>`;
                } else if(`${doc.type}` == 'image') {
                    mainContent = `
                    <article class="informations hidden">
                    <div class="main-information">
                        <img src="${doc.URL}"></img>
                            <p>${doc.description}</p>
                            <p class="source">${doc.source}</p>
                            <span>${doc.licence}</span>
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

function handlePermission() {
    let allDstIndicator = document.querySelectorAll('.distance');
    navigator.permissions.query({name:'geolocation'}).then(function(result) {
        if (result.state == 'granted') {
            report(result.state);
            if(firstGeoloc == true) {
                console.log('non effectuée');
                allDstIndicator.forEach(function(i) {
                    i.style.display = "none";
                });
            } else if (firstGeoloc == false) {
                console.log('effectuée');
                allDstIndicator.forEach(function(i) {
                    i.style.display = "block";
                });
            }
        } else if (result.state == 'prompt') {
            report(result.state);
            allDstIndicator.forEach(function(i) {
                i.style.display = "none";
            });
        } else if (result.state == 'denied') {
            report(result.state);
            // geoBtn.style.display = 'inline';
            allDstIndicator.forEach(function(i) {
                i.style.display = "none";
            });
        }

        result.onchange = function() {
        report(result.state);
        }
    });
}

function report(state) {
    console.log('Permission ' + state);
}  