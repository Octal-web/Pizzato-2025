<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use App\Models\Produto;
use App\Models\ImagemProduto;
use App\Models\ImagemProdutoIdioma;
use App\Models\Idioma;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\Manager\PostProductImageRequest;

use Carbon\Carbon;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;

use DeepCopy\DeepCopy;

class ImagensProdutosController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($id) {
        if (!$id) {
            return Inertia::location(route('Manager.Produtos.index'));
        }
        
        $idioma = inertia()->getShared('idioma');

        $produto = Produto::query()
            ->where([
                'excluido' => NULL,
                'id' => $id
            ])
            ->with([
                'produtosIdiomas' => function ($q) {
                    $q->whereHas('idiomas', function ($r) {
                        $r->Where('padrao', true);
                    })
                    ->orderBy('idioma_id', 'DESC');
                },
                'imagensProdutos' => function ($q)  {
                    $q->where([
                        'excluido' => null
                    ])
                    ->orderBy('ordem', 'ASC')
                    ->orderBy('id', 'DESC')
                    ->with([
                        'imagensProdutosIdiomas' => function ($query) {
                            $query->whereHas('idiomas', function ($secr) {
                                $secr->Where('padrao', true);
                            })
                            ->orderBy('idioma_id', 'DESC');
                        },
                    ]);
                },
            ])
            ->first();

        if(!$produto) {
            return Inertia::location(route('Manager.Produtos.index'));
        }

        $produtoData = [
            'id' => $produto->id,
            'nome' => count($produto->produtosIdiomas) ? $produto->produtosIdiomas[0]->nome : null,
            'imagens' => $produto->imagensProdutos->map(function ($imagem) {
                return [
                    'id' => $imagem->id,
                    'visivel' => $imagem->visivel ? true : false,
                    'titulo' => count($imagem->imagensProdutosIdiomas) ? $imagem->imagensProdutosIdiomas[0]->titulo : null,
                    'imagem' => rafator('content/products/gallery/' . $imagem->imagem),
                ];
            })->values()->all(),
        ];

        return Inertia::render('Manager/Produtos/Imagens/index', [
            'produto' => $produtoData,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function adicionar($id) {
        if (!$id) {
            return Inertia::location(route('Manager.Produtos.index'));
        }
        
        $idiomas = Idioma::query()
            ->orderBy('padrao', 'DESC')
            ->orderBy('id', 'DESC')
            ->get();

        $idioma = request('lang');

        return Inertia::render('Manager/Produtos/Imagens/adicionar', [
            'id' => $id
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function novo(PostProductImageRequest $request, $id) {
        if (!$id) {
            return Inertia::location(route('Manager.Produtos.index'));
        }
        
        if($request->ajax()){
            $idioma = inertia()->getShared('idioma');
            
            $imagem = new ImagemProduto;
            $imagem_idioma = new ImagemProdutoIdioma;

            $imagem->produto_id = $id;
            $imagem->imagem = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('img')->extension());

            $response = $imagem->save();

            $imagem_idioma->titulo = $request->titulo;
            $imagem_idioma->texto = $request->texto;

            $imagem_idioma->imagem_produto_id = $imagem->id;
            $imagem_idioma->idioma_id = $idioma->id;

            $response = $imagem_idioma->save();

            if ($response) {
                $image = $request->file('img')->move(public_path('content/products/gallery/'), $imagem->imagem);

                return to_route('Manager.Produtos.Imagens.index', ['id' => $id])->with('message', ['type' => 'success', 'msg' => 'Registro salvo com sucesso!']);
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

        $imagem = ImagemProduto::query()
            ->where([
                'excluido' => null,
                'id' => $id
            ])
            ->with([
                'imagensProdutosIdiomas' => function ($q) use ($idioma) {
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
            ])
            ->first();

        if(!$imagem) {
            return Inertia::location(route('Manager.Produtos.index'));
        }

        $idioma = inertia()->getShared('idioma');

        $imagem = [
            'id' => $imagem->id,
            'produto_id' => $imagem->produto_id,
            'imagem' => rafator('content/products/gallery/' . $imagem->imagem),
            'titulo' => count($imagem->imagensProdutosIdiomas) ? $imagem->imagensProdutosIdiomas[0]->titulo : null,
            'texto' => count($imagem->imagensProdutosIdiomas) ? $imagem->imagensProdutosIdiomas[0]->texto : null,
        ];

        return Inertia::render('Manager/Produtos/Imagens/editar', [
            'idiomas' => $idiomas,
            'idioma' => $idioma,
            'imagem' => $imagem,
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function atualizar(PostProductImageRequest $request, $id) {
        if($request->ajax()){
            $imagem = ImagemProduto::query()
                ->where([
                    'excluido' => null,
                    'id' => $id
                ])
                ->first();

            $idioma = $request->query('lang');

            $imagem_idioma = ImagemProdutoIdioma::query()
                ->where([
                    'excluido' => null,
                    'imagem_produto_id' => $imagem->id
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

            if (!$imagem) {
                return to_route('Manager.Produtos.index')->with('message', ['type' => 'error', 'msg' => 'Não foi possível salvar as informações. Tente novamente mais tarde.']);
            }

            $idioma = $this->getLanguages($imagem, 'imagensIdiomas', $idioma);

            if (!$idioma) {
                if ($request->ajax()) {
                    return to_route('Manager.Produtos.index')->with('message', ['type' => 'error', 'msg' => 'Não foi possível salvar as informações. Tente novamente mais tarde.']);
                }
                return Inertia::location(route('Manager.Produtos.index'));
            }

            if (!$imagem_idioma) {
                $imagem_idioma = new ImagemProdutoIdioma;

                $imagem_idioma->imagem_produto_id = $imagem->id;
                $imagem_idioma->idioma_id = $idioma;
            } else {
                $copier = new DeepCopy();
                $imagemOriginal = $copier->copy($imagem);
            }

            if ($request->file('img') && $request->file('img')->getError() == 0) {
                $imagem->imagem = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('img')->extension());
            }

            $imagem_idioma->titulo = $request->titulo;
            $imagem_idioma->texto = $request->texto;

            $response = $imagem->save();
            $response = $imagem_idioma->save();

            if ($response) {
                if ($request->file('img') && $request->file('img')->getError() == 0) {
                    if ($imagem->imagem && isset($imagemOriginal) && File::exists('content/products/gallery/' . $imagemOriginal->imagem)) {
                        File::delete('content/products/gallery/' . $imagemOriginal->imagem);
                    }

                    $image = $request->file('img')->move(public_path('content/products/gallery/'), $imagem->imagem);
                }

                return to_route('Manager.Produtos.Imagens.index', ['id' => $imagem->produto_id])->with('message', ['type' => 'success', 'msg' => 'Registro salvo com sucesso!']);
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

            $exclusao = ImagemProduto::query()
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

            $response = ImagemProduto::query()
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
                    $registro = ImagemProduto::query()
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
}