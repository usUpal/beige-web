import React, { useMemo } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import usePlacesAutocomplete, { getGeocode, getLatLng, Suggestion } from 'use-places-autocomplete';
import { MapProps } from './types';

const PlacesAutocomplete: React.FC<{
  onAddressSelect?: (address: string) => void;
  handleAddressChange?: (address: string) => void;
  defaultValue?: string;
}> = ({ onAddressSelect, handleAddressChange, defaultValue }) => {
  const [initialValue] = React.useState(defaultValue || '');

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    debounce: 300,
    cache: 86400,
    defaultValue: initialValue,
  });

  const renderSuggestions = () => {
    return data.map((suggestion: Suggestion) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
        description,
      } = suggestion;

      return (
        <li
          key={place_id}
          onClick={() => {
            setValue(description, false);
            clearSuggestions();
            onAddressSelect && onAddressSelect(description);
            localStorage.setItem('location', description);
          }}
          className="flex items-center rounded-md py-1 hover:bg-[#f0f0f0] dark:hover:bg-[#444444]"
        >
          <p className="text-sm font-bold text-black dark:text-white">{main_text},</p>
          <p className="text-sm text-gray-700 dark:text-gray-300">{secondary_text}</p>
        </li>
      );
    });
  };

  return (
    <div className="relative block w-full">
      <input
        value={value}
        disabled={!ready}
        onChange={(e) => {
          setValue(e.target.value);
          handleAddressChange && handleAddressChange(e.target.value);
        }}
        placeholder="Location"
        className="form-input w-full rounded-md border border-gray-300 bg-slate-100 px-3 py-2   text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-slate-700 dark:text-white dark:placeholder-gray-500 dark:focus:ring-indigo-500"
      />
      {status === 'OK' && <ul className="absolute z-50 w-full rounded-lg bg-white p-5 shadow-md dark:bg-gray-800 dark:text-white">{renderSuggestions()}</ul>}
    </div>
  );
};

const Map: React.FC<MapProps> = ({ setGeo_location, defaultValue, setLocation }) => {
  const libraries = useMemo(() => ['places'], []);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries,
  });

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  const handleAddressChange = (value: string) => {
    if (!value) {
      setGeo_location({ coordinates: [], type: 'Point' });
    }
  };

  return (
    <div>
      <PlacesAutocomplete
        onAddressSelect={(address) => {
          getGeocode({ address }).then((results) => {
            const { lat, lng } = getLatLng(results[0]);
            setLocation(address);
            setGeo_location({
              coordinates: [lng, lat],
              type: 'Point',
            });
          });
        }}
        handleAddressChange={handleAddressChange}
        defaultValue={defaultValue}
      />
    </div>
  );
};

export default Map;
