import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { cn } from '../lib/utils';
import { Button } from '../components/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/card';
import { Badge } from '../components/badge';
import { Input } from '../components/input';
import { ChangeBadge } from '../components/change-badge';
import { PriceDisplay } from '../components/price-display';
import { StockCard } from '../components/stock-card';
import { Select } from '../components/select';
import { Tabs } from '../components/tabs';
import { Tag } from '../components/tag';
import { Modal } from '../components/modal';
import { Tooltip } from '../components/tooltip';
import { Switch } from '../components/switch';
import { Table, TableHeader, TableHead, TableRow, TableCell } from '../components/table';
import { MarketTable } from '../components/market-table';
import { Textarea } from '../components/textarea';
import { Checkbox } from '../components/checkbox';
import { RadioGroup } from '../components/radio';
import { Slider } from '../components/slider';
import { Alert } from '../components/alert';
import { toastSuccess, toastError, toastLoading, dismiss, Toaster } from '../components/toast';
import { Progress } from '../components/progress';
import { Skeleton, SkeletonCard } from '../components/skeleton';
import { Breadcrumb } from '../components/breadcrumb';
import { Pagination } from '../components/pagination';
import { DropdownMenu } from '../components/dropdown-menu';
import { Accordion } from '../components/accordion';
import { Divider } from '../components/divider';
import { Space } from '../components/space';
import { Flex } from '../components/flex';
import { Avatar } from '../components/avatar';
import { Empty } from '../components/empty';
import { Statistic } from '../components/statistic';

// ============================================================
// cn utility
// ============================================================
describe('cn()', () => {
  it('merges class names', () => {
    expect(cn('a', 'b')).toBe('a b');
  });
  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', 'visible')).toBe('base visible');
  });
  it('handles tailwind merge', () => {
    expect(cn('px-4', 'px-6')).toBe('px-6');
  });
});

// ============================================================
// Button
// ============================================================
describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click</Button>);
    expect(screen.getByText('Click')).toBeInTheDocument();
  });
  it('applies variant styles', () => {
    const { container } = render(<Button variant="danger">Delete</Button>);
    expect(container.firstChild).toHaveClass('bg-[var(--error)]');
  });
  it('applies size styles', () => {
    const { container } = render(<Button size="sm">Small</Button>);
    expect(container.firstChild).toHaveClass('h-8');
  });
  it('passes additional props', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByText('Disabled')).toBeDisabled();
  });
  it('fires onClick', () => {
    const fn = vi.fn();
    render(<Button onClick={fn}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(fn).toHaveBeenCalledOnce();
  });
});

