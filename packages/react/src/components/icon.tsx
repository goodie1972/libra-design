import type { SVGAttributes } from 'react';
import { cn } from '../lib/utils';

import {
  IconSearch, IconX, IconMenu2, IconSettings,
  IconChevronUp, IconChevronDown, IconChevronLeft, IconChevronRight,
  IconArrowUp, IconArrowDown, IconArrowLeft, IconArrowRight,
  IconCheck, IconPlus, IconMinus, IconEdit, IconTrash,
  IconCopy, IconDownload, IconUpload, IconRefresh,
  IconInfoCircle, IconAlertTriangle, IconAlertCircle, IconCircleCheck,
  IconLoader2, IconFilter, IconSortAscending, IconSortDescending,
  IconEye, IconEyeOff, IconLock, IconLockOpen,
  IconUser, IconUsers, IconCalendar, IconClock, IconBell,
  IconHome, IconBook, IconStar, IconHeart, IconShare,
  IconExternalLink, IconDots, IconGridDots, IconList,
  IconChartBar, IconChartLine, IconChartArea,
  IconArrowsMaximize, IconArrowsMinimize,
  IconCandle, IconVolume, IconWallet,
  IconArrowsExchange2, IconTag, IconFileDescription,
  IconFolder, IconPin, IconFlag, IconBan, IconHelpCircle,
  IconTrendingUp, IconTrendingDown,
} from '@tabler/icons-react';

type TablerComp = typeof IconSearch;

type IconSource = 'tabler' | 'phosphor' | 'lucide';

interface IconBaseProps {
  name: string;
  source?: IconSource;
  weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';
  size?: number;
  className?: string;
  'aria-hidden'?: boolean | 'true' | 'false';
}

export type IconProps = IconBaseProps & Omit<SVGAttributes<SVGSVGElement>, keyof IconBaseProps | 'children'>;

const TABLER_MAP: Record<string, TablerComp> = {
  Search: IconSearch, X: IconX, Menu2: IconMenu2, Settings: IconSettings,
  ChevronUp: IconChevronUp, ChevronDown: IconChevronDown,
  ChevronLeft: IconChevronLeft, ChevronRight: IconChevronRight,
  ArrowUp: IconArrowUp, ArrowDown: IconArrowDown,
  ArrowLeft: IconArrowLeft, ArrowRight: IconArrowRight,
  Check: IconCheck, Plus: IconPlus, Minus: IconMinus,
  Edit: IconEdit, Trash: IconTrash,
  Copy: IconCopy, Download: IconDownload,
  Upload: IconUpload, Refresh: IconRefresh,
  InfoCircle: IconInfoCircle, AlertTriangle: IconAlertTriangle,
  AlertCircle: IconAlertCircle, CircleCheck: IconCircleCheck,
  Loader2: IconLoader2, Filter: IconFilter,
  SortAscending: IconSortAscending, SortDescending: IconSortDescending,
  Eye: IconEye, EyeOff: IconEyeOff, Lock: IconLock, LockOpen: IconLockOpen,
  User: IconUser, Users: IconUsers, Calendar: IconCalendar,
  Clock: IconClock, Bell: IconBell,
  Home: IconHome, Book: IconBook, Star: IconStar,
  Heart: IconHeart, Share: IconShare,
  ExternalLink: IconExternalLink, Dots: IconDots,
  GridDots: IconGridDots, List: IconList,
  ChartBar: IconChartBar, ChartLine: IconChartLine, ChartArea: IconChartArea,
  ArrowsMaximize: IconArrowsMaximize, ArrowsMinimize: IconArrowsMinimize,
  Candle: IconCandle, Volume: IconVolume, Wallet: IconWallet,
  ArrowsExchange2: IconArrowsExchange2, Tag: IconTag,
  FileDescription: IconFileDescription,
  Folder: IconFolder, Pin: IconPin, Flag: IconFlag,
  Ban: IconBan, HelpCircle: IconHelpCircle,
  TrendingUp: IconTrendingUp, TrendingDown: IconTrendingDown,
};

