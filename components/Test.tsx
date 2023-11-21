// reference_url: https://www.99darshan.com/posts/interactive-maps-using-nextjs-and-google-maps
// reference_url: https://www.npmjs.com/package/use-places-autocomplete

import type { NextPage } from 'next';
import { useMemo, useState } from 'react';
import { useLoadScript, GoogleMap, MarkerF, CircleF, } from '@react-google-maps/api';
import usePlacesAutocomplete, { getGeocode, getLatLng, } from 'use-places-autocomplete';

const Map: NextPage = (props) => {
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [location, setLocation] = useState<string>("LA");
  const [geoLocation, setGeoLocation] = useState<any>();

  props.onChildData(geoLocation);

  const libraries = useMemo(() => ['places'], []);
  const mapCenter = useMemo(() => ({ lat: lat, lng: lng }), [lat, lng]);

  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: true,
      scrollwheel: false,
    }),
    []
  );

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: libraries as any,
  });

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  const handleLocatoin = (childLocation: any) => {
    setLocation(childLocation);
  }

  return (
    <div>
      <div>
        {/* render Places Auto Complete and pass custom handler which updates the state */}
        <PlacesAutocomplete locationName={handleLocatoin}
          onAddressSelect={(address) => {
            getGeocode({ address: address }).then((results) => {
              const { lat, lng } = getLatLng(results[0]);

              setLat(lat);
              setLng(lng);
              setGeoLocation({
                "coordinates": [lat, lng],
                "type": "Point",
                "location": location,
              });
            });
          }}
        />
      </div>
    </div>
  );
};

const PlacesAutocomplete = ({
  locationName,
  onAddressSelect,
}: {
  locationName: (value: string) => void;
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

  locationName(value);
  const [location, setLocation] = useState<string>("LA");
  const renderSuggestions = () => {
    return data.map((suggestion) => {
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

export default Map;
