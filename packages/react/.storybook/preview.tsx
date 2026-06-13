import type { Preview } from '@storybook/react-vite';
import '@libra-design/tokens/css';
import { withTheme } from './theme-decorator';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
    options: { storySort: { order: ['P0-Basic', 'P1-Financial', 'P2-Navigation', 'P3-Feedback', 'P4-Layout', 'P5-Data'] } },
  },
  globalTypes: {
    theme: {
      description: 'Libra theme mix',
      defaultValue: 'soft',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'dark', title: 'Dark (t=0)', icon: 'circlehollow' },
          { value: 'soft', title: 'Soft (t=0.7)', icon: 'circle' },
          { value: 'light', title: 'Light (t=1)', icon: 'sun' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [withTheme],
};

export default preview;
