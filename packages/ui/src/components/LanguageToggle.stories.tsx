import type { Meta, StoryObj } from '@storybook/react-vite';
import { LanguageToggle } from './LanguageToggle';

const meta: Meta<typeof LanguageToggle> = {
  component: LanguageToggle,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof LanguageToggle>;

export const English: Story = { args: { value: 'en', onChange: () => {} } };
export const Spanish: Story = { args: { value: 'es', onChange: () => {} } };
