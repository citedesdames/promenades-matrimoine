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
        // <img src="${dame.portrait}"></img>
        let dameCard = `
            <div class="dame-portrait">
                <div style="background-image: url('${dame.portrait}'); background-repeat: no-repeat; background-size: cover; center;"></div>
                <span>${dame.source}</span>
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
                <h2>L’<span>héritage</span> culturel du <span>${step.nom}</span>.</h2>

                <div class="doc-header">
                    <h3>Documents sur ce lieu</h3>
                    <div class="doc-list"><span class="doc-number"></span></div>
                </div>

                <div class="step-document" document_id_etape=${step.ordre}></div>
                <a href="" class="augmented-reality-link">
                    <div class="augmented-reality">
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

    markerArray.forEach((i) => {
        i.addEventListener('click', function() {
            checkPopupState(i);
            document.querySelector('.leaflet-popup-close-button').addEventListener('click', function() {
                checkPopupState(i);
            })
        })
        // document.querySelector('#mapid').addEventListener('click', function() {
        //     // checkPopupState(i);
        //     console.log(3)
        // })
    })
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
    let test2 = 20000;

    if(distance < test2 && isClose == false) {
        console.log(step.nom)
        window.navigator.vibrate(300);
        stepAddress.innerHTML = step.nom;
        notif.style.top = "12px";
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
    } else if(distance < test2 && isClose == true) {
        isClose = true;
        console.log("condition 2")
        // console.log('Already close to step no need to notif the user');
    } else if(distance > test2) {
        isClose = false;
        allAugRealLinks.forEach(function(i) {
            i.style.display = "none";
        });
    }
    
    // console.log(isClose);
}

function updateOpacity(value) {
    for (const property in fondsDeCarte) {
        // console.log(value);
        fondsDeCarte[property].setOpacity(value)
        document.querySelector('.range-value').innerHTML = value;
    }
}

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

        toggleCard(true);
        toggleControls(true);
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

// function cardExtend(card) {
//     console.log(card.childNodes)
//     card.childNodes[5].style.display = "none";

//     card.style.cssText = "margin: 0; grid-template-columns: 100vw; bottom: 0;"
//     card.classList.add("card-extend");

//     let divCloseTo = document.createElement("div");
//     divCloseTo.classList.add('close-to');
//     card.append(divCloseTo);

//     card.childNodes[1].childNodes[1].classList.add("portrait");
//     card.childNodes[3].style.gridArea = "2 / 1 / 3 / 2";
// }



function toggleControls(state) {
    if(state == false) {
        document.querySelectorAll('[class*="-btn"]').forEach((ctrl,i) => 
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
            range.style.left = "-81px";
        }
        document.querySelector('.controllers').style.display = "block";
        document.querySelectorAll('[class*="-btn"]').forEach((ctrl,i) => 
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

const toggleExpansion = (element, to, duration = 350) => {
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

  const getCardContent = (damesArray, id_dame) => {
    //   console.log(damesArray);
    //   console.log(id_dame);
    let tmpDame = [];
    damesArray.forEach(function(dame){
        if(id_dame == dame.identifiant) {
            console.log(dame);
            tmpDame.push(dame);
        }
    });
    console.log(tmpDame);
    console.log(tmpDame[0].identifiant);
    return `
        <div class="card-header">
            <div class="pp" style="background-image: url('${tmpDame[0].portrait}'); background-repeat: no-repeat; background-size: cover; center;"></div>
            <p>${tmpDame[0].source}</p>
            <div class="header">
                <h1>${tmpDame[0].prenom} ${tmpDame[0].nom}</h1>
                <div>
                    <p><span>Née le</span><br>${tmpDame[0].dateNaissance.slice(0, 10)}</p>
                    <p><span>Décédée le</span><br>${tmpDame[0].dateDeces.slice(0, 10)}</p>
                </div>
            </div>
        </div>
        <div class="card-content">
            <p>${tmpDame[0].biographie}</p>
            <p class="source">${tmpDame[0].sourceBio}</p>
            <section>
                <p>Apparait aux :<p>
                <div class="step-route-info-2">
                    <div class="step-photo-2">
                        <img src="assets/images/photo-camera.svg" alt="">
                    </div>
                    <div class="step-route-address-2">
                        <div>
                            <span class="location">Palais du Louvre</span>
                            <span class="distance">2 Km</span>
                        </div>
                        <p>107 Rue de Rivoli, 75001 Paris</p>
                    </div>
                </div>
            </section>
        </div>
    `;
  }
  const onCardClick = async (e) => {
      const card = e.currentTarget.parentNode;
      let id = card.getAttribute("id_dames");
      console.log(card);
      
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
    //   const closeButton = document.createElement('button');
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
      });



      // expand the clone card
      await toggleExpansion(cardClone, {top: 0, left: 0, width: '100vw', height: '100vh'});
      const content = getCardContent(dataDames, id)

      // set the display block so the content will follow the normal flow in case the original card is not display block
      cardClone.style.display = 'block';
      cardClone.style.padding = '0';
      
      // append the close button after the expansion is done
      cardClone.appendChild(closeButton);
      cardClone.insertAdjacentHTML('afterbegin', content);
  };