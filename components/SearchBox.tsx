import { ChangeEvent } from 'react';
import { FunctionComponent } from 'react';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { useGoogleMapsScript, Libraries } from 'use-google-maps-script';
import { Combobox } from '@headlessui/react';

interface ISearchBoxProps {
  onSelectAddress: (address: string, latitude: number | null, longitude: number | null) => void;
  defaultValue: string;
}

const libraries: Libraries = ['places'];

const SearchBox = ({ onSelectAddress, defaultValue }: ISearchBoxProps) => {
  const { isLoaded, loadError } = useGoogleMapsScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
    libraries,
  });

  if (!isLoaded) return null;
  if (loadError) return <div>Error loading</div>;

  return <ReadySearchBox onSelectAddress={onSelectAddress} defaultValue={defaultValue} />;
};

function ReadySearchBox({ onSelectAddress, defaultValue }: ISearchBoxProps) {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete({ debounce: 300, defaultValue });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (e.target.value === "") {
      onSelectAddress("", null, null);
    }
  };

  const handleSelect = async (address: string) => {
    setValue(address, false);
    clearSuggestions();
    try {
        const results = await getGeocode({address})
        const {lat, lng} = await getLatLng(results[0]);
        onSelectAddress(address, lat, lng);
    } catch(error) {
        console.error(error);
    }
  };

  return (
    <Combobox>
      <Combobox.Input onSelect={handleSelect} id="search" defaultValue={value} onChange={handleChange} placeholder="Search your location" className="form-input" autoComplete='off' />
      <Combobox.Options>
        {status === 'OK' &&
          data.map(({ place_id, description }) => (
            <Combobox.Option key={place_id} value={description}>
              {description}
            </Combobox.Option>
          ))}
      </Combobox.Options>
    </Combobox>
  );
}

export default SearchBox;
