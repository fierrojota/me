import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  component: Input,
  tags: ['autodocs'],
  args: { label: 'Callsign' },
};
export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {};
export const WithPlaceholder: Story = { args: { placeholder: 'ENTER_VALUE' } };
export const Focused: Story = {
  play: async ({ canvas }) => {
    const input = canvas.getByRole('textbox');
    input.focus();
    await expect(input).toHaveFocus();
  },
};
