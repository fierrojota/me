import type { Preview } from '@storybook/react-vite'
import '../src/tokens.css';
import '../src/typography.css';
import '../src/layout.css';

document.documentElement.dataset.theme = 'dark';

const preview: Preview = {
  tags: ['autodocs'],
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    backgrounds: {
      default: 'dark',
      values: [
        { name: 'light', value: '#0b1326' },
        { name: 'dark', value: '#0b1326' },
      ],
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      // CONSTITUTION P4 calls accessibility inviolable; axe already runs in a
      // real Chromium here, so leaving it non-blocking made the gate advisory.
      test: 'error'
    }
  },
  decorators: [
    (Story) => (
      <div style={{ background: 'var(--background)', color: 'var(--on-surface)', minHeight: '100vh', padding: '2rem' }}>
        <Story />
      </div>
    ),
  ],
};

export default preview;