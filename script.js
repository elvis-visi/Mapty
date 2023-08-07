'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

// Using the Geolocation API
// 2 cbs, 1 on success and the other on error

//Refactoring for Project Architecture
class App {
  //Private instance properties.
  #map;
  #mapEvent;

  //constructor called immediately when a new object is created
  constructor() {
    this._getPosition();
    //event handler function will always have the this of the DOM element it is
    //attached to.
    form.addEventListener('submit', this._newWorkout.bind(this));

    inputType.addEventListener('change', this._toggleElevationField);
  }

  _getPosition() {
    if (navigator.geolocation) {
      //loadMap gets called by getCurrentPosition, this is undefined
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert(`Could not get your position`);
        }
      );
    }
  }

  _loadMap(position) {
    {
      const { latitude, longitude } = position.coords;
      console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

      //map the id of the div where the map will be displayed
      // L -> namespace from Leaflet, which has methods which we can use
      const coords = [latitude, longitude];

      console.log(`this`, this);
      this.#map = L.map('map').setView(coords, 13);
      console.log(this.#map);

      // the map on the page is made up of small tiles, they come from
      //operstreetmap
      L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.#map);

      // on not from JS itself, it comes from the Leaflet library
      // event created lby leaflet
      //Handling clicks on map
      this.#map.on('click', this._showForm.bind(this));
    }
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(e) {
    e.preventDefault();

    //Clear input fields
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputDuration.value =
        '';

    //Displaly the marker
    // console.log(mapEvent);
    const { lng, lat } = this.#mapEvent.latlng;

    L.marker([lat, lng])
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: 'running-popup',
        })
      )
      .setPopupContent('Workout')
      .openPopup();
  }
}

const app = new App();

//form
