import type { Meta, StoryObj } from '@storybook/react-vite';

function TypographyShowcase() {
  return (
    <div>
      <h1 className="text-headline-lg">Headline LG</h1>
      <h2 className="text-headline-md">Headline MD</h2>
      <p className="text-body-lg">Body LG — lead body text</p>
      <p className="text-body-md">Body MD — body text</p>
      <span className="text-label-md">[ LABEL_MD ]</span>
      <br />
      <span className="text-label-sm">LABEL_SM — fine metadata</span>
    </div>
  );
}

const meta: Meta<typeof TypographyShowcase> = {
  component: TypographyShowcase,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof TypographyShowcase>;

export const Default: Story = {};
