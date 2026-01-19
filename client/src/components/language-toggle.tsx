import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import { useI18n, Language } from '@/lib/i18n';

interface LanguageToggleProps {
  variant?: 'default' | 'compact' | 'text';
  className?: string;
}

const languages: { code: Language; name: string; flag: string }[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇲🇽' },
];

export function LanguageToggle({ variant = 'default', className = '' }: LanguageToggleProps) {
  const { language, setLanguage, t } = useI18n();
  
  const currentLang = languages.find(l => l.code === language) || languages[0];

  if (variant === 'compact') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className={className}
            data-testid="button-language-toggle"
          >
            <Globe className="h-4 w-4" />
            <span className="sr-only">{t('common.language')}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={language === lang.code ? 'bg-accent' : ''}
              data-testid={`menu-item-lang-${lang.code}`}
            >
              <span className="mr-2">{lang.flag}</span>
              {lang.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (variant === 'text') {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        {languages.map((lang, index) => (
          <span key={lang.code} className="flex items-center">
            <button
              onClick={() => setLanguage(lang.code)}
              className={`text-sm px-1 transition-colors ${
                language === lang.code 
                  ? 'text-primary font-semibold' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              data-testid={`button-lang-${lang.code}`}
            >
              {lang.name}
            </button>
            {index < languages.length - 1 && (
              <span className="text-muted-foreground mx-1">|</span>
            )}
          </span>
        ))}
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={`gap-2 ${className}`}
          data-testid="button-language-toggle"
        >
          <Globe className="h-4 w-4" />
          <span>{currentLang.flag}</span>
          <span className="hidden sm:inline">{currentLang.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={language === lang.code ? 'bg-accent' : ''}
            data-testid={`menu-item-lang-${lang.code}`}
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AILanguageSelector({ 
  value, 
  onChange,
  className = '' 
}: { 
  value: Language; 
  onChange: (lang: Language) => void;
  className?: string;
}) {
  const { t } = useI18n();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Globe className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">{t('ai.languageSelect')}:</span>
      <div className="flex rounded-lg border border-input overflow-hidden">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => onChange(lang.code)}
            className={`px-3 py-1.5 text-sm transition-colors ${
              value === lang.code
                ? 'bg-primary text-primary-foreground'
                : 'bg-background hover:bg-accent'
            }`}
            data-testid={`button-ai-lang-${lang.code}`}
          >
            {lang.flag} {lang.name}
          </button>
        ))}
      </div>
    </div>
  );
}
