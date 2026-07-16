<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;

use App\Models\Linha;
use App\Models\Categoria;
use App\Models\Volume;
use App\Models\LinhaIdioma;
use App\Models\Idioma;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\Manager\PostLinesRequest;

use Illuminate\Support\Str;
use Carbon\Carbon;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;

use DeepCopy\DeepCopy;

class LinhasController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index() {
        $idioma = inertia()->getShared('idioma');

        $linhas = Linha::query()
            ->where([
                'excluido' => NULL
            ])
            ->with([
                'linhasIdiomas' => function ($q) {
                    $q->whereHas('idiomas', function ($r) {
                        $r->Where('padrao', true);
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
                    'visivel' => $linha->visivel,
                    'nome' => $linha->linhasIdiomas->isNotEmpty() ? $linha->linhasIdiomas[0]->nome : null,
                ];
            });

        $categorias = Categoria::query()
            ->where([
                'excluido' => NULL
            ])
            ->with([
                'categoriasIdiomas' => function ($q) {
                    $q->whereHas('idiomas', function ($r) {
                        $r->Where('padrao', true);
                    })
                    ->orderBy('idioma_id', 'DESC');
                }
            ])
            ->orderBy('ordem', 'ASC')
            ->orderBy('id', 'DESC')
            ->get()
            ->map(function($categoria) {
                return [
                    'id' => $categoria->id,
                    'visivel' => $categoria->visivel,
                    'nome' => $categoria->categoriasIdiomas->isNotEmpty() ? ($categoria->categoriasIdiomas[0]->tipo ? $categoria->categoriasIdiomas[0]->tipo . ' ' . $categoria->categoriasIdiomas[0]->nome : $categoria->categoriasIdiomas[0]->nome) : null,
                ];
            });
            
        $volumes = Volume::query()
            ->where([
                'excluido' => NULL
            ])
            ->orderBy('ordem', 'ASC')
            ->orderBy('id', 'DESC')
            ->get()
            ->map(function($volume) {
                return [
                    'id' => $volume->id,
                    'visivel' => $volume->visivel,
                    'nome' => $volume->volume
                ];
            });

        return Inertia::render('Manager/Linhas/index', [
            'linhas' => $linhas,
            'categorias' => $categorias,
            'volumes' => $volumes
        ]);
    }
    
    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function adicionar() {
        return Inertia::render('Manager/Linhas/adicionar');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function novo(PostLinesRequest $request) {
        if($request->ajax()){
            $idioma = inertia()->getShared('idioma');
            
            $linha = new Linha;
            $linha_idioma = new LinhaIdioma;

            $slugBase = Str::slug($request['nome']);
            $slug = $slugBase;

            $count = 1;

            while (Linha::where('slug', $slug)->exists()) {
                $slug = $slugBase . '-' . $count;
                $count++;
            }

            $linha->logo = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('img_logo')->extension());
            $linha->banner = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('img')->extension());
            $linha->banner_rodape = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('img_footer')->extension());
            $linha->imagem_destaques = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('img_featured')->extension());

            $linha->slug = $slug;

            $response = $linha->save();

            $linha_idioma->nome = $request->nome;
            $linha_idioma->chamada = $request->chamada;
            $linha_idioma->descricao = $request->descricao;
            $linha_idioma->titulo_pagina = $request->titulo_pagina;
            $linha_idioma->descricao_pagina = $request->descricao_pagina;

            $linha_idioma->linha_id = $linha->id;
            $linha_idioma->idioma_id = $idioma->id;

            $response = $linha_idioma->save();

            if ($response) {
                $image = $request->file('img_logo')->move(public_path('content/lines/logo/'), $linha->logo);
                $image = $request->file('img')->move(public_path('content/lines/banner/'), $linha->banner);
                $image = $request->file('img_footer')->move(public_path('content/lines/footer/'), $linha->banner_rodape);
                $image = $request->file('img_featured')->move(public_path('content/lines/featureds/'), $linha->imagem_destaques);

                return to_route('Manager.Linhas.index')->with('message', ['type' => 'success', 'msg' => 'Registro salvo com sucesso!']);
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
            return Inertia::location(route('Manager.Linhas.index'));
        }
        
        $idiomas = Idioma::query()
            ->orderBy('padrao', 'DESC')
            ->orderBy('id', 'DESC')
            ->get();

        $idioma = request('lang');

