<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use App\Models\Pergunta;
use App\Models\PerguntaIdioma;
use App\Models\Idioma;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\Manager\PostQuestionRequest;

use Carbon\Carbon;

class PerguntasController extends Controller
{

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $idioma = inertia()->getShared('idioma');

        $perguntas = Pergunta::query()
            ->where([
                'excluido' => NULL
            ])
            ->orderBy('ordem', 'ASC')
            ->with([
                'perguntasIdiomas' => function ($q) use ($idioma) {
                    $q->whereHas('idiomas', function ($r) use ($idioma) {
                        $r->where('codigo', $idioma)
                            ->orWhere('padrao', true);
                    })
                        ->orderBy('idioma_id', 'DESC');
                }
            ])
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'visivel' => $item->visivel,
                    'titulo' => $item->perguntasIdiomas->isNotEmpty() ? $item->perguntasIdiomas[0]->titulo : null,
                ];
            });

        return Inertia::render('Manager/Perguntas/index', [
            'perguntas' => $perguntas
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function adicionar()
    {
        return Inertia::render('Manager/Perguntas/adicionar');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function novo(PostQuestionRequest $request)
    {
        if ($request->ajax()) {
            $idioma = inertia()->getShared('idioma');

            $pergunta = new Pergunta;
            $pergunta_idioma = new PerguntaIdioma;

            $response = $pergunta->save();

            $pergunta_idioma->titulo = $request->titulo;
            $pergunta_idioma->texto = $request->texto;

            $pergunta_idioma->pergunta_id = $pergunta->id;
            $pergunta_idioma->idioma_id = $idioma->id;

            $response = $pergunta_idioma->save();

            if ($response) {
                return to_route('Manager.Perguntas.index')->with('message', ['type' => 'success', 'msg' => 'Registro salvo com sucesso!']);
            }
        }
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function editar($id)
    {
        if (!$id) {
            return Inertia::location(route('Manager.Perguntas.index'));
        }

        $idiomas = Idioma::query()
            ->orderBy('padrao', 'DESC')
            ->orderBy('id', 'DESC')
            ->get();

        $idioma = request('lang');

        $pergunta = Pergunta::query()
            ->where([
                'excluido' => null,
                'id' => $id
            ])
            ->with([
                'perguntasIdiomas' => function ($q) use ($idioma) {
                    $q->when($idioma, function ($r) use ($idioma) {
                        $r->whereHas('idiomas', function ($query) use ($idioma) {
                            $query->where('codigo', $idioma);
                        });
                    })
                        ->when(!$idioma, function ($r) {
                            $r->whereHas('idiomas', function ($query) {
                                $query->where('padrao', true);
                            });
                        });
                },
            ])
            ->first();

        if (!$pergunta) {
            return Inertia::location(route('Manager.Perguntas.index'));
        }

        $idioma = inertia()->getShared('idioma');

        $pergunta = [
            'id' => $pergunta->id,
            'titulo' => count($pergunta->perguntasIdiomas) ? $pergunta->perguntasIdiomas[0]->titulo : null,
            'texto' => count($pergunta->perguntasIdiomas) ? $pergunta->perguntasIdiomas[0]->texto : null,
        ];

        return Inertia::render('Manager/Perguntas/editar', [
            'idiomas' => $idiomas,
            'idioma' => $idioma,
            'pergunta' => $pergunta
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function atualizar(PostQuestionRequest $request, $id)
    {
        if ($request->ajax()) {
            $pergunta = Pergunta::query()
                ->where([
                    'excluido' => null,
                    'id' => $id
                ])
                ->first();

            $idioma = $request->query('lang');

            $pergunta_idioma = PerguntaIdioma::query()
                ->where([
                    'excluido' => null,
                    'pergunta_id' => $pergunta->id
                ])
                ->when($idioma, function ($q) use ($idioma) {
                    $q->whereHas('idiomas', function ($query) use ($idioma) {
                        $query->where('codigo', $idioma);
                    });
                })
                ->when(!$idioma, function ($q) {
                    $q->whereHas('idiomas', function ($query) {
                        $query->where('padrao', true);
                    });
                })
                ->first();

            if (!$pergunta) {
                return to_route('Manager.Perguntas.index')->with('message', ['type' => 'error', 'msg' => 'Não foi possível salvar as informações. Tente novamente mais tarde.']);
            }

            $idioma = $this->getLanguages($pergunta, 'perguntasIdiomas', $idioma);

            if (!$idioma) {
                if ($request->ajax()) {
                    return to_route('Manager.Perguntas.index')->with('message', ['type' => 'error', 'msg' => 'Não foi possível salvar as informações. Tente novamente mais tarde.']);
                }
                return Inertia::location(route('Manager.Perguntas.index'));
            }

            if (!$pergunta_idioma) {
                $pergunta_idioma = new PerguntaIdioma;

                $pergunta_idioma->pergunta_id = $pergunta->id;
                $pergunta_idioma->idioma_id = $idioma;
            }

            $pergunta_idioma->titulo = $request->titulo;
            $pergunta_idioma->texto = $request->texto;

            $response = $pergunta->save();
            $response = $pergunta_idioma->save();

            if ($response) {
                return to_route('Manager.Perguntas.index')->with('message', ['type' => 'success', 'msg' => 'Registro salvo com sucesso!']);
            }
        }

        return to_route('Manager.Perguntas.index')->with('message', ['type' => 'error', 'msg' => 'Não foi possível salvar as informações. Tente novamente mais tarde.']);
    }

    /**
     * Set the specified resource as deleted.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function excluir(Request $request, $id)
    {
        if ($request->ajax()) {
            if (!$id) {
                return $request->header('referer');
            }

            $exclusao = Pergunta::query()
                ->where([
                    'excluido' => NULL,
                    'id' => $id
                ])
                ->update([
                    'excluido' => Carbon::now()
                ]);

            if ($exclusao == true) {
                PerguntaIdioma::query()
                    ->where([
                        'excluido' => NULL,
                        'pergunta_id' => $id
                    ])
                    ->update([
                        'excluido' => Carbon::now()
                    ]);
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
    public function visibilidade(Request $request, $id)
    {
        if ($request->ajax()) {
            if (!$id) {
                return redirect()->back()->with(['type' => 'error', 'message' => 'Registro não encontrado!']);
            }

            $response = Pergunta::query()
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
            } else {
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
    public function ordenar(Request $request)
    {
        if ($request->ajax()) {
            $erros = [];

            if ($request->odr && is_array($request->odr)) {
                foreach ($request->odr as $key => $value) {
                    $registro = Pergunta::query()
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
