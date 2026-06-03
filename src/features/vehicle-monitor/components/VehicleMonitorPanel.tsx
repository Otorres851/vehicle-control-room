import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { VehicleMap } from "./VehicleMap";

import { useDevices } from "../hooks/useDevices";
import { usePositions } from "../hooks/usePositions";
import { useTraccarSession } from "../hooks/useTraccarSession";

import styles from "./VehicleMonitorPanel.module.scss";

import {
  formatConnectionStatus,
  formatSpeedFromKnots,
  formatTime,
} from "../utils/formatters";

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

  const isLoading = sessionQuery.isLoading || devicesQuery.isLoading;
  const isError = sessionQuery.isError || devicesQuery.isError;

  if (isLoading) {
    return (
      <section className={styles.panel} aria-label={t("monitor.loading")}>
        <div className={styles.skeletonHeader} />
        <div className={styles.skeletonGrid}>
          <div />
          <div />
          <div />
        </div>
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

  return (
    <section className={styles.panel} aria-labelledby="monitor-title">
      <div className={styles.panelHeader}>
        <div>
          <p className={styles.eyebrow}>{t("monitor.eyebrow")}</p>
          <h2 id="monitor-title" className={styles.title}>
            {t("monitor.title")}
          </h2>
        </div>

        <label className={styles.selector}>
          <span>{t("monitor.vehicle")}</span>

          <select
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
      </div>

      <dl className={styles.statusGrid} aria-live="polite">
        <div>
          <dt>{t("monitor.name")}</dt>
          <dd>{selectedDevice?.name ?? t("monitor.noVehicle")}</dd>
        </div>

        <div>
          <dt>{t("monitor.connection")}</dt>
          <dd>
            <span
              className={styles.statusDot}
              data-status={selectedDevice?.status}
            />
            {formatConnectionStatus(selectedDevice?.status)}
          </dd>
        </div>

        <div>
          <dt>{t("monitor.speed")}</dt>
          <dd>{formatSpeedFromKnots(selectedPosition?.speed)}</dd>
        </div>

        <div>
          <dt>{t("monitor.lastUpdate")}</dt>
          <dd>
            {formatTime(
              selectedPosition?.fixTime ?? selectedDevice?.lastUpdate,
            )}
          </dd>
        </div>
      </dl>
      {!selectedPosition ? (
        <div className={styles.emptyPosition} role="status">
          <strong>{t("monitor.emptyPosition.title")}</strong>
          <span>{t("monitor.emptyPosition.description")}</span>
        </div>
      ) : null}
      <VehicleMap position={selectedPosition} />
    </section>
  );
}
