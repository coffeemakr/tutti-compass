async function lookupAddress(addressElement) {
    var originalContent = addressElement.getAttribute("data-original-location")
    var currentLocation = addressElement.innerText;
    if (originalContent && originalContent != currentLocation) {
        return null;
    }
    addressElement.setAttribute("data-original-location", currentLocation);

    var parts = addressElement.innerText.split(", ");
    var plzString = parts[1];
    var name;
    distance = Promise.resolve(-1);
    if (plzString in plz) {
        var loc = plz[plzString];
        name = loc.name;
         if(loc.point) {
            distance = await getDistanceToUser(loc.point);
        }
    } else {
        name = "Unknown";
    }
        return {
        "plz": plzString,
        "distance": distance,
        "name": name 
    }
}

function getDistanceFromLatLonInKm(point1, point2) {
  var lat1 = point1[0];
  var lon1 = point1[1];
  var lat2 = point2[0];
  var lon2 = point2[1];
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *  Math.sin(dLon/2) * Math.sin(dLon/2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

async function getDistanceToUser(point) {
    let userPoint;
    userPoint = await browser.storage.sync.get("loc")
    userPoint = userPoint.loc;
    console.log("User Point: ", userPoint);
    console.log("Point: ", point);
    if(!userPoint) {
        return -1;
    }
    return getDistanceFromLatLonInKm(userPoint, point);
}

async function lookupAllItems() {
    for (const ad of document.querySelectorAll('[data-automation="ad"]')) {
        //console.log(ad);
        var description = ad.lastChild;
        var topBar = description.firstChild;
        var loc = topBar.firstChild;
        address = await lookupAddress(loc);
        if (address == null) {
            return;
        }
        loc.innerText = address.plz + " " + address.name + " ";
        let distance;
        if(address.distance >= 0) {
            var element;
            if(address.distance < 10) {
                element = document.createElement("strong");	
            } else {
                element = document.createElement("span");
            }
            element.innerText = "" + Math.round(address.distance) + "km";
            loc.appendChild(element);
        }
    
    };
}

window.setInterval(lookupAllItems, 1000);
