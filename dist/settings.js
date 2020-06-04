//var currentLocation = storage.local.get("location");
var locationInput = document.getElementById('location');
//if(currentLocation) {
//	location.value = currentLocation;
//}

const lat = document.getElementById("lat");
const lon = document.getElementById("lon");

function setLocationByPLZ(code) {
	var loc = plz[code];
	lat.value = loc.point[0];
	lon.value = loc.point[1];
	browser.storage.sync.set({loc: loc.point});
	console.log("location saved");
}

document.getElementById("location_by_plz").addEventListener("click", function() {
	setLocationByPLZ(locationInput.value);
});
new autoComplete({
    selector: locationInput,
    minChars: 2,
    source: function(term, suggest){
        term = term.toLowerCase();
        var matches = [];
        for (code in plz) {
            var loc = plz[code];
            if (loc.point && (~loc.name.toLowerCase().indexOf(term) || code.indexOf(term) == 0)) matches.push(code);
	}
        suggest(matches);
    }
});