// ============================================================
// Card
// ============================================================
describe('Card', () => {
  it('renders children', () => {
    render(<Card><p>Content</p></Card>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
  it('CardHeader + CardTitle + CardContent compose', () => {
    render(
      <Card>
        <CardHeader><CardTitle>Title</CardTitle></CardHeader>
        <CardContent>Body</CardContent>
      </Card>,
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();
  });
});

// ============================================================
// Badge
// ============================================================
describe('Badge', () => {
  it('renders text', () => {
    render(<Badge variant="up">+2.13%</Badge>);
    expect(screen.getByText('+2.13%')).toBeInTheDocument();
  });
  it('applies direction colors', () => {
    const { container } = render(<Badge variant="down">-1.34%</Badge>);
    expect(container.firstChild).toHaveClass('text-[var(--down)]');
  });
});

// ============================================================
// Input
// ============================================================
describe('Input', () => {
  it('renders input', () => {
    render(<Input placeholder="Search" />);
    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
  });
  it('shows error state', () => {
    const { container } = render(<Input hasError />);
    expect(container.firstChild).toHaveClass('border-[var(--error)]');
  });
  it('handles value change', () => {
    const fn = vi.fn();
    render(<Input onChange={fn} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'abc' } });
    expect(fn).toHaveBeenCalled();
  });
});

// ============================================================
// ChangeBadge
// ============================================================
describe('ChangeBadge', () => {
  it('renders positive change', () => {
    render(<ChangeBadge value={2.13} />);
    expect(screen.getByText('+2.13%')).toBeInTheDocument();
  });
  it('renders negative change', () => {
    render(<ChangeBadge value={-1.34} />);
    expect(screen.getByText((c) => c.includes('1.34'))).toBeInTheDocument();
  });
  it('renders zero change as flat', () => {
    render(<ChangeBadge value={0} />);
    expect(screen.getByText('0.00%')).toBeInTheDocument();
  });
});

// ============================================================
// PriceDisplay
// ============================================================
describe('PriceDisplay', () => {
  it('renders price value', () => {
    render(<PriceDisplay value={3382.45} />);
    expect(screen.getByText('3382.45')).toBeInTheDocument();
  });
  it('shows positive change with arrow', () => {
    render(<PriceDisplay value={100} change={5} changePercent={5} />);
    expect(screen.getByText((c) => c.includes('5.00'))).toBeInTheDocument();
  });
  it('shows negative change', () => {
    render(<PriceDisplay value={100} change={-3} />);
    expect(screen.getByText('-3.00')).toBeInTheDocument();
  });
  it('renders without change', () => {
    render(<PriceDisplay value={50} />);
    expect(screen.getByText('50.00')).toBeInTheDocument();
  });
});

// ============================================================
// StockCard
// ============================================================
describe('StockCard', () => {
  const props = { code: 'sh600519', name: 'Moutai', price: 1689.5, change: 35.2, changePercent: 2.13 };
  it('renders stock info', () => {
    render(<StockCard {...props} />);
    expect(screen.getByText('Moutai')).toBeInTheDocument();
    expect(screen.getByText('sh600519')).toBeInTheDocument();
    expect(screen.getByText('1689.50')).toBeInTheDocument();
  });
  it('handles click', () => {
    const fn = vi.fn();
    render(<StockCard {...props} onClick={fn} />);
    fireEvent.click(screen.getByText('Moutai').closest('[role="button"]')!);
    expect(fn).toHaveBeenCalledOnce();
  });
});

// ============================================================
// Select
// ============================================================
describe('Select', () => {
  it('renders options', () => {
    render(<Select options={[{ value: 'a', label: 'Option A' }]} />);
    expect(screen.getByText('Option A')).toBeInTheDocument();
  });
  it('fires change event', () => {
    const fn = vi.fn();
    render(<Select options={[{ value: 'a', label: 'A' }]} onChange={fn} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'a' } });
    expect(fn).toHaveBeenCalled();
  });
});

// ============================================================
// Tabs
// ============================================================
describe('Tabs', () => {
  it('renders tabs', () => {
    render(<Tabs tabs={[{ value: '1m', label: '1M' }, { value: '5m', label: '5M' }]} value="1m" onChange={() => {}} />);
    expect(screen.getByText('1M')).toBeInTheDocument();
    expect(screen.getByText('5M')).toBeInTheDocument();
  });
  it('fires onChange', () => {
    const fn = vi.fn();
    render(<Tabs tabs={[{ value: '1m', label: '1M' }]} value="" onChange={fn} />);
    fireEvent.click(screen.getByText('1M'));
    expect(fn).toHaveBeenCalledWith('1m');
  });
  it('highlights active tab', () => {
    render(<Tabs tabs={[{ value: '1m', label: '1M' }]} value="1m" onChange={() => {}} />);
    expect(screen.getByRole('tab')).toHaveAttribute('aria-selected', 'true');
  });
});

// ============================================================
// Tag
// ============================================================
describe('Tag', () => {
  it('renders tag text', () => {
    render(<Tag>Label</Tag>);
    expect(screen.getByText('Label')).toBeInTheDocument();
  });
  it('shows remove button', () => {
    const fn = vi.fn();
    render(<Tag onRemove={fn}>Dismiss</Tag>);
    fireEvent.click(screen.getByLabelText('Remove'));
    expect(fn).toHaveBeenCalledOnce();
  });
});

