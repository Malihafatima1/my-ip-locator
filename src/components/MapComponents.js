import React, { useEffect, useState } from "react";
import { Map, Marker } from "react-map-gl"; 
import { RiUserLocationFill } from "react-icons/ri"; // import from specific icon package
import "mapbox-gl/dist/mapbox-gl.css"; 

const API_KEY = "VMiwUJveHi4iimF5JW9f";

const MapComponents = ({ lat, lon }) => {
  const [viewport, setViewport] = useState({
    latitude: lat || 0,
    longitude: lon || 0,
    zoom: 14,
    bearing: 0,
    pitch: 0,

  });

  // Update viewport when lat/lon change
  useEffect(() => {
    setViewport((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lon,
    }));
  }, [lat, lon]);

  return (
    <div className="map" >
      <Map
        {...viewport}
        mapLib={import("maplibre-gl")} 
        mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${API_KEY}`}
        onMove={(evt) => setViewport(evt.viewport)}
      >
        <Marker latitude={lat} longitude={lon} anchor="bottom">
          <RiUserLocationFill size={25} color="blue" />
        </Marker>
        </Map>
    </div>
  );
};

export default MapComponents;
