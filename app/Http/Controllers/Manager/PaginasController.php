<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use App\Models\Pagina;
use App\Models\PaginaIdioma;

use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;

use DeepCopy\DeepCopy;

class PaginasController extends Controller
{
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function editarAction(Request $request, $id) {
        if($request->ajax()){
            $request->validate([
                'paginasIdiomas.0.titulo' => 'required|max:60',
                'paginasIdiomas.0.descricao' => 'required|max:300',
                'paginasIdiomas.0.titulo_compartilhamento' => 'required|max:60',
                'paginasIdiomas.0.descricao_compartilhamento' => 'required|max:300',
                'img' => 'nullable|image|mimes:png,jpg|max:2048',
            ],
            [
                'paginasIdiomas.0.titulo.required' => 'Por favor, informe o título.',
                'paginasIdiomas.0.titulo.max' => 'O título da página deve conter no máximo 60 caracteres.',
                'paginasIdiomas.0.descricao.required' => 'Por favor, informe a descrição da página.',
                'paginasIdiomas.0.descricao.max' => 'A descrição da página deve conter no máximo 300 caracteres.',
                'paginasIdiomas.0.titulo_compartilhamento.required' => 'Por favor, informe o título exibido ao compartilhar.',
                'paginasIdiomas.0.titulo_compartilhamento.max' => 'O título exibido ao compartilhar deve conter no máximo 60 caracteres.',
                'paginasIdiomas.0.descricao_compartilhamento.required' => 'Por favor, informe a descrição exibida ao compartilhar.',
                'paginasIdiomas.0.descricao_compartilhamento.max' => 'A descrição exibida ao compartilhar deve conter no máximo 300 caracteres.',
                'img.image' => 'Por favor, selecione uma imagem válida.',
                'img.mimes' => 'Os formatos de imagem válidos são: JPG e PNG.',
                'img.max' => 'Por favor, envie um arquivo menor que 2MB.',
            ]);

            $pagina = Pagina::query()
                ->where([
                    'id' => $id
                ])
                ->first();

            $idioma = $request->query('lang');

            $pagina_idioma = PaginaIdioma::query()
                ->where([
                    'excluido' => null,
                    'pagina_id' => $pagina->id
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

            if (!$pagina) {
                return response()->json(['msg' => 'Não foi possível salvar as informações. Tente novamente mais tarde.', 'type' => 'error', 'title' => 'Oops...', 'url' => false]);
            }

            $idioma = $this->getLanguages($pagina, 'PaginasIdiomas', $idioma);

            if (!$idioma) {
                if ($request->ajax()) {
                    return response()->json(['msg' => 'Não foi possível salvar as informações. Tente novamente mais tarde.', 'type' => 'error', 'title' => 'Oops...', 'url' => false]);
                }
                return redirect()->route('Manager.Home.index');
            }

            if (!$pagina_idioma) {
                $pagina_idioma = new PaginaIdioma;

                $pagina_idioma->pagina_id = $pagina->id;
                $pagina_idioma->idioma_id = $idioma;
            }
            
            $copier = new DeepCopy();
            $paginaOriginal = $copier->copy($pagina);

            $pagina_idioma->titulo = $request['paginasIdiomas'][0]['titulo'];
            $pagina_idioma->descricao = $request['paginasIdiomas'][0]['descricao'];
            $pagina_idioma->titulo_compartilhamento = $request['paginasIdiomas'][0]['titulo_compartilhamento'];
            $pagina_idioma->descricao_compartilhamento = $request['paginasIdiomas'][0]['descricao_compartilhamento'];

            if ($request->file('img') && $request->file('img')->getError() == 0) {
                $pagina->imagem = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('img')->extension());
            }

            $response = $pagina->save();
            $response = $pagina_idioma->save();

            if ($response) {
                if ($request->file('img') && $request->file('img')->getError() == 0) {
                    if ($pagina->imagem && File::exists(public_path('content/pages/') . $paginaOriginal->imagem)) {
                        File::delete(public_path('content/pages/') . $paginaOriginal->imagem);
                    }

                    $image = $request->file('img')->move(public_path('content/pages/'), $pagina->imagem);
                }

                return redirect()->back()->with('message', ['type' => 'success', 'msg' => 'Registro salvo com sucesso!']);
            }

            return redirect()->back()->with('message', ['type' => 'error', 'msg' => 'Não foi possível salvar as informações. Tente novamente mais tarde.']);
        }

        return redirect()->route('Usuarios.ShowLoginForm');
    }
}