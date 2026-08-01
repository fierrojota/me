import type { Meta, StoryObj } from '@storybook/react-vite';
import { Welcome } from './Welcome';

const meta: Meta<typeof Welcome> = {
  component: Welcome,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: { projectName: 'me' },
};
export default meta;

type Story = StoryObj<typeof Welcome>;

export const Default: Story = {};
