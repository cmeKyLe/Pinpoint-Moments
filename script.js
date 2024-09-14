`use strict`;

const form = document.querySelector('.form');
const containerEvents = document.querySelector('.events');
const inputEvent = document.querySelector(`.form-input--event`);
const inputDate = document.querySelector(`.form-input--date`);
const inputStartTime = document.querySelector(`.form-input--startTime`);
const inputEndTime = document.querySelector(`.form-input--endTime`); 

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
        const { latitude } = position.coords;
        const { longitude } = position.coords;
        console.log(latitude, longitude); 

        const map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.marker([51.5, -0.09]).addTo(map)
    .bindPopup('A pretty CSS popup.<br> Easily customizable.')
    .openPopup();
    }, function () {
        alert('Could not get your position');
    });
}   