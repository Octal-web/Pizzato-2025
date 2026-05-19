<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use App\Models\Newsletter;

use Illuminate\Http\Request;
use Inertia\Inertia;

use Carbon\Carbon;
use DeepCopy\DeepCopy;

class NewsletterController extends Controller
{
    public function visualizar($id) {
        if (!$id) {
            return Inertia::location(route('Manager.Contato.index'));
        }
        
        $newsletter = Newsletter::query()
            ->where([
                'id' => $id,
                'excluido' => NULL,
            ])
            ->first();

        if(!$newsletter) {
            return Inertia::location(route('Manager.Contato.index'));
        }

        $newsletter = [
            'id' => $newsletter->id,
            'email' => $newsletter->email,
            'data' => $newsletter->criado->format('d/m/Y H:i')
        ];

        return Inertia::render('Manager/Newsletter/visualizar', [
            'newsletter' => $newsletter
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

            $exclusao = Newsletter::query()
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