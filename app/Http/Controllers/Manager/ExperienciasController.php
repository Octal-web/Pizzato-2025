<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;

use App\Models\Experiencia;
use App\Models\ExperienciaIdioma;
use App\Models\Idioma;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\Manager\PostExperienceRequest;

use Illuminate\Support\Str;
use Carbon\Carbon;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;

use DeepCopy\DeepCopy;

class ExperienciasController extends Controller
{
    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function adicionar() {
        return Inertia::render('Manager/Experiencias/adicionar');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function novo(PostExperienceRequest $request) {
        if($request->ajax()){
            $idioma = inertia()->getShared('idioma');
            
            $experiencia = new Experiencia;
            $experiencia_idioma = new ExperienciaIdioma;

            $experiencia->imagem = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('img')->extension());
            
            $response = $experiencia->save();
            
            $experiencia_idioma->nome = $request->nome;
            $experiencia_idioma->subtitulo = $request->subtitulo;
            $experiencia_idioma->descricao = $request->descricao;

            $experiencia_idioma->experiencia_id = $experiencia->id;
            $experiencia_idioma->idioma_id = $idioma->id;

            $response = $experiencia_idioma->save();

            if ($response) {
                $image = $request->file('img')->move(public_path('content/experiences/'), $experiencia->imagem);

                return to_route('Manager.Enoturismo.index')->with('message', ['type' => 'success', 'msg' => 'Registro salvo com sucesso!']);
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
            return Inertia::location(route('Manager.Enoturismo.index'));
        }
        
        $idiomas = Idioma::query()
            ->orderBy('padrao', 'DESC')
            ->orderBy('id', 'DESC')
            ->get();

        $idioma = request('lang');

        $experiencia = Experiencia::query()
            ->where([
                'excluido' => null,
                'id' => $id
            ])
            ->with([
                'experienciasIdiomas' => function ($q) use ($idioma) {
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

        if(!$experiencia) {
            return Inertia::location(route('Manager.Enoturismo.index'));
        }
    
        $idioma = inertia()->getShared('idioma');
        
        $experienciaData = [
            'id' => $experiencia->id,
            'imagem' => rafator('content/experiences/' . $experiencia->imagem),
            'nome' => count($experiencia->experienciasIdiomas) ? $experiencia->experienciasIdiomas[0]->nome : null,
            'subtitulo' => count($experiencia->experienciasIdiomas) ? $experiencia->experienciasIdiomas[0]->subtitulo : null,
            'descricao' => count($experiencia->experienciasIdiomas) ? $experiencia->experienciasIdiomas[0]->descricao : null
        ];

        return Inertia::render('Manager/Experiencias/editar', [
            'idiomas' => $idiomas,
            'idioma' => $idioma,
            'experiencia' => $experienciaData,
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function atualizar(PostExperienceRequest $request, $id) {
        if($request->ajax()){
            $experiencia = Experiencia::query()
                ->where([
                    'excluido' => null,
                    'id' => $id
                ])
                ->first();

            $idioma = $request->query('lang');

            $experiencia_idioma = ExperienciaIdioma::query()
                ->where([
                    'excluido' => null,
                    'experiencia_id' => $experiencia->id
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

            if (!$experiencia) {
                return to_route('Manager.Enoturismo.index')->with('message', ['type' => 'error', 'msg' => 'Não foi possível salvar as informações. Tente novamente mais tarde.']);
            }

            $idioma = $this->getLanguages($experiencia, 'experienciasIdiomas', $idioma);

            if (!$idioma) {
                if ($request->ajax()) {
                    return to_route('Manager.Enoturismo.index')->with('message', ['type' => 'error', 'msg' => 'Não foi possível salvar as informações. Tente novamente mais tarde.']);
                }
                return Inertia::location(route('Manager.Enoturismo.index'));
            }

            if (!$experiencia_idioma) {
                $experiencia_idioma = new ExperienciaIdioma;

                $experiencia_idioma->experiencia_id = $experiencia->id;
                $experiencia_idioma->idioma_id = $idioma;
            } else {
                $copier = new DeepCopy();
                $experienciaOriginal = $copier->copy($experiencia);
            }

            if ($request->file('img') && $request->file('img')->getError() == 0) {
                $experiencia->imagem = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('img')->extension());
            }

            $experiencia_idioma->nome = $request->nome;
            $experiencia_idioma->subtitulo = $request->subtitulo;
            $experiencia_idioma->descricao = $request->descricao;

            $response = $experiencia->save();
            $response = $experiencia_idioma->save();

            if ($response) {
                if ($request->file('img') && $request->file('img')->getError() == 0) {
                    if ($experiencia->imagem && isset($experienciaOriginal) && File::exists('content/experiences/' . $experienciaOriginal->imagem)) {
                        File::delete('content/experiences/' . $experienciaOriginal->imagem);
                    }
                    
                    $image = $request->file('img')->move(public_path('content/experiences/'), $experiencia->imagem);
                }

                return to_route('Manager.Enoturismo.index')->with('message', ['type' => 'success', 'msg' => 'Registro salvo com sucesso!']);
            }
        }

        return to_route('Manager.Enoturismo.index')->with('message', ['type' => 'error', 'msg' => 'Não foi possível salvar as informações. Tente novamente mais tarde.']);
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

            $exclusao = Experiencia::query()
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

            $response = Experiencia::query()
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
                    $registro = Experiencia::query()
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
};