import { useEffect, useState } from 'react';
import '../styles/Info.scss';
import { dataType, locationType, Status } from '../types/types';
import locationsJSON from '../assets/json/locations.json';
import { fetchGeolocation, getWeather } from '../utils/weather';

type props = {
  data: dataType;
  setData: React.Dispatch<React.SetStateAction<dataType>>;
  getLocation: () => void;
}

export default function Info({
  data, setData, getLocation
}: props) {
  const [locations, setLocations] = useState<locationType[]>([]);
  const [locationOptions, setLocationOptions] = useState<locationType[]>([]);
  const [locationInput, setLocationInput] = useState<string>("");
  
  useEffect(() => {
    setLocations(locationsJSON as locationType[]);
  }, []);

  useEffect(() => {
    setLocationInput(data.location?.name ?? "");
  }, [data.location])

  const filter = (s: string): void => {
    if (s.length < 3) {
      setLocationOptions([]);
      return;
    }

    setLocationOptions(locations.filter((l) => 
      l.name.toLowerCase().includes(s.toLowerCase().trim())
    ));
  }

  const handleChange = (s: string): void => {
    setLocationInput(s);
    filter(s);
  }

  const chooseLocation = async (location: locationType): Promise<void> => {
    setLocationInput(location.name);
    setLocationOptions([]);

    setData({...data, location, status: Status.NONE, message: "Loading..."});

    const geolocation = await fetchGeolocation(location);
    const {status, message} = await getWeather(geolocation!);
    
    setData({...data, location, geolocation, status, message});
  }

  const handleGetLocation = (): void => {
    getLocation();
    setLocationOptions([]);
  }

  return (
    <div className="Info">
      <div className="Title">
        <h1>Can you wear sneakers in</h1>
        <input 
          type="text" 
          value={locationInput}
          placeholder="Location..."
          onChange={(e) => handleChange(e.target.value)} 
        />
      </div>
      {locationOptions.length > 0 && 
        <div className="Options">
          {locationOptions.map((l) => 
            <div className="Location" key={l.id} onClick={() => chooseLocation(l)}>
              <div className="Country">
                {l.country}
              </div>
              <div className="Name">
                {l.name}
              </div>
            </div>
          )}
        </div>
      }
      <div className="Message">
        <h3>{data.message}</h3>
      </div>
      <button onClick={handleGetLocation}>Use My Location</button>
    </div>
  );
}