import Select from 'react-select';
import { CountryFlag, countryOptions, findCountry } from '@/Components/CountryFlag';

export const InputCountry = ({ value, onChange, error }) => {
    const country = findCountry(value);
    const selected = countryOptions.find(option => option.value === country?.name);

    return (
        <div className="mb-6 col-span-12 lg:col-span-8">
            <label htmlFor="import-country" className="block font-bold text-gray-500 mb-2">País</label>
            <Select
                inputId="import-country"
                options={countryOptions}
                value={selected ?? (value ? { value, label: value } : null)}
                onChange={option => onChange('pais', option?.value ?? '')}
                formatOptionLabel={option => <span className="flex items-center gap-2"><CountryFlag country={option.value} />{option.label}</span>}
                placeholder="Selecione um país..."
                noOptionsMessage={() => 'Nenhum país encontrado'}
                isSearchable
                aria-invalid={!!error}
                aria-describedby={error ? 'import-country-error' : undefined}
                classNamePrefix="admin-select"
            />
            {error && <p id="import-country-error" className="text-sm text-red-500 mt-1">{error}</p>}
        </div>
    );
};
