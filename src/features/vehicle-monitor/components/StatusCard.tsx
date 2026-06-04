import { motion } from "framer-motion";
import { Battery, Gauge, Navigation, Radar } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { TraccarDevice, TraccarPosition } from "../../../api/traccar.api";

import {
  formatConnectionStatus,
  formatSpeedFromKnots,
  formatTime,
} from "../utils/formatters";

import styles from "./StatusCard.module.scss";

type StatusCardProps = {
  device?: TraccarDevice;
  position: TraccarPosition | null;
};

function getNumberAttribute(
  attributes: Record<string, unknown> | undefined,
  key: string,
) {
  const value = attributes?.[key];

  return typeof value === "number" ? value : null;
}

function getStringAttribute(
  attributes: Record<string, unknown> | undefined,
  key: string,
) {
  const value = attributes?.[key];

  return typeof value === "string" ? value : null;
}

export function StatusCard({ device, position }: StatusCardProps) {
  const { t } = useTranslation();

  const batteryLevel = getNumberAttribute(position?.attributes, "batteryLevel");
  const accuracy = position?.accuracy;
  const activity = getStringAttribute(position?.attributes, "activity");
  const isOnline = device?.status === "online";

  return (
    <article className={styles.card} aria-labelledby="status-card-title">
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>{t("monitor.statusCard.eyebrow")}</p>
          <h3 id="status-card-title" className={styles.vehicleName}>
            {device?.name ?? t("monitor.noVehicle")}
          </h3>
        </div>

        <span className={styles.badge} data-status={device?.status}>
          <span className={styles.statusDot} data-status={device?.status} />
          {formatConnectionStatus(device?.status)}
        </span>
      </header>

      <dl className={styles.grid} aria-live="polite">
        <div className={styles.metric}>
          <dt>
            <Gauge size={16} aria-hidden="true" />
            {t("monitor.speed")}
          </dt>
          <dd>
            <motion.span
              key={position?.speed}
              initial={{ opacity: 0.4, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              {formatSpeedFromKnots(position?.speed)}
            </motion.span>
          </dd>
        </div>

        <div className={styles.metric}>
          <dt>
            <Battery size={16} aria-hidden="true" />
            {t("monitor.statusCard.battery")}
          </dt>
          <dd>
            {batteryLevel !== null ? `${Math.round(batteryLevel)}%` : "—"}
          </dd>
        </div>

        <div className={styles.metric}>
          <dt>
            <Radar size={16} aria-hidden="true" />
            {t("monitor.statusCard.activity")}
          </dt>
          <dd>{activity ?? (isOnline ? "active" : "offline")}</dd>
        </div>

        <div className={styles.metric}>
          <dt>
            <Navigation size={16} aria-hidden="true" />
            {t("monitor.statusCard.accuracy")}
          </dt>
          <dd>
            {typeof accuracy === "number" ? `${Math.round(accuracy)} m` : "—"}
          </dd>
        </div>

        <div className={styles.metricWide}>
          <dt>{t("monitor.lastUpdate")}</dt>
          <dd>
            <motion.span
              key={position?.fixTime ?? device?.lastUpdate}
              initial={{ opacity: 0.4 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
            >
              {formatTime(position?.fixTime ?? device?.lastUpdate)}
            </motion.span>
          </dd>
        </div>
      </dl>
    </article>
  );
}
