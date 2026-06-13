import { useMemo } from 'react';
import { cn } from '../lib/utils';

export interface SectorData {
  name: string;
  changePercent: number;
  volume?: number;
}

export interface HeatmapSectorProps {
  sectors: SectorData[];
  width?: number;
  height?: number;
  className?: string;
}

interface GridCell {
  name: string;
  changePercent: number;
  volume?: number;
  index: number;
  isUp: boolean;
  bgColor: string;
}

export function HeatmapSector({ sectors, width = 600, height = 400, className }: HeatmapSectorProps) {
  const gridData: { cells: GridCell[]; cols: number } | null = useMemo(() => {
    if (sectors.length === 0) return null;

    // 计算网格列数（尽量接近方形布局）
    const count = sectors.length;
    const cols = Math.ceil(Math.sqrt(count * (width / height)));

    // 按 volume 或 changePercent 绝对值排序，形成大小效果
    const sorted = [...sectors].sort((a, b) => {
      const aSize = a.volume ?? Math.abs(a.changePercent);
      const bSize = b.volume ?? Math.abs(b.changePercent);
      return bSize - aSize;
    });

    // 重新映射到 treemap 风格的网格布局
    // 大块放前面（左上角），小块放后面
    const cells: GridCell[] = sorted.map((sector, index) => {
      const isUp = sector.changePercent >= 0;

      // 颜色透明度：涨红跌绿，透明度根据涨跌幅绝对值计算
      const absPct = Math.abs(sector.changePercent);
      const opacity = Math.min(absPct / 5, 1) * 0.8 + 0.2;

      // 涨用红色 rgba，跌用绿色 rgba
      const upColor = `rgba(239, 83, 80, ${opacity})`;
      const downColor = `rgba(38, 166, 154, ${opacity})`;

      return {
        name: sector.name,
        changePercent: sector.changePercent,
        volume: sector.volume,
        index,
        isUp,
        bgColor: isUp ? upColor : downColor,
      };
    });

    return { cells, cols };
  }, [sectors, width, height]);

  if (!gridData) {
    return (
      <div
        className={cn('flex items-center justify-center rounded-[var(--card-radius)] bg-[var(--bg-card)] border border-[var(--border-main)]', className)}
        style={{ width, height }}
      >
        <span className="text-[var(--text-tertiary)] text-[14px]">暂无板块数据</span>
      </div>
    );
  }

  const { cells, cols } = gridData;
  const gap = 3;

  return (
    <div
      className={cn('rounded-[var(--card-radius)] overflow-hidden', className)}
      style={{ width, height }}
    >
      <div
        className="grid w-full h-full"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: `${gap}px`,
        }}
      >
        {cells.map((cell) => (
          <div
            key={`${cell.name}-${cell.index}`}
            className="flex flex-col items-center justify-center rounded-[3px] transition-all duration-200 hover:brightness-110 hover:scale-[1.02] cursor-default"
            style={{ backgroundColor: cell.bgColor }}
          >
            <span className="text-[10px] text-white/80 leading-tight mb-0.5 text-center px-1">
              {cell.name}
            </span>
            <span
              className="text-[14px] font-semibold tabular-nums text-white"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {cell.changePercent >= 0 ? '+' : ''}{cell.changePercent.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
