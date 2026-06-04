import {
  Activity,
  Bell,
  Car,
  Languages,
  LayoutDashboard,
  MapPinned,
  Moon,
  Radio,
  Settings,
  ShieldCheck,
  SunMedium,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { VehicleMonitorPanel } from "../../../features/vehicle-monitor/components/VehicleMonitorPanel";
import { useTheme } from "../../../hooks/useTheme";

import styles from "./AppShell.module.scss";

export function AppShell() {
  const { theme, toggleTheme } = useTheme();
  const { i18n, t } = useTranslation();

  const isDark = theme === "dark";
  const currentLanguage = i18n.language.startsWith("es") ? "es" : "en";

  const handleLanguageChange = async (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const nextLanguage = event.target.value;

    await i18n.changeLanguage(nextLanguage);
    localStorage.setItem("language", nextLanguage);
  };

  return (
    <main className={styles.shell}>
      <aside className={styles.sidebar} aria-label="Control room navigation">
        <div className={styles.sidebarBrand}>
          <div className={styles.logo} aria-hidden="true">
            <Activity size={22} strokeWidth={2.4} />
          </div>

          <div>
            <strong>Traccar</strong>
            <span>Control Room</span>
          </div>
        </div>

        <nav className={styles.nav} aria-label="Primary navigation">
          <a className={styles.navItemActive} href="#overview">
            <LayoutDashboard size={18} />
            Resumen
          </a>

          <a className={styles.navItem} href="#monitor">
            <Radio size={18} />
            Monitoreo
          </a>

          <a className={styles.navItem} href="#map">
            <MapPinned size={18} />
            Mapa
          </a>

          <a className={styles.navItem} href="#vehicles">
            <Car size={18} />
            Vehículos
          </a>

          <a className={styles.navItem} href="#settings">
            <Settings size={18} />
            Configuración
          </a>
        </nav>

        <div className={styles.operatorCard}>
          <div className={styles.avatar}>AD</div>
          <div>
            <strong>Admin Demo</strong>
            <span>Operador activo</span>
          </div>
        </div>
      </aside>

      <section className={styles.content}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>{t("app.eyebrow")}</p>
            <h1>{t("app.title")}</h1>
          </div>

          <div className={styles.actions}>
            <label className={styles.languageControl}>
              <span className={styles.visuallyHidden}>
                {t("app.language.label")}
              </span>

              <Languages size={16} aria-hidden="true" />

              <select value={currentLanguage} onChange={handleLanguageChange}>
                <option value="en">EN</option>
                <option value="es">ES</option>
              </select>
            </label>

            <button
              type="button"
              className={styles.themeToggle}
              onClick={toggleTheme}
              aria-label={
                isDark
                  ? t("app.theme.switchToLight")
                  : t("app.theme.switchToDark")
              }
            >
              <span className={styles.themeIcon} aria-hidden="true">
                {isDark ? <Moon size={16} /> : <SunMedium size={16} />}
              </span>

              <span>{isDark ? t("app.theme.dark") : t("app.theme.light")}</span>
            </button>
          </div>
        </header>

        <section id="overview" className={styles.overview}>
          <article className={styles.heroCard}>
            <span className={styles.liveBadge}>
              <span />
              En tiempo real
            </span>

            <h2>{t("app.hero.title")}</h2>
            <p>{t("app.hero.description")}</p>

            <div className={styles.heroActions}>
              <a href="#monitor" className={styles.primaryAction}>
                Ir al monitoreo
              </a>

              <a href="#map" className={styles.secondaryAction}>
                Ver mapa
                <MapPinned size={16} />
              </a>
            </div>
          </article>

          <article className={styles.systemCard}>
            <header>
              <div>
                <ShieldCheck size={22} />
                <h2>{t("app.preview.gateway")}</h2>
              </div>

              <span>Conectado</span>
            </header>

            <div className={styles.systemMetrics}>
              <div>
                <Activity size={20} />
                <span>{t("app.preview.apiMode")}</span>
                <strong>{t("app.preview.pollingReady")}</strong>
              </div>

              <div>
                <MapPinned size={20} />
                <span>{t("app.preview.mapEngine")}</span>
                <strong>Leaflet</strong>
              </div>

              <div>
                <Bell size={20} />
                <span>{t("app.preview.accessibility")}</span>
                <strong>{t("app.preview.wcag")}</strong>
              </div>
            </div>
          </article>
        </section>

        <section id="monitor">
          <VehicleMonitorPanel />
        </section>
      </section>
    </main>
  );
}
