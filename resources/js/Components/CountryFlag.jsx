import 'flag-icons/css/flag-icons.min.css';
import countries from '../../data/import-countries.json';

const normalize = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();

export const findCountry = value => countries.find(country =>
    [country.code, country.name, ...country.aliases].some(name => normalize(name) === normalize(value))
);

export const countryOptions = countries.map(country => ({ value: country.name, label: country.name }));

export const CountryFlag = ({ country }) => {
    const match = findCountry(country);
    return match ? <span className={`fi fi-${match.code.toLowerCase()} shrink-0 rounded-sm`} aria-hidden="true" /> : null;
};
