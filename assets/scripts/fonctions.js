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

                    <button class="know-more">En savoir plus</button>
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
                    openShutter(shutter);
                });


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
    // if (value > 1) {
    //     console.log(value);
    //     paris19.setOpacity(value - 1);
    //     paris17.setOpacity(1);
    // } else if (value < 1) {
    //     console.log(value);
    //     paris17.setOpacity(value);
    //     paris19.setOpacity(0);
    // }
    for (const property in fondsDeCarte) {
        // console.log(`${property}: ${fondsDeCarte[property]}`);
        console.log(value);
        fondsDeCarte[property].setOpacity(value)
      }
}

function openShutter(element) {
    if(!element.classList.contains("open")) {
        element.classList.add("open");
    } else {
        element.classList.remove("open");

        mymap.flyTo(mymap.getCenter(), 13, {
            animate: true,
            duration: 1.5
        });
    }
}