import type { StoryObj } from '@storybook/react';
import { Label, Form, Layout, LayoutHeader, LayoutSider, LayoutContent, LayoutFooter, Watermark } from '@libra-design/react';
import { Input, Button, Select } from '@libra-design/react';
import { useState } from 'react';

// ============================================================
// Form & Layout — Phase 5
// ============================================================

export const LabelStory: StoryObj = {
  name: 'Label',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 300 }}>
      <Label>Stock Code</Label>
      <Label required>Quantity</Label>
      <Label required style={{ color: 'var(--text-tertiary)' }}>
        Optional Field
      </Label>
      <Label>
        <span style={{ fontWeight: 600 }}>Bold Label</span>
      </Label>
    </div>
  ),
};

export const FormStory: StoryObj = {
  name: 'Form',
  render: () => (
    <div style={{ maxWidth: 500 }}>
      <Form layout="vertical" onSubmit={(e) => e.preventDefault()}>
        <Label required>Stock Code</Label>
        <Input placeholder="e.g. sh600519" style={{ marginBottom: 16 }} />
        <Label required>Quantity</Label>
        <Input placeholder="Number of shares" style={{ marginBottom: 16 }} />
        <Label>Order Type</Label>
        <Select
          options={[
            { value: 'limit', label: 'Limit Order' },
            { value: 'market', label: 'Market Order' },
            { value: 'stop', label: 'Stop Order' },
          ]}
          style={{ marginBottom: 24, width: '100%' }}
        />
        <Button type="submit">Submit Order</Button>
      </Form>
    </div>
  ),
};

export const HorizontalFormStory: StoryObj = {
  name: 'Form (Horizontal)',
  render: () => (
    <div style={{ maxWidth: 700 }}>
      <Form layout="horizontal" onSubmit={(e) => e.preventDefault()}>
        <Label required style={{ minWidth: 80 }}>Symbol</Label>
        <Input placeholder="sh600519" style={{ width: 200 }} />
        <Button type="submit" size="sm">Search</Button>
      </Form>
    </div>
  ),
};

export const LayoutStory: StoryObj = {
  name: 'Layout',
  render: () => (
    <Layout style={{ minHeight: 360 }}>
      <LayoutSider style={{ width: 200, background: 'var(--bg-sidebar, var(--bg-card))', padding: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)' }}>Sidebar</div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 2 }}>
          Dashboard<br />
          Positions<br />
          Orders<br />
          Watchlist
        </div>
      </LayoutSider>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <LayoutHeader style={{ height: 48, display: 'flex', alignItems: 'center', padding: '0 16px', borderBottom: '1px solid var(--border-sub)' }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Header</span>
        </LayoutHeader>
        <LayoutContent style={{ flex: 1, padding: 16 }}>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Main content area</div>
        </LayoutContent>
        <LayoutFooter style={{ height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', borderTop: '1px solid var(--border-sub)', fontSize: 11, color: 'var(--text-tertiary)' }}>
          © 2026 Libra Design
        </LayoutFooter>
      </div>
    </Layout>
  ),
};

export const WatermarkStory: StoryObj = {
  name: 'Watermark',
  render: () => (
    <div style={{ position: 'relative', width: '100%', height: 300, background: 'var(--bg-card)', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border-sub)' }}>
      <Watermark text="CONFIDENTIAL" opacity={0.05} />
      <div style={{ padding: 24, fontSize: 13, color: 'var(--text-secondary)' }}>
        Content with watermark overlay — "CONFIDENTIAL" rendered at 5% opacity, -25° rotation.
      </div>
    </div>
  ),
};
