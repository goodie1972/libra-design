import { existsSync, writeFileSync, mkdirSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * 组件源文件目录（从 @libra/react 源码读取）
 * 开发环境：packages/react/src/components/
 * 生产环境：node_modules/@libra/react/src/components/
 */
function getSourceDir(): string {
  // 优先从 monorepo 读取（开发环境）
  const devPath = resolve(__dirname, '../../../react/src/components');
  if (existsSync(devPath)) return devPath;

  // 生产环境：从 @libra/react 包读取
  try {
    const pkg = resolve(require.resolve('@libra/react/package.json'), '../src/components');
    if (existsSync(pkg)) return pkg;
  } catch {
    // fallback
  }

  // 最后尝试：从 CLI 同目录的 components 读取
  return resolve(__dirname, '../components');
}

const COMPONENTS: Record<string, string> = {
  button: 'button.tsx',
  card: 'card.tsx',
  table: 'table.tsx',
  badge: 'badge.tsx',
  input: 'input.tsx',
  'price-display': 'price-display.tsx',
  'change-badge': 'change-badge.tsx',
  'stock-card': 'stock-card.tsx',
  select: 'select.tsx',
  tabs: 'tabs.tsx',
  tag: 'tag.tsx',
  modal: 'modal.tsx',
  tooltip: 'tooltip.tsx',
  switch: 'switch.tsx',
  'market-table': 'market-table.tsx',
};

/**
 * 读取组件源码，将内部 import 路径改写为用户的本地路径
 */
function readComponent(name: string, pkg: string): string {
  const srcDir = getSourceDir();
  const filePath = resolve(srcDir, COMPONENTS[name]);
  let source = readFileSync(filePath, 'utf-8');

  // 改写 import 路径：'../lib/utils' → '${pkg}/lib/utils'
  source = source.replace(/from ['"]\.\.\/lib\/utils['"]/g, `from "${pkg}/lib/utils"`);

  return source;
}

/**
 * 复制 cn() 工具函数
 */
function writeUtils(targetDir: string, pkg: string): void {
  const srcDir = getSourceDir();
  const utilsPath = resolve(srcDir, '../lib/utils.ts');
  if (!existsSync(utilsPath)) return;

  const libDir = resolve(targetDir, '..', 'lib');
  if (!existsSync(libDir)) mkdirSync(libDir, { recursive: true });

  const targetPath = resolve(libDir, 'utils.ts');
  if (existsSync(targetPath)) return;

  let source = readFileSync(utilsPath, 'utf-8');
  // 保持 import 路径不变
  writeFileSync(targetPath, source, 'utf-8');
}

export function addCommand(name: string): void {
  const cwd = process.cwd();
  const key = name.toLowerCase();
  const fileName = COMPONENTS[key];

  if (!fileName) {
    console.error('');
    console.error(`  ✗ 未知组件 "${name}"`);
    console.error(`  可用组件: ${Object.keys(COMPONENTS).join(', ')}`);
    console.error('');
    process.exit(1);
  }

  const targetDir = resolve(cwd, 'src/components/ui');
  const targetPath = resolve(targetDir, fileName);

  if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true });
  }

  if (existsSync(targetPath)) {
    console.error(`  ⚠  ${targetPath} 已存在，跳过。`);
    process.exit(0);
  }

  const pkgPath = findStockuiPath(cwd) || '@/components/ui';

  // 写入组件源码
  const source = readComponent(key, pkgPath);
  writeFileSync(targetPath, source, 'utf-8');

  // 写入 cn() 工具函数
  writeUtils(targetDir, pkgPath);

  console.log('');
  console.log(`  ✓ 添加组件: ${name} → ${targetPath}`);
  console.log('');
  console.log('  提示：确保已在入口处 import tokens.css');
  console.log('');
}

function findStockuiPath(cwd: string): string | null {
  try {
    const pkgPath = resolve(cwd, 'package.json');
    const content = JSON.parse(readFileSync(pkgPath, 'utf-8'));
    const deps = { ...content.dependencies, ...content.devDependencies };

    if (deps['@libra/tokens']) return '@libra/tokens';
    if (deps['libra']) return 'libra/packages/tokens';

    return null;
  } catch {
    return null;
  }
}
