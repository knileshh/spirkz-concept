import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { Globe } from './icons';
import { languages, useI18n, validLocale } from './I18n';

export function LanguageSelector() {
  const { locale, setLocale, t } = useI18n();
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
          <Globe size={18} aria-hidden="true" />
          <span lang={locale}>{locale.toUpperCase()}</span>
        </SelectTrigger>
        <SelectContent
          className="language-options"
          align="end"
          alignItemWithTrigger={false}
        >
          {languages.map((language) => (
            <SelectItem key={language.code} value={language.code}>
              <span lang={language.code}>{language.name}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
