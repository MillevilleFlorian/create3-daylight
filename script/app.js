const apiKey = 'f4d5668e8e8569cce0a5c1b7f250d541';

// _ = helper functions
function _parseMillisecondsIntoReadableTime(timestamp) {
  //Get hours from milliseconds
  const date = new Date(timestamp * 1000);
  // Hours part from the timestamp
  const hours = '0' + date.getHours();
  // Minutes part from the timestamp
  const minutes = '0' + date.getMinutes();
  // Seconds part from the timestamp (gebruiken we nu niet)
  // const seconds = '0' + date.getSeconds();

  // Will display time in 10:30(:23) format
  return hours.substr(-2) + ':' + minutes.substr(-2); //  + ':' + s
}

// 5 TODO: maak updateSun functie
const updateSun = (sun, left, bottom, today) => {
  // TODO: alles
  sun.style.setProperty('--local-sun-position-left', `${left}%`);
  sun.style.setProperty('--local-sun-position-bottom', `${bottom}%`);

  sun.setAttribute('data-time', `${today.getHours().toString().padStart(2, '0')}:${today.getMinutes().toString().padStart(2, '0')}`);
};

const itBeNight = () => {
  document.querySelector('html').classList.add('is-night');
};
// 4 Zet de zon op de juiste plaats en zorg ervoor dat dit iedere minuut gebeurt.
const placeSunAndStartMoving = (totalMinutes, sunrise) => {
  // In de functie moeten we eerst wat zaken ophalen en berekenen.
  // TODO: Haal het DOM element van onze zon op en van onze aantal minuten resterend deze dag.
  const sun = document.querySelector('.js-sun'),
    timeLeft = document.querySelector('.js-time-left');
  // TODO: Bepaal het aantal minuten dat de zon al op is.
  let today = new Date();
  let dateUp = new Date(today.getTime() - sunrise * 1000);
  // const sunriseDate = new Date(sunrise * 1000);

  let minutesSunUp = dateUp.getHours() * 60 + dateUp.getMinutes();
  // let minutesSunUp = today.getHours() * 60 + today.getMinutes() - (sunriseDate.getHours() * 60 + sunriseDate.getMinutes());
  // TODO: Nu zetten we de zon op de initiële goede positie ( met de functie updateSun ). Bereken hiervoor hoeveel procent er van de totale zon-tijd al voorbij is.

  let percentage = (100 / totalMinutes) * minutesSunUp,
    sunLeft = percentage,
    sunBottom = percentage < 50 ? percentage * 2 : (100 - percentage) * 2;

  updateSun(sun, sunLeft, sunBottom, today);
  // TODO: We voegen ook de 'is-loaded' class toe aan de body-tag.
  document.querySelector('body').classList.add('is-loaded');
  // Vergeet niet om het resterende aantal minuten in te vullen.
  timeLeft.innerText = totalMinutes - minutesSunUp;
  // Nu maken we een functie die de zon elke minuut zal updaten
  const t = setInterval(() => {
    today = new Date();

    if (minutesSunUp < 0 || minutesSunUp > totalMinutes) {
      clearInterval(t);
      // TODO: make it night itBeNight()
      itBeNight();
    } else {
      // TODO: percentage left berekenen
      // TODO: percentage bottom berekenen
      // TODO: zon weer wat verder zetten
      // TODO minuten updaten
      percentage = (100 / totalMinutes) * minutesSunUp;
      sunLeft = percentage;
      sunBottom = percentage < 50 ? percentage * 2 : (100 - percentage) * 2;

      updateSun(sun, sunLeft, sunBottom, today);
      timeLeft.innerText = totalMinutes - minutesSunUp;
    }

    // ps: vergeet weer niet het resterend aantal minuten te updaten en verhoog het aantal verstreken minuten
    // TODO minutes zon op verhogen
    minutesSunUp++;
  }, 6000);
  // Bekijk of de zon niet nog onder of reeds onder is
  // Anders kunnen we huidige waarden evalueren en de zon updaten via de updateSun functie.
  // PS.: vergeet weer niet om het resterend aantal minuten te updaten en verhoog het aantal verstreken minuten.
};

// 3 Met de data van de API kunnen we de app opvullen
const showResult = (queryResponse) => {
  // We gaan eerst een paar onderdelen opvullen
  const sunRise = document.querySelector('.js-sunrise'),
    sunSet = document.querySelector('.js-sunset'),
    location = document.querySelector('.js-location');

  sunRise.innerHTML = _parseMillisecondsIntoReadableTime(queryResponse.city.sunrise);
  sunSet.innerHTML = _parseMillisecondsIntoReadableTime(queryResponse.city.sunset);
  location.innerHTML = `${queryResponse.city.name}, ${queryResponse.city.country}`;

  // Zorg dat de juiste locatie weergegeven wordt, volgens wat je uit de API terug krijgt.
  // Toon ook de juiste tijd voor de opkomst van de zon en de zonsondergang.
  // Hier gaan we een functie oproepen die de zon een bepaalde positie kan geven en dit kan updaten.
  // Geef deze functie de periode tussen sunrise en sunset mee en het tijdstip van sunrise.
  const timeDifference = new Date(queryResponse.city.sunset * 1000 - queryResponse.city.sunrise * 1000);

  placeSunAndStartMoving(timeDifference.getHours() * 60 + timeDifference.getMinutes(), queryResponse.city.sunrise);
};

const get = (url) => fetch(url).then((r) => r.json());

// 2 Aan de hand van een longitude en latitude gaan we de yahoo wheater API ophalen.
const getAPI = async (lat, lon) => {
  const endPoint = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=nl&cnt=1`;

  // Eerst bouwen we onze url op
  // Met de fetch API proberen we de data op te halen.
  const weatherResponse = await get(endPoint);

  // Als dat gelukt is, gaan we naar onze showResult functie.
  showResult(weatherResponse);
};

document.addEventListener('DOMContentLoaded', function () {
  // 1 We will query the API with longitude and latitude.
  getAPI(50.8027841, 3.2097454);
});
