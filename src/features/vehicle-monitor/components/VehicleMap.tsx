import L from "leaflet";
import { useEffect, useMemo } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";

import type { TraccarPosition } from "../../../api/traccar.api";
import { useSmoothedPosition } from "../hooks/useSmoothedPosition";

import styles from "./VehicleMap.module.scss";

type VehicleMapProps = {
  position: TraccarPosition | null;
  emptyTitle: string;
  emptyDescription: string;
};

const DEFAULT_CENTER: [number, number] = [4.711, -74.0721];

type MapControllerProps = {
  position: TraccarPosition | null;
};

function MapController({ position }: MapControllerProps) {
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

export function VehicleMap({
  position,
  emptyTitle,
  emptyDescription,
}: VehicleMapProps) {
  const smoothedPosition = useSmoothedPosition(position);

  const center: [number, number] = smoothedPosition
    ? [smoothedPosition.latitude, smoothedPosition.longitude]
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
      iconSize: [46, 46],
      iconAnchor: [23, 23],
    });
  }, [position?.course]);

  return (
    <section className={styles.mapCard} aria-labelledby="vehicle-map-title">
      <div className={styles.mapHeader}>
        <div>
          <p className={styles.eyebrow}>Live location</p>
          <h3 id="vehicle-map-title" className={styles.title}>
            Interactive GPS map
          </h3>
        </div>

        <span className={styles.signalBadge} data-active={Boolean(position)}>
          <span />
          {position ? "GPS locked" : "Waiting signal"}
        </span>
      </div>

      <div className={styles.mapShell}>
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

          <MapController position={smoothedPosition} />

          {smoothedPosition ? (
            <Marker
              position={[smoothedPosition.latitude, smoothedPosition.longitude]}
              icon={vehicleIcon}
            />
          ) : null}
        </MapContainer>

        {position ? (
          <div className={styles.coordinatesCard}>
            <span>Coordinates</span>
            <strong>
              {position.latitude.toFixed(5)}, {position.longitude.toFixed(5)}
            </strong>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>{emptyTitle}</p>
            <span>{emptyDescription}</span>
          </div>
        )}
      </div>
    </section>
  );
}
