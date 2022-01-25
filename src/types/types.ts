
export enum Status {
  POSITIVE = "positive",
  NEGATIVE = "negative",
  NONE = "none",
}

export enum Units {
  STANDARD = "standard",
  METRIC = "metric",
  IMPERIAL = "imperial",
}

export type locationType = {
  id: number;
  name: string;
  country: string;
}

export type geolocationType = {
  lat: number;
  lon: number;
}

export type dataType = {
  location: locationType | null;
  geolocation: geolocationType | null;
  units: Units; 
  status: Status;
  message: string;
}

export type weatherResultType = {
  status: Status;
  message: string;
}