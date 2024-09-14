
// Initialize the map
var map = L.map('map');

// Check if Geolocation API is available
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        // Success callback
        function(position) {
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;
            var accuracy = position.coords.accuracy;

            // Set the map's view to the user's current location
            map.setView([lat, lon], 13);

            // Add a marker at the user's location
            L.marker([lat, lon]).addTo(map)
                .bindPopup("You are here. Accuracy: " + accuracy + " meters.")
                .openPopup();

            // Add tile layer (this is necessary to display the map tiles)
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);
        },
        // Error callback
        function(error) {
            alert("Error getting your location: " + error.message);
        }
    );
} else {
    alert("Geolocation is not supported by this browser.");
}

