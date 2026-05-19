<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\Slide;
use App\Models\Linha;
use App\Models\Produto;
use App\Models\Imagem;

use Illuminate\Support\Collection;

class HomeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index() {
        $idioma = inertia()->getShared('idioma');

        $slides = Slide::query()
            ->where([
                'excluido' => NULL,
                'visivel' => true
            ])
            ->with([
                'slidesIdiomas' => function ($q) use ($idioma) {
                    $q->whereHas('idiomas', function ($r) use ($idioma) {
                        $r->where('codigo', $idioma)
                          ->orWhere('padrao', true);
                    })
                    ->orderBy('idioma_id', 'DESC');
                }
            ])
            ->orderBy('ordem', 'ASC')
            ->orderBy('id', 'DESC')
            ->get()
            ->map(function($slide) {
                return [
                    'id' => $slide->id,
                    'tipo' => $slide->tipo,
                    'imagem' => $slide->tipo == 'imagem' ? rafator('content/slides/d/' . $slide->imagem) : null,
                    'imagem_mobile' => $slide->tipo == 'imagem' ? rafator('content/slides/m/' . $slide->imagem_mobile) : null,
                    'video' => $slide->tipo == 'video' ? rafator('content/slides/videos/d/' . $slide->video) : null,
                    'video_mobile' => $slide->tipo == 'video' ? rafator('content/slides/videos/m/' . $slide->video_mobile) : null,
                    'titulo' => $slide->slidesIdiomas->isNotEmpty() ? $slide->slidesIdiomas[0]->titulo : null,
                    'descricao' => $slide->slidesIdiomas->isNotEmpty() ? $slide->slidesIdiomas[0]->descricao : null,
                ];
            });

        $linhas = Linha::query()
            ->where([
                'excluido' => NULL,
                'visivel' => true,
            ])
            ->with([
                'linhasIdiomas' => function ($q) use ($idioma) {
                    $q->whereHas('idiomas', function ($r) use ($idioma) {
                        $r->where('codigo', $idioma)
                          ->orWhere('padrao', true);
                    })
                    ->orderBy('idioma_id', 'DESC');
                }
            ])
            ->orderBy('ordem', 'ASC')
            ->orderBy('id', 'DESC')
            ->get()
            ->map(function($linha) {
                return [
                    'id' => $linha->id,
                    'imagem' => rafator('content/lines/banner/' . $linha->banner),
                    'nome' => $linha->linhasIdiomas->isNotEmpty() ? $linha->linhasIdiomas[0]->nome : null,
                    'chamada' => $linha->linhasIdiomas->isNotEmpty() ? $linha->linhasIdiomas[0]->chamada : null,
                    'descricao' => $linha->linhasIdiomas->isNotEmpty() ? $linha->linhasIdiomas[0]->descricao : null,
                    'slug' => $linha->slug,
                ];
            });

        $destaques = Produto::query()
            ->where([
                'excluido' => NULL,
                'visivel' => true,
                'destaque' => true
            ])
            ->with([
                'produtosIdiomas' => function ($q) use ($idioma) {
                    $q->whereHas('idiomas', function ($r) use ($idioma) {
                        $r->where('codigo', $idioma)
                          ->orWhere('padrao', true);
                    })
                    ->orderBy('idioma_id', 'DESC');
                },
                'linha' => function ($query) use ($idioma) {
                    $query->with([
                        'linhasIdiomas' => function ($q) use ($idioma) {
                            $q->whereHas('idiomas', function ($r) use ($idioma) {
                                $r->where('codigo', $idioma)
                                  ->orWhere('padrao', true);
                            })
                            ->orderBy('idioma_id', 'DESC');
                        },
                    ]);
                }
            ])
            ->orderBy('ordem', 'ASC')
            ->orderBy('id', 'DESC')
            ->get()
            ->map(function($destaque) {
                return [
                    'id' => $destaque->id,
                    'slug' => $destaque->slug,
                    'imagem' => rafator('content/products/full/' . $destaque->imagem_infinito),
                    'nome' => $destaque->produtosIdiomas->isNotEmpty() ? $destaque->produtosIdiomas[0]->nome : null,
                    'linha' => $destaque->linha->linhasIdiomas->isNotEmpty() ? $destaque->linha->linhasIdiomas[0]->nome : null,
                ];
            });

        $imagensGaleria = Imagem::query()
            ->where([
                'excluido' => NULL,
                'visivel' => true,
                'controladora' => 'Home',
                'acao' => 'index'
            ])
            ->orderBy('ordem', 'ASC')
            ->orderBy('id', 'DESC')
            ->get()
            ->groupBy('conteudo_id')
            ->map(function (Collection $group) {
                return $group->map(function ($imagem) {
                    return [
                        'id' => $imagem->id,
                        'imagem' => rafator('content/carousel/' . $imagem->imagem),
                    ];
                });
            });

        return Inertia::render('Home/index', [
            'slides' => $slides,
            'linhas' => $linhas,
            'destaques' => $destaques,
            'imagensGaleria' => $imagensGaleria
        ]);
    }
};