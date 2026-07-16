<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\Vinhedo;
use App\Models\Acontecimento;

use Carbon\Carbon;

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
                'excluido' => NULL
            ])
            ->with([
                'vinhedosIdiomas' => function ($q) {
                    $q->whereHas('idiomas', function ($r) {
                        $r->Where('padrao', true);
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
                    'visivel' => $vinhedo->visivel,
                    'imagem' => rafator('content/vineyards/banner/d/' . $vinhedo->banner),
                    'nome' => $vinhedo->vinhedosIdiomas->isNotEmpty() ? $vinhedo->vinhedosIdiomas[0]->nome : null,
                ];
            });

        return Inertia::render('Manager/Institucional/index', [
            'vinhedos' => $vinhedos
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
                'excluido' => NULL
            ])
            ->with([
                'acontecimentosIdiomas' => function ($q) {
                    $q->whereHas('idiomas', function ($r) {
                        $r->Where('padrao', true);
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
                    'visivel' => $acontecimento->visivel,
                    'imagem' => rafator('content/timeline/' . $acontecimento->imagem),
                    'nome' => $acontecimento->ano,
                ];
            });

        return Inertia::render('Manager/Institucional/historia', [
            'acontecimentos' => $acontecimentos
        ]);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function sustentabilidade() {
        return Inertia::render('Manager/Institucional/sustentabilidade');
    }
};