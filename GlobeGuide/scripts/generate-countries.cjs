/**
 * Generates /public/data/countries.json from the world-countries npm package.
 * The output format matches restcountries.com v3.1 so no game code needs to change
 * the shape of the data — only the fetch URL changes.
 */
const countries = require('world-countries');
const fs = require('fs');
const path = require('path');

const out = countries.map((c) => ({
  name: {
    common: c.name.common,
    official: c.name.official,
    nativeName: c.name.nativeName || {},
  },
  cca3: c.cca3,
  cca2: c.cca2,
  region: c.region,
  subregion: c.subregion || '',
  capital: c.capital || [],
  population: c.population || 0,
  area: c.area || 0,
  flags: {
    png: c.flags?.png || `https://flagcdn.com/w320/${(c.cca2 || '').toLowerCase()}.png`,
    svg: c.flags?.svg || `https://flagcdn.com/${(c.cca2 || '').toLowerCase()}.svg`,
    alt: c.flags?.alt || '',
  },
  languages: c.languages || {},
  currencies: c.currencies || {},
  borders: c.borders || [],
  timezones: c.timezones || [],
  continents: c.continents || [],
  latlng: c.latlng || [0, 0],
}));

const outPath = path.join(__dirname, '..', 'public', 'data', 'countries.json');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(out, null, 0));
console.log(`✅ Written ${out.length} countries to ${outPath}`);
