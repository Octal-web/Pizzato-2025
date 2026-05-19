<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;

use Inertia\Inertia;
use App\Http\Requests\Manager\PostGeneralDataRequest;

use App\Models\DadosGerais;
use App\Models\Slide;

class HomeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $idioma = inertia()->getShared('idioma');

        $dadosGerais = DadosGerais::first();

        $slides = Slide::query()
            ->where([
                'excluido' => NULL
            ])
            ->with([
                'slidesIdiomas' => function ($q) {
                    $q->whereHas('idiomas', function ($r) {
                        $r->Where('padrao', true);
                    })
                        ->orderBy('idioma_id', 'DESC');
                }
            ])
            ->orderBy('ordem', 'ASC')
            ->orderBy('id', 'DESC')
            ->get()
            ->map(function ($slide) {
                return [
                    'id' => $slide->id,
                    'visivel' => $slide->visivel,
                    'titulo' => (($slide->slidesIdiomas->isNotEmpty() ? $slide->slidesIdiomas[0]->titulo : null) . ' - ' . ($slide->tipo == 'imagem' ? 'Imagem' : 'Vídeo')),
                ];
            });

        return Inertia::render('Manager/Home/index', [
            'dadosGerais' => $dadosGerais,
            'slides' => $slides
        ]);
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function atualizarInfo(PostGeneralDataRequest $request)
    {
        if ($request->ajax()) {
            $dados_gerais = DadosGerais::first();

            $dados_gerais->endereco = $request->endereco;
            $dados_gerais->cep = $request->cep;
            $dados_gerais->telefones = $request->telefones;
            $dados_gerais->instagram = $request->instagram ? $request->instagram : null;
            $dados_gerais->facebook = $request->facebook ? $request->facebook : null;
            $dados_gerais->link_mapa = $request->link_mapa;

            $response = $dados_gerais->save();

            if ($response) {
                return to_route('Manager.Home.index')->with('message', ['type' => 'success', 'msg' => 'Registro salvo com sucesso!']);
            }
        }
    }
};
