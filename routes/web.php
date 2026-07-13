<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\HomeController;
use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\InstitucionalController;
use App\Http\Controllers\LinhasController;
use App\Http\Controllers\ProdutosController;
use App\Http\Controllers\EnoturismoController;
use App\Http\Controllers\ContatoController;
use App\Http\Controllers\PoliticasController;
// use App\Http\Controllers\TokensController;
use App\Http\Controllers\PerguntasController;

use App\Http\Controllers\Manager\UsuariosController;
use App\Http\Controllers\Manager\ConteudosController as ManagerPaginasController;
use App\Http\Controllers\Manager\ConteudosController as ManagerConteudosController;
use App\Http\Controllers\Manager\ImagensController as ManagerImagensController;
use App\Http\Controllers\Manager\HomeController as ManagerHomeController;
use App\Http\Controllers\Manager\SlidesController as ManagerSlidesController;
use App\Http\Controllers\Manager\InstitucionalController as ManagerInstitucionalController;
use App\Http\Controllers\Manager\TokensController as ManagerTokensController;
use App\Http\Controllers\Manager\VinhedosController as ManagerVinhedosController;
use App\Http\Controllers\Manager\AcontecimentosController as ManagerAcontecimentosController;
use App\Http\Controllers\Manager\ProdutosController as ManagerProdutosController;
use App\Http\Controllers\Manager\DetalhesProdutosController as ManagerDetalhesProdutosController;
use App\Http\Controllers\Manager\LinhasController as ManagerLinhasController;
use App\Http\Controllers\Manager\VolumesController as ManagerVolumesController;
use App\Http\Controllers\Manager\CategoriasController as ManagerCategoriasController;
use App\Http\Controllers\Manager\EnoturismoController as ManagerEnoturismoController;
use App\Http\Controllers\Manager\ExperienciasController as ManagerExperienciasController;
use App\Http\Controllers\Manager\ContatoController as ManagerContatoController;
use App\Http\Controllers\Manager\NewsletterController as ManagerNewsletterController;
use App\Http\Controllers\Manager\PoliticasController as ManagerPoliticasController;

use App\Http\Controllers\Intranet\UsuariosController as IntranetUsuariosController;
use App\Http\Controllers\Intranet\FileController as IntranetFileController;
use App\Http\Controllers\Intranet\MembrosController as IntranetMembrosController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::group(['prefix' => LaravelLocalization::setLocale(), 'middleware' => ['localeSessionRedirect', 'localizationRedirect', 'localeViewPath']], function () {
    Route::get('/', [HomeController::class, 'index'])->name('Home.index');

    Route::post('/newsletter/enviar', [NewsletterController::class, 'enviar'])->name('Newsletter.enviar');

    Route::prefix('/sobre-nos')->group(function() {
        Route::get('/', [InstitucionalController::class, 'index'])->name('Institucional.index');
        Route::get('/sustentabilidade', [InstitucionalController::class, 'sustentabilidade'])->name('Institucional.sustentabilidade');
        Route::get('/historia', [InstitucionalController::class, 'historia'])->name('Institucional.historia');
    });

    Route::get('/marca/{slug?}', [LinhasController::class, 'linha'])->name('Linhas.linha');

    Route::get('/nossos-vinhos', [ProdutosController::class, 'index'])->name('Produtos.index');
    Route::get('/nossos-vinhos/{slug}', [ProdutosController::class, 'produto'])->name('Produtos.produto');
    Route::get('/nossos-vinhos/download/{produto}/{id}', [ProdutosController::class, 'download'])->name('Produtos.download');

    // Route::get('lista-de-tokens', [TokensController::class, 'lista'])->name('Tokens.lista');

    Route::get('/enoturismo', [EnoturismoController::class, 'index'])->name('Enoturismo.index');

    Route::get('/contato', [ContatoController::class, 'index'])->name('Contato.index');
    Route::post('/contato/enviar', [ContatoController::class, 'enviar'])->name('Contato.enviar');

    Route::get('/perguntas-frequentes', [PerguntasController::class, 'index'])->name('Perguntas.index');

    Route::get('/politica-de-privacidade', [PoliticasController::class, 'privacidade'])->name('Politicas.privacidade');
});