// ============================================================
// Modal
// ============================================================
describe('Modal', () => {
  it('renders when open', () => {
    render(<Modal open={true} onClose={() => {}} title="Title"><p>Content</p></Modal>);
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
  it('does not render when closed', () => {
    render(<Modal open={false} onClose={() => {}} title="Hidden"><p>Content</p></Modal>);
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
  });
  it('calls onClose on background click', () => {
    const fn = vi.fn();
    render(<Modal open={true} onClose={fn}><p>Content</p></Modal>);
    fireEvent.click(screen.getByRole('dialog').querySelector('[class*="inset-0"]')!);
    expect(fn).toHaveBeenCalledOnce();
  });
});

// ============================================================
// Tooltip
// ============================================================
describe('Tooltip', () => {
  it('shows content on hover', () => {
    render(<Tooltip content="Tooltip text"><button>Hover</button></Tooltip>);
    expect(screen.queryByText('Tooltip text')).not.toBeInTheDocument();
    fireEvent.mouseEnter(screen.getByText('Hover'));
    expect(screen.getByText('Tooltip text')).toBeInTheDocument();
  });
});

// ============================================================
// Switch
// ============================================================
describe('Switch', () => {
  it('toggles state', () => {
    const fn = vi.fn();
    render(<Switch checked={false} onChange={fn} />);
    fireEvent.click(screen.getByRole('switch'));
    expect(fn).toHaveBeenCalledWith(true);
  });
  it('shows checked state', () => {
    render(<Switch checked={true} onChange={() => {}} />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });
});

// ============================================================
// Table
// ============================================================
describe('Table components', () => {
  it('renders table structure', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Header</TableHead>
          </TableRow>
        </TableHeader>
        <tbody>
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </tbody>
      </Table>,
    );
    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Cell')).toBeInTheDocument();
  });
});

// ============================================================
// MarketTable
// ============================================================
describe('MarketTable', () => {
  const data = [
    { code: 'A', name: 'Stock A', price: 100, change: 5, changePercent: 5.25 },
    { code: 'B', name: 'Stock B', price: 50, change: -2, changePercent: -3.85 },
  ];
  const columns = [
    { key: 'code' as const, label: 'Code', sortable: true },
    { key: 'name' as const, label: 'Name' },
    { key: 'price' as const, label: 'Price', align: 'right' as const, sortable: true },
  ];

  it('renders data rows', () => {
    render(<MarketTable data={data} columns={columns} />);
    expect(screen.getByText('Stock A')).toBeInTheDocument();
    expect(screen.getByText('Stock B')).toBeInTheDocument();
  });
  it('sorts by column', () => {
    render(<MarketTable data={data} columns={columns} />);
    const codeHeader = screen.getByText('Code');
    fireEvent.click(codeHeader);
    expect(codeHeader.textContent).toContain('\u25BC');
  });
});

// ============================================================
// Textarea
// ============================================================
describe('Textarea', () => {
  it('renders and handles input', () => {
    render(<Textarea placeholder="Write..." />);
    const el = screen.getByPlaceholderText('Write...');
    expect(el).toBeInTheDocument();
    fireEvent.change(el, { target: { value: 'hello' } });
    expect(el).toHaveValue('hello');
  });
  it('shows character count', () => {
    render(<Textarea showCount maxLength={100} defaultValue="hi" />);
    expect(screen.getByText('2/100')).toBeInTheDocument();
  });
  it('applies error style', () => {
    const { container } = render(<Textarea hasError />);
    expect(container.firstChild!.firstChild).toHaveClass('border-[var(--error)]');
  });
});

// ============================================================
// Checkbox
// ============================================================
describe('Checkbox', () => {
  const opts = [
    { value: 'a', label: 'A' },
    { value: 'b', label: 'B' },
    { value: 'c', label: 'C' },
  ];
  it('renders options', () => {
    render(<Checkbox options={opts} />);
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();
  });
  it('selects and deselects', () => {
    const fn = vi.fn();
    render(<Checkbox options={opts} onChange={fn} />);
    fireEvent.click(screen.getByText('A'));
    expect(fn).toHaveBeenCalledWith(['a']);
  });
  it('toggle select all', () => {
    const fn = vi.fn();
    render(<Checkbox options={opts} onChange={fn} />);
    fireEvent.click(screen.getByText('Select All'));
    expect(fn).toHaveBeenCalledWith(['a', 'b', 'c']);
  });
});

// ============================================================
// Radio
// ============================================================
describe('RadioGroup', () => {
  const opts = [
    { value: '1m', label: '1M' },
    { value: '5m', label: '5M' },
  ];
  it('renders options', () => {
    render(<RadioGroup options={opts} />);
    expect(screen.getByText('1M')).toBeInTheDocument();
    expect(screen.getByText('5M')).toBeInTheDocument();
  });
  it('selects value', () => {
    const fn = vi.fn();
    render(<RadioGroup options={opts} onChange={fn} />);
    fireEvent.click(screen.getByText('5M'));
    expect(fn).toHaveBeenCalledWith('5m');
  });
  it('renders button variant', () => {
    render(<RadioGroup options={opts} variant="button" value="1m" onChange={() => {}} />);
    expect(screen.getByRole('radio', { name: '1M' })).toHaveAttribute('aria-checked', 'true');
  });
});

// ============================================================
// Slider
// ============================================================
describe('Slider', () => {
  it('renders with default value', () => {
    const { container } = render(<Slider defaultValue={60} />);
    expect(container.firstChild).toHaveAttribute('aria-valuenow', '60');
  });
  it('fires onChange on arrow key', () => {
    const fn = vi.fn();
    const { container } = render(<Slider onChange={fn} min={0} max={100} />);
    fireEvent.keyDown(container.firstChild!, { key: 'ArrowRight' });
    expect(fn).toHaveBeenCalledWith(51);
  });
});

// ============================================================
// Alert
// ============================================================
describe('Alert', () => {
  it('renders content', () => {
    render(<Alert>Message</Alert>);
    expect(screen.getByText('Message')).toBeInTheDocument();
  });
  it('renders with title', () => {
    render(<Alert title="Warning">Body</Alert>);
    expect(screen.getByText('Warning')).toBeInTheDocument();
  });
  it('fires onClose', () => {
    const fn = vi.fn();
    render(<Alert onClose={fn}>Dismiss me</Alert>);
    fireEvent.click(screen.getByLabelText('Close'));
    expect(fn).toHaveBeenCalledOnce();
  });
});

// ============================================================
// Toast
// ============================================================
describe('Toast', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });
  it('toastSuccess renders message', async () => {
    render(<Toaster />);
    toastSuccess('Done!');
    await screen.findByText('Done!');
  });
  it('toastError renders message', async () => {
    render(<Toaster />);
    toastError('Failed!');
    await screen.findByText('Failed!');
  });
  it('dismiss removes toast', async () => {
    render(<Toaster />);
    const id = toastLoading('Loading...');
    await screen.findByText('Loading...');
    dismiss(id);
    await vi.waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());
  });
});

