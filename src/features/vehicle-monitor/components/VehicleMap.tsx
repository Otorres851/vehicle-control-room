import L from "leaflet";
import { useEffect, useMemo } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";

import type { TraccarPosition } from "../../../api/traccar.api";

import styles from "./VehicleMap.module.scss";

type VehicleMapProps = {
  position: TraccarPosition | null;
};

const DEFAULT_CENTER: [number, number] = [4.711, -74.0721];

function MapController({ position }: VehicleMapProps) {
  const map = useMap();

  useEffect(() => {
    if (!position) return;

    map.flyTo([position.latitude, position.longitude], 15, {
      animate: true,
      duration: 0.9,
    });
  }, [map, position]);

  return null;
}

export function VehicleMap({ position }: VehicleMapProps) {
  const center: [number, number] = position
    ? [position.latitude, position.longitude]
    : DEFAULT_CENTER;

  const vehicleIcon = useMemo(() => {
    return L.divIcon({
      className: styles.marker,
      html: `
        <div class="${styles.markerShell}" style="transform: rotate(${position?.course ?? 0}deg)">
          <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
            <path d="M17 3L27 29L17 24L7 29L17 3Z" fill="currentColor"/>
          </svg>
        </div>
      `,
      iconSize: [42, 42],
      iconAnchor: [21, 21],
    });
  }, [position?.course]);

  return (
    <section className={styles.mapCard} aria-label="Vehicle location map">
      <MapContainer
        center={center}
        zoom={position ? 15 : 11}
        className={styles.map}
        scrollWheelZoom
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController position={position} />

        {position ? (
          <Marker
            position={[position.latitude, position.longitude]}
            icon={vehicleIcon}
          />
        ) : null}
      </MapContainer>

      {!position ? (
        <div className={styles.emptyState}>
          <p>Waiting for GPS signal</p>
          <span>
            The selected device is online, but no position has been received
            yet.
          </span>
        </div>
      ) : null}
    </section>
  );
}
