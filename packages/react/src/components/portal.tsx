import { createPortal } from 'react-dom';

export interface PortalProps {
  to?: HTMLElement | (() => HTMLElement);
  children: React.ReactNode;
}

export function Portal({ to, children }: PortalProps) {
  const container = typeof to === 'function' ? to() : to ?? document.body;
  return createPortal(children, container);
}
