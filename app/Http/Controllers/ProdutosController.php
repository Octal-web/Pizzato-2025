<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\Linha;
use App\Models\Categoria;
use App\Models\Produto;
use App\Models\Pagina;
use App\Models\Arquivo;

use Illuminate\Support\Str;
use Illuminate\Support\Facades\File;

class ProdutosController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index() {
        $idioma = inertia()->getShared('idioma');

        $linha = null;
        $categoria = null;

        if (request('linha')) {
            $linha = Linha::query()
                ->where([
                    'excluido' => NULL,
                    'visivel' => true,
                    'id' => request('linha')
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

            if ($linha) {
                $linha = [
                    'id' => $linha->id,
                    'logo' => $linha->logo,
                    'banner' => $linha->banner,
                    'nome' => $linha->linhasIdiomas->isNotEmpty() ? $linha->linhasIdiomas[0]->nome : null,
                    'descricao' => $linha->linhasIdiomas->isNotEmpty() ? $linha->linhasIdiomas[0]->descricao : null,
                    'produtos' => $linha->produtos
                        ->groupBy(function ($produto) use ($idioma) {
                            $categoriaIdioma = $produto->categoria->categoriasIdiomas->first();

                            if (!$categoriaIdioma) {
                                return 'Sem Categoria';
                            }

                            $tipo = $categoriaIdioma->tipo;
                            $nome = $categoriaIdioma->nome;

                            return $idioma === 'en'
                                ? strtoupper($nome . ' ' . $tipo)
                                : strtoupper($tipo . ' ' . $nome);
                        })
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
            }
        } else if (request('categoria')) {
            $categoria = Categoria::query()
                ->where([
                    'excluido' => NULL,
                    'visivel' => true,
                    'id' => request('categoria')
                ])
                ->with([
                    'categoriasIdiomas' => function ($q) use ($idioma) {
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
                            'linha' => function ($q) use ($idioma) {
                                $q->with([
                                    'linhasIdiomas' => function ($s) use ($idioma) {
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

            if ($categoria) {
                $categoria = [
                    'id' => $categoria->id,
                    'nome' => $categoria->categoriasIdiomas->isNotEmpty() ? $categoria->categoriasIdiomas[0]->nome : null,
                    'produtos' => $categoria->produtos
                        ->groupBy(function ($produto) use ($idioma) {
                            $categoriaIdioma = $produto->categoria->categoriasIdiomas->first();

                            if (!$categoriaIdioma) {
                                return 'Sem Categoria';
                            }

                            $tipo = $categoriaIdioma->tipo;
                            $nome = $categoriaIdioma->nome;

                            return $idioma === 'en'
                                ? strtoupper($nome . ' ' . $tipo)
                                : strtoupper($tipo . ' ' . $nome);
                        })
                        ->map(function ($produtos, $linhaNome) {
                            return [
                                'linha' => $linhaNome,
                                'produtos' => $produtos->map(function ($produto) {
                                    return [
                                        'id' => $produto->id,
                                        'slug' => $produto->slug,
                                        'imagem_infinito' => rafator('content/products/full/' . $produto->imagem_infinito),
                                        'imagem_fundo' => rafator('content/products/bg/' . $produto->imagem_fundo),
                                        'link_loja' => $produto->link_loja,
                                        'nome' => $produto->produtosIdiomas->isNotEmpty() ? ($produto->linha->linhasIdiomas->isNotEmpty() ? $produto->linha->linhasIdiomas[0]->nome . ' ' : null) . $produto->produtosIdiomas[0]->nome : null,
                                    ];
                                }),
                            ];
                        })
                        ->values(),
                ];
            }
        } else {
            $linha = Linha::query()
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
                                $q->where([
                                    'excluido' => NULL,
                                    'visivel' => true
                                ])
                                ->with([
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

            if ($linha) {
                $linha = [
                    'id' => $linha->id,
                    'logo' => $linha->logo,
                    'banner' => $linha->banner,
                    'nome' => $linha->linhasIdiomas->isNotEmpty() ? $linha->linhasIdiomas[0]->nome : null,
                    'descricao' => $linha->linhasIdiomas->isNotEmpty() ? $linha->linhasIdiomas[0]->descricao : null,
                    'produtos' => $linha->produtos
                        ->groupBy(function ($produto) use ($idioma) {
                            $categoriaIdioma = $produto->categoria->categoriasIdiomas->first();

                            if (!$categoriaIdioma) {
                                return 'Sem Categoria';
                            }

                            $tipo = $categoriaIdioma->tipo;
                            $nome = $categoriaIdioma->nome;

                            return $idioma === 'en'
                                ? strtoupper($nome . ' ' . $tipo)
                                : strtoupper($tipo . ' ' . $nome);
                        })
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
            }
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
                    'nome' => $linhaMenu->linhasIdiomas->isNotEmpty() ? $linhaMenu->linhasIdiomas[0]->nome : null,
                ];
            });

        $categoriasMenu = Categoria::query()
            ->where([
                'excluido' => NULL,
                'visivel' => true
            ])
            ->with([
                'categoriasIdiomas' => function ($q) use ($idioma) {
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
            ->map(function ($categoriaMenu) use ($idioma) {
                $categoria = $categoriaMenu->categoriasIdiomas->first();

                if (!$categoria) {
                    return [
                        'id' => $categoriaMenu->id,
                        'nome' => null
                    ];
                }

                $nome = $categoria->nome;
                $tipo = $categoria->tipo;

                if (!$nome) {
                    $texto = $tipo;
                } else {
                    $texto = $idioma === 'en'
                        ? $nome . ' ' . $tipo
                        : $tipo . ' ' . $nome;
                }

                return [
                    'id' => $categoriaMenu->id,
                    'nome' => $texto
                ];
            });

        return Inertia::render('Produtos/index', [
            'linha' => $linha,
            'categoria' => $categoria,
            'linhasMenu' => $linhasMenu,
            'categoriasMenu' => $categoriasMenu
        ]);
    }

    public function produto($slug) {
        $idioma = inertia()->getShared('idioma');

        $produto = Produto::query()
            ->where([
                'excluido' => NULL,
                'visivel' => true,
                'slug' => $slug
            ])
            ->with([
                'produtosIdiomas' => function ($q) use ($idioma) {
                    $q->whereHas('idiomas', function ($r) use ($idioma) {
                        $r->where('codigo', $idioma)
                        ->orWhere('padrao', true);
                    })
                    ->orderBy('idioma_id', 'DESC');
                },
                'linha' => function ($q) use ($idioma) {
                    $q->with([
                        'linhasIdiomas' => function ($s) use ($idioma) {
                            $s->whereHas('idiomas', function ($r) use ($idioma) {
                                $r->where('codigo', $idioma)
                                  ->orWhere('padrao', true);
                            })
                            ->orderBy('idioma_id', 'DESC');
                        },
                    ])
                    ->orderBy('ordem', 'ASC')
                    ->orderBy('id', 'DESC');
                },
                'volumes' => function ($q) {
                    $q->where([
                        'excluido' => NULL,
                        'visivel' => true,
                    ]);
                },
                'detalhes' => function ($q) use ($idioma) {
                    $q->where([
                        'excluido' => NULL,
                        'visivel' => true
                    ])
                    ->with([
                        'detalhesIdiomas' => function ($s) use ($idioma) {
                            $s->whereHas('idiomas', function ($r) use ($idioma) {
                                $r->where('codigo', $idioma)
                                  ->orWhere('padrao', true);
                            })
                            ->orderBy('idioma_id', 'DESC');
                        },
                    ])
                    ->orderBy('ordem', 'ASC')
                    ->orderBy('id', 'DESC');
                },
                'arquivos' => function ($q) use ($idioma) {
                    $q->where([
                        'excluido' => NULL
                    ])
                    ->with([
                        'arquivosIdiomas' => function ($s) use ($idioma) {
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
            ->first();

        if(!$produto) {
            return Inertia::location(route('Produtos.index'));
        }

        $pagina = new Pagina;

        $pagina->titulo = $produto->produtosIdiomas[0]->titulo_pagina . ' - Pizzato';
        $pagina->descricao = $produto->produtosIdiomas[0]->descricao_pagina . ' - Pizzato';
        $pagina->titulo_compartilhamento = $produto->produtosIdiomas[0]->titulo_pagina . ' - Pizzato';
        $pagina->descricao_compartilhamento = $produto->produtosIdiomas[0]->descricao_pagina . ' - Pizzato';

        list($width, $height, $type, $attr) = getimagesize(public_path('/content/products/thumbs/' . $produto->imagem));

        $pagina->imagem = [
            'endereco' => '/content/products/thumbs/' . $produto->imagem,
            'tipo' => image_type_to_mime_type($type),
            'largura' => $width,
            'altura' => $height,
        ];

        $produto = [
            'id' => $produto->id,
            'nome' => $produto->produtosIdiomas[0]->nome,
            'volumes' => $produto->volumes->pluck('volume')->implode(' • '),
            'imagem' => rafator('content/products/thumbs/' . $produto->imagem),
            'linha_logo' => rafator('content/lines/logo/' . $produto->linha->logo),
            'imagem_destaques' => rafator('content/lines/featureds/' . $produto->linha->imagem_destaques),
            'descricao' => $produto->produtosIdiomas[0]->descricao,
            'destaques' => $produto->produtosIdiomas[0]->destaques,
            'colheitas' => $produto->colheitas,
            'banner_rodape' => rafator('content/lines/footer/' . $produto->linha->banner_rodape),
            'detalhes' => $produto->detalhes->map(function ($detalhe) {
                return [
                    'id' => $detalhe->id,
                    'icone' => rafator('content/products/details/' . $detalhe->icone),
                    'nome' => $detalhe->detalhesIdiomas[0]->nome,
                    'conteudo' => $detalhe->detalhesIdiomas[0]->conteudo,
                ];
            }),
            'arquivos' => $produto->arquivos->map(function ($arquivo) {
                return [
                    'id' => $arquivo->id,
                    'titulo' => $arquivo->arquivosIdiomas[0]->titulo,
                ];
            })
        ];

        return Inertia::render('Produtos/produto', [
            'pagina' => $pagina,
            'produto' => $produto
        ]);
    }

    /**
     * Download the file of the specified resource.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $produto
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function download($produto, $id) {
        if (!$produto || !$id) {
            return redirect()->route('Manager.Produtos.index');
        }

        $idioma = inertia()->getShared('idioma');

        $arquivo = Arquivo::query()
            ->where([
                'id' => $id,
                'excluido' => NULL,
            ])
            ->whereHas('produto', function ($q) use ($produto) {
                $q->where('id', $produto);
            })
            ->with([
                'produto' => function ($q) {
                    $q->select('id', 'slug');
                },
                'arquivosIdiomas' => function ($q) use ($idioma) {
                    $q->whereHas('idiomas', function ($r) use ($idioma) {
                        $r->where('codigo', $idioma)
                        ->orWhere('padrao', true);
                    })
                    ->orderBy('idioma_id', 'DESC');
                }
            ])
            ->first();

        if (!$arquivo) {
            return redirect()->route('Manager.Produtos.index');
        }

        $caminho = public_path('content/products/files/' . $arquivo->arquivo);

        if (!File::exists($caminho)) {
            return redirect()->back()->with('message', ['type' => 'error', 'msg' => 'Não foi possível encontrar o arquivo!']);
        }

        $extensao = pathinfo($caminho, PATHINFO_EXTENSION);
        
        $tituloSlug = Str::slug($arquivo->arquivosIdiomas[0]->titulo ?? 'arquivo');
        $produtoSlug = $arquivo->produto->slug ?? 'produto';
        
        $nomeArquivo = $tituloSlug . '--' . $produtoSlug . '.' . $extensao;

        return response()->download($caminho, $nomeArquivo);
    }
};