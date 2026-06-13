#!/usr/bin/env node

/**
 * @libra-design/cli — libra 设计系统 CLI
 *
 * 类似 shadcn/ui 的体验：
 *   npx @libra-design/cli init        → 初始化 tokens.css 到项目
 *   npx @libra-design/cli add button  → 复制组件源码到项目
 *
 * 项目信息页: https://github.com/ccwu/libra
 */

import { Command } from 'commander';
import { initCommand } from './commands/init.js';
import { addCommand } from './commands/add.js';

const pkg = { version: '0.1.0' };

const program = new Command();

program
  .name('libra')
  .description('libra 设计系统 CLI — 自研金融设计语言')
  .version(pkg.version);

program
  .command('init')
  .description('初始化 libra 设计 Token 到项目')
  .option('-y, --yes', '跳过确认，使用默认配置')
  .action((opts) => initCommand(opts));

program
  .command('add')
  .description('添加 libra 组件到项目')
  .argument('<name>', '组件名（如 button, table, card）')
  .action((name) => addCommand(name));

program.parse();
