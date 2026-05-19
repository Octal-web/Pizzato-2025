<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;

use App\Models\Produto;
use App\Models\ProdutoIdioma;

use App\Models\Volume;
use App\Models\Categoria;
use App\Models\Linha;
use App\Models\Arquivo;
use App\Models\ArquivoIdioma;

use App\Models\Idioma;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\Manager\PostProductRequest;

use Illuminate\Support\Str;
use Carbon\Carbon;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;

use DeepCopy\DeepCopy;

class ProdutosController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index() {
        $idioma = inertia()->getShared('idioma');

        $produtos = Produto::query()
            ->where([
                'excluido' => NULL
            ])
            ->with([
                'produtosIdiomas' => function ($q) use ($idioma) {
                    $q->whereHas('idiomas', function ($r) use ($idioma) {
                        $r->where('codigo', $idioma)
                          ->orWhere('padrao', true);
                    })
                    ->orderBy('idioma_id', 'DESC');
                }
            ])
            ->get()
            ->map(function($produto) {
                return [
                    'id' => $produto->id,
                    'visivel' => $produto->visivel,
                    'imagem' => rafator('content/products/full/' . $produto->imagem_infinito),
                    'nome' => $produto->produtosIdiomas->isNotEmpty() ? $produto->produtosIdiomas[0]->nome : null,
                ];
            });

