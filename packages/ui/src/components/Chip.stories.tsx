import type { Meta, StoryObj } from '@storybook/react-vite';
import { Chip } from './Chip';

const meta: Meta<typeof Chip> = {
  component: Chip,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Chip>;

export const Neutral: Story = { args: { variant: 'neutral', children: 'STATUS: IDLE' } };
export const Success: Story = { args: { variant: 'success', children: 'STATUS: ACTIVE' } };
export const Error: Story = { args: { variant: 'error', children: 'STATUS: FAILED' } };
