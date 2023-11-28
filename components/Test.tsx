// reference_url: https://www.99darshan.com/posts/interactive-maps-using-nextjs-and-google-maps
// reference_url: https://www.npmjs.com/package/use-places-autocomplete

import type { NextPage } from 'next';
import { useMemo, useState } from 'react';
import { useLoadScript, GoogleMap, MarkerF, CircleF } from '@react-google-maps/api';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';

const Map: NextPage = (props) => {
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [location, setLocation] = useState<string>('LA');
  const [geoLocation, setGeoLocation] = useState<any>({
    budget: {
      min: 1000,
      max: 5800,
    },
    payment: {
      payment_type: 'partial',
      payment_status: 'pending',
      amount_paid: 0,
      payment_ids: [],
    },
    chat_room_id: '65656a2b41551603e8b0bc89',
    order_status: 'pending',
    content_type: ['video'],
    vst: [],
    order_name: 'CLE',
    meeting_date_times: [],
    client_id: '648eceb5f2cac1a3da9f72c0',
    content_vertical: 'Wedding',
    description: 'Beige',
    location: 'LA',
    references: 'Ddd',
    shoot_datetimes: [
      {
        _id: '65656a2b41551603e8b0bc84',
        start_date_time: '2022-01-01T10:00:00.000Z',
        end_date_time: '2022-01-02T11:00:00.000Z',
        duration: 24,
        date_status: 'confirmed',
      },
    ],
    geo_location: {
      coordinates: [-73.97, 40.77],
      type: 'Point',
    },
    shoot_duration: 24,
    cp_ids: [],
    createdAt: '2023-11-28T04:18:51.309Z',
    updatedAt: '2023-11-28T04:18:51.647Z',
    id: '65656a2b41551603e8b0bc83',
  });

  props.onChildData(geoLocation);

  const libraries = useMemo(() => ['places'], []);
  const mapCenter = useMemo(() => ({ lat: lat, lng: lng }), [lat, lng]);

  const allowOrderWithoutCp = false;
  const hello = false;
  // need an empty array as state

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
  };

  return (
    <div>
      <div>
        {/* render Places Auto Complete and pass custom handler which updates the state */}
        <PlacesAutocomplete
          locationName={handleLocatoin}
          onAddressSelect={(address) => {
            getGeocode({ address: address }).then((results) => {
              const { lat, lng } = getLatLng(results[0]);

              setLat(lat);
              setLng(lng);
              setGeoLocation({
                coordinates: [lat, lng],
                type: 'Point',
                location: location,
              });
            });
          }}
        />
      </div>
    </div>
  );
};

const PlacesAutocomplete = (
  {
    locationName,
    onAddressSelect,
  }: {
    locationName: (value: string) => void;
    onAddressSelect?: (address: string) => void;
  },
  props: any
) => {
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
  const [location, setLocation] = useState<string>('LA');
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
    <div className="block w-full">
      <input value={value} disabled={!ready} onChange={(e) => setValue(e.target.value)} placeholder="123 Stariway To Heaven" className="form-input" />

      {status === 'OK' && <ul>{renderSuggestions()}</ul>}
    </div>
  );
};

export default Map;
