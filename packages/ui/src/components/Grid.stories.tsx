import type { Meta, StoryObj } from '@storybook/react-vite';

function GridShowcase() {
  return (
    <div className="container-max">
      <div className="grid">
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} style={{ background: 'var(--surface-container-high)', padding: '8px', textAlign: 'center' }}>
            {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}

const meta: Meta<typeof GridShowcase> = {
  component: GridShowcase,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof GridShowcase>;

export const Default: Story = {};
