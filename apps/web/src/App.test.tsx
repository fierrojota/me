import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { testI18n } from './lib/test-i18n';
import App from './App';

describe('App', () => {
  it('renders the home route heading', () => {
    render(
      <I18nextProvider i18n={testI18n}>
        <App />
      </I18nextProvider>,
    );
    expect(screen.getByRole('heading', { name: /engineering for/i })).toBeInTheDocument();
  });
});
