import { Activity, Languages, Moon, SunMedium } from "lucide-react";
import { useTranslation } from "react-i18next";

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
      <header className={styles.header}>
        <div className={styles.brand}>
          <div className={styles.logo} aria-hidden="true">
            <Activity size={22} strokeWidth={2.4} />
          </div>

          <div>
            <p className={styles.eyebrow}>{t("app.eyebrow")}</p>
            <h1 className={styles.title}>{t("app.title")}</h1>
          </div>
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

      <section className={styles.hero} aria-labelledby="dashboard-title">
        <div className={styles.heroContent}>
          <p className={styles.kicker}>{t("app.hero.kicker")}</p>

          <h2 id="dashboard-title" className={styles.heroTitle}>
            {t("app.hero.title")}
          </h2>

          <p className={styles.heroText}>{t("app.hero.description")}</p>
        </div>

        <div
          className={styles.previewCard}
          aria-label={t("app.preview.gateway")}
        >
          <div className={styles.cardHeader}>
            <span className={styles.pulse} />
            <span>{t("app.preview.gateway")}</span>
          </div>

          <dl className={styles.metrics}>
            <div>
              <dt>{t("app.preview.apiMode")}</dt>
              <dd>{t("app.preview.pollingReady")}</dd>
            </div>

            <div>
              <dt>{t("app.preview.mapEngine")}</dt>
              <dd>Leaflet</dd>
            </div>

            <div>
              <dt>{t("app.preview.accessibility")}</dt>
              <dd>{t("app.preview.wcag")}</dd>
            </div>
          </dl>
        </div>
      </section>
    </main>
  );
}
