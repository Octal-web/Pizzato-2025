<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;

use App\Models\Experiencia;
use App\Models\ExperienciaIdioma;
use App\Models\Idioma;

use Illuminate\Http\Request;
use Inertia\Inertia;

class EnoturismoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index() {
        $experiencias = Experiencia::query()
            ->where([
                'excluido' => NULL
            ])
            ->with([
                'experienciasIdiomas' => function ($q) {
                    $q->whereHas('idiomas', function ($r) {
                        $r->Where('padrao', true);
                    })
                    ->orderBy('idioma_id', 'DESC');
                }
            ])
            ->orderBy('ordem', 'ASC')
            ->orderBy('id', 'DESC')
            ->get()
            ->map(function($experiencia) {
                return [
                    'id' => $experiencia->id,
                    'visivel' => $experiencia->visivel,
                    'imagem' => rafator('content/experiences/' . $experiencia->imagem),
                    'nome' => $experiencia->experienciasIdiomas->isNotEmpty() ? $experiencia->experienciasIdiomas[0]->nome : null,
                ];
            });

        return Inertia::render('Manager/Enoturismo/index', [
            'experiencias' => $experiencias
        ]);
    }
};