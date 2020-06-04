const locationInput = document.getElementById('location');
const errorElement = document.getElementById("error");
const successElement = document.getElementById("success");
const lat = document.getElementById("lat");
const lon = document.getElementById("lon");

function error(message) {
    successElement.style.display = 'none';
    errorElement.style.display = 'block';
    errorElement.innerText = message;
}

function success(message) {
    successElement.innerText = message;
    successElement.style.display = 'block';
    errorElement.style.display = 'none';
}

document.getElementById("updatePLZ").addEventListener("submit", function(event){
    event.preventDefault();
    updatePLZ();
});


function updateCoordinatesInput(point) {
    lat.value = point[0];
	lon.value = point[1];
}

browser.storage.sync.get("loc").then(function(result){
    if(result.loc) {
        updateCoordinatesInput(result.loc);
    }
});

function setLocationByPLZ(code) {
    code = code.trim();
    if (!(code in plz)) {
        throw Error(`PLZ '${code}' not found`);
    }
    const loc = plz[code];
    if (!loc.point) {
        throw Error(`PLZ '${code}' has no coordinates`);
    }
    
    updateCoordinatesInput(loc.point);
	browser.storage.sync.set({loc: loc.point});

}

function updatePLZ() {
    try {
        setLocationByPLZ(locationInput.value); 
    } catch(e) {
        console.trace("Failed to set location: ", e);
        error(e);
        return;
    }
    success("Location saved.")
}