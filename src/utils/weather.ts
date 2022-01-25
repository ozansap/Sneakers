import { geolocationType, locationType, Status, Units, weatherResultType } from "../types/types";

const domain = "http://api.openweathermap.org";
const key = process.env.OPENWEATHERMAP_KEY;
const units = Units.METRIC;

export const fetchGeolocation = async (location: locationType): Promise<geolocationType | null> => {
  const {id} = location;
  const link = domain + `/data/2.5/weather?id=${id}&appid=${key}`;

  try {
    const response = await fetch(link);
    const json = await response.json();
    
    return {
      lat: json.coord.lat,
      lon: json.coord.lon,
    };
  } catch (error) {
    console.error(error);
  }

  return null;
}

export const fetchLocation = async (geolocation: geolocationType): Promise<locationType | null> => {
  const {lat, lon} = geolocation;
  const link = domain + `/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${key}`;

  try {
    const response = await fetch(link);
    const json = await response.json();
    
    return {
      id: 0,
      name: json[0].name,
      country: json[0].country,
    };
  } catch (error) {
    console.error(error);
  }

  return null;
}

export const fetchForecast = async (geolocation: geolocationType): Promise<any | null> => {
  const {lat, lon} = geolocation;
  const link =  domain + `/data/2.5/onecall?lat=${lat}&lon=${lon}&units=${units}&appid=${key}`;

  try {
    const response = await fetch(link);
    const json = await response.json();
    
    return json;
  } catch (error) {
    console.error(error);
  }

  return null;
}

export const fetchHistory = async (geolocation: geolocationType): Promise<any | null> => {
  const dt = Math.floor(Date.now() / 1000);
  const {lat, lon} = geolocation;
  const link =  domain + `/data/2.5/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${dt}&units=${units}&appid=${key}`;

  try {
    const response = await fetch(link);
    const json = await response.json();
    
    return json;
  } catch (error) {
    console.error(error);
  }

  return null;
}

export const getResult = (json_forecast: any, json_history: any): weatherResultType => {
  if (json_forecast.current.weather[0].main === "Rain") {
    return {
      status: Status.NEGATIVE,
      message: `It is raining right now`
    };
  }
  if (json_forecast.current.weather[0].main === "Snow") {
    return {
      status: Status.NEGATIVE,
      message: `It is snowing right now`
    };
  }

  const historyLength = json_history.hourly.length;

  for (let i = historyLength - 1; i >= historyLength - 5; i--) {
    if (json_history.hourly[i].weather[0].main === "Rain") {
      return {
        status: Status.NEGATIVE,
        message:  `It rained ${historyLength-i} hours ago, it might still be wet or slippery`
      };
    }
    if (json_history.hourly[i].weather[0].main === "Snow") {
      return {
        status: Status.NEGATIVE,
        message:  `It snowed ${historyLength-i} hours ago, it might still be wet or slippery`
      };
    }
  }

  for (let i = 0; i < 10; i++) {
    if (json_forecast.hourly[i].weather[0].main === "Rain") {
      return {
        status: Status.NEGATIVE,
        message:  `Looks like it will rain in ${i+1} hours, be careful`
      };
    }
    if (json_forecast.hourly[i].weather[0].main === "Snow") {
      return {
        status: Status.NEGATIVE,
        message:  `Looks like it will snow in ${i+1} hours, be careful`
      };
    }
  }

  return {
    status: Status.POSITIVE,
    message:  "Enjoy your sneakers!"
  };
}

export const getWeather = async (geolocation: geolocationType): Promise<weatherResultType> => {
  const json_forecast = await fetchForecast(geolocation);
  const json_history = await fetchHistory(geolocation);
  const result = getResult(json_forecast, json_history);
  return result;
}