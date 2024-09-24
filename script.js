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
class Event{
    date = new Date();
    id = (Date.now() + ``).slice(-10);
    constructor(coords, event,date, startTime, endTime, color) {
        this.coords = coords;
        this.event = event;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.color = color;
    }
}

////////////////////////////////
// Applicatioon Architecture
class App{
    #map = L.map('map');
    #mapEvent;
    #events = [];
    constructor() { 
        
        this._getPosition();

        this._getLocalStorage();
        form.addEventListener('submit', this._newEvent.bind(this)); 
        events.addEventListener('click', this._moveToPopUp.bind(this));
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
    
    }
    
    _checkFormValidity() {
            if (!inputEvent.value.trim() || !inputDate.value.trim() || !inputStartTime.value.trim() || !inputEndTime.value.trim()) {
                alert("Please fill out all fields before submitting.");
                return false;
            }
            return true;
        }
    

    _newEvent(e) {
        e.preventDefault();

        //get data 
        const { lat, lng } = this.#mapEvent.latlng;
        const event = inputEvent.value;
        const date = inputDate.value;
        const startTime = inputStartTime.value;
        const endTime = inputEndTime.value;
        const color = getRandomColor();
        //check if data is valid, create new object
        if (!this._checkFormValidity()) return;
        //add new obeject to event array
        
            const ev = new Event([lat, lng], event, date, startTime, endTime,color);
            this.#events.push(ev);
            this._renderEventMarker(ev,color);
            this._renderEvent(ev);

        this._setLocalStorage();

        
    }
        

        
        
        
        
    _renderEventMarker(eve,randomColor) {
        L.marker(eve.coords).addTo(this.#map)
            .bindPopup(L.popup({
                    maxWidth: 250,
                    minWidth: 100,
                    autoClose: false,
                    closeOnClick: false,
                }).setContent(`${eve.event}:${eve.date}`))
                .openPopup();
        
            
            setTimeout(function () {
                const popupElements = document.querySelectorAll('.leaflet-popup-content-wrapper');
                const latestPopup = popupElements[popupElements.length - 1];
                if (latestPopup) {
                    latestPopup.style.borderLeft = `5px solid ${randomColor}`;
                }
            }, 5); 
            //hide form and clear form
            form.reset();
            form.classList.add('hidden'); 
        mapEvent = null;
    }

    _renderEvent(eve) {
        const html = `
        <li class="events__item event" data-id="${eve.id}" style="border-left: 5px solid ${eve.color};">
            <h2 class="event__title">${eve.event} </h2>
                <div class="event__info">
                    <span class="event__date">Date:${eve.date}</span>
                </div>
                <div class="event__info">
                    <span class="event__time">Start:${eve.startTime} - End:${eve.endTime}</span>
                </div>         
        </li>`;
        form.insertAdjacentHTML('afterend', html);
    }

    _moveToPopUp(e) {
        const eventEl = e.target.closest(`.events__item`);


        if (!eventEl) return;

        const evnt = this.#events.find(ev => ev.id === eventEl.dataset.id);

        this.#map.setView(evnt.coords, 13, {
            animate: true,
            pan: {
                duration: 1
            },
        });
    }

    _setLocalStorage() {
        localStorage.setItem(`events`, JSON.stringify(this.#events));
    }

    _getLocalStorage() {
        const data = JSON.parse(localStorage.getItem(`events`));
        if (!data) return;

        this.#events = data;

        this.#events.forEach(eve => {
            this._renderEvent(eve);
            this._renderEventMarker(eve);
         });
    }

    reset() {
        localStorage.removeItem(`events`);
        location.reload();
    }
    

    
    
}

const app = new App();







