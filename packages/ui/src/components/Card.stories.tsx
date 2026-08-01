import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './Card';

const meta: Meta<typeof Card> = {
  component: Card,
  tags: ['autodocs'],
  args: { children: 'Card body content.' },
};
export default meta;

type Story = StoryObj<typeof Card>;

export const WithHeader: Story = { args: { header: 'SYSTEM_STATUS' } };
export const WithoutHeader: Story = { args: {} };
