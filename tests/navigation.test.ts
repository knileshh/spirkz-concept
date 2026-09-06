import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import postcss from 'postcss';
import { createServer } from 'vite';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { navigation, topics, faqs } from '../src/content.ts';

test('the rendered page contains every navigation destination and original topic', async () => {
  const server = await createServer({
    server: { middlewareMode: true, hmr: false, ws: false },
    appType: 'custom',
  });
  try {
    const { default: App } = await server.ssrLoadModule('/src/App.tsx');
    const html = renderToStaticMarkup(createElement(App));
    for (const [, hash] of navigation)
      assert.ok(
        html.includes(`id="${hash.slice(1)}"`),
        `Missing section ${hash}`,
      );
    for (const topic of topics)
      assert.ok(
        html.includes(topic.replaceAll('&', '&amp;')),
        `Missing topic ${topic}`,
      );
    assert.equal(topics.length, 12);
    assert.equal(faqs.length, 9);
    assert.ok(html.includes('aria-label="Open navigation"'));
    assert.ok(html.includes('aria-expanded="false"'));
    assert.ok(
      !html.includes('id="mobile-nav"'),
      'Closed navigation should not expose its links',
    );
  } finally {
    await server.close();
  }
});

// Resolve display declarations for the simple class selectors involved in the
// reported bug. In the regression, .icon-button overrode .mobile-toggle while
// .mobile-nav still resolved to display:none at desktop/tablet widths.
function displayAt(classes: string[], width: number) {
  const root = postcss.parse(readFileSync('app/globals.css', 'utf8'));
  let result = { score: -1, value: '' };
  root.walkRules((rule) => {
    for (let parent = rule.parent; parent; parent = parent.parent) {
      if (parent.type !== 'atrule' || parent.name !== 'media') continue;
      for (const match of parent.params.matchAll(
        /(max|min)-width:\s*(\d+)px/g,
      )) {
        if (
          match[1] === 'max'
            ? width > Number(match[2])
            : width < Number(match[2])
        )
          return;
      }
    }
    for (const selector of rule.selector.split(',')) {
      const clean = selector.trim();
      if (!/^(\.[\w-]+)+$/.test(clean)) continue;
      const required = clean.slice(1).split('.');
      if (!required.every((name) => classes.includes(name))) continue;
      rule.walkDecls('display', (declaration) => {
        const score = required.length + (declaration.important ? 100 : 0);
        if (score >= result.score) result = { score, value: declaration.value };
      });
    }
  });
  return result.value;
}

test('opening the hamburger cannot leave its dropdown CSS-hidden at any supported width', () => {
  for (const width of [320, 375, 600, 768, 1024, 1440]) {
    assert.equal(
      displayAt(['mobile-toggle', 'icon-button'], width),
      'inline-grid',
      `toggle at ${width}px`,
    );
    assert.equal(
      displayAt(['mobile-nav'], width),
      'flex',
      `dropdown at ${width}px`,
    );
  }
});