Route::redirect('/fausto-merlot', '/nossos-vinhos/merlot', 301);
Route::redirect('/fausto-tannat', '/nossos-vinhos/tannat', 301);
Route::redirect('/fausto-verve', '/nossos-vinhos/verve-gran-reserva', 301);
Route::redirect('/fausto-violette', '/nossos-vinhos/violette-suave-fino', 301);
Route::redirect('/fausto-cabernet-sauvignon', '/nossos-vinhos/cabernet-sauvignon', 301);
Route::redirect('/fausto-chardonnay', '/nossos-vinhos/chardonnay', 301);
Route::redirect('/fausto-merlot-rose', '/nossos-vinhos/merlot-rose', 301);
Route::redirect('/fausto-demi-sec', '/nossos-vinhos/demi-sec-tradicional', 301);
Route::redirect('/fausto-brut-branco', '/nossos-vinhos/brut-tradicional', 301);
Route::redirect('/fausto-brut-rose', '/nossos-vinhos/brut-rose-tradicional', 301);
Route::redirect('/pizzato-alicante-bouschet', '/nossos-vinhos/alicante-bouschet-veludo-azul', 301);
Route::redirect('/pizzato-egiodola', '/nossos-vinhos/egiodola-sangue-de-verdade', 301);
Route::redirect('/pizzato-egiodola', '/nossos-vinhos/egiodola-sangue-de-verdade', 301);
Route::redirect('/pizzato-tannat', '/nossos-vinhos/tannat-nervi', 301);
Route::redirect('/pizzato-concentus', '/nossos-vinhos/concentus-gran-reserva', 301);
Route::redirect('/pizzato-dna', '/nossos-vinhos/dna-99-single-vineyard', 301);
Route::redirect('/pizzato-legno', '/nossos-vinhos/legno-chardonnay', 301);
Route::redirect('/pizzato-chardonnay', '/nossos-vinhos/chardonnay-de-chardonnays', 301);
Route::redirect('/pizzato-merlot', '/nossos-vinhos/merlot-de-merlots', 301);
Route::redirect('/pizzato-nature', '/nossos-vinhos/nature', 301);
Route::redirect('/pizzato-brut-rose-2', '/nossos-vinhos/brut-rose', 301);
Route::redirect('/pizzato-brut', '/nossos-vinhos/brut-branco-blanc-de-blanc', 301);
Route::redirect('/pizzato-semillon', '/nossos-vinhos/semillon-pp', 301);
Route::redirect('/pizzato-vertigo-nature', '/nossos-vinhos/vertigo-nature-branco-tradicional', 301);
Route::redirect('/pizzato-sauvignon-blanc', '/nossos-vinhos/sauvignon-blanc', 301);
Route::redirect('/fausto-alvarinho', '/nossos-vinhos/alvarinho', 301);
Route::redirect('/fausto-marcelle', '/nossos-vinhos/marcelle-suave-fino', 301);
Route::redirect('/allume-cabernet-sauvignon', '/nossos-vinhos/cabernet-sauvignon-1', 301);
Route::redirect('/allume-cabernet-franc', '/nossos-vinhos/cabernet-franc', 301);
Route::redirect('/allume-pinot-noir', '/nossos-vinhos/pinot-noir', 301);
Route::redirect('/allume-chardonnay', '/nossos-vinhos/chardonnay-1', 301);
Route::redirect('/pizzatonature2012-html', '/nossos-vinhos/nature', 301);
Route::redirect('/concentus-g-reserva', '/nossos-vinhos/concentus-gran-reserva', 301);
Route::redirect('/pizzato-chardonnay-dovv', '/nossos-vinhos/chardonnay-de-chardonnays', 301);
Route::redirect('/pizzato-dna-99', '/nossos-vinhos/dna-99-single-vineyard', 301);
Route::redirect('/pizzato-brut-rose', '/nossos-vinhos/brut-rose', 301);
Route::redirect('/pizzato-brut-branco', '/nossos-vinhos/brut-branco-blanc-de-blanc', 301);
Route::redirect('/PizzatoVertigo.html', '/nossos-vinhos/vertigo-nature-branco-tradicional', 301);