const SEMANTIC_ALIASES: Record<string, string> = {
  'trend-up':     'TrendingUp',
  'trend-down':   'TrendingDown',
  'search':       'Search',
  'close':        'X',
  'menu':         'Menu2',
  'settings':     'Settings',
  'chevron-up':   'ChevronUp',
  'chevron-down': 'ChevronDown',
  'chevron-left': 'ChevronLeft',
  'chevron-right':'ChevronRight',
  'arrow-up':     'ArrowUp',
  'arrow-down':   'ArrowDown',
  'arrow-left':   'ArrowLeft',
  'arrow-right':  'ArrowRight',
  'check':        'Check',
  'plus':         'Plus',
  'minus':        'Minus',
  'edit':         'Edit',
  'trash':        'Trash',
  'copy':         'Copy',
  'download':     'Download',
  'upload':       'Upload',
  'refresh':      'Refresh',
  'info':         'InfoCircle',
  'warning':      'AlertTriangle',
  'error':        'AlertCircle',
  'success':      'CircleCheck',
  'loading':      'Loader2',
  'filter':       'Filter',
  'sort-asc':     'SortAscending',
  'sort-desc':    'SortDescending',
  'eye':          'Eye',
  'eye-off':      'EyeOff',
  'lock':         'Lock',
  'unlock':       'LockOpen',
  'user':         'User',
  'users':        'Users',
  'calendar':     'Calendar',
  'clock':        'Clock',
  'bell':         'Bell',
  'home':         'Home',
  'book':         'Book',
  'star':         'Star',
  'heart':        'Heart',
  'share':        'Share',
  'external-link':'ExternalLink',
  'external':     'ExternalLink',
  'more':         'Dots',
  'grid':         'GridDots',
  'list':         'List',
  'chart-bar':    'ChartBar',
  'chart-line':   'ChartLine',
  'chart-area':   'ChartArea',
  'fullscreen':   'ArrowsMaximize',
  'minimize':     'ArrowsMinimize',
  'candle':       'Candle',
  'volume':       'Volume',
  'wallet':       'Wallet',
  'exchange':     'ArrowsExchange2',
  'tag':          'Tag',
  'document':     'FileDescription',
  'folder':       'Folder',
  'pin':          'Pin',
  'flag':         'Flag',
  'ban':          'Ban',
  'question':     'HelpCircle',
  'alert':        'AlertTriangle',
};

function resolveName(name: string): string {
  const lower = name.toLowerCase().replace(/\s+/g, '-');
  return SEMANTIC_ALIASES[lower] ?? capitalize(name.replace(/[-_\s]+/g, ''));
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function Icon({
  name,
  source,
  weight,
  size = 20,
  className,
  'aria-hidden': ariaHidden = true,
  ...rest
}: IconProps) {
  const resolved = resolveName(name);
  const svgProps = {
    ...(typeof size === 'number' ? { size } : {}),
    'aria-hidden': ariaHidden === true || ariaHidden === 'true',
    className: cn('tabler-icon', className),
  };

  if (source === 'phosphor') {
    return (
      <PhosphorIcon
        name={resolved}
        weight={weight ?? 'regular'}
        size={size}
        className={cn('phosphor-icon', className)}
        aria-hidden={ariaHidden === true || ariaHidden === 'true'}
        {...rest}
      />
    );
  }
  if (source === 'lucide') {
    return (
      <LucideIcon
        name={resolved}
        size={size}
        className={cn('lucide-icon', className)}
        aria-hidden={ariaHidden === true || ariaHidden === 'true'}
        {...rest}
      />
    );
  }

  const TablerComp = TABLER_MAP[resolved];
  if (TablerComp) {
    return <TablerComp {...svgProps} {...rest} />;
  }

  return <FallbackSvg name={resolved} size={size} className={className} />;
}

function PhosphorIcon({
  name, weight, ...rest
}: { name: string; weight: string; [key: string]: unknown }) {
  try {
    const mod = require('@phosphor-icons/react') as Record<string, unknown>;
    const Comp = mod[`${name}${capitalize(weight)}`] as React.ComponentType<Record<string, unknown>> | undefined;
    if (Comp) return <Comp {...rest} />;
  } catch {}
  return <FallbackSvg name={name} size={rest.size as number} className={rest.className as string} />;
}

function LucideIcon({
  name, ...rest
}: { name: string; [key: string]: unknown }) {
  try {
    const mod = require('lucide-react') as Record<string, unknown>;
    const Comp = mod[name] as React.ComponentType<Record<string, unknown>> | undefined;
    if (Comp) return <Comp {...rest} />;
  } catch {}
  return <FallbackSvg name={name} size={rest.size as number} className={rest.className as string} />;
}

function FallbackSvg({ name: _name, size = 20, className, ...rest }: Record<string, unknown>) {
  const s = (typeof size === 'number' ? size : 20) as number;
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      className={cn('tabler-icon', className as string)}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      <circle cx="12" cy="12" r="10" opacity="0.2" />
      <path d="M12 8v4m0 4h.01" />
    </svg>
  );
}
