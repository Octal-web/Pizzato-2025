<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\Experiencia;

class EnoturismoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index() {
        $idioma = inertia()->getShared('idioma');

        $experiencias = Experiencia::query()
            ->where([
                'excluido' => NULL,
                'visivel' => true
            ])
            ->with([
                'experienciasIdiomas' => function ($q) use ($idioma) {
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
            ->map(function($experiencia) {
                return [
                    'id' => $experiencia->id,
                    'imagem' => $experiencia->imagem,
                    'nome' => $experiencia->experienciasIdiomas->isNotEmpty() ? $experiencia->experienciasIdiomas[0]->nome : null,
                    'subtitulo' => $experiencia->experienciasIdiomas->isNotEmpty() ? $experiencia->experienciasIdiomas[0]->subtitulo : null,
                    'descricao' => $experiencia->experienciasIdiomas->isNotEmpty() ? $experiencia->experienciasIdiomas[0]->descricao : null,
                ];
            });

        return Inertia::render('Enoturismo/index', [
            'experiencias' => $experiencias,
        ]);
    }
};