function onMapClick(e) {
    L.marker([e.latlng.lat, e.latlng.lng]).addTo(mymap)
        .bindPopup("Vous avez clické sur la carte à " + e.latlng.toString()).openPopup()
}

function onLocationFound(e) {
    let radius = e.accuracy;

    positionUser = L.marker(e.latlng).addTo(mymap)
        .bindPopup("Approximativement, voici votre posiion !").openPopup();

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
    stepArray.map(step => {
        L.marker([`${step.latitude}`, `${step.longitude}`]).addTo(mymap)
            .bindPopup(`<h3>${step.nom}</h3>`).openPopup();
        
        // console.log(stepMarker);
    });

    
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
    if (value > 1) {
        console.log(value);
        oldParis2.setOpacity(value - 1);
        oldParis1.setOpacity(1);
    } else if (value < 1) {
        console.log(value);
        oldParis1.setOpacity(value);
        oldParis2.setOpacity(0);
    }
    // console.log(value);
    // oldParis1.setOpacity(value);
}