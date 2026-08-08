import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { MemoryRouter } from 'react-router';
import { Nav } from './Nav';
import { Button } from './Button';

const meta: Meta<typeof Nav> = {
  component: Nav,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/']}>
        <Story />
      </MemoryRouter>
    ),
  ],
  args: {
    brand: 'me',
    links: [
      { label: 'Home', to: '/' },
      { label: 'Work', to: '/work' },
      { label: 'Contact', to: '/contact' },
    ],
  },
};
export default meta;

type Story = StoryObj<typeof Nav>;

export const Default: Story = {};
export const WithCta: Story = { args: { cta: <Button variant="primary">Get in touch</Button> } };
export const WithActiveSection: Story = { args: { activeTo: '/work' } };
export const Focused: Story = {
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: 'Home' });
    link.focus();
    await expect(link).toHaveFocus();
  },
};
