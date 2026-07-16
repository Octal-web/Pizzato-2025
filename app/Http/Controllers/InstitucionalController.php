<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\Vinhedo;
use App\Models\Imagem;
use App\Models\Acontecimento;

use Illuminate\Support\Collection;

class InstitucionalController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index() {
        $idioma = inertia()->getShared('idioma');

        $vinhedos = Vinhedo::query()
            ->where([
                'excluido' => NULL,
                'visivel' => true
            ])
            ->with([
                'vinhedosIdiomas' => function ($q) use ($idioma) {
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
            ->map(function($vinhedo) {
                return [
                    'id' => $vinhedo->id,
                    'banner' => $vinhedo->banner,
                    'banner_mobile' => $vinhedo->banner_mobile,
                    'nome' => $vinhedo->vinhedosIdiomas->isNotEmpty() ? $vinhedo->vinhedosIdiomas[0]->nome : null,
                    'subtitulo' => $vinhedo->vinhedosIdiomas->isNotEmpty() ? $vinhedo->vinhedosIdiomas[0]->subtitulo : null,
                    'descricao' => $vinhedo->vinhedosIdiomas->isNotEmpty() ? $vinhedo->vinhedosIdiomas[0]->descricao : null,
                    'localizacao' => $vinhedo->vinhedosIdiomas->isNotEmpty() ? $vinhedo->vinhedosIdiomas[0]->localizacao : null,
                    'composicao_solo' => $vinhedo->vinhedosIdiomas->isNotEmpty() ? $vinhedo->vinhedosIdiomas[0]->composicao_solo : null,
                    'clima' => $vinhedo->vinhedosIdiomas->isNotEmpty() ? $vinhedo->vinhedosIdiomas[0]->clima : null,
                    'arquitetura' => $vinhedo->vinhedosIdiomas->isNotEmpty() ? $vinhedo->vinhedosIdiomas[0]->arquitetura : null,
                ];
            });

        $imagensGaleria = Imagem::query()
            ->where([
                'excluido' => NULL,
                'visivel' => true,
                'controladora' => 'Institucional',
                'acao' => 'index'
            ])
            ->orderBy('ordem', 'ASC')
            ->orderBy('id', 'DESC')
            ->limit(8)
            ->get()
            ->groupBy('conteudo_id')
            ->map(function (Collection $group) {
                return $group->take(4)->map(function ($imagem) {
                    return [
                        'id' => $imagem->id,
                        'imagem' => rafator('content/carousel/' . $imagem->imagem),
                    ];
                });
            });

        return Inertia::render('Institucional/index', [
            'vinhedos' => $vinhedos,
            'imagensGaleria' => $imagensGaleria,
        ]);
    }
    
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function historia() {
        $idioma = inertia()->getShared('idioma');

        $acontecimentos = Acontecimento::query()
            ->where([
                'excluido' => NULL,
                'visivel' => true
            ])
            ->with([
                'acontecimentosIdiomas' => function ($q) use ($idioma) {
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
            ->map(function($acontecimento) {
                return [
                    'id' => $acontecimento->id,
                    'ano' => $acontecimento->ano,
                    'imagem' => rafator('content/timeline/' . $acontecimento->imagem),
                    'titulo' => $acontecimento->acontecimentosIdiomas->isNotEmpty() ? $acontecimento->acontecimentosIdiomas[0]->titulo : null,
                    'descricao' => $acontecimento->acontecimentosIdiomas->isNotEmpty() ? $acontecimento->acontecimentosIdiomas[0]->descricao : null,
                ];
            });

        return Inertia::render('Institucional/historia', [
            'acontecimentos' => $acontecimentos,
        ]);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function sustentabilidade() {
        return Inertia::render('Institucional/sustentabilidade');
    }
};