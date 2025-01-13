const form = document.querySelector('.form');
const events = document.querySelector('.events');
const inputEvent = document.querySelector('.form__input--event');
const inputDate = document.querySelector('.form__input--date');
const inputStartTime = document.querySelector('.form__input--startTime');
const inputEndTime = document.querySelector('.form__input--endTime');

//var map = L.map('map');
let mapEvent;

// Random Border Color
const rootStyles = getComputedStyle(document.documentElement);
const brandColors = [
    rootStyles.getPropertyValue('--color-brand--1'),
    rootStyles.getPropertyValue('--color-brand--2'),
    rootStyles.getPropertyValue('--color-brand--3')
];
function getRandomColor() {
    return brandColors[Math.floor(Math.random() * brandColors.length)];
}

//Event Clas for event objects
class Event {
    date = new Date();
    id = (Date.now() + '').slice(-10);
    constructor(coords, event, date, startTime, endTime, color) {
        this.coords = coords;
        this.event = event;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.color = color;
    }
}

class App {
    #map = L.map('map');
    #mapEvent;
    #events = [];
    #markers = new Map(); // Track markers with event IDs

    constructor() {
        this._getPosition();
        this._getLocalStorage();

        // Event listeners
        form.addEventListener('submit', this._newEvent.bind(this));
        events.addEventListener('click', this._handleEventClick.bind(this));
    }

    _getPosition() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                this._loadMap.bind(this),
                function () {
                    alert('Could not get your position');
                }
            );
        }
    }

    _loadMap(position) {
        const { latitude, longitude } = position.coords;
        this.#map.setView([latitude, longitude], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
        }).addTo(this.#map);

        this.#map.on('click', this._showForm.bind(this));
    }

    _showForm(mapE) {
        this.#mapEvent = mapE;
        form.classList.remove('hidden');
    }

    _checkFormValidity() {
        if (!inputEvent.value.trim() || !inputDate.value.trim() || !inputStartTime.value.trim() || !inputEndTime.value.trim()) {
            alert('Please fill out all fields before submitting.');
            return false;
        }
        return true;
    }

    _newEvent(e) {
        e.preventDefault();

        const { lat, lng } = this.#mapEvent.latlng;
        const event = inputEvent.value;
        const date = inputDate.value;
        const startTime = inputStartTime.value;
        const endTime = inputEndTime.value;
        const color = getRandomColor();

        if (!this._checkFormValidity()) return;

        const newEvent = new Event([lat, lng], event, date, startTime, endTime, color);
        this.#events.push(newEvent);

        this._renderEventMarker(newEvent);
        this._renderEvent(newEvent);
        this._setLocalStorage();
    }

    _renderEventMarker(event) {
        const marker = L.marker(event.coords).addTo(this.#map)
        .bindPopup(
            L.popup({
                maxWidth: 250,
                minWidth: 100,
                autoClose: false,
                closeOnClick: false,
            }).setContent(`<span>${event.event}</span>`)
        );

    // Dynamically style the popup's left border
    marker.on('popupopen', () => {
        const popupElements = document.querySelectorAll('.leaflet-popup-content-wrapper');
        const latestPopup = popupElements[popupElements.length - 1];
        if (latestPopup) {
            latestPopup.style.borderLeft = `5px solid ${event.color}`;
        }
    });

    this.#markers.set(event.id, marker);

    form.reset();
    form.classList.add('hidden');
    this.#mapEvent = null;
    }

    _renderEvent(event) {
        const html = `
        <li class="events__item" data-id="${event.id}" style="border-left: 5px solid ${event.color};">
            <button class="btn-delete">X</button>
            <h2 class="event__title">${event.event}</h2>
            <div class="event__info">
                <span class="event__date">Date: ${event.date}</span>
            </div>
            <div class="event__info">
                <span class="event__time">Start: ${event.startTime} - End: ${event.endTime}</span>
            </div>
        </li>`;
        events.insertAdjacentHTML('beforeend', html);
    }

    _handleEventClick(e) {
        // Handle delete button click
        if (e.target.classList.contains('btn-delete')) {
            const eventEl = e.target.closest('.events__item');
            if (!eventEl) return;

            const eventId = eventEl.dataset.id;

            // Remove marker from map
            const eventMarker = this.#markers.get(eventId);
            if (eventMarker) {
                this.#map.removeLayer(eventMarker);
                this.#markers.delete(eventId);
            }

            // Remove event from list
            this.#events = this.#events.filter(event => event.id !== eventId);
            eventEl.remove();

            // Update local storage
            this._setLocalStorage();
        } else {
            // Handle event click to move map
            this._moveToEvent(e);
        }
    }

    _moveToEvent(e) {
        const eventEl = e.target.closest('.events__item');
        if (!eventEl) return;

        const eventId = eventEl.dataset.id;
        const eventMarker = this.#markers.get(eventId);

        if (eventMarker) {
            this.#map.setView(eventMarker.getLatLng(), 13, {
                animate: true,
                pan: { duration: 1 },
            });

            eventMarker.openPopup();
        }
    }

    _setLocalStorage() {
        localStorage.setItem('events', JSON.stringify(this.#events));
    }

    _getLocalStorage() {
        const data = JSON.parse(localStorage.getItem('events'));
        if (!data) return;

        this.#events = data;

        this.#events.forEach(event => {
            this._renderEvent(event);
            this._renderEventMarker(event);
        });
    }

    reset() {
        localStorage.removeItem('events');
        location.reload();
    }
}

const app = new App();







