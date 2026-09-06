import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import en from './locales/en.json';
import es from './locales/es.json';
import de from './locales/de.json';
import fr from './locales/fr.json';
import ru from './locales/ru.json';
import mt from './locales/mt.json';
import ka from './locales/ka.json';

export const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'de', name: 'Deutsch' },
  { code: 'fr', name: 'Français' },
  { code: 'ru', name: 'Русский' },
  { code: 'mt', name: 'Malti' },
  { code: 'ka', name: 'ქართული' },
] as const;
export type Locale = (typeof languages)[number]['code'];
export const catalogs: Record<Locale, Record<string, string>> = {
  en,
  es,
  de,
  fr,
  ru,
  mt,
  ka,
};
export function validLocale(value: unknown): value is Locale {
  return languages.some((item) => item.code === value);
}
export function resolveLocale(
  query: string | null,
  saved: string | null,
): Locale {
  return validLocale(query) ? query : validLocale(saved) ? saved : 'en';
}
export function makeTranslator(locale: Locale) {
  return (text: string, values: Record<string, string | number> = {}) => {
    const translated = catalogs[locale][text] ?? text;
    return translated.replace(/\{(\w+)\}/g, (match, key: string) =>
      String(values[key] ?? match),
    );
  };
}
function translateData<T>(data: T, t: ReturnType<typeof makeTranslator>): T {
  if (typeof data === 'string') return t(data) as T;
  if (Array.isArray(data))
    return data.map((item) => translateData(item, t)) as T;
  if (data && typeof data === 'object')
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        translateData(value, t),
      ]),
    ) as T;
  return data;
}
const defaultTranslator = makeTranslator('en');
const Context = createContext({
  locale: 'en' as Locale,
  setLocale: (_locale: Locale) => {},
  t: defaultTranslator,
  localize: <T,>(data: T) => data,
});
export function LanguageProvider({
  children,
  initialLocale,
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocale] = useState<Locale>(() => {
    if (initialLocale) return initialLocale;
    if (typeof window === 'undefined') return 'en';
    let saved: string | null = null;
    try {
      saved = localStorage.getItem('spirkz-language');
    } catch {
      /* The URL still works when storage is unavailable. */
    }
    return resolveLocale(
      new URL(window.location.href).searchParams.get('lang'),
      saved,
    );
  });
  const value = useMemo(() => {
    const t = makeTranslator(locale);
    return {
      locale,
      setLocale,
      t,
      localize: <T,>(data: T) => translateData(data, t),
    };
  }, [locale]);
  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = value.t('Spirkz — A little scroll. A lot to discover.');
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        'content',
        value.t(
          'Your curiosity deserves a better feed. Explore big ideas in short lessons — and turn your next spare minute into something good.',
        ),
      );
    const url = new URL(window.location.href);
    url.searchParams.set('lang', locale);
    history.replaceState(history.state, '', url);
    try {
      localStorage.setItem('spirkz-language', locale);
    } catch {
      /* Browsing does not depend on local storage. */
    }
  }, [locale, value]);
  useEffect(() => {
    const onBack = () => {
      const code = new URL(window.location.href).searchParams.get('lang');
      setLocale(validLocale(code) ? code : 'en');
    };
    window.addEventListener('popstate', onBack);
    return () => window.removeEventListener('popstate', onBack);
  }, []);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useI18n() {
  return useContext(Context);
}
