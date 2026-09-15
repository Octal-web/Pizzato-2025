// Regenerate with: node scripts/generate-import-countries.cjs
const fs = require('node:fs');
const countries = require('i18n-iso-countries');
const names = new Intl.DisplayNames(['pt-BR'], { type: 'region' });
const catalog = Object.keys(countries.getAlpha2Codes()).map(code => ({
    code,
    name: names.of(code),
    aliases: [...new Set([
        ...countries.getName(code, 'pt', { select: 'all' }),
        ...countries.getName(code, 'en', { select: 'all' }),
    ])],
})).sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
fs.mkdirSync('resources/data', { recursive: true });
fs.writeFileSync('resources/data/import-countries.json', JSON.stringify(catalog, null, 2) + '\n');
