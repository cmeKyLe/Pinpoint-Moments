const form = document.querySelector('.form');
const events = document.querySelector('.events');
const inputEvent = document.querySelector('form__input--event');
const inputDate = document.querySelector('form__input--date');
const inputStartTime = document.querySelector('form__input--startTime');
const inputEndTime = document.querySelector('form__input--endTime');

//var map = L.map('map');
let mapEvent;


const rootStyles = getComputedStyle(document.documentElement);
const brandColors = [
    rootStyles.getPropertyValue('--color-brand--1'),
    rootStyles.getPropertyValue('--color-brand--2'),
    rootStyles.getPropertyValue('--color-brand--3')
];


function getRandomColor() {
    return brandColors[Math.floor(Math.random() * brandColors.length)];
}

class Event{
    constructor(coords, event, time) {
        this.coords = coords;
        this.event = event;
        this.time = time;
    }
}

class App{
    #map = L.map('map');
    #mapEvent;
    constructor() { 
        this._getPosition();
        form.addEventListener('submit', this._newEvent.bind(this)); 
    }
    _getPosition() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this._loadMap.bind(this),
                function () {
                    alert('Could not get your position');
                },
            );
        }
         }

    _loadMap(position) { 
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;

        
        this.#map.setView([latitude, longitude], 13);

        
        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.#map);

        
        this.#map.on('click', this._showForm.bind(this));
        }

    _showForm(mapE) { 
        this.#mapEvent = mapE;
        form.classList.remove('hidden');
        inputEvent.focus();      
        }

    _newEvent(e) {
        e.preventDefault();
        
            const { lat, lng } = this.#mapEvent.latlng;
            const randomColor = getRandomColor();
        
            
            const marker = L.marker([lat, lng]).addTo(this.#map)
                .bindPopup(L.popup({
                    maxWidth: 250,
                    minWidth: 100,
                    autoClose: false,
                    closeOnClick: false,
                }).setContent("Hello, World"))
                .openPopup();
        
            
            setTimeout(function () {
                const popupElements = document.querySelectorAll('.leaflet-popup-content-wrapper');
                const latestPopup = popupElements[popupElements.length - 1];
                if (latestPopup) {
                    latestPopup.style.borderLeft = `5px solid ${randomColor}`;
                }
            }, 5); 
        
            form.reset();
            form.classList.add('hidden'); 
            mapEvent = null; }
    
}

const app = new App();







