import type { StoryObj } from '@storybook/react';
import { Steps, Timeline } from '@libra-design/react';
import { useState } from 'react';

// ============================================================
// Feedback & Data Display — Phase 6
// ============================================================

export const StepsStory: StoryObj = {
  name: 'Steps (Horizontal)',
  render: () => {
    const [current, setCurrent] = useState(1);
    return (
      <div style={{ maxWidth: 600 }}>
        <Steps
          current={current}
          steps={[
            { title: 'Select Stock' },
            { title: 'Set Price' },
            { title: 'Confirm Order' },
            { title: 'Complete' },
          ]}
          style={{ marginBottom: 24 }}
        />
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setCurrent(Math.max(0, current - 1))} style={{ padding: '4px 12px', fontSize: 12, border: '1px solid var(--border-main)', borderRadius: 4, background: 'var(--bg-card)', color: 'var(--text-primary)' }}>Prev</button>
          <button onClick={() => setCurrent(Math.min(3, current + 1))} style={{ padding: '4px 12px', fontSize: 12, border: '1px solid var(--border-main)', borderRadius: 4, background: 'var(--bg-card)', color: 'var(--text-primary)' }}>Next</button>
        </div>
      </div>
    );
  },
};

export const StepsVerticalStory: StoryObj = {
  name: 'Steps (Vertical)',
  render: () => (
    <div style={{ maxWidth: 400 }}>
      <Steps
        direction="vertical"
        current={2}
        steps={[
          { title: 'Submit Order', description: 'Order sent to exchange' },
          { title: 'Matching', description: 'Waiting for counterparty' },
          { title: 'Execution', description: 'Order filled at ¥1689.50' },
          { title: 'Settlement', description: 'T+1 settlement pending' },
        ]}
      />
    </div>
  ),
};

export const TimelineStory: StoryObj = {
  name: 'Timeline',
  render: () => (
    <div style={{ maxWidth: 500 }}>
      <Timeline
        items={[
          { title: 'Order Created', description: 'Buy 100 shares of 600519 at ¥1689.50', time: '09:30:15', color: 'var(--accent)' },
          { title: 'Order Submitted', description: 'Sent to Shanghai Stock Exchange', time: '09:30:16' },
          { title: 'Partially Filled', description: '60 shares filled at ¥1689.50', time: '09:30:18', color: 'var(--up)' },
          { title: 'Fully Filled', description: 'Remaining 40 shares filled at ¥1689.50', time: '09:30:22', color: 'var(--up)' },
          { title: 'Settlement', description: 'T+1 settlement processing', time: 'Pending...', color: 'var(--text-tertiary)' },
        ]}
        pending
      />
    </div>
  ),
};
