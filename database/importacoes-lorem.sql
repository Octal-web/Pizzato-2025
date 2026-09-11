-- Dados fictícios para testar /ao-redor-do-mundo.
-- Execute uma vez: cada execução adiciona três novos registros.
-- Requer um idioma cadastrado como padrão; sem ele, não insere registros.
SET NAMES utf8mb4;
START TRANSACTION;

SET @idioma_id = (SELECT id FROM idiomas WHERE padrao = 1 ORDER BY id DESC LIMIT 1);

INSERT INTO importacoes (imagem, visivel, ordem, criado)
SELECT 'lorem-franca.png', 1, 0, NOW() FROM DUAL WHERE @idioma_id IS NOT NULL;

INSERT INTO importacoes_idiomas (pais, cidades, descricao, idioma_id, importacao_id, criado)
SELECT 'França', 'Paris · Bordeaux · Champagne',
       '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vitae lectus vel augue fermentum tempor.</p><p>Integer at sapien sed lorem posuere facilisis. Donec dignissim, neque vitae tincidunt dictum, erat justo consequat est.</p>',
       @idioma_id, LAST_INSERT_ID(), NOW()
FROM DUAL WHERE @idioma_id IS NOT NULL;

INSERT INTO importacoes (imagem, visivel, ordem, criado)
SELECT 'lorem-italia.png', 1, 1, NOW() FROM DUAL WHERE @idioma_id IS NOT NULL;

INSERT INTO importacoes_idiomas (pais, cidades, descricao, idioma_id, importacao_id, criado)
SELECT 'Itália', 'Toscana · Piemonte · Vêneto',
       '<p>Curabitur blandit tempus porttitor. Aenean eu leo quam, pellentesque ornare sem lacinia quam venenatis vestibulum.</p><p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Maecenas faucibus mollis interdum.</p>',
       @idioma_id, LAST_INSERT_ID(), NOW()
FROM DUAL WHERE @idioma_id IS NOT NULL;

INSERT INTO importacoes (imagem, visivel, ordem, criado)
SELECT 'lorem-portugal.png', 1, 2, NOW() FROM DUAL WHERE @idioma_id IS NOT NULL;

INSERT INTO importacoes_idiomas (pais, cidades, descricao, idioma_id, importacao_id, criado)
SELECT 'Portugal', 'Douro · Alentejo · Lisboa',
       '<p>Nullam quis risus eget urna mollis ornare vel eu leo. Sed posuere consectetur est at lobortis.</p><p>Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</p>',
       @idioma_id, LAST_INSERT_ID(), NOW()
FROM DUAL WHERE @idioma_id IS NOT NULL;

COMMIT;
