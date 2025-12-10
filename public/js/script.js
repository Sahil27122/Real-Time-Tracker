// Initialize Socket.io
const socket = io(); // A connection request goes to backend

// Check if geolocation is supported
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (postion) => {
            const { latitude, longitude } = postion.coords;

            // console.log("Location:", latitude, longitude);

            // event emit to server
            socket.emit("send-location", { latitude, longitude });
        },
        (error) => {
            console.log(error);
        },
        {
           enableHighAccuracy: true,
           timeout:5000, // check location again after 5 sec
           maximumAge: 0 // No cached data 
        }
    )
}


// Initialize the map
const map = L.map("map").setView([0, 0], 16);

// Add OpenStreetMap tiles
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "OpenStreetMap"
}).addTo(map);


// Store markers for each connected user
const markers = {};

socket.on("receive-location", (data)=>{
    const { id, latitude, longitude } = data;

    // Center map on first location received
    map.setView([latitude, longitude]);

    if(markers[id]){
        markers[id].setLatLng([latitude, longitude]);
    }
    else{
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
});


socket.on("user-disconnected", (id)=>{
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id]
    }
})