        return Inertia::render('Manager/Produtos/index', [
            'produtos' => $produtos
        ]);
    }
    
    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function adicionar() {
        $idiomas = Idioma::query()
            ->orderBy('padrao', 'DESC')
            ->orderBy('id', 'DESC')
            ->get();

        $idioma = request('lang');
        
        $volumes = Volume::query()
            ->where([
                'excluido' => NULL,
                'visivel' => true
            ])
            ->get()
            ->map(function($volume) {
                return [
                    'value' => $volume->id,
                    'label' => $volume->volume
                ];
            });

        $linhas = Linha::query()
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
            ->get()
            ->map(function($linha) {
                return [
                    'value' => $linha->id,
                    'label' => $linha->linhasIdiomas->isNotEmpty() ? $linha->linhasIdiomas[0]->nome : null,
                ];
            });

        $categorias = Categoria::query()
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
            ->get()
            ->map(function($categoria) {
                return [
                    'value' => $categoria->id,
                    'label' => $categoria->categoriasIdiomas->isNotEmpty() ? ($categoria->categoriasIdiomas[0]->tipo ? $categoria->categoriasIdiomas[0]->tipo . ' ' . $categoria->categoriasIdiomas[0]->nome : $categoria->categoriasIdiomas[0]->nome) : null,
                ];
            });

        return Inertia::render('Manager/Produtos/adicionar', [
            'volumes' => $volumes,
            'linhas' => $linhas,
            'categorias' => $categorias
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function novo(PostProductRequest $request) {
        if($request->ajax()){
            $idioma = inertia()->getShared('idioma');
            
            $produto = new Produto;
            $produto_idioma = new ProdutoIdioma;

            $slugBase = Str::slug($request['nome']);
            $slug = $slugBase;

            $count = 1;

            while (Produto::where('slug', $slug)->exists()) {
                $slug = $slugBase . '-' . $count;
                $count++;
            }

            $produto->imagem = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('img')->extension());
            $produto->imagem_fundo = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('img_bg')->extension());
            $produto->imagem_infinito = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('img_full')->extension());
            
            if ($request->file('arq') && $request->file('arq')->getError() == 0) {
                $produto->ficha_tecnica = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('arq')->extension());
            }
            
            $produto->slug = $slug;
            $produto->colheitas = $request->colheitas;
            $produto->link_loja = $request->link_loja;
            $produto->destaque = $request->destaque ? true : false;
            $produto->linha_id = $request->linha_id;
            $produto->categoria_id = $request->categoria_id;

            $response = $produto->save(); 
            
            if ($request->filled('produtos_volumes')) {
                $produto->volumes()->sync($request->input('produtos_volumes'));
            }

            $produto_idioma->nome = $request->nome;
            $produto_idioma->descricao = $request->descricao;
            $produto_idioma->destaques = $request->destaques;
            $produto_idioma->titulo_pagina = $request->titulo_pagina;
            $produto_idioma->descricao_pagina = $request->descricao_pagina;

            $produto_idioma->produto_id = $produto->id;
            $produto_idioma->idioma_id = $idioma->id;

            $response = $produto_idioma->save();

            if ($response) {
                $image = $request->file('img')->move(public_path('content/products/thumbs/'), $produto->imagem);
                $image = $request->file('img_bg')->move(public_path('content/products/bg/'), $produto->imagem_fundo);
                $image = $request->file('img_full')->move(public_path('content/products/full/'), $produto->imagem_infinito);
                
                if ($request->file('arq') && $request->file('arq')->getError() == 0) {
                    $file = $request->file('arq')->move(public_path('content/products/files/'), $produto->ficha_tecnica);
                }

                return to_route('Manager.Produtos.index')->with('message', ['type' => 'success', 'msg' => 'Registro salvo com sucesso!']);
            }
        }
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function editar($id) {
        if (!$id) {
            return Inertia::location(route('Manager.Produtos.index'));
        }
        
        $idiomas = Idioma::query()
            ->orderBy('padrao', 'DESC')
            ->orderBy('id', 'DESC')
            ->get();

        $idioma = request('lang');

        $produto = Produto::query()
            ->where([
                'excluido' => null,
                'id' => $id
            ])
            ->with([
                'produtosIdiomas' => function ($q) use ($idioma) {
                    $q->when($idioma, function ($r) use($idioma) {
                        $r->whereHas('idiomas', function($query) use($idioma) {
                            $query->where('codigo', $idioma);
                        });
                    })
                    ->when(!$idioma, function ($r) {
                        $r->whereHas('idiomas', function($query) {
                            $query->where('padrao', true);
                        });
                    });
                },
                'categoria' => function ($q) {
                    $q->where([
                        'excluido' => null,
                        'visivel' => true
                    ])
                    ->orderBy('ordem', 'DESC')
                    ->orderBy('id', 'DESC');
                },
                'arquivos' => function ($q) use ($idioma) {
                    $q->where('excluido', null)
                    ->orderBy('ordem', 'ASC')
                    ->orderBy('id', 'ASC')
                    ->with(['arquivosIdiomas' => function ($query) use ($idioma) {
                        $query->when($idioma, function ($r) use($idioma) {
                            $r->whereHas('idiomas', function($q) use($idioma) {
                                $q->where('codigo', $idioma);
                            });
                        })
                        ->when(!$idioma, function ($r) {
                            $r->whereHas('idiomas', function($q) {
                                $q->where('padrao', true);
                            });
                        });
                    }]);
                }
            ])
            ->first();

        if(!$produto) {
            return Inertia::location(route('Manager.Produtos.index'));
        }
    
        $volumes = Volume::query()
            ->where([
                'excluido' => NULL,
                'visivel' => true
            ])
            ->get()
            ->map(function($volume) {
                return [
                    'value' => $volume->id,
                    'label' => $volume->volume
                ];
            });

        $linhas = Linha::query()
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
            ->get()
            ->map(function($linha) {
                return [
                    'value' => $linha->id,
                    'label' => $linha->linhasIdiomas->isNotEmpty() ? $linha->linhasIdiomas[0]->nome : null,
                ];
            });

        $categorias = Categoria::query()
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
            ->get()
            ->map(function($categoria) {
                return [
                    'value' => $categoria->id,
                    'label' => $categoria->categoriasIdiomas->isNotEmpty() ? ($categoria->categoriasIdiomas[0]->tipo ? $categoria->categoriasIdiomas[0]->tipo . ' ' . $categoria->categoriasIdiomas[0]->nome : $categoria->categoriasIdiomas[0]->nome) : null,
                ];
            });

        $idioma = inertia()->getShared('idioma');
        
        $produtoData = [
            'id' => $produto->id,
            'imagem' => rafator('content/products/thumbs/' . $produto->imagem),
            'imagem_infinito' => rafator('content/products/full/' . $produto->imagem_infinito),
            'imagem_fundo' => rafator('content/products/bg/' . $produto->imagem_fundo),
            'colheitas' => $produto->colheitas,
            'link_loja' => $produto->link_loja,
            'destaque' => $produto->destaque ? true : false,
            'produtos_volumes' => $produto->volumes->pluck('id'),
            'linha_id' => $produto->linha_id,
            'categoria_id' => $produto->categoria_id,
            'ficha_tecnica' => $produto->ficha_tecnica ? true : false,
            'nome' => count($produto->produtosIdiomas) ? $produto->produtosIdiomas[0]->nome : null,
            'descricao' => count($produto->produtosIdiomas) ? $produto->produtosIdiomas[0]->descricao : null,
            'destaques' => count($produto->produtosIdiomas) ? $produto->produtosIdiomas[0]->destaques : null,
            'titulo_pagina' => count($produto->produtosIdiomas) ? $produto->produtosIdiomas[0]->titulo_pagina : null,
            'descricao_pagina' => count($produto->produtosIdiomas) ? $produto->produtosIdiomas[0]->descricao_pagina : null,
            'arquivos' => $produto->arquivos->map(function($arquivo) {
                return [
                    'id' => $arquivo->id,
                    'titulo' => count($arquivo->arquivosIdiomas) ? $arquivo->arquivosIdiomas[0]->titulo : '',
                ];
            })->toArray(),
        ];

        return Inertia::render('Manager/Produtos/editar', [
            'idiomas' => $idiomas,
            'idioma' => $idioma,
            'produto' => $produtoData,
            'volumes' => $volumes,
            'linhas' => $linhas,
            'categorias' => $categorias
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function atualizar(PostProductRequest $request, $id) {
        if($request->ajax()){
            $produto = Produto::query()
                ->where([
                    'excluido' => null,
                    'id' => $id
                ])
                ->first();

            $idioma = $request->query('lang');

            $produto_idioma = ProdutoIdioma::query()
                ->where([
                    'excluido' => null,
                    'produto_id' => $produto->id
                ])
                ->when($idioma, function ($q) use($idioma) {
                    $q->whereHas('idiomas', function($query) use($idioma) {
                        $query->where('codigo', $idioma);
                    });
                })
                ->when(!$idioma, function ($q) {
                    $q->whereHas('idiomas', function($query) {
                        $query->where('padrao', true);
                    });
                })
                ->first();

            if (!$produto) {
                return to_route('Manager.Produtos.index')->with('message', ['type' => 'error', 'msg' => 'Não foi possível salvar as informações. Tente novamente mais tarde.']);
            }

            $idioma = $this->getLanguages($produto, 'produtosIdiomas', $idioma);

            if (!$idioma) {
                if ($request->ajax()) {
                    return to_route('Manager.Produtos.index')->with('message', ['type' => 'error', 'msg' => 'Não foi possível salvar as informações. Tente novamente mais tarde.']);
                }
                return Inertia::location(route('Manager.Produtos.index'));
            }

            if (!$produto_idioma) {
                $produto_idioma = new ProdutoIdioma;

                $produto_idioma->produto_id = $produto->id;
                $produto_idioma->idioma_id = $idioma;
            } else {
                $copier = new DeepCopy();
                $produtoOriginal = $copier->copy($produto);
            }

            $slug = $produto->slug;

            if (!$request->query('lang')) {
                if ($request['nome'] !== $produto_idioma->nome) {
                    $slugBase = Str::slug($request['nome']);
                    $slug = $slugBase;
                    $count = 1;

                    while (Produto::where('slug', $slug)->where('id', '!=', $id)->exists()) {
                        $slug = $slugBase . '-' . $count;
                        $count++;
                    }
                }
            }

            $produto->slug = $slug;
            $produto->colheitas = $request->colheitas;
            $produto->link_loja = $request->link_loja;
            $produto->destaque = $request->destaque ? true : false;
            $produto->linha_id = $request->linha_id;
            $produto->categoria_id = $request->categoria_id;

            if ($request->file('img') && $request->file('img')->getError() == 0) {
                $produto->imagem = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('img')->extension());
            }

            if ($request->file('img_bg') && $request->file('img_bg')->getError() == 0) {
                $produto->imagem_fundo = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('img_bg')->extension());
            }

            if ($request->file('img_full') && $request->file('img_full')->getError() == 0) {
                $produto->imagem_infinito = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('img_full')->extension());
            }

            $produto_idioma->nome = $request->nome;
            $produto_idioma->descricao = $request->descricao;
            $produto_idioma->destaques = $request->destaques;
            $produto_idioma->titulo_pagina = $request->titulo_pagina;
            $produto_idioma->descricao_pagina = $request->descricao_pagina;

            $response = $produto->save();
            $response = $produto_idioma->save();

            $produto->volumes()->sync($request->input('produtos_volumes', []));

            if ($response) {
                if ($request->file('img') && $request->file('img')->getError() == 0) {
                    if ($produto->imagem && isset($produtoOriginal) && File::exists('content/products/thumbs/' . $produtoOriginal->imagem)) {
                        File::delete('content/products/thumbs/' . $produtoOriginal->imagem);
                    }
                    
                    $image = $request->file('img')->move(public_path('content/products/thumbs/'), $produto->imagem);
                }
                
                if ($request->file('img_bg') && $request->file('img_bg')->getError() == 0) {
                    if ($produto->imagem_fundo && isset($produtoOriginal) && File::exists('content/products/bg/' . $produtoOriginal->imagem_fundo)) {
                        File::delete('content/products/bg/' . $produtoOriginal->imagem_fundo);
                    }               

                    $image = $request->file('img_bg')->move(public_path('content/products/bg/'), $produto->imagem_fundo);
                }
                
                if ($request->file('img_full') && $request->file('img_full')->getError() == 0) {
                    if ($produto->imagem_infinito && isset($produtoOriginal) && File::exists('content/products/full/' . $produtoOriginal->imagem_infinito)) {
                        File::delete('content/products/full/' . $produtoOriginal->imagem_infinito);
                    }               

                    $image = $request->file('img_full')->move(public_path('content/products/full/'), $produto->imagem_infinito);
                }

                $arquivosData = $request->input('arq', []);
                $idsArquivosRecebidos = [];
                
                if (is_array($arquivosData) && count($arquivosData) > 0) {
                    foreach ($arquivosData as $index => $arquivoData) {
                        if (isset($arquivoData['_deleted']) && $arquivoData['_deleted']) {
                            continue;
                        }
                        
                        $arquivoId = $arquivoData['id'] ?? null;
                        $titulo = $arquivoData['titulo'] ?? '';
                        
                        $arquivoFile = $request->file("arq.{$index}.arquivo");
                        
                        if ($arquivoId) {
                            $arquivo = Arquivo::query()
                                ->where([
                                    'id' => $arquivoId,
                                    'produto_id' => $produto->id,
                                    'excluido' => null
                                ])
                                ->first();
                            
                            if ($arquivo) {
                                if ($arquivoFile && $arquivoFile->getError() == 0) {
                                    $arquivoOriginal = $arquivo->arquivo;
                                    $novoNomeArquivo = md5(uniqid((string) rand(), true)) . '.' . strtolower($arquivoFile->extension());
                                    
                                    $arquivoFile->move(public_path('content/products/files/'), $novoNomeArquivo);
                                    
                                    if ($arquivoOriginal && File::exists('content/products/files/' . $arquivoOriginal)) {
                                        File::delete('content/products/files/' . $arquivoOriginal);
                                    }
                                    
                                    $arquivo->arquivo = $novoNomeArquivo;
                                }
                                
                                $arquivo->ordem = $index + 1;
                                $arquivo->save();
                                
                                $arquivoIdioma = ArquivoIdioma::query()
                                    ->where([
                                        'arquivo_id' => $arquivo->id,
                                        'idioma_id' => $idioma,
                                        'excluido' => null
                                    ])
                                    ->first();
                                
                                if ($arquivoIdioma) {
                                    $arquivoIdioma->titulo = $titulo;
                                    $arquivoIdioma->save();
                                } else {
                                    $arquivoIdioma = new ArquivoIdioma();
                                    $arquivoIdioma->arquivo_id = $arquivo->id;
                                    $arquivoIdioma->idioma_id = $idioma;
                                    $arquivoIdioma->titulo = $titulo;
                                    $arquivoIdioma->save();
                                }
                                
                                $idsArquivosRecebidos[] = $arquivo->id;
                            }
                        } else {
                            if ($arquivoFile && $arquivoFile->getError() == 0) {
                                $nomeArquivo = md5(uniqid((string) rand(), true)) . '.' . strtolower($arquivoFile->extension());
                                
                                $arquivoFile->move(public_path('content/products/files/'), $nomeArquivo);
                                
                                $novoArquivo = new Arquivo();
                                $novoArquivo->produto_id = $produto->id;
                                $novoArquivo->arquivo = $nomeArquivo;
                                $novoArquivo->ordem = $index + 1;
                                $novoArquivo->save();
                                
                                $arquivoIdioma = new ArquivoIdioma();
                                $arquivoIdioma->arquivo_id = $novoArquivo->id;
                                $arquivoIdioma->idioma_id = $idioma;
                                $arquivoIdioma->titulo = $titulo;
                                $arquivoIdioma->save();
                                
                                $idsArquivosRecebidos[] = $novoArquivo->id;
                            }
                        }
                    }
                    
                    Arquivo::query()
                        ->where('produto_id', $produto->id)
                        ->whereNotIn('id', $idsArquivosRecebidos)
                        ->where('excluido', null)
                        ->update(['excluido' => now()]);
                }

                return to_route('Manager.Produtos.index')->with('message', ['type' => 'success', 'msg' => 'Registro salvo com sucesso!']);
            }
        }

        return to_route('Manager.Produtos.index')->with('message', ['type' => 'error', 'msg' => 'Não foi possível salvar as informações. Tente novamente mais tarde.']);
    }

    /**
     * Set the specified resource as deleted.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function excluir(Request $request, $id) {
        if ($request->ajax()){
            if (!$id) {
                return $request->header('referer');
            }

            $exclusao = Produto::query()
                ->where([
                    'excluido' => NULL,
                    'id' => $id
                ])
                ->update([
                    'excluido' => Carbon::now()
                ]);

            if ($exclusao == true) {
                return redirect()->back()->with('message', ['type' => 'alert', 'msg' => 'Registro excluído com sucesso.']);
            } else {
                return redirect()->back()->with('message', ['type' => 'error', 'msg' => 'Não foi possível excluir o registro.']);
            }
        }
    }

    /**
     * Set the specified resource to visible/invisible.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function visibilidade(Request $request, $id) {
        if ($request->ajax()){
            if (!$id) {
                return redirect()->back()->with(['type' => 'error', 'message' => 'Registro não encontrado!']);
            }

            $response = Produto::query()
                ->where([
                    'id' => $id,
                    'excluido' => NULL
                ])
                ->first();

            if (!$response) {
                return redirect()->back()->with('message', ['type' => 'error', 'msg' => 'Registro não encontrado!']);
            }
    
            $response->visivel = 1 - $response->visivel;
            $response->save();
    
            if ($response) {
                return redirect()->back()->with('message', ['type' => 'success', 'msg' => 'Visibilidade alterada com sucesso!']);
            }
            else {
                return redirect()->back()->with('message', ['type' => 'error', 'msg' => 'Visibilidade não alterada!']);
            }
        }

        return $request->header('referer');
    }

    /**
     * Update the order of the specified resource.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function ordenar(Request $request) {
        if ($request->ajax()){
            $erros = [];

            if ($request->odr && is_array($request->odr)) {
                foreach ($request->odr as $key => $value) {
                    $registro = Produto::query()
                        ->where([
                            'excluido' => NULL,
                            'id' => $value
                        ])
                        ->update([
                            'ordem' => $key,
                        ]);

                    $errors[] = $registro;
                }
            }

            if (!count($erros)) {
                return redirect()->back()->with('message', ['type' => 'success', 'msg' => 'Registros reordenados com sucesso!']);
            } else {
                return redirect()->back()->with('message', ['type' => 'error', 'msg' => 'Registros não reordenados, tente novamente mais tarde!']);
            }
        }

        return redirect()->back();
    }
    
    /**
     * Download the file of the specified resource.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function baixarArquivo($produto, $id) {
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

        $extensao = pathinfo($caminho)['extension'];

        if (!File::exists($caminho)) {
            return redirect()->back()->with('message', ['type' => 'error', 'msg' => 'Não foi possível encontrar o arquivo!']);
        }

        return response()->download($caminho, $arquivo->arquivosIdiomas[0]->titulo . '.' . $extensao);
    }
};