<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use App\Models\Contato;
use App\Models\Newsletter;
use App\Models\Departamento;
use App\Models\Parceiro;

use Illuminate\Http\Request;
use Inertia\Inertia;

use Carbon\Carbon;
use DeepCopy\DeepCopy;

class ContatoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index() {
        $idioma = inertia()->getShared('idioma');

        $contatos = Contato::query()
            ->where([
                'excluido' => NULL
            ])
            ->orderBy('criado', 'ASC')
            ->orderBy('id', 'DESC')
            ->get()
            ->map(function($contato) {
                return [
                    'id' => $contato->id,
                    'nome' => $contato->nome,
                    'data' => $contato->criado->format('d/m/Y'),
                ];
            });

        $newsletters = Newsletter::query()
            ->where([
                'excluido' => NULL
            ])
            ->orderBy('criado', 'ASC')
            ->orderBy('id', 'DESC')
            ->get()
            ->map(function($newsletter) {
                return [
                    'id' => $newsletter->id,
                    'nome' => $newsletter->email,
                    'data' => $newsletter->criado->format('d/m/Y'),
                ];
            });

        return Inertia::render('Manager/Contato/index', [
            'contatos' => $contatos,
            'newsletters' => $newsletters,
        ]);
    }

    public function visualizar($id) {
        if (!$id) {
            return Inertia::location(route('Manager.Contato.index'));
        }
        
        $idioma = inertia()->getShared('idioma');

        $contato = Contato::query()
            ->where([
                'id' => $id,
                'excluido' => NULL,
            ])
            ->first();

        if(!$contato) {
            return Inertia::location(route('Manager.Contato.index'));
        }

        $contato = [
            'id' => $contato->id,
            'nome' => $contato->nome,
            'email' => $contato->email,
            'telefone' => $contato->telefone,
            'area' => $contato->area,
            'mensagem' => $contato->mensagem,
            'data' => $contato->criado->format('d/m/Y H:i')
        ];

        return Inertia::render('Manager/Contato/visualizar', [
            'contato' => $contato
        ]);
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

            $exclusao = Contato::query()
                ->where([
                    'excluido' => NULL,
                    'id' => $id
                ])
                ->update([
                    'excluido' => Carbon::now()
                ]);

            if ($exclusao == true) {
                return redirect(route('Manager.Contato.index'))->with('message', ['type' => 'alert', 'msg' => 'Registro excluído com sucesso.']);
            } else {
                return redirect(route('Manager.Contato.index'))->with('message', ['type' => 'error', 'msg' => 'Não foi possível excluir o registro.']);
            }
        }
    }
}