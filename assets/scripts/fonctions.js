function onMapClick(e) {
    L.marker([e.latlng.lat, e.latlng.lng]).addTo(mymap)
        .bindPopup("Vous avez clické sur la carte à " + e.latlng.toString()).openPopup()
}


// ================================================================
//
// *IMPORTANT* Démarrage de l'application selon la promenade choisi
//
// ================================================================


function startApp(strollData) {
    // console.log(strollData[0].chemin_geojson)
    PROMENADE = [];
    PROMENADE.push(strollData[0])
    savePromenadeToStorage(PROMENADE);
    let currentStroll = JSON.parse(localStorage.getItem(STORAGE_KEY));
    
    sudOuest = L.latLng(currentStroll[0].bounds.sudOuest[0], currentStroll[0].bounds.sudOuest[1]);
    nordEst = L.latLng(currentStroll[0].bounds.nordEst[0], currentStroll[0].bounds.nordEst[1]);
    bounds = L.latLngBounds(sudOuest, nordEst);
    mymap = new L.Map('mapid', {
        center: bounds.getCenter(),
        zoom: 12,
        minZoom: 5,
        zoomControl: false,
        maxBounds: bounds,
        maxBoundsViscosity: 0.5
    });
    stepIcon = L.icon({
        iconUrl: PROMENADE[0].icone_marqueur,
    
        iconSize:     [32, 32], // size of the icon
        iconAnchor:   [16, 38], // point of the icon which will correspond to marker's location
        popupAnchor:  [0, -34] // point from which the popup should open relative to the iconAnchor
    });
    CartoDB_Positron.addTo(mymap);
    L.geoJSON(strollData[0].chemin_geojson, {
        style: function(){
            return { color: '#A1C6B9' }
        }
    }).addTo(mymap);

    Papa.parse(currentStroll[0].data[0], {
        download: true,
        header: true,
        complete: function (results) {
            const items = results.data;
            items.sort((a, b) => a.ordre - b.ordre);
            etapeData = items;
        }
    });
            
    Papa.parse(currentStroll[0].data[1], {
        download: true,
        header: true,
        complete: function (results) {
            documentData = results.data;
        }
    });
    
    Papa.parse(currentStroll[0].data[2], {
        download: true,
        header: true,
        complete: function (results) {
            damesData = results.data;
        }
    });

    // console.log(fondsDeCarte)
    // console.log(currentStroll[0].fonds_de_carte)
    
    if(currentStroll[0].fonds_de_carte != 'undefined') {
        let tmpObj = currentStroll[0].fonds_de_carte;
        for (const [key, value] of Object.entries(tmpObj)) {
            tmpObj[key] = L.tileLayer(value.src, {
                attribution: value.attribution,
                minZoom: 1
            });
        }
        
        // console.log(tmpObj);
        Object.assign(fondsDeCarte, tmpObj);
    }

    document.querySelector("header h1").textContent = currentStroll[0].titre;
    document.querySelector(".route-section h2").textContent = currentStroll[0].titre;
    document.querySelector(".route-section p").textContent = currentStroll[0].description;
    document.querySelectorAll(".premonade-rank").forEach(rank => {
        currentStroll[0].id < 10 ? rank.textContent = '0' + currentStroll[0].id : rank.textContent = currentStroll[0].id;
    })
    
    // console.log(fondsDeCarte)
}

function catchStrollDataFromStorage() {

}


// ==========================================================
//
// Fonctions génétrices des Étapes, des Documents et des Daes
//
// ==========================================================


function addDames(damesArray) {
    damesArray.forEach(dame => {
        let cardContent = document.createElement("div");
        cardContent.classList.add('dame-card');
        cardContent.setAttribute("identifiant", `${dame.identifiant}`);

        let dameCard = `
            <div class="dame-portrait">
                
                <img src="${dame.portrait}" alt=""></img>
            </div>
            <div class="dame-infos">
                <h3>${dame.prenom} ${dame.nom}</h3>
                <p>${dame.biographie.slice(0,100)}...</p>
            </div>
            <button class="dame-btn">
                    <span>En savoir plus</span>
            </button>`

        cardContent.innerHTML = dameCard;
        document.querySelector('.dame-slider').append(cardContent);
    })
    toggleCard(true);
}