        $linha = Linha::query()
            ->where([
                'excluido' => null,
                'id' => $id
            ])
            ->with([
                'linhasIdiomas' => function ($q) use ($idioma) {
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

        if(!$linha) {
            return Inertia::location(route('Manager.Linhas.index'));
        }

        $idioma = inertia()->getShared('idioma');

        $linhaData = [
            'id' => $linha->id,
            'banner' => rafator('content/lines/banner/' . $linha->banner),
            'logo' => rafator('content/lines/logo/' . $linha->logo),
            'imagem_destaques' => rafator('content/lines/featureds/' . $linha->imagem_destaques),
            'banner_rodape' => rafator('content/lines/footer/' . $linha->banner_rodape),
            'nome' => count($linha->linhasIdiomas) ? $linha->linhasIdiomas[0]->nome : null,
            'chamada' => count($linha->linhasIdiomas) ? $linha->linhasIdiomas[0]->chamada : null,
            'descricao' => count($linha->linhasIdiomas) ? $linha->linhasIdiomas[0]->descricao : null,
            'titulo_pagina' => count($linha->linhasIdiomas) ? $linha->linhasIdiomas[0]->titulo_pagina : null,
            'descricao_pagina' => count($linha->linhasIdiomas) ? $linha->linhasIdiomas[0]->descricao_pagina : null,
        ];
        
        return Inertia::render('Manager/Linhas/editar', [
            'idiomas' => $idiomas,
            'idioma' => $idioma,
            'linha' => $linhaData
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function atualizar(PostLinesRequest $request, $id) {
        if($request->ajax()){
            $linha = Linha::query()
                ->where([
                    'excluido' => null,
                    'id' => $id
                ])
                ->first();

            $idioma = $request->query('lang');

            $linha_idioma = LinhaIdioma::query()
                ->where([
                    'excluido' => null,
                    'linha_id' => $linha->id
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

            if (!$linha) {
                return to_route('Manager.Linhas.index')->with('message', ['type' => 'error', 'msg' => 'Não foi possível salvar as informações. Tente novamente mais tarde.']);
            }

            $idioma = $this->getLanguages($linha, 'linhasIdiomas', $idioma);

            if (!$idioma) {
                if ($request->ajax()) {
                    return to_route('Manager.Linhas.index')->with('message', ['type' => 'error', 'msg' => 'Não foi possível salvar as informações. Tente novamente mais tarde.']);
                }
                return Inertia::location(route('Manager.Linhas.index'));
            }

            if (!$linha_idioma) {
                $linha_idioma = new LinhaIdioma;

                $linha_idioma->linha_id = $linha->id;
                $linha_idioma->idioma_id = $idioma;
            } else {
                $copier = new DeepCopy();
                $linhaOriginal = $copier->copy($linha);
            }

            $slug = $linha->slug;

            if (!$request->query('lang')) {
                if ($request['nome'] !== $linha_idioma->nome) {
                    $slugBase = Str::slug($request['nome']);
                    $slug = $slugBase;
                    $count = 1;

                    while (Linha::where('slug', $slug)->where('id', '!=', $id)->exists()) {
                        $slug = $slugBase . '-' . $count;
                        $count++;
                    }
                }
            }

            $linha->slug = $slug;

            if ($request->file('img_logo') && $request->file('img_logo')->getError() == 0) {
                $linha->logo = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('img_logo')->extension());
            }

            if ($request->file('img') && $request->file('img')->getError() == 0) {
                $linha->banner = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('img')->extension());
            }

            if ($request->file('img_footer') && $request->file('img_footer')->getError() == 0) {
                $linha->banner_rodape = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('img_footer')->extension());
            }
            
            if ($request->file('img_featured') && $request->file('img_featured')->getError() == 0) {
                $linha->imagem_destaques = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('img_featured')->extension());
            }

            $linha_idioma->nome = $request->nome;
            $linha_idioma->chamada = $request->chamada;
            $linha_idioma->descricao = $request->descricao;
            $linha_idioma->titulo_pagina = $request->titulo_pagina;
            $linha_idioma->descricao_pagina = $request->descricao_pagina;

            $response = $linha->save();
            $response = $linha_idioma->save();

            if ($response) {
                if ($request->file('img_logo') && $request->file('img_logo')->getError() == 0) {
                    if ($linha->logo && isset($linhaOriginal) && File::exists('content/lines/logo/' . $linhaOriginal->logo)) {
                        File::delete('content/lines/logo/' . $linhaOriginal->logo);
                    }

                    $image = $request->file('img_logo')->move(public_path('content/lines/logo/'), $linha->logo);
                }
                
                if ($request->file('img') && $request->file('img')->getError() == 0) {
                    if ($linha->banner && isset($linhaOriginal) && File::exists('content/lines/banner/' . $linhaOriginal->banner)) {
                        File::delete('content/lines/banner/' . $linhaOriginal->banner);
                    }

                    $image = $request->file('img')->move(public_path('content/lines/banner/'), $linha->banner);
                }

                if ($request->file('img_footer') && $request->file('img_footer')->getError() == 0) {
                    if ($linha->banner_rodape && isset($linhaOriginal) && File::exists('content/lines/footer/' . $linhaOriginal->banner_rodape)) {
                        File::delete('content/lines/footer/' . $linhaOriginal->banner_rodape);
                    }

                    $image = $request->file('img_footer')->move(public_path('content/lines/footer/'), $linha->banner_rodape);
                }

                if ($request->file('img_featured') && $request->file('img_featured')->getError() == 0) {
                    if ($linha->imagem_destaques && isset($linhaOriginal) && File::exists('content/lines/featureds/' . $linhaOriginal->imagem_destaques)) {
                        File::delete('content/lines/featureds/' . $linhaOriginal->imagem_destaques);
                    }

                    $image = $request->file('img_featured')->move(public_path('content/lines/featureds/'), $linha->imagem_destaques);
                }
                
                return to_route('Manager.Linhas.index')->with('message', ['type' => 'success', 'msg' => 'Registro salvo com sucesso!']);
            }
        }

        return to_route('Manager.Linhas.index')->with('message', ['type' => 'error', 'msg' => 'Não foi possível salvar as informações. Tente novamente mais tarde.']);
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

            $exclusao = Linha::query()
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

            $response = Linha::query()
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
                    $registro = Linha::query()
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