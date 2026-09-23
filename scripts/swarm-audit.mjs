#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const repoRoot = process.cwd();

function runCommand(command) {
  try {
    execSync(command, { stdio: 'pipe', encoding: 'utf8' });
    return { status: 'pass', details: 'Command succeeded.' };
  } catch (error) {
    const output = [error.stdout, error.stderr].filter(Boolean).join('\n').trim();
    return {
      status: 'fail',
      details: output || error.message || 'Command failed.',
    };
  }
}

function checkFile(path) {
  return existsSync(resolve(repoRoot, path));
}

function countLines(path, regex) {
  if (!checkFile(path)) return 0;
  const content = readFileSync(resolve(repoRoot, path), 'utf8');
  const matches = content.match(regex);
  return matches ? matches.length : 0;
}

function countMatches(paths, regex) {
  return paths.reduce((total, path) => total + countLines(path, regex), 0);
}

function auditBuildAgent() {
  return {
    agent: 'Build & Type Safety Agent',
    checks: [
      { name: 'Lint', ...runCommand('npm run lint') },
      { name: 'Typecheck', ...runCommand('npm run typecheck') },
      { name: 'Production build', ...runCommand('npm run build') },
    ],
  };
}

function auditSeoAgent() {
  const hasSitemap = checkFile('src/app/sitemap.ts');
  const hasRobots = checkFile('src/app/robots.ts');
  const hasManifest = checkFile('public/site.webmanifest');

  return {
    agent: 'SEO Agent',
    checks: [
      {
        name: 'Sitemap route exists',
        status: hasSitemap ? 'pass' : 'fail',
        details: hasSitemap ? 'Found src/app/sitemap.ts.' : 'Missing sitemap route.',
      },
      {
        name: 'Robots route exists',
        status: hasRobots ? 'pass' : 'fail',
        details: hasRobots ? 'Found src/app/robots.ts.' : 'Missing robots route.',
      },
      {
        name: 'Web manifest exists',
        status: hasManifest ? 'pass' : 'fail',
        details: hasManifest ? 'Found public/site.webmanifest.' : 'Missing web manifest.',
      },
    ],
  };
}

function auditAccessibilityAgent() {
  const formLabels = countLines('src/components/sections/ContactForm.tsx', /<label/gi);
  const imageAlt = countLines('src/components/sections/Hero.tsx', /alt=/gi);

  return {
    agent: 'Accessibility Agent',
    checks: [
      {
        name: 'Contact form has labels',
        status: formLabels > 0 ? 'pass' : 'warn',
        details: formLabels > 0 ? `Found ${formLabels} label tag(s).` : 'No label tags detected in ContactForm.tsx.',
      },
      {
        name: 'Hero images include alt text',
        status: imageAlt > 0 ? 'pass' : 'warn',
        details: imageAlt > 0 ? `Found ${imageAlt} alt attribute(s).` : 'No alt attributes detected in Hero.tsx.',
      },
    ],
  };
}

function auditConversionAgent() {
  const hasQuoteAction = checkFile('src/actions/quote.ts');
  const hasContactAction = checkFile('src/actions/contact.ts');
  const homepageFiles = [
    'src/views/Home.tsx',
    'src/views/HomeBelowFold.tsx',
    'src/components/sections/Hero.tsx',
    'src/components/sections/QuoteForm.tsx',
    'src/components/sections/TrustBadges.tsx',
    'src/components/sections/HowItWorks.tsx',
    'src/components/sections/WhyUs.tsx',
    'src/components/sections/ServiceAreas.tsx',
    'src/components/sections/FAQ.tsx',
    'src/components/sections/SellingSafelySection.tsx',
    'src/components/sections/FinalCTA.tsx',
  ];
  const ctaCount = countMatches(homepageFiles, /Quote|Call|Contact/gi);

  return {
    agent: 'Conversion Agent',
    checks: [
      {
        name: 'Quote action exists',
        status: hasQuoteAction ? 'pass' : 'fail',
        details: hasQuoteAction ? 'Found src/actions/quote.ts.' : 'Quote server action missing.',
      },
      {
        name: 'Contact action exists',
        status: hasContactAction ? 'pass' : 'fail',
        details: hasContactAction ? 'Found src/actions/contact.ts.' : 'Contact server action missing.',
      },
      {
        name: 'CTA language density on homepage',
        status: ctaCount >= 5 ? 'pass' : 'warn',
        details: `Detected ${ctaCount} CTA keyword matches across the homepage component tree.`,
      },
    ],
  };
}

function auditContentIntegrityAgent() {
  return {
    agent: 'Content Integrity Agent',
    checks: [
      {
        name: 'Regulated-content claim scan',
        ...runCommand('npm run check:content'),
      },
    ],
  };
}

function scoreStatus(status) {
  if (status === 'pass') return 2;
  if (status === 'warn') return 1;
  return 0;
}

function summarize(results) {
  const allChecks = results.flatMap((group) => group.checks);
  const total = allChecks.length;
  const passed = allChecks.filter((c) => c.status === 'pass').length;
  const warned = allChecks.filter((c) => c.status === 'warn').length;
  const failed = allChecks.filter((c) => c.status === 'fail').length;
  const points = allChecks.reduce((sum, c) => sum + scoreStatus(c.status), 0);
  const maxPoints = total * 2;
  const score = Math.round((points / maxPoints) * 100);

  return { total, passed, warned, failed, score };
}

function createReport(results, summary) {
  const now = new Date().toISOString();
  const header = [
    '# Website Audit (Swarm Agents)',
    '',
    `Generated: ${now}`,
    `Overall score: ${summary.score}/100`,
    `Checks: ${summary.total} total | ${summary.passed} pass | ${summary.warned} warn | ${summary.failed} fail`,
    '',
  ];

  const body = results.flatMap((group) => {
    const lines = [`## ${group.agent}`, ''];
    for (const check of group.checks) {
      const icon = check.status === 'pass' ? '✅' : check.status === 'warn' ? '⚠️' : '❌';
      lines.push(`- ${icon} **${check.name}**: ${check.details}`);
    }
    lines.push('');
    return lines;
  });

  return [...header, ...body].join('\n');
}

const results = [
  auditBuildAgent(),
  auditSeoAgent(),
  auditAccessibilityAgent(),
  auditConversionAgent(),
  auditContentIntegrityAgent(),
];

const summary = summarize(results);
const report = createReport(results, summary);
const reportDirectory = resolve(repoRoot, 'reports');
const reportPath = resolve(reportDirectory, 'website-audit.md');

mkdirSync(reportDirectory, { recursive: true });
writeFileSync(reportPath, report, 'utf8');
console.log(`Audit complete. Report written to ${reportPath}`);
console.log(`Score: ${summary.score}/100 (${summary.passed} pass, ${summary.warned} warn, ${summary.failed} fail)`);

if (summary.failed > 0) {
  process.exitCode = 1;
}
