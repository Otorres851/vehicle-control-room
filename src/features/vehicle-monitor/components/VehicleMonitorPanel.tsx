import { Clock, Gauge, MapPinned, Radio, Satellite } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useDevices } from "../hooks/useDevices";
import { usePositions } from "../hooks/usePositions";
import { useTraccarSession } from "../hooks/useTraccarSession";
import {
  formatConnectionStatus,
  formatSpeedFromKnots,
  formatTime,
} from "../utils/formatters";

import { StatusCard } from "./StatusCard";
import { VehicleMap } from "./VehicleMap";

import styles from "./VehicleMonitorPanel.module.scss";

export function VehicleMonitorPanel() {
  const { t } = useTranslation();

  const sessionQuery = useTraccarSession();

  // Authentication is required before accessing protected Traccar resources.
  const isAuthenticated = sessionQuery.isSuccess;

  const devicesQuery = useDevices(isAuthenticated);
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null);

  const devices = useMemo(() => devicesQuery.data ?? [], [devicesQuery.data]);

  // The monitor falls back to the first available vehicle on initial load.
  const selectedDevice = useMemo(() => {
    return (
      devices.find((device) => device.id === selectedDeviceId) ?? devices[0]
    );
  }, [devices, selectedDeviceId]);

  const activeDeviceId = selectedDevice?.id ?? null;

  // Positions are polled periodically once there is an active device to monitor.
  const positionsQuery = usePositions(Boolean(activeDeviceId));

  const positions = useMemo(
    () => positionsQuery.data ?? [],
    [positionsQuery.data],
  );

  // Match the selected device with its latest telemetry payload.
  const selectedPosition = useMemo(() => {
    if (!activeDeviceId) return null;

    return (
      positions.find((position) => position.deviceId === activeDeviceId) ?? null
    );
  }, [positions, activeDeviceId]);

  const gpsAccuracy = selectedPosition?.accuracy;
  const isLoading = sessionQuery.isLoading || devicesQuery.isLoading;
  const isError = sessionQuery.isError || devicesQuery.isError;
  const isOnline = selectedDevice?.status === "online";

  if (isLoading) {
    return (
      <section className={styles.panel} aria-label={t("monitor.loading")}>
        <div className={styles.skeletonTop}>
          <div className={styles.skeletonTitle} />
          <div className={styles.skeletonBadge} />
        </div>

        <div className={styles.skeletonMetrics}>
          <div />
          <div />
          <div />
          <div />
          <div className={styles.skeletonWide} />
        </div>

        <div className={styles.skeletonMap} />
      </section>
    );
  }

  // The challenge explicitly requires a resilient error state.
  if (isError) {
    return (
      <section className={styles.panel} role="alert" aria-live="assertive">
        <p className={styles.errorEyebrow}>{t("monitor.error.eyebrow")}</p>
        <h2 className={styles.errorTitle}>{t("monitor.error.title")}</h2>
        <p className={styles.errorText}>{t("monitor.error.description")}</p>

        <button
          type="button"
          className={styles.retryButton}
          onClick={() => {
            void sessionQuery.refetch();
            void devicesQuery.refetch();
          }}
        >
          {t("monitor.error.retry")}
        </button>
      </section>
    );
  }

  if (!devices.length) {
    return (
      <section className={styles.panel} role="status">
        <p className={styles.errorEyebrow}>
          {t("monitor.emptyDevices.eyebrow")}
        </p>
        <h2 className={styles.errorTitle}>{t("monitor.emptyDevices.title")}</h2>
        <p className={styles.errorText}>
          {t("monitor.emptyDevices.description")}
        </p>
      </section>
    );
  }

  return (
    <section
      id="map"
      className={styles.dashboard}
      aria-labelledby="monitor-title"
    >
      <header className={styles.dashboardHeader}>
        <div>
          <p className={styles.eyebrow}>{t("monitor.eyebrow")}</p>
          <h2 id="monitor-title" className={styles.title}>
            {t("monitor.title")}
          </h2>
          <p className={styles.refreshState} role="status" aria-live="polite">
            {positionsQuery.isFetching
              ? t("monitor.refreshing")
              : t("monitor.synced")}
          </p>
        </div>

        <label className={styles.selector} htmlFor="vehicle-selector">
          <span>{t("monitor.vehicle")}</span>

          <select
            id="vehicle-selector"
            value={selectedDevice?.id ?? ""}
            onChange={(event) =>
              setSelectedDeviceId(Number(event.target.value))
            }
          >
            {devices.map((device) => (
              <option key={device.id} value={device.id}>
                {device.name}
              </option>
            ))}
          </select>
        </label>
      </header>

      <div className={styles.kpiGrid} aria-label="Vehicle key metrics">
        <article className={styles.kpiCard}>
          <div className={styles.kpiIcon} data-tone="blue">
            <Radio size={20} />
          </div>
          <span>{t("monitor.connection")}</span>
          <strong>{formatConnectionStatus(selectedDevice?.status)}</strong>
          <small>{isOnline ? "Live signal" : "No active signal"}</small>
        </article>

        <article className={styles.kpiCard}>
          <div className={styles.kpiIcon} data-tone="green">
            <Gauge size={20} />
          </div>
          <span>{t("monitor.speed")}</span>
          <strong>{formatSpeedFromKnots(selectedPosition?.speed)}</strong>
          <small>{selectedPosition ? "GPS telemetry" : "Waiting data"}</small>
        </article>

        <article className={styles.kpiCard}>
          <div className={styles.kpiIcon} data-tone="purple">
            <Satellite size={20} />
          </div>
          <span>{t("monitor.statusCard.accuracy")}</span>
          <strong>
            {typeof gpsAccuracy === "number"
              ? `${Math.round(gpsAccuracy)} m`
              : "—"}
          </strong>
          <small>Position quality</small>
        </article>

        <article className={styles.kpiCard}>
          <div className={styles.kpiIcon} data-tone="amber">
            <Clock size={20} />
          </div>
          <span>{t("monitor.lastUpdate")}</span>
          <strong>
            {formatTime(
              selectedPosition?.fixTime ?? selectedDevice?.lastUpdate,
            )}
          </strong>
          <small>Polling cada 5 segundos</small>
        </article>
      </div>

      {positionsQuery.isError ? (
        <div className={styles.inlineError} role="alert">
          <strong>{t("monitor.positionsError.title")}</strong>
          <span>{t("monitor.positionsError.description")}</span>
        </div>
      ) : null}

      <div className={styles.monitorGrid}>
        <div className={styles.mapArea}>
          <div className={styles.mapToolbar}>
            <div>
              <strong>{t("map.title", "Mapa en vivo")}</strong>
              <span>{selectedDevice?.name}</span>
            </div>

            <span
              className={styles.livePill}
              data-active={Boolean(selectedPosition)}
            >
              <span />
              {selectedPosition ? "GPS locked" : "Waiting GPS"}
            </span>
          </div>

          <VehicleMap
            position={selectedPosition}
            emptyTitle={t("monitor.emptyPosition.title")}
            emptyDescription={t("monitor.emptyPosition.description")}
          />
        </div>

        <aside
          className={styles.sidePanel}
          aria-label="Selected vehicle details"
        >
          <header className={styles.vehicleSummary}>
            <span
              className={styles.summaryStatus}
              data-status={selectedDevice?.status}
            />
            <div>
              <strong>{selectedDevice?.name}</strong>
              <small>{selectedDevice?.uniqueId}</small>
            </div>
            <MapPinned size={18} />
          </header>

          <StatusCard device={selectedDevice} position={selectedPosition} />
        </aside>
      </div>
    </section>
  );
}
