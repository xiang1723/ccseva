import { Globe } from 'lucide-react';
import type React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface LanguageSelectorProps {
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className = '' }) => {
  const { i18n, t } = useTranslation();

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Globe className="w-4 h-4 text-neutral-400" />
      <Select value={i18n.language} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-[140px] h-9 glass border-white/10 text-white">
          <SelectValue placeholder={t('settings.selectLanguage')} />
        </SelectTrigger>
        <SelectContent className="glass border-white/10">
          <SelectItem value="en" className="text-white hover:bg-white/10">
            {t('language.en')}
          </SelectItem>
          <SelectItem value="zh" className="text-white hover:bg-white/10">
            {t('language.zh')}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
