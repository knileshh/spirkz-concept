import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { languages, useI18n, validLocale } from './I18n';

export function LanguageSelector() {
  const { locale, setLocale, t } = useI18n();
  const selectedLanguage = languages.find(
    (language) => language.code === locale,
  )!;
  return (
    <div className="language-picker">
      <Select
        value={locale}
        onValueChange={(value) => {
          if (validLocale(value)) setLocale(value);
        }}
      >
        <SelectTrigger
          className="language-trigger"
          aria-label={t('Website language')}
          title={t('Language')}
        >
          <img
            className="language-flag"
            src={`/flags/${selectedLanguage.flag}.svg`}
            width="20"
            height="15"
            alt=""
          />
          <span lang={locale}>{locale.toUpperCase()}</span>
        </SelectTrigger>
        <SelectContent
          className="language-options"
          align="end"
          alignItemWithTrigger={false}
        >
          {languages.map((language) => (
            <SelectItem key={language.code} value={language.code}>
              <span className="language-option-label" lang={language.code}>
                <img
                  className="language-flag"
                  src={`/flags/${language.flag}.svg`}
                  width="20"
                  height="15"
                  alt=""
                />
                {language.name}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
