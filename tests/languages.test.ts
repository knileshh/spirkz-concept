import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

test('all seven locales render translated content with the same navigation and official branding', async () => {
  const server = await createServer({
    server: { middlewareMode: true, hmr: false, ws: false },
    appType: 'custom',
  });
  try {
    const { default: App } = await server.ssrLoadModule('/src/App.tsx');
    const {
      LanguageProvider,
      languages,
      catalogs,
      makeTranslator,
      resolveLocale,
    } = await server.ssrLoadModule('/src/I18n.tsx');
    assert.deepEqual(
      languages.map((item: { code: string }) => item.code),
      ['en', 'es', 'de', 'fr', 'ru', 'mt', 'ka'],
    );
    const english = Object.keys(catalogs.en).sort();
    for (const { code } of languages) {
      assert.deepEqual(
        Object.keys(catalogs[code]).sort(),
        english,
        `${code}: missing translation keys`,
      );
      for (const [key, value] of Object.entries(catalogs[code])) {
        assert.equal(typeof value, 'string');
        assert.ok(String(value).trim(), `${code}: empty ${key}`);
        assert.deepEqual(
          String(value)
            .match(/\{\w+\}/g)
            ?.sort() ?? [],
          key.match(/\{\w+\}/g)?.sort() ?? [],
          `${code}: changed interpolation tokens`,
        );
      }
      const t = makeTranslator(code);
      const html = renderToStaticMarkup(
        createElement(
          LanguageProvider,
          { initialLocale: code },
          createElement(App),
        ),
      );
      const escape = (s: string) =>
        s
          .replaceAll('&', '&amp;')
          .replaceAll("'", '&#x27;')
          .replaceAll('"', '&quot;')
          .replaceAll('<', '&lt;')
          .replaceAll('>', '&gt;');
      for (const key of [
        'A little scroll.',
        'discover.',
        'For creators',
        'Get the app',
        'What is Spirkz?',
      ])
        assert.ok(
          html.includes(escape(t(key))),
          `${code}: untranslated rendered ${key}`,
        );
      assert.ok(html.includes('/brand/spirkz-app-icon.png'));
      assert.ok(html.includes(`aria-label="${escape(t('Website language'))}"`));
      assert.ok(html.includes(`https://www.spirkz.com/${code}/privacy`));
      assert.ok(html.includes('id="notify"'));
      assert.ok(!html.includes('{question}'));
      assert.ok(
        !t('Jump to chapter {number}: {title}', {
          number: 2,
          title: 'Test',
        }).includes('{'),
      );
    }
    assert.equal(
      resolveLocale('ka', 'es'),
      'ka',
      'URL preference takes priority',
    );
    assert.equal(
      resolveLocale('unsupported', 'de'),
      'de',
      'stored valid preference is used',
    );
    assert.equal(
      resolveLocale(null, 'unsupported'),
      'en',
      'invalid preferences fall back to English',
    );
  } finally {
    await server.close();
  }
});

test('the official app icon is a shipped PNG and the favicon uses it', () => {
  const icon = readFileSync('public/brand/spirkz-app-icon.png');
  assert.equal(icon.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  assert.ok(
    readFileSync('index.html', 'utf8').includes('/brand/spirkz-app-icon.png'),
  );
});
