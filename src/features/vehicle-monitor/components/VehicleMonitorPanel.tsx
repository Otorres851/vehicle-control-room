import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { VehicleMap } from "./VehicleMap";

import { useDevices } from "../hooks/useDevices";
import { usePositions } from "../hooks/usePositions";
import { useTraccarSession } from "../hooks/useTraccarSession";

import styles from "./VehicleMonitorPanel.module.scss";

import { StatusCard } from "./StatusCard";

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
    <section className={styles.panel} aria-labelledby="monitor-title">
      <div className={styles.panelHeader}>
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
      </div>

      <StatusCard device={selectedDevice} position={selectedPosition} />
      {positionsQuery.isError ? (
        <div className={styles.inlineError} role="alert">
          <strong>{t("monitor.positionsError.title")}</strong>
          <span>{t("monitor.positionsError.description")}</span>
        </div>
      ) : null}
      <VehicleMap
        position={selectedPosition}
        emptyTitle={t("monitor.emptyPosition.title")}
        emptyDescription={t("monitor.emptyPosition.description")}
      />
    </section>
  );
}
