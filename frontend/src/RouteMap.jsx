import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Polyline,
} from "@react-google-maps/api";


const containerStyle = {
  width: "100%",
  height: "250px",
};

const centerDefault = { lat: 50.85, lng: 4.35 }; // Brussel

export default function RouteMap({ origin, destination }) {
  const [path, setPath] = useState([]);
  const [error, setError] = useState(null);
  const mapRef = React.useRef(null); 

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places", "geometry"],
  });


  useEffect(() => {
    if (!isLoaded || !origin || !destination) return;

    const fetchRoute = async () => {
      const encodedOrigin = encodeURIComponent(origin);
      const encodedDestination = encodeURIComponent(destination);
      const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

      try {
        const res = await fetch(
          `https://routes.googleapis.com/directions/v2:computeRoutes`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Goog-Api-Key": key,
              "X-Goog-FieldMask": "routes.polyline.encodedPolyline",
            },
            body: JSON.stringify({
              origin: { address: origin },
              destination: { address: destination },
              travelMode: "DRIVE",
            }),
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error?.message || "Routes API failed");
        }

        const encoded = data.routes?.[0]?.polyline?.encodedPolyline;
        if (encoded) {
          const decoded = window.google.maps.geometry.encoding.decodePath(encoded);
          setPath(decoded);
          setError(null);
          if (mapRef.current && decoded.length > 0) {
            const bounds = new window.google.maps.LatLngBounds();
            decoded.forEach((latLng) => bounds.extend(latLng));
            mapRef.current.fitBounds(bounds);
          }
        } else {
          setPath([]);
          setError("Geen route gevonden.");
        }
      } catch (err) {
        console.error("Route ophalen mislukt:", err);
        setError(err.message);
      }
    };

    fetchRoute();
  }, [isLoaded, origin, destination]);

  

  if (!isLoaded) return <p>📍 Kaart wordt geladen...</p>;
  if (!origin || !destination) return <p>⛔️ Onvolledige routegegevens.</p>;

  return (
    <div style={{ marginTop: "10px", marginBottom: "10px" }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={centerDefault}
        zoom={7}
        onLoad={map => (mapRef.current = map)}
      >
        {path.length > 0 && (
          <Polyline
            path={path}
            options={{ strokeColor: "#4285F4", strokeWeight: 5 }}
          />
        )}
      </GoogleMap>
      {error && (
        <p style={{ color: "red", fontSize: "0.9rem" }}>{error}</p>
      )}
    </div>
  );
}