function addStep(stepArray) {
    let markerArray = [];

    stepArray.forEach(step => {
        let mark = L.marker([`${step.latitude}`, `${step.longitude}`], {icon: stepIcon}).addTo(mymap)
            .bindPopup(`
                <div class="popup-photo">
                    <img src="${step.photo}" alt="">
                    <span><a href="${step.sourcePhoto}" target="_blank">Aller à la source</a><span>
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

                    <button class="know-more" ordre="${step.ordre}">En savoir plus<img src="./assets/images/exit-top-right.svg" alt=""></img></button>
                </div>
            `, {closeOnClick: false}).on("click", function(coord) {
                // if(innerHeight < 500) {
                //     header.classList.add("closed");
                //     console.log(document.querySelector('.popup-description'));
                // }

                let GPSMark = L.latLng(coord.latlng.lat + .0046, coord.latlng.lng);
    
                mymap.flyTo(GPSMark, 16, {
                    animate: true,
                    duration: 0.5
                });
            
                let knowMore = document.querySelector(".know-more");
                knowMore.addEventListener('click', event => {
                    this.closePopup();
                    toggleCard(false);
                    let markerRankNumber = markerArray.indexOf(mark);
                    openShutter(shutter, markerRankNumber);
                });
                // setTimeout(() => {
                //     document.querySelector("*:not([leaflet-popup])").addEventListener('click', function() {
                //         console.log("lkhlkusd");
                //         header.classList.remove("closed");
                //         document.querySelector("*:not([leaflet-popup])").removeEventListener('click', function() {})
                //     })
                // }, 100)
            });

            let shutterContent = document.createElement("div");
            shutterContent.classList.add('shutter-content');
            shutterContent.setAttribute("shuter_id_etape", `${step.ordre}`);

            let newContent = `
                <div class="step-address">
                    <img src="assets/images/gps.svg" alt="">
                    <div class="address">${step.adresse}</div>
                </div>
                <h2>${step.ordre == 1 ? `${step.ordre}<sup>ère</sup>` : `${step.ordre}<sup>e</sup>`} étape : <span>${step.nom}</span>.</h2>

                <div class="doc-header">
                    <h3>Documents sur ce lieu :</h3>
                    <div class="doc-list"><span class="doc-number"></span></div>
                </div>

                <div class="step-document" document_id_etape=${step.ordre}></div>
                <a href="" class="augmented-reality-link" target="_blank">
                    <div class="augmented-reality">
                        <img src="assets/images/photo-camera.svg" alt="">
                        <span>Sortez l'appareil photo !</span>
                    </div>
                </a>`;

            let stepRoute = document.createElement("div");
            stepRoute.classList.add('step-route');
            let newStep = `
                <div class="step-indicator"></div>
                <div class="step-route-info" id_step="${step.ordre}">
                    <div class="step-photo">
                        <img src="${step.photo}" alt=""></img>
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

    markerArray.forEach((i) => {
        i.addEventListener('click', function() {
            checkPopupState(i);
            document.querySelector('.leaflet-popup-close-button').addEventListener('click', function() {
                checkPopupState(i);
            })
        })
    })
}

function addDocuments(docArray, damesArray) {
    let shutterChildrens = document.querySelectorAll(".step-document");
    let docContent = docArray.forEach(doc => {
        let a = damesArray.map(e => { 
            return e.identifiant; 
        }).indexOf(`${doc.id_dame}`);

        for (let i = 0; i < shutterChildrens.length; i++) {

            if(shutterChildrens[i].getAttribute("document_id_etape") == `${doc.id_etape}`) {
                let docContent = document.createElement("div");
                docContent.classList.add('document');
                docContent.setAttribute("id_etape", `${doc.id_etape}`);
        
                let cardContent = `
                    <div>
                        <div class="dot"></div>
                        <div class="photo-doc" identifiant="${damesArray[a].identifiant}">
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
                            <p class="desc">${doc.texte}</p>
                            <p class="source">${addHref(doc.source)}</p>
                            <span>${doc.licence}</span>
                        </div>
                    </article>`;
                } else if(`${doc.type}` == 'extrait') {
                    mainContent = `
                    <article class="informations hidden">
                        <div class="main-information">
                            <p class="desc">${doc.description}</p>
                            <p class="source">${addHref(doc.source)}</p>
                            <span>${doc.licence}</span>
                        </div>
                    </article>`;
                } else if(`${doc.type}` == 'vidéo' && doc.URL.includes("dailymotion")){
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
                            <p class="desc">${doc.description}</p>
                            <p class="source">${doc.source}</p>
                        </div>
                    </article>`;
                } else if(`${doc.type}` == 'vidéo' && doc.URL.includes("youtube")) {
                    mainContent = `
                    <article class="informations video-type">
                        <div class="touch-bar"></div>
                        <div class="embed-vid">
                            <iframe frameborder="0" width="640" height="360" 
                                src="https://www.youtube.com/embed/${youtube_parser(doc.URL)}" 
                                allow="autoplay; fullscreen">
                            </iframe>
                        </div>
                        <div class="additional-infos">
                            <div class="marquee-rtl">
                                <div><span>${doc.licence}</span></div>
                            </div>
                            <p class="desc">${doc.description}</p>
                            <p class="source">${doc.source}</p>
                        </div>
                    </article>`;
                } else if (`${doc.type}` == 'article' || `${doc.type}` == 'texte') {
                    mainContent = `
                    <article class="informations hidden">
                        <div class="card-preview">
                            <div>
                                <h3>${doc.description}</h3>
                                <span class="source">${addHref(doc.source)}</span>
                            </div>
                            <div class="preview">
                                <div class="shadow">
                                    <a href="${doc.URL}" target="_blank">Clickez pour poursuivre vers le site</a>
                                </div>
                                <iframe src="${doc.URL}" sandbox="allow-scripts" frameborder="0">
                                </iframe>
                            </div>
                            <span>${doc.licence}</span>
                        </div>
                    </article>`;
                } else if(`${doc.type}` == 'image') {
                    mainContent = `
                    <article class="informations hidden">
                    <div class="main-information">
                        <img src="${doc.URL}"></img>
                            <p class="desc">${doc.description}</p>
                            <p class="source">${addHref(doc.source)}</p>
                            <span>${doc.licence}</span>
                        </div>
                    </article>`;
                } else {
                    mainContent = `
                    <article class="informations hidden">
                        <div class="main-information">
                            <p class="desc">${doc.description}</p>
                            <p class="source">${doc.source}</p>
                            <span>${addHref(doc.licence)}</span>
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


// ==================================================================================
//
// Fonctions retives au positionnement de l'utilisateur, coordonnées GPS et distances
//
// ==================================================================================


function onLocationFound(e) {
    console.log(e)
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

    let distanceArray = [],
        allDstIndicator = document.querySelectorAll('.distance');
    
    // console.log(allDstIndicator);

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

    etapeData.map(step => {
        let start = positionUser.getLatLng();
        let end = {
            lat: step.latitude,
            lng: step.longitude
        };
        distance = Math.round(start.distanceTo(end));
        // console.log(distance);

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
            <p>Étape la plus proche : ${etapeData[closest].nom}.</p>
        </div>
    `);
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
        mymap.on('locationfound', onLocationFound);
        mymap.on('locationerror', onLocationError);
        console.log("Position utilisateur mise à jour")
    }
}

