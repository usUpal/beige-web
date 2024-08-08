import { useMemo, useState } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';

const PlacesAutocomplete = (
  {
    onAddressSelect,
    handleAddressChange,
    defaultValue,
  }: {
    locationName?: (value: string) => void;
    onAddressSelect?: (address: string) => void;
    handleAddressChange?: (address: string) => void;
    defaultValue: string;
  },
  props: any
) => {
  const storedValue = localStorage.getItem('location') || defaultValue || '';
  const [initialValue, setInitialValue] = useState(storedValue);

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
    return data.map((suggestion) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
        description,
        types,
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
          className="flex items-center py-1"
        >
          <p className="text-sm font-bold">{main_text},</p>
          <p className="text-sm"> {secondary_text}</p>{' '}
        </li>
      );
    });
  };

  return (
    <div className="block w-full">
      <input
        value={value}
        disabled={!ready}
        onChange={(e) => {
          setValue(e.target.value);
          handleAddressChange && handleAddressChange(e.target.value);
        }}
        placeholder="Location"
        className="form-input"
      />

      {status === 'OK' && <ul>{renderSuggestions()}</ul>}
    </div>
  );
};

const Map = ({ setGeo_location }: { setGeo_location: (location: any) => void }) => {
  const libraries = useMemo(() => ['places'], []);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: libraries as any,
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
      <div className={``}>
        <PlacesAutocomplete
          onAddressSelect={(address) => {
            getGeocode({ address: address }).then((results) => {
              const { lat, lng } = getLatLng(results[0]);
              setGeo_location({
                coordinates: [lng, lat],
                type: 'Point',
              });
            });
          }}
          handleAddressChange={handleAddressChange}
          defaultValue={localStorage.getItem('location') || ''}
        />
      </div>
    </div>
  );
};

export default Map;
