import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
  tags: ['autodocs'],
  args: { children: 'Initialize View Systems' },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = { args: { variant: 'primary' } };
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Disabled: Story = { args: { variant: 'primary', disabled: true } };
export const Focused: Story = {
  args: { variant: 'primary' },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button');
    button.focus();
    await expect(button).toHaveFocus();
  },
};
