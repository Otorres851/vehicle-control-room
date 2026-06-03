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

export function StatusCard({ device, position }: StatusCardProps) {
  const { t } = useTranslation();

  return (
    <dl className={styles.statusGrid} aria-live="polite">
      <div>
        <dt>{t("monitor.name")}</dt>
        <dd>{device?.name ?? t("monitor.noVehicle")}</dd>
      </div>

      <div>
        <dt>{t("monitor.connection")}</dt>
        <dd>
          <span className={styles.statusDot} data-status={device?.status} />
          {formatConnectionStatus(device?.status)}
        </dd>
      </div>

      <div>
        <dt>{t("monitor.speed")}</dt>
        <dd>{formatSpeedFromKnots(position?.speed)}</dd>
      </div>

      <div>
        <dt>{t("monitor.lastUpdate")}</dt>
        <dd>{formatTime(position?.fixTime ?? device?.lastUpdate)}</dd>
      </div>
    </dl>
  );
}
