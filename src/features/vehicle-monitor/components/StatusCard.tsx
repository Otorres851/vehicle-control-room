import { useTranslation } from "react-i18next";
import type { TraccarDevice, TraccarPosition } from "../../../api/traccar.api";

import {
  formatConnectionStatus,
  formatSpeedFromKnots,
  formatTime,
} from "../utils/formatters";

import { motion } from "framer-motion";
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

      <div>
        <dt>{t("monitor.lastUpdate")}</dt>
        <dd>
          <motion.span
            key={position?.fixTime}
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
          >
            {formatTime(position?.fixTime ?? device?.lastUpdate)}
          </motion.span>
        </dd>
      </div>
    </dl>
  );
}
