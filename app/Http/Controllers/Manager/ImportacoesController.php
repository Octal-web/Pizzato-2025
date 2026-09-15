<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;

use App\Models\Importacao;
use App\Models\ImportacaoIdioma;
use App\Models\Idioma;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\Manager\PostImportRequest;

use Carbon\Carbon;

class ImportacoesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index() {
        $importacoes = Importacao::query()
            ->where([
                'excluido' => NULL
            ])
            ->with([
                'importacoesIdiomas' => function ($q) {
                    $q->whereHas('idiomas', function ($r) {
                        $r->Where('padrao', true);
                    })
                    ->orderBy('idioma_id', 'DESC');
                }
            ])
            ->orderBy('ordem', 'ASC')
            ->orderBy('id', 'DESC')
            ->get()
            ->map(function($importacao) {
                return [
                    'id' => $importacao->id,
                    'visivel' => $importacao->visivel,
                    'nome' => $importacao->importacoesIdiomas->isNotEmpty() ? $importacao->importacoesIdiomas[0]->pais : null,
                ];
            });

        return Inertia::render('Manager/Importacoes/index', [
            'importacoes' => $importacoes
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function adicionar() {
        return Inertia::render('Manager/Importacoes/adicionar');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function novo(PostImportRequest $request) {
        if($request->ajax()){
            $idioma = inertia()->getShared('idioma');
            
            $importacao = new Importacao;
            $importacao_idioma = new ImportacaoIdioma;

            $response = $importacao->save();
            
            $importacao_idioma->pais = $request->pais;
            $importacao_idioma->descricao = $request->descricao;

            $importacao_idioma->importacao_id = $importacao->id;
            $importacao_idioma->idioma_id = $idioma->id;

            $response = $importacao_idioma->save();

            if ($response) {

                return to_route('Manager.Importacoes.index')->with('message', ['type' => 'success', 'msg' => 'Registro salvo com sucesso!']);
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
            return Inertia::location(route('Manager.Importacoes.index'));
        }
        
        $idiomas = Idioma::query()
            ->orderBy('padrao', 'DESC')
            ->orderBy('id', 'DESC')
            ->get();

        $idioma = request('lang');

        $importacao = Importacao::query()
            ->where([
                'excluido' => null,
                'id' => $id
            ])
            ->with([
                'importacoesIdiomas' => function ($q) use ($idioma) {
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
                }
            ])
            ->first();

        if(!$importacao) {
            return Inertia::location(route('Manager.Importacoes.index'));
        }
    
        $idioma = inertia()->getShared('idioma');
        
        $importacaoData = [
            'id' => $importacao->id,
            'pais' => count($importacao->importacoesIdiomas) ? $importacao->importacoesIdiomas[0]->pais : null,
            'descricao' => count($importacao->importacoesIdiomas) ? $importacao->importacoesIdiomas[0]->descricao : null
        ];

        return Inertia::render('Manager/Importacoes/editar', [
            'idiomas' => $idiomas,
            'idioma' => $idioma,
            'importacao' => $importacaoData,
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function atualizar(PostImportRequest $request, $id) {
        if($request->ajax()){
            $importacao = Importacao::query()
                ->where([
                    'excluido' => null,
                    'id' => $id
                ])
                ->first();

            if (!$importacao) {
                return to_route('Manager.Importacoes.index')->with('message', ['type' => 'error', 'msg' => 'Não foi possível salvar as informações. Tente novamente mais tarde.']);
            }

            $idioma = $request->query('lang');

            $importacao_idioma = ImportacaoIdioma::query()
                ->where([
                    'excluido' => null,
                    'importacao_id' => $importacao->id
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

            $idioma = $this->getLanguages($importacao, 'importacoesIdiomas', $idioma);

            if (!$idioma) {
                if ($request->ajax()) {
                    return to_route('Manager.Importacoes.index')->with('message', ['type' => 'error', 'msg' => 'Não foi possível salvar as informações. Tente novamente mais tarde.']);
                }
                return Inertia::location(route('Manager.Importacoes.index'));
            }

            if (!$importacao_idioma) {
                $importacao_idioma = new ImportacaoIdioma;

                $importacao_idioma->importacao_id = $importacao->id;
                $importacao_idioma->idioma_id = $idioma;
            }

            $importacao_idioma->pais = $request->pais;
            $importacao_idioma->descricao = $request->descricao;

            $response = $importacao->save();
            $response = $importacao_idioma->save();

            if ($response) {
                return to_route('Manager.Importacoes.index')->with('message', ['type' => 'success', 'msg' => 'Registro salvo com sucesso!']);
            }
        }

        return to_route('Manager.Importacoes.index')->with('message', ['type' => 'error', 'msg' => 'Não foi possível salvar as informações. Tente novamente mais tarde.']);
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

            $exclusao = Importacao::query()
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

            $response = Importacao::query()
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
                    $registro = Importacao::query()
                        ->where([
                            'excluido' => NULL,
                            'id' => $value
                        ])
                        ->update([
                            'ordem' => $key,
                        ]);

                    if (!$registro) {
                        $erros[] = $value;
                    }
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
};