// ============================================================
// Progress
// ============================================================
describe('Progress', () => {
  it('renders line variant', () => {
    const { container } = render(<Progress value={60} />);
    expect(container.querySelector('div[class*="rounded-full"]')).toBeInTheDocument();
  });
  it('renders circle variant', () => {
    const { container } = render(<Progress value={75} variant="circle" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
  it('shows label', () => {
    render(<Progress value={42} showLabel />);
    expect(screen.getByText('42%')).toBeInTheDocument();
  });
});

// ============================================================
// Skeleton
// ============================================================
describe('Skeleton', () => {
  it('renders with base classes', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass('animate-pulse');
  });
  it('renders text skeleton', () => {
    const { container } = render(<Skeleton text />);
    expect(container.firstChild).toHaveClass('h-4');
  });
  it('renders SkeletonCard', () => {
    const { container } = render(<SkeletonCard lines={2} />);
    expect(container.firstChild).toHaveClass('rounded-[var(--card-radius)]');
  });
});

// ============================================================
// Breadcrumb
// ============================================================
describe('Breadcrumb', () => {
  it('renders items', () => {
    render(<Breadcrumb items={[{ label: 'Home' }, { label: 'Stocks' }, { label: 'AAPL' }]} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Stocks')).toBeInTheDocument();
    expect(screen.getByText('AAPL')).toBeInTheDocument();
  });
  it('last item is primary color', () => {
    render(<Breadcrumb items={[{ label: 'A' }, { label: 'B' }]} />);
    expect(screen.getByText('B')).toHaveClass('text-[var(--text-primary)]');
  });
  it('renders links', () => {
    render(<Breadcrumb items={[{ label: 'Home', href: '/' }]} />);
    expect(screen.getByText('Home')).toHaveAttribute('href', '/');
  });
});

// ============================================================
// Pagination
// ============================================================
describe('Pagination', () => {
  it('renders page buttons', () => {
    render(<Pagination current={1} total={100} onChange={() => {}} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });
  it('calls onChange on click', () => {
    const fn = vi.fn();
    render(<Pagination current={1} total={100} onChange={fn} />);
    fireEvent.click(screen.getByText('2'));
    expect(fn).toHaveBeenCalledWith(2);
  });
  it('disables prev on first page', () => {
    render(<Pagination current={1} total={100} onChange={() => {}} />);
    expect(screen.getByLabelText('Previous')).toBeDisabled();
  });
  it('returns null for single page', () => {
    const { container } = render(<Pagination current={1} total={5} onChange={() => {}} />);
    expect(container.firstChild).toBeNull();
  });
});

// ============================================================
// DropdownMenu
// ============================================================
describe('DropdownMenu', () => {
  it('shows items on trigger click', () => {
    render(<DropdownMenu trigger={<button>Menu</button>} items={[{ label: 'Item A' }, { label: 'Item B' }]} />);
    fireEvent.click(screen.getByText('Menu'));
    expect(screen.getByText('Item A')).toBeInTheDocument();
    expect(screen.getByText('Item B')).toBeInTheDocument();
  });
  it('calls onClick and closes', () => {
    const fn = vi.fn();
    render(<DropdownMenu trigger={<button>Menu</button>} items={[{ label: 'Select', onClick: fn }]} />);
    fireEvent.click(screen.getByText('Menu'));
    fireEvent.click(screen.getByText('Select'));
    expect(fn).toHaveBeenCalledOnce();
  });
});

// ============================================================
// Accordion
// ============================================================
describe('Accordion', () => {
  const items = [
    { value: '1', title: 'Section 1', content: 'Content 1' },
    { value: '2', title: 'Section 2', content: 'Content 2' },
  ];
  it('renders titles', () => {
    render(<Accordion items={items} />);
    expect(screen.getByText('Section 1')).toBeInTheDocument();
    expect(screen.getByText('Section 2')).toBeInTheDocument();
  });
  it('toggles content on click', () => {
    render(<Accordion items={items} />);
    const content = screen.getByText('Content 1').parentElement!;
    expect(content.className).toContain('max-h-0');
    fireEvent.click(screen.getByText('Section 1'));
    expect(content.className).toContain('max-h-[500px]');
  });
});

// ============================================================
// Divider
// ============================================================
describe('Divider', () => {
  it('renders horizontal', () => {
    const { container } = render(<Divider />);
    expect(container.firstChild).toHaveClass('h-px');
  });
  it('renders vertical', () => {
    const { container } = render(<Divider orientation="vertical" />);
    expect(container.firstChild).toHaveClass('w-px');
  });
  it('renders with label', () => {
    render(<Divider label="OR" />);
    expect(screen.getByText('OR')).toBeInTheDocument();
  });
});

// ============================================================
// Space
// ============================================================
describe('Space', () => {
  it('renders children', () => {
    render(<Space><button>A</button><button>B</button></Space>);
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
  });
  it('applies vertical direction', () => {
    const { container } = render(<Space direction="vertical"><div /><div /></Space>);
    expect(container.firstChild).toHaveClass('flex-col');
  });
});

// ============================================================
// Flex
// ============================================================
describe('Flex', () => {
  it('renders with justify between', () => {
    const { container } = render(<Flex justify="between"><div /><div /></Flex>);
    expect(container.firstChild).toHaveClass('justify-between');
  });
  it('renders with align center', () => {
    const { container } = render(<Flex align="center"><div /><div /></Flex>);
    expect(container.firstChild).toHaveClass('items-center');
  });
});

// ============================================================
// Avatar
// ============================================================
describe('Avatar', () => {
  it('renders fallback', () => {
    render(<Avatar fallback="U" />);
    expect(screen.getByText('U')).toBeInTheDocument();
  });
  it('renders image', () => {
    render(<Avatar src="test.jpg" alt="User" />);
    expect(screen.getByAltText('User')).toBeInTheDocument();
  });
});

// ============================================================
// Empty
// ============================================================
describe('Empty', () => {
  it('renders title and description', () => {
    render(<Empty title="No Data" description="No records found" />);
    expect(screen.getByText('No Data')).toBeInTheDocument();
    expect(screen.getByText('No records found')).toBeInTheDocument();
  });
  it('renders action', () => {
    render(<Empty action={<button>Refresh</button>} />);
    expect(screen.getByText('Refresh')).toBeInTheDocument();
  });
});

// ============================================================
// Statistic
// ============================================================
describe('Statistic', () => {
  it('renders value', () => {
    render(<Statistic value={3382.45} precision={2} />);
    expect(screen.getByText('3382.45')).toBeInTheDocument();
  });
  it('renders with prefix/suffix', () => {
    render(<Statistic value={2.13} precision={2} prefix="$" suffix="%" />);
    expect(screen.getByText('$')).toBeInTheDocument();
    expect(screen.getByText('%')).toBeInTheDocument();
  });
  it('applies up trend color', () => {
    const { container } = render(<Statistic value={100} trend="up" />);
    expect(container.firstChild!.lastChild).toHaveClass('text-[var(--up)]');
  });
  it('renders string value', () => {
    render(<Statistic value="3,382.45" />);
    expect(screen.getByText('3,382.45')).toBeInTheDocument();
  });
});