function verifyPosition(step) {
    // console.log(isCloseArray);
    let pst = etapeData.indexOf(step);
    // console.log(isCloseArray[pst])
    let allAugRealLinks = document.querySelectorAll('.augmented-reality-link');
    let stepAddressInNotif = document.querySelector('.position');

    let test1 = 30;
    let test2 = 20000;

    if(distance < test1 && isCloseArray[pst] == false) {
        console.log("condition 1");

        console.log(step.nom)
        window.navigator.vibrate(300);
        stepAddressInNotif.innerHTML = step.nom;
        notif.style.top = "12px";
        allAugRealLinks.forEach(function(i) {
            i.style.display = "initial";
            i.setAttribute('location', 'near')
        });

        Notification.requestPermission( function(status) {
            // console.log(status); // les notifications ne seront affichées que si "autorisées"
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
        isCloseArray[pst] = true;
    } else if(distance < test1 && isCloseArray[pst] == true) {
        // console.log("condition 2");

        isCloseArray[pst] = true;
        // console.log('Already close to step no need to notif the user');
    } else if(distance > test1) {
        // console.log("condition 3");

        isCloseArray[pst] = false;
        allAugRealLinks.forEach(function(i) {
            i.style.display = "none";
            i.setAttribute('location', 'away')
        });
    }
    
    // console.log(isClose);
}


// =======================================================
//
// Mise à jour de l'opacité des fonds de carte historiques
//
// =======================================================


function updateOpacity(value) {
    for (const property in fondsDeCarte) {
        // console.log(value);
        fondsDeCarte[property].setOpacity(value)
        document.querySelector('.range-value').innerHTML = value;
    }
}

// ==============================================================
//
// Ouverture du volet latéral droit contenant étapes ou documnets
//
// ==============================================================


function openShutter(element, rank) {
    let stepDocumentChildrens = document.querySelectorAll(".shutter-content");
    if(!element.classList.contains("open")) {
        toggleControls(false);
        toggleCard(false);
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

                setTimeout(() => {
                    if(elementList[9].getAttribute('location') == 'near') {
                        elementList[9].style.bottom = "25px";
                    }
                }, 600)
            }
        }
    } else {
        document.querySelector('body').classList.add("overflow");
        element.classList.remove("open");
        setTimeout(() => {
            header.classList.remove("closed");
            toggleCard(true);
            toggleControls(true);
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


// ==================================
//
// Déploiement des documents au click
//
// ==================================


function onDocuemntClick(doc) {
    if(doc.childNodes[3].classList.contains("hidden")) {
        doc.childNodes[3].classList.remove("hidden");
    } else if (doc.childNodes[3].classList.contains("video-type")) {
        if (doc.childNodes[3].classList.contains("video-reveal")) { // rajouter condition && pour audio-type à l'avenir
            doc.childNodes[3].classList.remove("video-reveal");
        } else {
            doc.childNodes[3].classList.add("video-reveal");
        }
    } else {
        doc.childNodes[3].classList.add("hidden");
    }
}


// =================================
//
// Mode plein écran de l'application
//
// =================================


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
    return (match&&match[7].length==11)? match[7] : false;
}

function handlePermission() {
    let allDstIndicator = document.querySelectorAll('.distance');
    navigator.permissions.query({name:'geolocation'}).then(function(result) {
        if (result.state == 'granted') {
            report(result.state);
            if(firstGeoloc == true) {
                allDstIndicator.forEach(function(i) {
                    i.style.display = "none";
                });
            } else if (firstGeoloc == false) {
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
    // if(state == 'granted') {
    //     return true;
    // } else if (state == 'prompt' || state == 'denied') {
    //     return false;
    // }
}  

function checkPopupState(popup) {
    console.log(popup);
    if(popup.isPopupOpen() == true) {
        toggleControls(false);
        toggleCard(false);
        header.classList.add('closed');
    } else if (popup.isPopupOpen() == false) {
        toggleControls(true);
        toggleCard(true);
        header.classList.remove('closed');
    }
}

function toggleCard(state) {
    if(state == false) {
        document.querySelectorAll('.dame-card').forEach((card,i) => 
            setTimeout(() => {
                card.style.bottom = "-175px";
                // console.log(card);
            }, i * 125)
        )
        setTimeout(() => {
            document.querySelector('.dame-slider-container').style.bottom = "-100%";
            setTimeout(() => {
                document.querySelector('.dame-slider-container').style.display = "none";
            }, 250);
        }, 250);
    } else if(state == true) {
        document.querySelector('.dame-slider-container').style.cssText = "display: grid; bottom: 0;";
        document.querySelectorAll('.dame-card').forEach((card,i) => 
            setTimeout(() => {
                card.style.bottom = "0px";
                // console.log(card);
            }, i * 125)
        )
    }
}


function toggleControls(state) {
    if(state == false) {
        document.querySelectorAll('[class*="-ctrl-btn"]').forEach((ctrl,i) => 
            setTimeout(() => {
                ctrl.style.transform = "translateX(-125%)";
            }, i * 100)
        )
        setTimeout(() => {
            range.style.left = "-100%";
            document.querySelector('.controllers').style.display = "none";
        }, 350);
    } else if(state == true) {
        if(!document.getElementById('noLayer').checked) {         
            range.style.left = "-82px";
        }
        document.querySelector('.controllers').style.display = "block";
        document.querySelectorAll('[class*="-ctrl-btn"]').forEach((ctrl,i) => 
            setTimeout(() => {
                ctrl.style.transform = "translateX(0px)";
            }, i * 100)
        )
    }
}

function toggleLayers(layers) {
    // console.log(layers.childNodes)
    if(!layers.childNodes[3].classList.contains("hidden")) {
        document.querySelector('.layers-choice').classList.add("hidden");
        layers.childNodes[1].classList.remove("hidden");
        layers.classList.remove("layers-extend");
    } else {
        layers.classList.add("layers-extend");
        layers.childNodes[1].classList.add("hidden");
        document.querySelector('.layers-choice').classList.remove("hidden");
    }
}


// ===========================================================================
//
// Fonctions relatives à l'extension et au rétrécissement des cartes des Dames 
//
// ===========================================================================


const toggleExpansion = (element, to, duration = 300) => {
    return new Promise((res) => {
      element.animate([
        {
      top: to.top,
      left: to.left,
      width: to.width,
      height: to.height
        }
      ], {duration, fill: 'forwards', ease: 'ease-in'})
      setTimeout(res, duration);
    })
  }

  const fadeContent = (element, opacity, duration = 300) => {
      return new Promise(res => {
          [...element.children].forEach((child) => {
              requestAnimationFrame(() => {
                  child.style.transition = `opacity ${duration}ms linear`;
                  child.style.opacity = opacity;
              });
          })
          setTimeout(res, duration);
      })
  }

  const getCardContent = (damesArray, docArray, stepArray, id_dame, card) => {
    if(navigator.geolocation) {
        console.log('allowed access');
    }

    let tmpDame = [];
    damesArray.forEach(function(dame){
        if(id_dame == dame.identifiant) {
            console.log(dame);
            tmpDame.push(dame);
        }
    });
    
    return `
        <div class="card-header">
            <div class="pp" style="background-image: url('${tmpDame[0].portrait}'); background-repeat: no-repeat; background-size: cover; center;">
                <img src="${tmpDame[0].portrait}" alt=""></img>
            </div>
            <p>${addHref(tmpDame[0].source)}</p>
            <div class="header">
                <h1>${tmpDame[0].prenom} ${tmpDame[0].nom}</h1>
                <div>
                    <p><span>Née le :</span><br>${new Date(tmpDame[0].dateNaissance).toLocaleString().slice(0, 10)}</p>
                    <p><span>Décédée le :</span><br>${new Date(tmpDame[0].dateDeces).toLocaleString().slice(0, 10)}</p>
                </div>
            </div>
        </div>
        <div class="card-content">
            <p>${tmpDame[0].biographie}</p>
            <p class="source">${addHref(tmpDame[0].sourceBio)}</p>
            <section>
                <p>Apparait aux :</p>
            </section>
        </div>
    `;
  }

const onCardClick = async (e) => {
    toggleControls(false);
    header.classList.add('closed');
    notchBtn.style.left = '0px';

    const card = e.currentTarget.parentNode;
    let id = card.getAttribute("identifiant");
    console.log(card);
    console.log(id);
      
    let tmpIdStep = [];
    let tmpStep = [];
    documentData.forEach(function(item){
        if(id == item.id_dame) {
            console.log(item.id_etape);
            console.log(document.querySelector(`[id_step='${item.id_etape}']`))
            if(!tmpIdStep.includes(`${item.id_etape}`)) {
                tmpIdStep.push(`${item.id_etape}`);
                tmpStep.push(document.querySelector(`[id_step='${item.id_etape}']`).cloneNode(true));
            }
        }
    });
    console.log(tmpStep);


    // clone the card
    const cardClone = card.cloneNode();
    cardClone.classList.remove("card-dame");
    cardClone.classList.add("card-extend");
      
    // get the location of the card in the view
    const {top, left, width, height} = card.getBoundingClientRect();

    // position the clone on top of the original
    cardClone.style.position = 'fixed';
    cardClone.style.top = top + 'px';
    cardClone.style.left = left + 'px';
    cardClone.style.width = width + 'px';
    cardClone.style.height = height + 'px';

    // hide the original card with opacity
    card.style.opacity = '0';
    // add card to the same container
    card.parentNode.appendChild(cardClone);

    // create a close button to handle the undo
    // const closeButton = document.createElement('button');
    const closeButton = document.createElement("img");
    closeButton.setAttribute("src", "./assets/images/close.svg");
    // position the close button top corner
    closeButton.style = `
        position: fixed;
        z-index: 10000;
        top: 25px;
        right: 25px;
        width: 35px;
        height: 35px;
        padding: 10px;
        border-radius: 12px;
        background-color: #C9C9C9;
    `;

    // attach click event to the close button
    closeButton.addEventListener('click', async () => {
        // remove the button on close
        closeButton.remove();

        // remove the display style so the original content is displayed right
        cardClone.style.removeProperty('display');
        cardClone.style.removeProperty('padding');

        // show original card content
        [...cardClone.children].forEach(child => child.style.removeProperty('display'));
        fadeContent(cardClone, '0');

        // shrink the card back to the original position and size
        await toggleExpansion(cardClone, {top: `${top}px`, left: `${left}px`, width: `${width}px`, height: `${height}px`}, 300)
        // show the original card again
        card.style.removeProperty('opacity');
        // remove the clone card
        cardClone.remove();

        toggleControls(true);
        header.classList.remove('closed');
        notchBtn.style.left = '-30px';
    });


    // expand the clone card
    await toggleExpansion(cardClone, {top: 0, left: 0, width: '100vw', height: '100vh'});
    const content = getCardContent(damesData, documentData, etapeData, id, cardClone)

    // set the display block so the content will follow the normal flow in case the original card is not display block
    cardClone.style.display = 'block';
    cardClone.style.padding = '0';
      
    // append the close button after the expansion is done
    cardClone.appendChild(closeButton);
    cardClone.insertAdjacentHTML('afterbegin', content);
    // console.log(cardClone.childNodes[3]);
    console.log(cardClone.childNodes[3].querySelector('section'));
    tmpStep.forEach(function(item, i){
        setTimeout(() => {
            item.style = `
                width: 100%;
                margin: 15px 0;
            `;
            cardClone.childNodes[3].querySelector('section').append(item);
        }, i * 200)
    });
};

function onPhotoDocClick(id) {
    openShutter(shutter);
    toggleControls(true);
    toggleCard(true);
    console.log(id);
    setTimeout(() => {
        document.querySelectorAll('.dame-card').forEach(function(card,i) {
            if(card.getAttribute('identifiant') == id) {
                document.querySelector('.dame-slider-container').scrollTo({
                    left:  card.offsetLeft - 40,
                    behavior: 'smooth'
                })
                card.classList.add('bounce');
                setTimeout(() => {
                    card.classList.remove('bounce');
                    card.lastChild.click();
                }, 1700)
            }
        })
    }, 800);
  }

function addHref(str) {
    if(str.includes("a href")) {
        let link = str.split('">');
        return link[0] + ' "target="_blank">' + link[1];
    } else {
        return str;
    }
}

function callDad(src, dest, sort) {
    if(sort == true) {
        Papa.parse(src, {
            download: true,
            header: true,
            complete: function (results) {
                const items = results.data;
                items.sort((a, b) => a.ordre - b.ordre);
                dest = items;
                console.log(dest);
                // addStep(items);
            }
        });
    } else if(sort == false || sort == 'undefined') {
        Papa.parse(src, {
            download: true,
            header: true,
            complete: function (results) {
                dest = results.data;
                console.log(dest);
                // documentData.push(results.data);
            }
        });
    }
}

function onCheckboxClick(checkboxes, settings, layers) {
    toggleLayers(layerBtn);
    settings = 
        Array.from(checkboxes)
        .filter(i => i.checked)
        .map(i => i.value);
        
    console.log(settings);
    if (settings == "noLayer") {
        range.style.left = "-140px";
        for (const property in layers) {
            mymap.removeLayer(layers[property])
        }
    } else {
        range.style.left = "-81px";
        for (const property in layers) {
            mymap.removeLayer(layers[property])
        }
        layers[settings[0]].addTo(mymap);
    }
}


function addFdC(layers) {
    for (const property in layers) {
        mymap.removeLayer(fondsDeCarte[property])
        let layerContainer = document.createElement("div");

        let layer = `
                <input type="radio" id="${property}" class="radio-layer" name="layer" value="${property}">
                <label for="${property}">${property}</label>
        `;

        layerContainer.innerHTML = layer;
        document.querySelector('.layers-choice').append(layerContainer);
    }
}


// =========================================================
//
// Génération du carousel de promenade sur la page d'accueil
//
// =========================================================


function setPromenades(dataProm) {
    // console.log(dataProm);
    for (const promenade in dataProm) {
        // console.log(dataProm[promenade]);
        let cardContent = document.createElement("div");
        // console.log(Object.keys(dataProm));
        cardContent.setAttribute("stroll", `${promenade}`);
        cardContent.classList.add('swiper-slide');
        cardContent.classList.add('card-promenade');

        let promCard = `
            <img src="${dataProm[promenade].visuel}" alt="">
            <div class="promenade-info">
                <h2>${dataProm[promenade].titre}</h2>
                <a href="./promenade.html?stroll=${cardContent.getAttribute("stroll")}">
                    <div class="start">
                        <img src="assets/images/start.svg" alt="">
                    </div>
                </a>
            </div>`

        cardContent.innerHTML = promCard;
        document.querySelector('.swiper-wrapper').append(cardContent);
    }
}


// =======================
//
// Local Storage utilities
//
// =======================


function getPromenadeFromStorage() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function savePromenadeToStorage(promenadeArray = []) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(promenadeArray));
}

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function convertToJson(strollArray) {
    strollArray.forEach(function(item) {
        for (const [key, value] of Object.entries(item)) {
            let isJSON = IsJsonString(value)
            if(isJSON == true) {
                item[key] = JSON.parse(item[key]);
            } 
        }
    })

    return strollArray;
}

Papa.parsePromise = function(file) {
    return new Promise(function(complete, error) {
      Papa.parse(file, {download: true, header: true, complete, error});
    });
};