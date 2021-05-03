function onMapClick(e) {
    L.marker([e.latlng.lat, e.latlng.lng]).addTo(mymap)
        .bindPopup("Vous avez clické sur la carte à " + e.latlng.toString()).openPopup()
}

function onMarkerClick(coord) {
    let GPSMark = L.latLng(coord.latlng.lat + .0045, coord.latlng.lng);
    
    mymap.flyTo(GPSMark, 16, {
        animate: true,
        duration: 0.5
    });
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
        let mark = L.marker([`${step.latitude}`, `${step.longitude}`]).addTo(mymap)
            .bindPopup(`
                <div class="step">
                    <div class="popup-photo">
                        <img src="../assets/images/paris-min.jpeg" alt="">
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
                        <p>Lorem ipsum dolor sit amet. Hic quisquam dolores aut voluptates dolor in dolores quia ut ullam rerum 33 dolorem dolor ut provident voluptatem aut nisi omnis.</p>
                        <div class="author">Author</div>
                    </div>

                    <a href=""><div class="know-more">En savoir plus</div></a>
                </div>
            `).on("click", onMarkerClick);
        
            markerArray.push(mark);
    });

    console.log(markerArray);
    
    for (let i = 0; i < stepArray.length - 1; i++) {
        var latlngs = [
            [`${stepArray[i].latitude}`, stepArray[i].longitude],
            [`${stepArray[i+1].latitude}`, stepArray[i+1].longitude],
        ];

        L.polyline(latlngs, {
            color: 'blue'
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