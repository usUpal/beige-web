import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

const GeoLocationMap = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), {
  ssr: false
});

const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), {
  ssr: false
});

const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), {
  ssr: false
});

const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), {
  ssr: false
});

const MapComponent = () => {
  const position = [51.505, -0.09];

  return (
    <GeoLocationMap center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position}>
        <Popup>
          Beige Map
        </Popup>
      </Marker>
    </GeoLocationMap>
  )
}

export default MapComponent;
