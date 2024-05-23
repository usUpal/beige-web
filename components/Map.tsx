import { useMemo } from 'react';
import { useLoadScript, } from '@react-google-maps/api';
import usePlacesAutocomplete, { getGeocode, getLatLng, } from 'use-places-autocomplete';

const PlacesAutocomplete = ({
  onAddressSelect,
}: {
  locationName?: (value: string) => void;
  onAddressSelect?: (address: string) => void;
}, props: any) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    debounce: 300,
    cache: 86400,
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
          localStorage.setItem("location", description);
        }}
      >
        <strong>{main_text}</strong> <small>{secondary_text}</small>
      </li>
      );
    });
  };

  return (
    <div className='block w-full'>
      <input
        value={value}
        disabled={!ready}
        onChange={(e) => setValue(e.target.value)}
        placeholder="123 Stariway To Heaven"
        className="form-input"
      />

      {status === 'OK' && (
        <ul>{renderSuggestions()}</ul>
      )}
    </div>
  );
};

const Map = () => {

  const libraries = useMemo(() => ['places'], []);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: libraries as any,
  });

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <div>
        
        <PlacesAutocomplete
          onAddressSelect={(address) => {
            getGeocode({ address: address }).then((results) => {
              const { lat, lng } = getLatLng(results[0]);

              localStorage.setItem("latitude", lat.toString());
              localStorage.setItem("longitude", lng.toString());
            });
          }}
        />

      </div>
    </div>
  );
};

export default Map;
