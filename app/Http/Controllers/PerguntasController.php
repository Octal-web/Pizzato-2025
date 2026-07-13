<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\Pergunta;

class PerguntasController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index() {
        $idioma = inertia()->getShared('idioma');

        $perguntas = Pergunta::query()
            ->where([
                'excluido' => NULL,
                'visivel' => true
            ])
            ->with([
                'perguntasIdiomas' => function ($q) use ($idioma) {
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
            ->map(function($pergunta) {
                return [
                    'id' => $pergunta->id,
                    'titulo' => count($pergunta->perguntasIdiomas) ? $pergunta->perguntasIdiomas[0]->titulo : null,
                    'texto' => count($pergunta->perguntasIdiomas) ? $pergunta->perguntasIdiomas[0]->texto : null,
                ];
            });

        return Inertia::render('Perguntas/index', [
            'perguntas' => $perguntas,
        ]);
    }
};