Route::prefix('/pt-BR/rotulos/vale-dos-vinhedos')->group(function() {
    Route::redirect('/fausto-merlot', '/nossos-vinhos/merlot', 301);
    Route::redirect('/fausto-tannat', '/nossos-vinhos/tannat', 301);
    Route::redirect('/fausto-verve', '/nossos-vinhos/verve-gran-reserva', 301);
    Route::redirect('/fausto-violette', '/nossos-vinhos/violette-suave-fino', 301);
    Route::redirect('/fausto-cabernet-sauvignon', '/nossos-vinhos/cabernet-sauvignon', 301);
    Route::redirect('/fausto-chardonnay', '/nossos-vinhos/chardonnay', 301);
    Route::redirect('/fausto-merlot-rose', '/nossos-vinhos/merlot-rose', 301);
    Route::redirect('/fausto-demi-sec', '/nossos-vinhos/demi-sec-tradicional', 301);
    Route::redirect('/fausto-brut-branco', '/nossos-vinhos/brut-tradicional', 301);
    Route::redirect('/fausto-brut-rose', '/nossos-vinhos/brut-rose-tradicional', 301);
    Route::redirect('/pizzato-alicante-bouschet', '/nossos-vinhos/alicante-bouschet-veludo-azul', 301);
    Route::redirect('/pizzato-egiodola', '/nossos-vinhos/egiodola-sangue-de-verdade', 301);
    Route::redirect('/pizzato-egiodola', '/nossos-vinhos/egiodola-sangue-de-verdade', 301);
    Route::redirect('/pizzato-tannat', '/nossos-vinhos/tannat-nervi', 301);
    Route::redirect('/pizzato-concentus', '/nossos-vinhos/concentus-gran-reserva', 301);
    Route::redirect('/pizzato-dna', '/nossos-vinhos/dna-99-single-vineyard', 301);
    Route::redirect('/pizzato-legno', '/nossos-vinhos/legno-chardonnay', 301);
    Route::redirect('/pizzato-chardonnay', '/nossos-vinhos/chardonnay-de-chardonnays', 301);
    Route::redirect('/pizzato-merlot', '/nossos-vinhos/merlot-de-merlots', 301);
    Route::redirect('/pizzato-nature', '/nossos-vinhos/nature', 301);
    Route::redirect('/pizzato-brut-rose-2', '/nossos-vinhos/brut-rose', 301);
    Route::redirect('/pizzato-brut', '/nossos-vinhos/brut-branco-blanc-de-blanc', 301);
    Route::redirect('/pizzato-semillon', '/nossos-vinhos/semillon-pp', 301);
    Route::redirect('/pizzato-vertigo-nature', '/nossos-vinhos/vertigo-nature-branco-tradicional', 301);
    Route::redirect('/pizzato-sauvignon-blanc', '/nossos-vinhos/sauvignon-blanc', 301);
    Route::redirect('/fausto-alvarinho', '/nossos-vinhos/alvarinho', 301);
    Route::redirect('/fausto-marcelle', '/nossos-vinhos/marcelle-suave-fino', 301);
    Route::redirect('/allume-cabernet-sauvignon', '/nossos-vinhos/cabernet-sauvignon-1', 301);
    Route::redirect('/allume-cabernet-franc', '/nossos-vinhos/cabernet-franc', 301);
    Route::redirect('/allume-pinot-noir', '/nossos-vinhos/pinot-noir', 301);
    Route::redirect('/allume-chardonnay', '/nossos-vinhos/chardonnay-1', 301);
    Route::redirect('/pizzatonature2012-html', '/nossos-vinhos/nature', 301);
    Route::redirect('/concentus-g-reserva', '/nossos-vinhos/concentus-gran-reserva', 301);
    Route::redirect('/pizzato-chardonnay-dovv', '/nossos-vinhos/chardonnay-de-chardonnays', 301);
    Route::redirect('/pizzato-dna-99', '/nossos-vinhos/dna-99-single-vineyard', 301);
    Route::redirect('/pizzato-brut-rose', '/nossos-vinhos/brut-rose', 301);
    Route::redirect('/pizzato-brut-branco', '/nossos-vinhos/brut-branco-blanc-de-blanc', 301);
    Route::redirect('/PizzatoVertigo.html', '/nossos-vinhos/vertigo-nature-branco-tradicional', 301);
});

