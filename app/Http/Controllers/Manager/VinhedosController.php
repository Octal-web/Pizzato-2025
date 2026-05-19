<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;

use App\Models\Vinhedo;
use App\Models\VinhedoIdioma;

use App\Models\Idioma;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\Manager\PostVineyardRequest;

use Carbon\Carbon;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;

use DeepCopy\DeepCopy;

class VinhedosController extends Controller
{    
    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function adicionar() {
        return Inertia::render('Manager/Vinhedos/adicionar');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function novo(PostVineyardRequest $request) {
        if($request->ajax()){
            $idioma = inertia()->getShared('idioma');
            
            $vinhedo = new Vinhedo;
            $vinhedo_idioma = new VinhedoIdioma;

            $vinhedo->banner = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('img')->extension());
            $vinhedo->banner_mobile = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('img_mobile')->extension());

            $response = $vinhedo->save();

            $vinhedo_idioma->nome = $request->nome;
            $vinhedo_idioma->subtitulo = $request->subtitulo;
            $vinhedo_idioma->descricao = $request->descricao;
            $vinhedo_idioma->localizacao = $request->localizacao;
            $vinhedo_idioma->composicao_solo = $request->composicao_solo;
            $vinhedo_idioma->clima = $request->clima;
            $vinhedo_idioma->arquitetura = $request->arquitetura;

            $vinhedo_idioma->vinhedo_id = $vinhedo->id;
            $vinhedo_idioma->idioma_id = $idioma->id;

            $response = $vinhedo_idioma->save();

            if ($response) {
                $image = $request->file('img')->move(public_path('content/vineyards/banner/d/'), $vinhedo->banner);
                $image_mobile = $request->file('img_mobile')->move(public_path('content/vineyards/banner/m/'), $vinhedo->banner_mobile);

                return to_route('Manager.Institucional.index')->with('message', ['type' => 'success', 'msg' => 'Registro salvo com sucesso!']);
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
            return Inertia::location(route('Manager.Institucional.index'));
        }
        
        $idiomas = Idioma::query()
            ->orderBy('padrao', 'DESC')
            ->orderBy('id', 'DESC')
            ->get();

        $idioma = request('lang');

        $vinhedo = Vinhedo::query()
            ->where([
                'excluido' => null,
                'id' => $id
            ])
            ->with([
                'vinhedosIdiomas' => function ($q) use ($idioma) {
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

        if(!$vinhedo) {
            return Inertia::location(route('Manager.Institucional.index'));
        }

        $idioma = inertia()->getShared('idioma');

        $vinhedoData = [
            'id' => $vinhedo->id,
            'banner' => rafator('content/vineyards/banner/d/' . $vinhedo->banner),
            'banner_mobile' => rafator('content/vineyards/banner/m/' . $vinhedo->banner_mobile),
            'nome' => count($vinhedo->vinhedosIdiomas) ? $vinhedo->vinhedosIdiomas[0]->nome : null,
            'subtitulo' => count($vinhedo->vinhedosIdiomas) ? $vinhedo->vinhedosIdiomas[0]->subtitulo : null,
            'descricao' => count($vinhedo->vinhedosIdiomas) ? $vinhedo->vinhedosIdiomas[0]->descricao : null,
            'localizacao' => count($vinhedo->vinhedosIdiomas) ? $vinhedo->vinhedosIdiomas[0]->localizacao : null,
            'composicao_solo' => count($vinhedo->vinhedosIdiomas) ? $vinhedo->vinhedosIdiomas[0]->composicao_solo : null,
            'clima' => count($vinhedo->vinhedosIdiomas) ? $vinhedo->vinhedosIdiomas[0]->clima : null,
            'arquitetura' => count($vinhedo->vinhedosIdiomas) ? $vinhedo->vinhedosIdiomas[0]->arquitetura : null,
        ];
        
        return Inertia::render('Manager/Vinhedos/editar', [
            'idiomas' => $idiomas,
            'idioma' => $idioma,
            'vinhedo' => $vinhedoData
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function atualizar(PostVineyardRequest $request, $id) {
        if($request->ajax()){
            $vinhedo = Vinhedo::query()
                ->where([
                    'excluido' => null,
                    'id' => $id
                ])
                ->first();

            $idioma = $request->query('lang');

            $vinhedo_idioma = VinhedoIdioma::query()
                ->where([
                    'excluido' => null,
                    'vinhedo_id' => $vinhedo->id
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

            if (!$vinhedo) {
                return to_route('Manager.Institucional.index')->with('message', ['type' => 'error', 'msg' => 'Não foi possível salvar as informações. Tente novamente mais tarde.']);
            }

            $idioma = $this->getLanguages($vinhedo, 'vinhedosIdiomas', $idioma);

            if (!$idioma) {
                if ($request->ajax()) {
                    return to_route('Manager.Institucional.index')->with('message', ['type' => 'error', 'msg' => 'Não foi possível salvar as informações. Tente novamente mais tarde.']);
                }
                return Inertia::location(route('Manager.Institucional.index'));
            }

            if (!$vinhedo_idioma) {
                $vinhedo_idioma = new VinhedoIdioma;

                $vinhedo_idioma->vinhedo_id = $vinhedo->id;
                $vinhedo_idioma->idioma_id = $idioma;
            } else {
                $copier = new DeepCopy();
                $vinhedoOriginal = $copier->copy($vinhedo);
            }

            if ($request->file('img') && $request->file('img')->getError() == 0) {
                $vinhedo->banner = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('img')->extension());
            }

            if ($request->file('img_mobile') && $request->file('img_mobile')->getError() == 0) {
                $vinhedo->banner_mobile = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('img_mobile')->extension());
            }

            $vinhedo_idioma->nome = $request->nome;
            $vinhedo_idioma->subtitulo = $request->subtitulo;
            $vinhedo_idioma->descricao = $request->descricao;
            $vinhedo_idioma->localizacao = $request->localizacao;
            $vinhedo_idioma->composicao_solo = $request->composicao_solo;
            $vinhedo_idioma->clima = $request->clima;
            $vinhedo_idioma->arquitetura = $request->arquitetura;

            $response = $vinhedo->save();
            $response = $vinhedo_idioma->save();

            if ($response) {
                if ($request->file('img') && $request->file('img')->getError() == 0) {
                    if ($vinhedo->banner && isset($vinhedoOriginal) && File::exists('content/vineyards/banner/d/' . $vinhedoOriginal->banner)) {
                        File::delete('content/vineyards/banner/d/' . $vinhedoOriginal->banner);
                    }
                    
                    $image = $request->file('img')->move(public_path('content/vineyards/banner/d/'), $vinhedo->banner);
                }
                
                if ($request->file('img_mobile') && $request->file('img_mobile')->getError() == 0) {
                    if ($vinhedo->banner_mobile && isset($vinhedoOriginal) && File::exists('content/vineyards/banner/m/' . $vinhedoOriginal->banner_mobile)) {
                        File::delete('content/vineyards/banner/m/' . $vinhedoOriginal->banner_mobile);
                    }
                    
                    $image = $request->file('img_mobile')->move(public_path('content/vineyards/banner/m/'), $vinhedo->banner_mobile);
                }

                return to_route('Manager.Institucional.index')->with('message', ['type' => 'success', 'msg' => 'Registro salvo com sucesso!']);
            }
        }

        return to_route('Manager.Institucional.index')->with('message', ['type' => 'error', 'msg' => 'Não foi possível salvar as informações. Tente novamente mais tarde.']);
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

            $exclusao = Vinhedo::query()
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

            $response = Vinhedo::query()
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
                    $registro = Vinhedo::query()
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