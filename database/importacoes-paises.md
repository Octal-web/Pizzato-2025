# Importações: países e bandeiras

O cadastro usa uma lista pesquisável em pt-BR e bandeiras SVG locais de `flag-icons`.
O catálogo compartilhado pelo formulário e pelo validador fica em
`resources/data/import-countries.json`. Para regenerá-lo após atualizar
`i18n-iso-countries`, execute `node scripts/generate-import-countries.cjs`.
Os nomes usam `Intl.DisplayNames('pt-BR')`; os nomes alternativos em português
e inglês permitem reconhecer registros anteriores.

## Banco

Antes de usar o novo cadastro, execute:

```sh
php artisan migrate --path=database/migrations/2026_09_15_000001_make_importacao_imagem_nullable.php
```

A migration altera somente `importacoes.imagem` (`varchar(36)`) para aceitar
NULL, pois esse campo era obrigatório. `importacoes_idiomas.cidades` já aceita
NULL. As colunas e os arquivos antigos são preservados, mas deixam de ser usados
no fluxo. Nenhuma tabela ou coluna de bandeira é necessária: o campo `pais`
continua guardando o nome selecionado e o catálogo resolve seu código ISO.

Nomes antigos que não correspondam ao catálogo continuam visíveis no site,
sem bandeira. Ao editar esses registros, selecione o país correto na lista.

As bibliotecas estão registradas em `package.json` e `package-lock.json`.
Na publicação, execute `npm ci` e `npm run build`.
