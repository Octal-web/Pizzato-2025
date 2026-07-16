<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\Linha;
use App\Models\Pagina;

class LinhasController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function linha($slug = null) {
        if(!$slug) {
            return Inertia::location(route('Produtos.index'));
        }

        $idioma = inertia()->getShared('idioma');

        $linha = Linha::query()
            ->where([
                'excluido' => NULL,
                'visivel' => true,
                'slug' => $slug
            ])
            ->with([
                'linhasIdiomas' => function ($q) use ($idioma) {
                    $q->whereHas('idiomas', function ($r) use ($idioma) {
                        $r->where('codigo', $idioma)
                          ->orWhere('padrao', true);
                    })
                    ->orderBy('idioma_id', 'DESC');
                },
                'produtos' => function ($query) use ($idioma) {
                    $query->where([
                        'excluido' => NULL,
                        'visivel' => true
                    ])
                    ->with([
                        'produtosIdiomas' => function ($q) use ($idioma) {
                            $q->whereHas('idiomas', function ($r) use ($idioma) {
                                $r->where('codigo', $idioma)
                                  ->orWhere('padrao', true);
                            })
                            ->orderBy('idioma_id', 'DESC');
                        },
                        'categoria' => function ($q) use ($idioma) {
                            $q->with([
                                'categoriasIdiomas' => function ($s) use ($idioma) {
                                    $s->whereHas('idiomas', function ($r) use ($idioma) {
                                        $r->where('codigo', $idioma)
                                          ->orWhere('padrao', true);
                                    })
                                    ->orderBy('idioma_id', 'DESC');
                                },
                            ])
                            ->orderBy('ordem', 'ASC')
                            ->orderBy('id', 'DESC');
                        }
                    ])
                    ->orderBy('ordem', 'ASC')
                    ->orderBy('id', 'DESC');
                }
            ])
            ->orderBy('ordem', 'ASC')
            ->orderBy('id', 'DESC')
            ->first();

        if(!$linha) {
            return Inertia::location(route('Produtos.index'));
        }

        $linhasMenu = Linha::query()
            ->where([
                'excluido' => NULL,
                'visivel' => true
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
            ->map(function($linhaMenu) {
                return [
                    'id' => $linhaMenu->id,
                    'slug' => $linhaMenu->slug,
                    'nome' => $linhaMenu->linhasIdiomas->isNotEmpty() ? $linhaMenu->linhasIdiomas[0]->nome : null,
                ];
            });

        $pagina = new Pagina;

        $pagina->titulo = $linha->linhasIdiomas[0]->titulo_pagina . ' - Pizzato';
        $pagina->descricao = $linha->linhasIdiomas[0]->descricao_pagina . ' - Pizzato';
        $pagina->titulo_compartilhamento = $linha->linhasIdiomas[0]->titulo_pagina . ' - Pizzato';
        $pagina->descricao_compartilhamento = $linha->linhasIdiomas[0]->descricao_pagina . ' - Pizzato';

        list($width, $height, $type, $attr) = getimagesize(public_path('/content/lines/banner/' . $linha->banner));

        $pagina->imagem = [
            'endereco' => '/content/lines/banner/' . $linha->banner,
            'tipo' => image_type_to_mime_type($type),
            'largura' => $width,
            'altura' => $height,
        ];

        $linhaData = [
            'id' => $linha->id,
            'logo' => $linha->logo,
            'banner' => rafator('content/lines/banner/' . $linha->banner),
            'slug' => $linha->slug,
            'nome' => $linha->linhasIdiomas->isNotEmpty() ? $linha->linhasIdiomas[0]->nome : null,
            'chamada' => $linha->linhasIdiomas->isNotEmpty() ? $linha->linhasIdiomas[0]->chamada : null,
            'descricao' => $linha->linhasIdiomas->isNotEmpty() ? $linha->linhasIdiomas[0]->descricao : null,
            'produtos' => $linha->produtos
                ->groupBy(fn ($produto) => $produto->categoria->categoriasIdiomas->isNotEmpty() ? strtoupper($produto->categoria->categoriasIdiomas[0]->tipo) . ' ' . $produto->categoria->categoriasIdiomas[0]->nome : 'Sem Categoria')
                ->map(function ($produtos, $categoriaNome) use ($linha) {
                    return [
                        'categoria' => $categoriaNome,
                        'produtos' => $produtos->map(function ($produto) use ($linha) {
                            return [
                                'id' => $produto->id,
                                'slug' => $produto->slug,
                                'imagem_infinito' => rafator('content/products/full/' . $produto->imagem_infinito),
                                'imagem_fundo' => rafator('content/products/bg/' . $produto->imagem_fundo),
                                'link_loja' => $produto->link_loja,
                                'nome' => $produto->produtosIdiomas->isNotEmpty() ? ($linha->linhasIdiomas->isNotEmpty() ? $linha->linhasIdiomas[0]->nome . ' ' : null) . $produto->produtosIdiomas[0]->nome : null,
                            ];
                        }),
                    ];
                })
                ->values(),
        ];

        return Inertia::render('Linhas/linha', [
            'pagina' => $pagina,
            'linha' => $linhaData,
            'linhasMenu' => $linhasMenu
        ]);
    }
};