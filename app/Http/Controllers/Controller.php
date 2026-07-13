<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\App;

use Inertia\Inertia;

use App\Models\Idioma;
use App\Models\Pagina;
use App\Models\Conteudo;
use App\Models\Linha;
use App\Models\Categoria;
use App\Models\DadosGerais;
use Illuminate\Support\Str;
use Mcamara\LaravelLocalization\Facades\LaravelLocalization;

abstract class Controller
{
    public function __construct()
    {
        $routeArray = app('request')->route()->getAction();
        $controllerAction = class_basename($routeArray['controller']);
        list($controller, $action) = explode('Controller@', $controllerAction);

        if (app('request')->route()->getPrefix() == '/manager') {
            $idioma = request('lang', -1);

            $idiomas = Idioma::all();

            $idioma = Idioma::query()
                ->where(function ($query) use ($idioma) {
                    $query->orWhere([
                        'padrao' => true
                    ])
                        ->orWhere([
                            'codigo' => $idioma
                        ]);
                })
                ->orderBy('padrao', 'ASC')
                ->orderBy('id', 'DESC')
                ->first();

            $pagina = Pagina::query()
                ->where([
                    'controladora' => $controller,
                    'acao' => $action
                ])
                ->with([
                    'paginasIdiomas' => function ($q) use ($idioma) {
                        $q->whereHas('idiomas', function ($r) use ($idioma) {
                            $r->where([
                                'id' => $idioma->id,
                            ]);
                        })
                            ->with('idiomas');
                    },
                ])
                ->first();

            $conteudos = Conteudo::query()
                ->where([
                    'controladora' => $controller,
                    'acao' => $action
                ])
                ->with([
                    'conteudosIdiomas' => function ($q) use ($idioma) {
                        $q->whereHas('idiomas', function ($r) use ($idioma) {
                            $r->where([
                                'id' => $idioma->id,
                            ]);
                        })
                            ->with('idiomas');
                    },
                    'parametro'
                ])
                ->get()
                ->map(function ($conteudo) {
                    return [
                        'id' => $conteudo->id,
                        'bloco' => $conteudo->parametro->descricao,
                        'titulo' => count($conteudo->conteudosIdiomas) ? $conteudo->conteudosIdiomas[0]->titulo : null,
                        'habilitar_titulo' => $conteudo->parametro->habilitar_titulo ? true : false,
                        'subtitulo' => count($conteudo->conteudosIdiomas) ? $conteudo->conteudosIdiomas[0]->subtitulo : null,
                        'habilitar_subtitulo' => $conteudo->parametro->habilitar_subtitulo ? true : false,
                        'texto' => count($conteudo->conteudosIdiomas) ? $conteudo->conteudosIdiomas[0]->texto : null,
                        'habilitar_texto' => $conteudo->parametro->habilitar_texto ? true : false,
                        'texto_formatado' => $conteudo->parametro->texto_formatado ? true : false,
                        'imagem' => rafator('content/display/' . $conteudo->imagem),
                        'habilitar_img' => $conteudo->parametro->habilitar_img ? true : false,
                        'largura_img' => $conteudo->parametro->largura_img,
                        'altura_img' => $conteudo->parametro->altura_img,
                        'recortar_img' => $conteudo->parametro->recortar_img ? true : false,
                        'imagem_mobile' => rafator('content/display/' . $conteudo->imagem_mobile),
                        'habilitar_img_mobile' => $conteudo->parametro->habilitar_img_mobile ? true : false,
                        'largura_img_mobile' => $conteudo->parametro->largura_img_mobile,
                        'altura_img_mobile' => $conteudo->parametro->altura_img_mobile,
                        'recortar_img_mobile' => $conteudo->parametro->recortar_img_mobile ? true : false,
                        'habilitar_arq' => $conteudo->parametro->habilitar_arq ? true : false,
                        'arquivo' => count($conteudo->conteudosIdiomas) ? rafator('content/files/' . $conteudo->conteudosIdiomas[0]->arquivo) : null,
                        'link' => count($conteudo->conteudosIdiomas) ? $conteudo->conteudosIdiomas[0]->link : null,
                        'habilitar_link' => $conteudo->parametro->habilitar_link ? true : false,
                        'nova_aba' => count($conteudo->conteudosIdiomas) && $conteudo->conteudosIdiomas[0]->nova_aba ? true : false,
                        'minimizavel' => $conteudo->parametro->minimizavel ? true : false,
                        'galeria' => $conteudo->parametro->galeria ? true : false,
                    ];
                });

            if ($pagina) {
                $pagina = [
                    'id' => $pagina->id,
                    'titulo' => count($pagina->paginasIdiomas) ? $pagina->paginasIdiomas[0]->titulo : null,
                    'descricao' => count($pagina->paginasIdiomas) ? $pagina->paginasIdiomas[0]->descricao : null,
                    'titulo_compartilhamento' => count($pagina->paginasIdiomas) ? $pagina->paginasIdiomas[0]->titulo_compartilhamento : null,
                    'descricao_compartilhamento' => count($pagina->paginasIdiomas) ? $pagina->paginasIdiomas[0]->descricao_compartilhamento : null,
                    'imagem' => rafator('/content/pages/' . $pagina->imagem),
                ];
            }

            $idiomas = Idioma::all()->map(function ($linguagem) {
                return [
                    'nome' => $linguagem->nome,
                    'codigo' => $linguagem->codigo,
                    'padrao' => $linguagem->padrao ? true : false,
                ];
            });

            Inertia::share([
                'pagina' => $pagina,
                'conteudos' => $conteudos,
                'idioma' => $idioma,
                'idiomas' => $idiomas,
                'controller' => $controller,
                'action' => $action
            ]);
        } else if (app('request')->route()->getPrefix() !== '/intranet') {
            $idiomas = Idioma::query()
                ->orderBy('padrao', 'DESC')
                ->orderBy('id', 'DESC')
                ->get()
                ->map(function ($idioma) {
                    $idioma->url = LaravelLocalization::getLocalizedURL($idioma->codigo, null, [], true);
                    return $idioma;
                });

            $idioma = App::getLocale();

            $conteudos = Conteudo::query()
                ->where([
                    'excluido' => NULL,
                    'controladora' => $controller,
                    'acao' => $action
                ])
                ->with([
                    'conteudosIdiomas' => function ($q) use ($idioma) {
                        $q->whereHas('idiomas', function ($r) use ($idioma) {
                            $r->where('codigo', $idioma)
                                ->orWhere('padrao', true);
                        })
                            ->orderBy('idioma_id', 'DESC');
                    },
                ])
                ->get()
                ->map(function ($conteudo) {
                    return [
                        'id' => $conteudo->id,
                        'titulo' => count($conteudo->conteudosIdiomas) ? $conteudo->conteudosIdiomas[0]->titulo : null,
                        'subtitulo' => count($conteudo->conteudosIdiomas) ? $conteudo->conteudosIdiomas[0]->subtitulo : null,
                        'texto' => count($conteudo->conteudosIdiomas) ? $conteudo->conteudosIdiomas[0]->texto : null,
                        'imagem' => rafator('content/display/' . $conteudo->imagem),
                        'imagem_mobile' => rafator('content/display/' . $conteudo->imagem_mobile),
                        'arquivo' => count($conteudo->conteudosIdiomas) ? rafator('content/files/' . $conteudo->conteudosIdiomas[0]->arquivo) : null,
                        'link' => count($conteudo->conteudosIdiomas) ? $conteudo->conteudosIdiomas[0]->link : null,
                        'nova_aba' => count($conteudo->conteudosIdiomas) ? $conteudo->conteudosIdiomas[0]->nova_aba : false,
                    ];
                });

            $pagina = Pagina::query()
                ->where([
                    'controladora' => $controller,
                    'acao' => $action
                ])
                ->with([
                    'paginasIdiomas' => function ($q) use ($idioma) {
                        $q->whereHas('idiomas', function ($r) use ($idioma) {
                            $r->where('codigo', $idioma)
                                ->orWhere('padrao', true);
                        })
                            ->orderBy('idioma_id', 'DESC');
                    },
                ])
                ->first();

            $dados_gerais = DadosGerais::first();

            $linhas_menu = Linha::query()
                ->where([
                    'visivel' => true,
                    'excluido' => NULL
                ])
                ->with([
                    'linhasIdiomas' => function ($q) use ($idioma) {
                        $q->whereHas('idiomas', function ($r) use ($idioma) {
                            $r->where('codigo', $idioma)
                                ->orWhere('padrao', true);
                        })
                            ->orderBy('idioma_id', 'DESC');
                    },
                ])
                ->get()
                ->map(function ($linha) {
                    return [
                        'id' => $linha->id,
                        'nome' => count($linha->linhasIdiomas) ? $linha->linhasIdiomas[0]->nome : null,
                        'slug' => $linha->slug,
                    ];
                });

            $categorias_menu = Categoria::query()
                ->where([
                    'visivel' => true,
                    'excluido' => NULL
                ])
                ->with([
                    'categoriasIdiomas' => function ($q) use ($idioma) {
                        $q->whereHas('idiomas', function ($r) use ($idioma) {
                            $r->where('codigo', $idioma)
                                ->orWhere('padrao', true);
                        })
                            ->orderBy('idioma_id', 'DESC');
                    },
                ])
                ->get()
                ->map(function ($categoria) {
                    return [
                        'id' => $categoria->id,
                        'nome' => count($categoria->categoriasIdiomas) ? strtoupper($categoria->categoriasIdiomas[0]->tipo) . ' ' . $categoria->categoriasIdiomas[0]->nome : 'Sem Categoria',
                        'slug' => $categoria->slug,
                    ];
                });

            $notifyCookie = array_key_exists('notify-cookies', $_COOKIE) ? true : false;

            if ($pagina) {
                list($width, $height, $type, $attr) = getimagesize(public_path('content/pages/' . $pagina->imagem));
            }

            Inertia::share([
                'pagina' => [
                    'titulo' => $pagina->paginasIdiomas[0]->titulo,
                    'descricao' => $pagina->paginasIdiomas[0]->descricao,
                    'tituloCompartilhamento' => $pagina->paginasIdiomas[0]->titulo_compartilhamento,
                    'descricaoCompartilhamento' => $pagina->paginasIdiomas[0]->descricao_compartilhamento,
                    'imagem' => [
                        'endereco' => '/content/pages/' . $pagina->imagem,
                        'tipo' => image_type_to_mime_type($type),
                        'largura' => $width,
                        'altura' => $height,
                    ],
                ],
                'dados_gerais' => $dados_gerais,
                'linhas_menu' => $linhas_menu,
                'categorias_menu' => $categorias_menu,
                'notifyCookie' => $notifyCookie,
                'controller' => $controller,
                'action' => $action,
                'conteudos' => $conteudos,
                'idiomas' => $idiomas,
                'idioma' => $idioma,
                'isSite' => true
            ]);
        }
    }

    protected function getLanguages($record, $translationModel, $language)
    {
        $idiomas = Idioma::query()
            ->orderByDesc('padrao')
            ->orderBy('codigo')
            ->pluck('id', 'codigo')
            ->toArray();

        $translationProperty = Str::snake($translationModel);

        if (!$language) {
            return reset($idiomas);
        } elseif (!$record->$translationProperty) {
            if (!array_key_exists($language, $idiomas)) {
                return false;
            }

            return $idiomas[$language];
        }

        return $record->$translationProperty[0]->idioma;
    }
}
