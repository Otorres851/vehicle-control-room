import {
  Activity,
  ArrowRight,
  Bell,
  Car,
  CheckCircle,
  ChevronDown,
  Languages,
  LayoutDashboard,
  MapPinned,
  Moon,
  Radio,
  Settings,
  ShieldCheck,
  SunMedium,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import heroVehicle from "../../../assets/images/hero-vehicle.png";
import { VehicleMonitorPanel } from "../../../features/vehicle-monitor/components/VehicleMonitorPanel";
import { useTraccarSession } from "../../../features/vehicle-monitor/hooks/useTraccarSession";
import { useTheme } from "../../../hooks/useTheme";

import styles from "./AppShell.module.scss";

export function AppShell() {
  const { theme, toggleTheme } = useTheme();
  const { i18n, t } = useTranslation();
  const sessionQuery = useTraccarSession();
  const isGatewayConnected = sessionQuery.isSuccess;

  const isDark = theme === "dark";
  const currentLanguage = i18n.language.startsWith("es") ? "es" : "en";
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const languageDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        languageDropdownRef.current &&
        !languageDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLanguageOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsLanguageOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <main className={styles.shell}>
      <aside className={styles.sidebar} aria-label="Control room navigation">
        <div className={styles.sidebarBrand}>
          <div className={styles.logo} aria-hidden="true">
            <Activity size={22} strokeWidth={2.4} />
          </div>

          <div>
            <strong>{t("app.brand.name")}</strong>
            <span>{t("app.brand.subtitle")}</span>
          </div>
        </div>

        <nav className={styles.nav} aria-label="Primary navigation">
          <a className={styles.navItemActive} href="#overview">
            <LayoutDashboard size={18} />
            {t("app.nav.overview")}
          </a>

          <a className={styles.navItem} href="#monitor">
            <Radio size={18} />
            {t("app.nav.monitoring")}
          </a>

          <a className={styles.navItem} href="#map">
            <MapPinned size={18} />
            {t("app.nav.map")}
          </a>

          <a className={styles.navItem} href="#vehicles">
            <Car size={18} />
            {t("app.nav.vehicles")}
          </a>

          <a className={styles.navItem} href="#settings">
            <Settings size={18} />
            {t("app.nav.settings")}
          </a>
        </nav>

        <div className={styles.operatorCard}>
          <div className={styles.avatar}>AD</div>
          <div>
            <strong>{t("app.operator.name")}</strong>
            <span>{t("app.operator.active")}</span>
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
            <div ref={languageDropdownRef} className={styles.languageDropdown}>
              <button
                type="button"
                className={styles.languageTrigger}
                onClick={() => setIsLanguageOpen((current) => !current)}
                aria-expanded={isLanguageOpen}
                aria-haspopup="listbox"
                aria-label={t("app.language.label")}
              >
                <Languages size={16} aria-hidden="true" />
                <span>
                  {currentLanguage === "es"
                    ? t("app.language.spanish")
                    : t("app.language.english")}
                </span>
                <ChevronDown
                  size={16}
                  className={styles.chevron}
                  data-open={isLanguageOpen}
                  aria-hidden="true"
                />
              </button>

              {isLanguageOpen ? (
                <div className={styles.languageMenu} role="listbox">
                  <button
                    type="button"
                    role="option"
                    aria-selected={currentLanguage === "en"}
                    onClick={() => {
                      void i18n.changeLanguage("en");
                      localStorage.setItem("language", "en");
                      setIsLanguageOpen(false);
                    }}
                  >
                    {t("app.language.english")}
                  </button>

                  <button
                    type="button"
                    role="option"
                    aria-selected={currentLanguage === "es"}
                    onClick={() => {
                      void i18n.changeLanguage("es");
                      localStorage.setItem("language", "es");
                      setIsLanguageOpen(false);
                    }}
                  >
                    {t("app.language.spanish")}
                  </button>
                </div>
              ) : null}
            </div>

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
              <span className={styles.liveDot} />
              {t("app.hero.badge", "En tiempo real")}
            </span>

            <h2>{t("app.hero.title")}</h2>
            <p>{t("app.hero.description")}</p>

            <div className={styles.vehicleVisual} aria-hidden="true">
              <img src={heroVehicle} alt="" />
              <span className={styles.radarRing} />
            </div>

            <div className={styles.heroActions}>
              <a href="#monitor" className={styles.terciaryAction}>
                {t("app.hero.terciaryAction")}
                <ArrowRight size={16} aria-hidden="true" />
              </a>

              <a href="#map" className={styles.secondaryAction}>
                {t("app.hero.secondaryAction")}
                <MapPinned size={16} aria-hidden="true" />
              </a>
            </div>
          </article>

          <article className={styles.systemCard}>
            <header>
              <div>
                <ShieldCheck size={22} />
                <h2>{t("app.preview.gateway")}</h2>
              </div>

              <span
                className={styles.gatewayStatus}
                data-status={isGatewayConnected ? "online" : "offline"}
              >
                {isGatewayConnected
                  ? t("app.preview.connected")
                  : t("app.preview.disconnected")}
              </span>
            </header>

            <div className={styles.systemMetrics}>
              <div className={styles.metricCard}>
                <Activity size={20} className={styles.metricApi} />

                <div className={styles.metricBody}>
                  <span>{t("app.preview.apiMode")}</span>
                  <strong>{t("app.preview.pollingReady")}</strong>
                </div>

                <CheckCircle
                  size={18}
                  className={styles.metricSuccess}
                  data-status={isGatewayConnected ? "online" : "offline"}
                />
              </div>

              <div className={styles.metricCard}>
                <MapPinned size={20} className={styles.metricMap} />

                <div className={styles.metricBody}>
                  <span>{t("app.preview.mapEngine")}</span>
                  <strong>{t("app.preview.leaflet")}</strong>
                </div>

                <CheckCircle
                  size={18}
                  className={styles.metricSuccess}
                  data-status={isGatewayConnected ? "online" : "offline"}
                />
              </div>

              <div className={styles.metricCard}>
                <Bell size={20} className={styles.metricAccessibility} />

                <div className={styles.metricBody}>
                  <span>{t("app.preview.accessibility")}</span>
                  <strong>{t("app.preview.wcag")}</strong>
                </div>

                <CheckCircle
                  size={18}
                  className={styles.metricSuccess}
                  data-status={isGatewayConnected ? "online" : "offline"}
                />
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