Route::prefix('/manager')->group(function() {
    Route::get('/', [UsuariosController::class, 'login'])->name('Manager.Usuarios.login');
    Route::post('/', ['as' => 'login', 'uses' => 'App\Http\Controllers\Manager\UsuariosController@authenticate']);

    Route::post('/usuarios/logout', [UsuariosController::class, 'logout'])->name('Manager.Usuarios.logout');

    Route::group(['middleware' => ['auth']], function() {
        Route::post('/paginas/editar/{id}', [ManagerPaginasController::class, 'editarAction'])->name('Manager.Paginas.editar');

        Route::post('/conteudos/editar/{id}', [ManagerConteudosController::class, 'editarAction'])->name('Manager.Conteudos.editar');
        Route::post('/conteudos/baixar-arquivo/{id}', [ManagerConteudosController::class, 'baixarArquivo'])->name('Manager.Conteudos.baixarArquivo');

        Route::get('/imagens/{id}', [ManagerImagensController::class, 'conteudo'])->name('Manager.Imagens.conteudo');
        Route::post('/imagens/conteudo/adicionar/{id}', [ManagerImagensController::class, 'novo'])->name('Manager.Imagens.novo');
        
        Route::post('/imagens/conteudo/ordenar/{id}', [ManagerImagensController::class, 'ordenar'])->name('Manager.Imagens.ordenar');
        Route::post('/imagens/conteudo/visibilidade/{id}', [ManagerImagensController::class, 'visibilidade'])->name('Manager.Imagens.visibilidade');
        Route::post('/imagens/conteudo/excluir/{id}', [ManagerImagensController::class, 'excluir'])->name('Manager.Imagens.excluir');


        Route::get('/home', [ManagerHomeController::class, 'index'])->name('Manager.Home.index');

        Route::post('/slides/ordenar', [ManagerSlidesController::class, 'ordenar'])->name('Manager.Slides.ordenar');
        Route::post('/slides/visibilidade/{id}', [ManagerSlidesController::class, 'visibilidade'])->name('Manager.Slides.visibilidade');
        Route::post('/slides/excluir/{id}', [ManagerSlidesController::class, 'excluir'])->name('Manager.Slides.excluir');

        Route::get('/slides/adicionar/{tipo}', [ManagerSlidesController::class, 'adicionar'])->name('Manager.Slides.adicionar');
        Route::post('/slides/adicionar/{tipo}', [ManagerSlidesController::class, 'novo'])->name('Manager.Slides.novo');
        Route::get('/slides/editar/{id}', [ManagerSlidesController::class, 'editar'])->name('Manager.Slides.editar');
        Route::post('/slides/editar/{id}', [ManagerSlidesController::class, 'atualizar'])->name('Manager.Slides.atualizar');
        Route::get('/slides/baixar-video/{id}/{video}', [ManagerSlidesController::class, 'baixarVideo'])->name('Manager.Slides.baixarVideo');


        Route::get('/institucional', [ManagerInstitucionalController::class, 'index'])->name('Manager.Institucional.index');

        Route::post('/vinhedos/ordenar', [ManagerVinhedosController::class, 'ordenar'])->name('Manager.Vinhedos.ordenar');
        Route::post('/vinhedos/visibilidade/{id}', [ManagerVinhedosController::class, 'visibilidade'])->name('Manager.Vinhedos.visibilidade');
        Route::post('/vinhedos/excluir/{id}', [ManagerVinhedosController::class, 'excluir'])->name('Manager.Vinhedos.excluir');

        Route::get('/vinhedos/adicionar', [ManagerVinhedosController::class, 'adicionar'])->name('Manager.Vinhedos.adicionar');
        Route::post('/vinhedos/adicionar', [ManagerVinhedosController::class, 'novo'])->name('Manager.Vinhedos.novo');
        Route::get('/vinhedos/editar/{id}', [ManagerVinhedosController::class, 'editar'])->name('Manager.Vinhedos.editar');
        Route::post('/vinhedos/editar/{id}', [ManagerVinhedosController::class, 'atualizar'])->name('Manager.Vinhedos.atualizar');

        Route::get('/institucional/historia', [ManagerInstitucionalController::class, 'historia'])->name('Manager.Institucional.historia');

        Route::post('/institucional/acontecimentos/ordenar', [ManagerAcontecimentosController::class, 'ordenar'])->name('Manager.Acontecimentos.ordenar');
        Route::post('/institucional/acontecimentos/visibilidade/{id}', [ManagerAcontecimentosController::class, 'visibilidade'])->name('Manager.Acontecimentos.visibilidade');
        Route::post('/institucional/acontecimentos/excluir/{id}', [ManagerAcontecimentosController::class, 'excluir'])->name('Manager.Acontecimentos.excluir');

        Route::get('/institucional/acontecimentos/adicionar', [ManagerAcontecimentosController::class, 'adicionar'])->name('Manager.Acontecimentos.adicionar');
        Route::post('/institucional/acontecimentos/adicionar', [ManagerAcontecimentosController::class, 'novo'])->name('Manager.Acontecimentos.novo');
        Route::get('/institucional/acontecimentos/editar/{id}', [ManagerAcontecimentosController::class, 'editar'])->name('Manager.Acontecimentos.editar');
        Route::post('/institucional/acontecimentos/editar/{id}', [ManagerAcontecimentosController::class, 'atualizar'])->name('Manager.Acontecimentos.atualizar');

        Route::get('/institucional/sustentabilidade', [ManagerInstitucionalController::class, 'sustentabilidade'])->name('Manager.Institucional.sustentabilidade');

        Route::get('/produtos', [ManagerProdutosController::class, 'index'])->name('Manager.Produtos.index');

        Route::post('/produtos/ordenar', [ManagerProdutosController::class, 'ordenar'])->name('Manager.Produtos.ordenar');
        Route::post('/produtos/visibilidade/{id}', [ManagerProdutosController::class, 'visibilidade'])->name('Manager.Produtos.visibilidade');
        Route::post('/produtos/excluir/{id}', [ManagerProdutosController::class, 'excluir'])->name('Manager.Produtos.excluir');

        Route::get('/produtos/adicionar', [ManagerProdutosController::class, 'adicionar'])->name('Manager.Produtos.adicionar');
        Route::post('/produtos/adicionar', [ManagerProdutosController::class, 'novo'])->name('Manager.Produtos.novo');
        Route::get('/produtos/editar/{id}', [ManagerProdutosController::class, 'editar'])->name('Manager.Produtos.editar');
        Route::post('/produtos/editar/{id}', [ManagerProdutosController::class, 'atualizar'])->name('Manager.Produtos.atualizar');
        Route::get('/produtos/baixar-arquivo/{produto}/{id}', [ManagerProdutosController::class, 'baixarArquivo'])->name('Manager.Produtos.baixarArquivo');

        Route::get('/produtos/detalhes/{id}', [ManagerDetalhesProdutosController::class, 'index'])->name('Manager.Produtos.Detalhes.index');
        
        Route::post('/produtos/detalhes/ordenar', [ManagerDetalhesProdutosController::class, 'ordenar'])->name('Manager.Produtos.Detalhes.ordenar');
        Route::post('/produtos/detalhes/visibilidade/{id}', [ManagerDetalhesProdutosController::class, 'visibilidade'])->name('Manager.Produtos.Detalhes.visibilidade');
        Route::post('/produtos/detalhes/excluir/{id}', [ManagerDetalhesProdutosController::class, 'excluir'])->name('Manager.Produtos.Detalhes.excluir');

        Route::get('/produtos/detalhes/adicionar/{id}', [ManagerDetalhesProdutosController::class, 'adicionar'])->name('Manager.Produtos.Detalhes.adicionar');
        Route::post('/produtos/detalhes/adicionar/{id}', [ManagerDetalhesProdutosController::class, 'novo'])->name('Manager.Produtos.Detalhes.novo');
        Route::get('/produtos/detalhes/editar/{id}', [ManagerDetalhesProdutosController::class, 'editar'])->name('Manager.Produtos.Detalhes.editar');
        Route::post('/produtos/detalhes/editar/{id}', [ManagerDetalhesProdutosController::class, 'atualizar'])->name('Manager.Produtos.Detalhes.atualizar');


        Route::get('/linhas', [ManagerLinhasController::class, 'index'])->name('Manager.Linhas.index');

        Route::post('/linhas/ordenar', [ManagerLinhasController::class, 'ordenar'])->name('Manager.Linhas.ordenar');
        Route::post('/linhas/visibilidade/{id}', [ManagerLinhasController::class, 'visibilidade'])->name('Manager.Linhas.visibilidade');
        Route::post('/linhas/excluir/{id}', [ManagerLinhasController::class, 'excluir'])->name('Manager.Linhas.excluir');

        Route::get('/linhas/adicionar', [ManagerLinhasController::class, 'adicionar'])->name('Manager.Linhas.adicionar');
        Route::post('/linhas/adicionar', [ManagerLinhasController::class, 'novo'])->name('Manager.Linhas.novo');
        Route::get('/linhas/editar/{id}', [ManagerLinhasController::class, 'editar'])->name('Manager.Linhas.editar');
        Route::post('/linhas/editar/{id}', [ManagerLinhasController::class, 'atualizar'])->name('Manager.Linhas.atualizar');


        Route::post('/categorias/ordenar', [ManagerCategoriasController::class, 'ordenar'])->name('Manager.Categorias.ordenar');
        Route::post('/categorias/visibilidade/{id}', [ManagerCategoriasController::class, 'visibilidade'])->name('Manager.Categorias.visibilidade');
        Route::post('/categorias/excluir/{id}', [ManagerCategoriasController::class, 'excluir'])->name('Manager.Categorias.excluir');

        Route::get('/categorias/adicionar', [ManagerCategoriasController::class, 'adicionar'])->name('Manager.Categorias.adicionar');
        Route::post('/categorias/adicionar', [ManagerCategoriasController::class, 'novo'])->name('Manager.Categorias.novo');
        Route::get('/categorias/editar/{id}', [ManagerCategoriasController::class, 'editar'])->name('Manager.Categorias.editar');
        Route::post('/categorias/editar/{id}', [ManagerCategoriasController::class, 'atualizar'])->name('Manager.Categorias.atualizar');

        
        Route::post('/volumes/ordenar', [ManagerVolumesController::class, 'ordenar'])->name('Manager.Volumes.ordenar');
        Route::post('/volumes/visibilidade/{id}', [ManagerVolumesController::class, 'visibilidade'])->name('Manager.Volumes.visibilidade');
        Route::post('/volumes/excluir/{id}', [ManagerVolumesController::class, 'excluir'])->name('Manager.Volumes.excluir');

        Route::get('/volumes/adicionar', [ManagerVolumesController::class, 'adicionar'])->name('Manager.Volumes.adicionar');
        Route::post('/volumes/adicionar', [ManagerVolumesController::class, 'novo'])->name('Manager.Volumes.novo');
        Route::get('/volumes/editar/{id}', [ManagerVolumesController::class, 'editar'])->name('Manager.Volumes.editar');
        Route::post('/volumes/editar/{id}', [ManagerVolumesController::class, 'atualizar'])->name('Manager.Volumes.atualizar');


        Route::get('/enoturismo', [ManagerEnoturismoController::class, 'index'])->name('Manager.Enoturismo.index');

        Route::post('/experiencias/ordenar', [ManagerExperienciasController::class, 'ordenar'])->name('Manager.Experiencias.ordenar');
        Route::post('/experiencias/visibilidade/{id}', [ManagerExperienciasController::class, 'visibilidade'])->name('Manager.Experiencias.visibilidade');
        Route::post('/experiencias/excluir/{id}', [ManagerExperienciasController::class, 'excluir'])->name('Manager.Experiencias.excluir');

        Route::get('/experiencias/adicionar', [ManagerExperienciasController::class, 'adicionar'])->name('Manager.Experiencias.adicionar');
        Route::post('/experiencias/adicionar', [ManagerExperienciasController::class, 'novo'])->name('Manager.Experiencias.novo');
        Route::get('/experiencias/editar/{id}', [ManagerExperienciasController::class, 'editar'])->name('Manager.Experiencias.editar');
        Route::post('/experiencias/editar/{id}', [ManagerExperienciasController::class, 'atualizar'])->name('Manager.Experiencias.atualizar');


        Route::get('/contato', [ManagerContatoController::class, 'index'])->name('Manager.Contato.index');
        Route::get('/contato/visualizar/{id}', [ManagerContatoController::class, 'visualizar'])->name('Manager.Contato.visualizar');
        Route::post('/contato/excluir/{id}', [ManagerContatoController::class, 'excluir'])->name('Manager.Contato.excluir');

        Route::get('/newsletter/visualizar/{id}', [ManagerNewsletterController::class, 'visualizar'])->name('Manager.Newsletter.visualizar');
        Route::post('/newsletter/excluir/{id}', [ManagerNewsletterController::class, 'excluir'])->name('Manager.Newsletter.excluir');


        Route::get('/politicas/privacidade', [ManagerPoliticasController::class, 'privacidade'])->name('Manager.Politicas.privacidade');
    });
});

