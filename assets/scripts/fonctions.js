function onMapClick(e) {
    L.marker([e.latlng.lat, e.latlng.lng]).addTo(mymap)
        .bindPopup("Vous avez clické sur la carte à " + e.latlng.toString()).openPopup()
}

function onLocationFound(e) {
    let radius = e.accuracy;

    positionUser = L.marker(e.latlng).addTo(mymap)
        .bindPopup("Approximativement, voici votre posiion !").openPopup(e.latlng);

    L.circle(e.latlng, radius).addTo(mymap);
}

function onLocationError(e) {
    alert(e.message);
}

function locate() {
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
//         openShutter(shutter);
//         // knowMoreBtn(dataDocument);
//     });

// }


function addStep(stepArray) {
    let markerArray = [];

    stepArray.map(step => {
        let mark = L.marker([`${step.latitude}`, `${step.longitude}`], {icon: icon}).addTo(mymap)
            .bindPopup(`
                <div class="step">
                    <div class="popup-photo">
                        <img src="../assets/images/paris-min.jpeg" alt="">
                        <span class="source-photo">Wikimedia Commons, Lorem Ispum<span>
                    </div>
                    
                    <div class="popup-header">
                        <div class="step-icon">
                            <img src="../assets/images/maps-and-flags.svg" alt="">
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
                // console.log(this);
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
                    // knowMoreBtn(dataDocument);
                });

                
                // console.log(this.getAttribute("data-latlng"));
                // console.log(markerArray.indexOf(mark));

            });
        
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
      }
}

function openShutter(element, rank) {
    let stepDocumentChildrens = document.querySelectorAll(".document");
    if(!element.classList.contains("open")) {
        element.classList.add("open");
        let docNumber = 0;
        for (let i = 0; i < stepDocumentChildrens.length; i++) {
            if(stepDocumentChildrens[i].getAttribute("id_etape") == rank + 1) {
                docNumber++;
                stepDocumentChildrens[i].classList.add("visible");
            }
        }
        document.querySelector(".doc-number").innerHTML = docNumber;
    } else {
        element.classList.remove("open");
        setTimeout(() => {
            document.querySelector(".doc-number").innerHTML = "";

            for (let i = 0; i < stepDocumentChildrens.length; i++) {
                stepDocumentChildrens[i].classList.remove("visible");
            }
        }, 1200)

        mymap.flyTo(mymap.getCenter(), 13, {
            animate: true,
            duration: 1.5
        });
    }
}

// function knowMoreBtn(docArray) {
//     console.log(docArray);
// }

function addDocuments(docArray) {
    

    let docContent = docArray.map(doc => {
        let docContent = document.createElement("div");
        docContent.classList.add('document');
        docContent.setAttribute("id_etape", `${doc.id_etape}`);

        let newContent = `<div class="dot"></div>
                        <div class="photo-doc">
                            <img src="assets/images/photo-camera.svg" alt="">
                        </div>
                        <div class="doc-content">
                            <span>${doc.type}</span>
                            <p>${doc.description}</p>
                        </div>`;

        docContent.innerHTML = newContent;
    
        stepDocument.append(docContent);

    });
    
}