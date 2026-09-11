<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\Importacao;

class ImportacoesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $idioma = inertia()->getShared('idioma');

        $importacoes = Importacao::query()
            ->where([
                'excluido' => NULL,
                'visivel' => true
            ])
            ->with([
                'importacoesIdiomas' => function ($q) use ($idioma) {
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
            ->map(function ($importacao) {
                return [
                    'id' => $importacao->id,
                    'imagem' => $importacao->imagem,
                    'pais' => $importacao->importacoesIdiomas->isNotEmpty()
                        ? $importacao->importacoesIdiomas[0]->pais
                        : null,
                    'cidades' => $importacao->importacoesIdiomas->isNotEmpty()
                        ? $importacao->importacoesIdiomas[0]->cidades
                        : null,
                    'descricao' => $importacao->importacoesIdiomas->isNotEmpty()
                        ? $importacao->importacoesIdiomas[0]->descricao
                        : null,
                ];
            });

        return Inertia::render('Importacoes/index', [
            'importacoes' => $importacoes,
        ]);
    }
}