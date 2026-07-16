<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use App\Models\Produto;
use App\Models\Detalhe;
use App\Models\DetalheIdioma;
use App\Models\Idioma;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\Manager\PostProductDetailRequest;

use Carbon\Carbon;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;

use DeepCopy\DeepCopy;

class DetalhesProdutosController extends Controller
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
                'detalhes' => function ($q)  {
                    $q->where([
                        'excluido' => null
                    ])
                    ->orderBy('ordem', 'ASC')
                    ->orderBy('id', 'DESC')
                    ->with([
                        'detalhesIdiomas' => function ($query) {
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
            'detalhes' => $produto->detalhes->map(function ($detalhe) {
                return [
                    'id' => $detalhe->id,
                    'visivel' => $detalhe->visivel ? true : false,
                    'imagem' => rafator('content/products/details/' . $detalhe->icone),
                    'nome' => count($detalhe->detalhesIdiomas) ? $detalhe->detalhesIdiomas[0]->nome : null,
                ];
            })->values()->all(),
        ];

        return Inertia::render('Manager/Produtos/Detalhes/index', [
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

        return Inertia::render('Manager/Produtos/Detalhes/adicionar', [
            'id' => $id
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function novo(PostProductDetailRequest $request, $id) {
        if (!$id) {
            return Inertia::location(route('Manager.Produtos.index'));
        }
        
        if($request->ajax()){
            $idioma = inertia()->getShared('idioma');
            
            $detalhe = new Detalhe;
            $detalhe_idioma = new DetalheIdioma;

            $detalhe->produto_id = $id;
            $detalhe->icone = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('img')->extension());

            $response = $detalhe->save();

            $detalhe_idioma->nome = $request->nome;
            $detalhe_idioma->conteudo = $request->conteudo;

            $detalhe_idioma->detalhe_id = $detalhe->id;
            $detalhe_idioma->idioma_id = $idioma->id;


            $response = $detalhe_idioma->save();

            if ($response) {
                $image = $request->file('img')->move(public_path('content/products/details/'), $detalhe->icone);

                return to_route('Manager.Produtos.Detalhes.index', ['id' => $id])->with('message', ['type' => 'success', 'msg' => 'Registro salvo com sucesso!']);
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

        $detalhe = Detalhe::query()
            ->where([
                'excluido' => null,
                'id' => $id
            ])
            ->with([
                'detalhesIdiomas' => function ($q) use ($idioma) {
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

        if(!$detalhe) {
            return Inertia::location(route('Manager.Produtos.index'));
        }

        $idioma = inertia()->getShared('idioma');

        $detalhe = [
            'id' => $detalhe->id,
            'produto_id' => $detalhe->produto_id,
            'icone' => rafator('content/products/details/' . $detalhe->icone),
            'nome' => count($detalhe->detalhesIdiomas) ? $detalhe->detalhesIdiomas[0]->nome : null,
            'conteudo' => count($detalhe->detalhesIdiomas) ? $detalhe->detalhesIdiomas[0]->conteudo : null,
        ];

        return Inertia::render('Manager/Produtos/Detalhes/editar', [
            'idiomas' => $idiomas,
            'idioma' => $idioma,
            'detalhe' => $detalhe,
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function atualizar(PostProductDetailRequest $request, $id) {
        if($request->ajax()){
            $detalhe = Detalhe::query()
                ->where([
                    'excluido' => null,
                    'id' => $id
                ])
                ->first();

            $idioma = $request->query('lang');

            $detalhe_idioma = DetalheIdioma::query()
                ->where([
                    'excluido' => null,
                    'detalhe_id' => $detalhe->id
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

            if (!$detalhe) {
                return to_route('Manager.Produtos.index')->with('message', ['type' => 'error', 'msg' => 'Não foi possível salvar as informações. Tente novamente mais tarde.']);
            }

            $idioma = $this->getLanguages($detalhe, 'imagensIdiomas', $idioma);

            if (!$idioma) {
                if ($request->ajax()) {
                    return to_route('Manager.Produtos.index')->with('message', ['type' => 'error', 'msg' => 'Não foi possível salvar as informações. Tente novamente mais tarde.']);
                }
                return Inertia::location(route('Manager.Produtos.index'));
            }

            if (!$detalhe_idioma) {
                $detalhe_idioma = new DetalheIdioma;

                $detalhe_idioma->detalhe_id = $detalhe->id;
                $detalhe_idioma->idioma_id = $idioma;
            } else {
                $copier = new DeepCopy();
                $detalheOriginal = $copier->copy($detalhe);
            }

            if ($request->file('img') && $request->file('img')->getError() == 0) {
                $detalhe->icone = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('img')->extension());
            }

            $detalhe_idioma->nome = $request->nome;
            $detalhe_idioma->conteudo = $request->conteudo;

            $response = $detalhe->save();
            $response = $detalhe_idioma->save();

            if ($response) {
                if ($request->file('img') && $request->file('img')->getError() == 0) {
                    if ($detalhe->icone && isset($detalheOriginal) && File::exists('content/products/details/' . $detalheOriginal->icone)) {
                        File::delete('content/products/details/' . $detalheOriginal->icone);
                    }               

                    $image = $request->file('img')->move(public_path('content/products/details/'), $detalhe->icone);
                }

                return to_route('Manager.Produtos.Detalhes.index', ['id' => $detalhe->produto_id])->with('message', ['type' => 'success', 'msg' => 'Registro salvo com sucesso!']);
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

            $exclusao = Detalhe::query()
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

            $response = Detalhe::query()
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
                    $registro = Detalhe::query()
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