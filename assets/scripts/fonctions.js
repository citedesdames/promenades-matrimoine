function onMapClick(e) {
    L.marker([e.latlng.lat, e.latlng.lng]).addTo(mymap)
        .bindPopup("Vous avez clické sur la carte à " + e.latlng.toString()).openPopup()
}

function onLocationFound(e) {
    let radius = e.accuracy;

    let positionUser = L.marker(e.latlng).addTo(mymap)
        .bindPopup("Approximativement, voici votre posiion !").openPopup();

    L.circle(e.latlng, radius).addTo(mymap);
}

function onLocationError(e) {
    alert(e.message);
}

function locate() {
    mymap.locate({maxZoom: 16});
    console.log("Position utilisateur mise à jour")
}


function addStep(stepArray) {
    stepArray.map(step => {
        L.marker([`${step.latitude}`, `${step.longitude}`]).addTo(mymap)
            .bindPopup(`<h3>${step.nom}</h3>`).openPopup();
    });

    
    for (let i = 0; i < stepArray.length - 1; i++) {
        var latlngs = [
            [`${stepArray[i].latitude}`, stepArray[i].longitude],
            [`${stepArray[i+1].latitude}`, stepArray[i+1].longitude],
        ];

        L.polyline(latlngs, {
            color: 'blue'
        }).addTo(mymap);

        // mymap.fitBounds(polyline.getBounds());
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