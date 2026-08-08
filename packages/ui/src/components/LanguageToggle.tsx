import './language-toggle.css';

export type LanguageToggleProps = {
  value: 'en' | 'es';
  onChange: (lang: 'en' | 'es') => void;
  /** Accessible name for the group. Pass a translated string — the default is
   *  a last-resort fallback, not copy: an English label under an ES locale is
   *  exactly the mismatch this control exists to fix. */
  label?: string;
};

const LANGUAGES = ['en', 'es'] as const;

export function LanguageToggle({ value, onChange, label = 'Language' }: LanguageToggleProps) {
  return (
    <div className="language-toggle" role="group" aria-label={label}>
      <svg
        className="language-toggle__icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
      {LANGUAGES.map((lang) => (
        <button
          key={lang}
          type="button"
          aria-pressed={value === lang}
          className={`language-toggle__option${value === lang ? ' language-toggle__option--active' : ''}`}
          onClick={() => onChange(lang)}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