Route::prefix('/intranet')->group(function () {
    Route::get('/login', [IntranetUsuariosController::class, 'login'])->name('Intranet.Usuarios.login');
    Route::post('/login', ['as' => 'Intranet.login', 'uses' => 'App\Http\Controllers\Intranet\UsuariosController@authenticate']);

    Route::post('/usuarios/logout', [IntranetUsuariosController::class, 'logout'])->name('Intranet.Usuarios.logout');

    Route::middleware([App\Http\Middleware\FilesAuth::class])->group(function() {
        Route::get('/', [IntranetFileController::class, 'index'])->name('Intranet.index');
        Route::post('/upload', [IntranetFileController::class, 'upload'])->name('Intranet.upload');
        Route::post('/folder', [IntranetFileController::class, 'createFolder'])->name('Intranet.createFolder');
        Route::patch('/rename', [IntranetFileController::class, 'rename'])->name('Intranet.rename');
        Route::delete('/delete', [IntranetFileController::class, 'delete'])->name('Intranet.delete');
        Route::get('/download', [IntranetFileController::class, 'download'])->name('Intranet.download');
        Route::patch('/move', [IntranetFileController::class, 'move'])->name('Intranet.move');
        Route::delete('/delete-multiple', [IntranetFileController::class, 'deleteMultiple'])->name('Intranet.deleteMultiple');
        Route::patch('/move-multiple', [IntranetFileController::class, 'moveMultiple'])->name('Intranet.moveMultiple');
        Route::get('/download-multiple', [IntranetFileController::class, 'downloadMultiple'])->name('Intranet.downloadMultiple');

        Route::get('/usuarios', [IntranetMembrosController::class, 'index'])->name('Intranet.Membros.index');
        Route::get('/usuarios/adicionar', [IntranetMembrosController::class, 'adicionar'])->name('Intranet.Membros.adicionar');
        Route::post('/usuarios/adicionar', [IntranetMembrosController::class, 'adicionar'])->name('Intranet.Membros.novo');
        Route::get('/usuarios/visualizar/{id}', [IntranetMembrosController::class, 'ver'])->name('Intranet.Membros.ver');
        Route::get('/usuarios/editar/{id}', [IntranetMembrosController::class, 'editar'])->name('Intranet.Membros.editar');
        Route::post('/usuarios/editar/{id}', [IntranetMembrosController::class, 'atualizar'])->name('Intranet.Membros.atualizar');
        Route::patch('/usuarios/mudar-admin/{id}', [IntranetMembrosController::class, 'mudarAdmin'])->name('Intranet.Membros.mudarAdmin');
        Route::delete('/usuarios/excluir/{id}', [IntranetMembrosController::class, 'excluir'])->name('Intranet.Membros.excluir');
    });
});

Auth::routes(['login' => false]);