import L from "leaflet";
import { Expand, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import vehicleMarker from "../../../assets/images/vehicle-marker.png";

import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const [isMapOpen, setIsMapOpen] = useState(false);

  const center: [number, number] = smoothedPosition
    ? [smoothedPosition.latitude, smoothedPosition.longitude]
    : DEFAULT_CENTER;

  const vehicleIcon = useMemo(() => {
    return L.icon({
      iconUrl: vehicleMarker,
      iconSize: [48, 48],
      iconAnchor: [24, 24],
    });
  }, []);

  return (
    <section className={styles.mapCard} aria-labelledby="vehicle-map-title">
      <div className={styles.mapHeader}>
        <div>
          <p className={styles.eyebrow}>{t("map.liveLocation")}</p>
          <h3 id="vehicle-map-title" className={styles.title}>
            {t("map.interactiveMap")}
          </h3>
        </div>

        <div className={styles.mapActions}>
          <span className={styles.signalBadge} data-active={Boolean(position)}>
            <span />
            {position ? t("map.gpsLocked") : t("map.waitingSignal")}
          </span>

          <button
            type="button"
            className={styles.expandButton}
            onClick={() => setIsMapOpen(true)}
            aria-label={t("map.expand")}
          >
            <Expand size={18} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className={styles.mapShell}>
        <MapContainer
          keyboard
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
              alt={t("map.markerAlt")}
            />
          ) : null}
        </MapContainer>

        {position ? (
          <div className={styles.coordinatesCard}>
            <span>{t("map.coordinates")}</span>
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

      {isMapOpen ? (
        <div
          className={styles.mapOverlay}
          role="dialog"
          aria-modal="true"
          aria-label={t("map.interactiveMap")}
          onClick={() => setIsMapOpen(false)}
        >
          <div
            className={styles.mapModal}
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div>
                <p className={styles.eyebrow}>{t("map.liveLocation")}</p>
                <h3 className={styles.title}>{t("map.interactiveMap")}</h3>
              </div>

              <button
                type="button"
                className={styles.closeButton}
                onClick={() => setIsMapOpen(false)}
                aria-label={t("map.close")}
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            <MapContainer
              keyboard
              center={center}
              zoom={position ? 16 : 11}
              className={styles.fullMap}
              scrollWheelZoom
            >
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <MapController position={smoothedPosition} />

              {smoothedPosition ? (
                <Marker
                  position={[
                    smoothedPosition.latitude,
                    smoothedPosition.longitude,
                  ]}
                  icon={vehicleIcon}
                  alt={t("map.markerAlt")}
                />
              ) : null}
            </MapContainer>
          </div>
        </div>
      ) : null}
    </section>
  );
}
