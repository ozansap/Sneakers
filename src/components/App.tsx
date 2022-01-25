import { useState } from 'react';
import '../styles/App.scss';
import { dataType, Status, Units } from '../types/types';
import { fetchLocation, getWeather } from '../utils/weather';
import Background from './Background';
import Info from './Info';

export default function App() {
  const [data, setData] = useState<dataType>({
    location: null,
    geolocation: null,
    units: Units.METRIC,
    status: Status.NONE,
    message: "Please choose a location",
  });

  const geolocationSuccess = async (position: GeolocationPosition) => {
    setData({...data, status: Status.NONE, message: "Loading..."});

    const geolocation = {
      lat: position.coords.latitude,
      lon: position.coords.longitude,
    }

    alert(geolocation.lat + " " + geolocation.lon);

    const location = await fetchLocation(geolocation);
    const {status, message} = await getWeather(geolocation);
    
    setData({...data, location, geolocation, status, message});
  }
  
  const geolocationError = (error: GeolocationPositionError) => {
    console.error(error);
  }

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError);
    alert("pressed");
  }

  return (
    <div className="App">
      <Info data={data} setData={setData} getLocation={getLocation}/>
      <Background data={data}/>
    </div>
  );
}