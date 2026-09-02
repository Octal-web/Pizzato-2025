<?php

namespace App\Http\Controllers\Manager;

use App\Http\Controllers\Controller;
use App\Models\Arquivo;
use App\Models\ArquivoIdioma;
use App\Models\Categoria;
use App\Models\CategoriaIdioma;
use App\Models\Idioma;
use App\Models\Linha;
use App\Models\LinhaIdioma;
use App\Models\Produto;
use App\Models\ProdutoIdioma;
use App\Models\Volume;
use App\Models\VolumeIdioma;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;

class ProdutosController extends Controller
{
    protected function getLanguages($language = null)
    {
        $lang = $language ?? request()->get('lang', 'pt');
        $idioma = Idioma::where('codigo', $lang)->first();
        return $idioma ? $idioma->id : 1;
    }

    public function index()
    {
        $idiomaId = $this->getLanguages();
        $idioma = Idioma::find($idiomaId);
        $idiomas = Idioma::whereNull('excluido')->get();

        $produtos = Produto::whereNull('excluido')
            ->with(['idiomas' => function ($query) use ($idiomaId) {
                $query->where('idioma_id', $idiomaId);
            }])
            ->orderBy('ordem', 'asc')
            ->get()
            ->map(function ($produto) {
                $idioma = $produto->idiomas->first();
                return [
                    'id' => $produto->id,
                    'nome' => $idioma ? $idioma->nome : '',
                    'ordem' => $produto->ordem,
                ];
            });

        return Inertia::render('Manager/Produtos/Index', [
            'idioma' => $idioma,
            'idiomas' => $idiomas,
            'produtos' => $produtos,
        ]);
    }

    public function criar()
    {
        $idiomaId = $this->getLanguages();
        $idioma = Idioma::find($idiomaId);
        $idiomas = Idioma::whereNull('excluido')->get();

        $volumes = Volume::whereNull('excluido')
            ->with(['idiomas' => function ($query) use ($idiomaId) {
                $query->where('idioma_id', $idiomaId);
            }])
            ->get()
            ->map(function ($volume) {
                $idioma = $volume->idiomas->first();
                return [
                    'value' => $volume->id,
                    'label' => $idioma ? $idioma->titulo : '',
                ];
            });

        $linhas = Linha::whereNull('excluido')
            ->with(['idiomas' => function ($query) use ($idiomaId) {
                $query->where('idioma_id', $idiomaId);
            }])
            ->get()
            ->map(function ($linha) {
                $idioma = $linha->idiomas->first();
                return [
                    'value' => $linha->id,
                    'label' => $idioma ? $idioma->titulo : '',
                ];
            });

        $categorias = Categoria::whereNull('excluido')
            ->with(['idiomas' => function ($query) use ($idiomaId) {
                $query->where('idioma_id', $idiomaId);
            }])
            ->get()
            ->map(function ($categoria) {
                $idioma = $categoria->idiomas->first();
                return [
                    'value' => $categoria->id,
                    'label' => $idioma ? $idioma->titulo : '',
                ];
            });

        return Inertia::render('Manager/Produtos/Criar', [
            'idioma' => $idioma,
            'idiomas' => $idiomas,
            'volumes' => $volumes,
            'linhas' => $linhas,
            'categorias' => $categorias,
        ]);
    }

    public function salvar(Request $request)
    {
        $idiomaId = $this->getLanguages();

        $request->validate([
            'nome' => 'required|max:120',
            'link_loja' => 'nullable|url',
        ], [
            'nome.required' => 'O campo Nome é obrigatório.',
            'nome.max' => 'O campo Nome deve ter no máximo 120 caracteres.',
            'link_loja.url' => 'O campo Link Loja deve ser uma URL válida.',
        ]);

        DB::beginTransaction();

        try {
            $produto = new Produto();
            $produto->linha_id = $request->input('linha_id');
            $produto->categoria_id = $request->input('categoria_id');
            $produto->colheitas = $request->input('colheitas');
            $produto->destaque = $request->input('destaque', false);

            if ($request->hasFile('img') && $request->file('img')->isValid()) {
                $nomeImagem = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('img')->extension());
                $request->file('img')->move(public_path('content/products/files/'), $nomeImagem);
                $produto->imagem = $nomeImagem;
            }

            if ($request->hasFile('img_bg') && $request->file('img_bg')->isValid()) {
                $nomeImagemBg = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('img_bg')->extension());
                $request->file('img_bg')->move(public_path('content/products/files/'), $nomeImagemBg);
                $produto->imagem_fundo = $nomeImagemBg;
            }

            if ($request->hasFile('img_full') && $request->file('img_full')->isValid()) {
                $nomeImagemFull = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('img_full')->extension());
                $request->file('img_full')->move(public_path('content/products/files/'), $nomeImagemFull);
                $produto->imagem_infinito = $nomeImagemFull;
            }

            $produto->save();

            $produtoIdioma = new ProdutoIdioma();
            $produtoIdioma->produto_id = $produto->id;
            $produtoIdioma->idioma_id = $idiomaId;
            $produtoIdioma->nome = $request->input('nome');
            $produtoIdioma->link_loja = $request->input('link_loja');
            $produtoIdioma->descricao = $request->input('descricao');
            $produtoIdioma->destaques = $request->input('destaques');
            $produtoIdioma->titulo_pagina = $request->input('titulo_pagina');
            $produtoIdioma->descricao_pagina = $request->input('descricao_pagina');
            $produtoIdioma->save();

            if ($request->has('produtos_volumes')) {
                $volumes = $request->input('produtos_volumes');
                if (is_array($volumes)) {
                    $produto->volumes()->sync($volumes);
                }
            }

            // Processamento dos arquivos
            $arquivosData = $request->input('arq', []);
            if (is_array($arquivosData) && count($arquivosData) > 0) {
                foreach ($arquivosData as $index => $arquivoData) {
                    if (isset($arquivoData['_deleted']) && $arquivoData['_deleted']) {
                        continue;
                    }

                    $arquivoFile = $request->file("arq.{$index}.arquivo");
                    $titulo = $arquivoData['titulo'] ?? '';

                    if ($arquivoFile && $arquivoFile->isValid()) {
                        $nomeArquivo = md5(uniqid((string) rand(), true)) . '.' . strtolower($arquivoFile->extension());
                        $arquivoFile->move(public_path('content/products/files/'), $nomeArquivo);

                        $novoArquivo = new Arquivo();
                        $novoArquivo->produto_id = $produto->id;
                        $novoArquivo->arquivo = $nomeArquivo;
                        $novoArquivo->ordem = $index + 1;
                        $novoArquivo->save();

                        $arquivoIdioma = new ArquivoIdioma();
                        $arquivoIdioma->arquivo_id = $novoArquivo->id;
                        $arquivoIdioma->idioma_id = $idiomaId;
                        $arquivoIdioma->titulo = $titulo;
                        $arquivoIdioma->save();
                    }
                }
            }

            DB::commit();

            return redirect()->route('Manager.Produtos.index', ['lang' => request()->get('lang', 'pt')])
                ->with('success', 'Produto criado com sucesso!');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Erro ao salvar o produto: ' . $e->getMessage()]);
        }
    }

    public function editar($id)
    {
        $idiomaId = $this->getLanguages();
        $idioma = Idioma::find($idiomaId);
        $idiomas = Idioma::whereNull('excluido')->get();

        $produto = Produto::where('id', $id)
            ->whereNull('excluido')
            ->with(['idiomas' => function ($query) use ($idiomaId) {
                $query->where('idioma_id', $idiomaId);
            }, 'volumes', 'arquivos' => function ($query) use ($idiomaId) {
                $query->whereNull('excluido')
                    ->with(['idiomas' => function ($q) use ($idiomaId) {
                        $q->where('idioma_id', $idiomaId)->whereNull('excluido');
                    }])
                    ->orderBy('ordem', 'asc');
            }])
            ->firstOrFail();

        $produtoIdioma = $produto->idiomas->first();

        $volumes = Volume::whereNull('excluido')
            ->with(['idiomas' => function ($query) use ($idiomaId) {
                $query->where('idioma_id', $idiomaId);
            }])
            ->get()
            ->map(function ($volume) {
                $idioma = $volume->idiomas->first();
                return [
                    'value' => $volume->id,
                    'label' => $idioma ? $idioma->titulo : '',
                ];
            });

        $linhas = Linha::whereNull('excluido')
            ->with(['idiomas' => function ($query) use ($idiomaId) {
                $query->where('idioma_id', $idiomaId);
            }])
            ->get()
            ->map(function ($linha) {
                $idioma = $linha->idiomas->first();
                return [
                    'value' => $linha->id,
                    'label' => $idioma ? $idioma->titulo : '',
                ];
            });

        $categorias = Categoria::whereNull('excluido')
            ->with(['idiomas' => function ($query) use ($idiomaId) {
                $query->where('idioma_id', $idiomaId);
            }])
            ->get()
            ->map(function ($categoria) {
                $idioma = $categoria->idiomas->first();
                return [
                    'value' => $categoria->id,
                    'label' => $idioma ? $idioma->titulo : '',
                ];
            });

        $produtoFormatted = [
            'id' => $produto->id,
            'linha_id' => $produto->linha_id,
            'categoria_id' => $produto->categoria_id,
            'colheitas' => $produto->colheitas,
            'destaque' => (bool) $produto->destaque,
            'imagem' => $produto->imagem ? asset('content/products/files/' . $produto->imagem) : null,
            'imagem_fundo' => $produto->imagem_fundo ? asset('content/products/files/' . $produto->imagem_fundo) : null,
            'imagem_infinito' => $produto->imagem_infinito ? asset('content/products/files/' . $produto->imagem_infinito) : null,
            'nome' => $produtoIdioma ? $produtoIdioma->nome : '',
            'link_loja' => $produtoIdioma ? $produtoIdioma->link_loja : '',
            'descricao' => $produtoIdioma ? $produtoIdioma->descricao : '',
            'destaques' => $produtoIdioma ? $produtoIdioma->destaques : '',
            'titulo_pagina' => $produtoIdioma ? $produtoIdioma->titulo_pagina : '',
            'descricao_pagina' => $produtoIdioma ? $produtoIdioma->descricao_pagina : '',
            'produtos_volumes' => $produto->volumes->pluck('id')->toArray(),
            'arquivos' => $produto->arquivos->map(function ($arquivo) {
                $arquivoIdioma = $arquivo->idiomas->first();
                return [
                    'id' => $arquivo->id,
                    'titulo' => $arquivoIdioma ? $arquivoIdioma->titulo : '',
                    'arquivo' => asset('content/products/files/' . $arquivo->arquivo),
                ];
            }),
        ];

        return Inertia::render('Manager/Produtos/Editar', [
            'idioma' => $idioma,
            'idiomas' => $idiomas,
            'produto' => $produtoFormatted,
            'volumes' => $volumes,
            'linhas' => $linhas,
            'categorias' => $categorias,
        ]);
    }

    public function atualizar(Request $request, $id)
    {
        $idiomaId = $this->getLanguages();

        $produto = Produto::where('id', $id)->whereNull('excluido')->firstOrFail();

        $request->validate([
            'nome' => 'required|max:120',
            'link_loja' => 'nullable|url',
        ], [
            'nome.required' => 'O campo Nome é obrigatório.',
            'nome.max' => 'O campo Nome deve ter no máximo 120 caracteres.',
            'link_loja.url' => 'O campo Link Loja deve ser uma URL válida.',
        ]);

        DB::beginTransaction();

        try {
            $produto->linha_id = $request->input('linha_id');
            $produto->categoria_id = $request->input('categoria_id');
            $produto->colheitas = $request->input('colheitas');
            $produto->destaque = $request->input('destaque', false);

            if ($request->hasFile('img') && $request->file('img')->isValid()) {
                if ($produto->imagem && File::exists(public_path('content/products/files/' . $produto->imagem))) {
                    File::delete(public_path('content/products/files/' . $produto->imagem));
                }
                $nomeImagem = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('img')->extension());
                $request->file('img')->move(public_path('content/products/files/'), $nomeImagem);
                $produto->imagem = $nomeImagem;
            }

            if ($request->hasFile('img_bg') && $request->file('img_bg')->isValid()) {
                if ($produto->imagem_fundo && File::exists(public_path('content/products/files/' . $produto->imagem_fundo))) {
                    File::delete(public_path('content/products/files/' . $produto->imagem_fundo));
                }
                $nomeImagemBg = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('img_bg')->extension());
                $request->file('img_bg')->move(public_path('content/products/files/'), $nomeImagemBg);
                $produto->imagem_fundo = $nomeImagemBg;
            }

            if ($request->hasFile('img_full') && $request->file('img_full')->isValid()) {
                if ($produto->imagem_infinito && File::exists(public_path('content/products/files/' . $produto->imagem_infinito))) {
                    File::delete(public_path('content/products/files/' . $produto->imagem_infinito));
                }
                $nomeImagemFull = md5(uniqid((string) rand(), true)) . '.' . strtolower($request->file('img_full')->extension());
                $request->file('img_full')->move(public_path('content/products/files/'), $nomeImagemFull);
                $produto->imagem_infinito = $nomeImagemFull;
            }

            $produto->save();

            ProdutoIdioma::updateOrCreate(
                [
                    'produto_id' => $produto->id,
                    'idioma_id'  => $idiomaId
                ],
                [
                    'nome'             => $request->input('nome'),
                    'link_loja'        => $request->input('link_loja'),
                    'descricao'        => $request->input('descricao'),
                    'destaques'        => $request->input('destaques'),
                    'titulo_pagina'    => $request->input('titulo_pagina'),
                    'descricao_pagina' => $request->input('descricao_pagina')
                ]
            );

            if ($request->has('produtos_volumes')) {
                $volumes = $request->input('produtos_volumes');
                if (is_array($volumes)) {
                    $produto->volumes()->sync($volumes);
                }
            } else {
                $produto->volumes()->detach();
            }

            // Gerenciamento de Arquivos
            $arquivosData = $request->input('arq', []);
            $idsArquivosRecebidos = [];

            if (is_array($arquivosData) && count($arquivosData) > 0) {
                foreach ($arquivosData as $index => $arquivoData) {
                    if (isset($arquivoData['_deleted']) && $arquivoData['_deleted']) {
                        continue;
                    }

                    $arquivoId = !empty($arquivoData['id']) ? $arquivoData['id'] : null;
                    $titulo = $arquivoData['titulo'] ?? '';
                    $arquivoFile = $request->file("arq.{$index}.arquivo");

                    if ($arquivoId) {
                        $arquivo = Arquivo::query()
                            ->where([
                                'id' => $arquivoId,
                                'produto_id' => $produto->id,
                                'excluido' => null
                            ])
                            ->first();

                        if ($arquivo) {
                            if ($arquivoFile && $arquivoFile->isValid()) {
                                $arquivoOriginal = $arquivo->arquivo;
                                $novoNomeArquivo = md5(uniqid((string) rand(), true)) . '.' . strtolower($arquivoFile->extension());

                                $arquivoFile->move(public_path('content/products/files/'), $novoNomeArquivo);

                                if ($arquivoOriginal && File::exists(public_path('content/products/files/' . $arquivoOriginal))) {
                                    File::delete(public_path('content/products/files/' . $arquivoOriginal));
                                }

                                $arquivo->arquivo = $novoNomeArquivo;
                            }

                            $arquivo->ordem = $index + 1;
                            $arquivo->save();

                            ArquivoIdioma::updateOrCreate(
                                [
                                    'arquivo_id' => $arquivo->id,
                                    'idioma_id'  => $idiomaId,
                                    'excluido'   => null
                                ],
                                [
                                    'titulo'     => $titulo
                                ]
                            );

                            $idsArquivosRecebidos[] = $arquivo->id;
                        }
                    } else {
                        if ($arquivoFile && $arquivoFile->isValid()) {
                            $nomeArquivo = md5(uniqid((string) rand(), true)) . '.' . strtolower($arquivoFile->extension());
                            $arquivoFile->move(public_path('content/products/files/'), $nomeArquivo);

                            $novoArquivo = new Arquivo();
                            $novoArquivo->produto_id = $produto->id;
                            $novoArquivo->arquivo = $nomeArquivo;
                            $novoArquivo->ordem = $index + 1;
                            $novoArquivo->save();

                            $arquivoIdioma = new ArquivoIdioma();
                            $arquivoIdioma->arquivo_id = $novoArquivo->id;
                            $arquivoIdioma->idioma_id = $idiomaId;
                            $arquivoIdioma->titulo = $titulo;
                            $arquivoIdioma->save();

                            $idsArquivosRecebidos[] = $novoArquivo->id;
                        }
                    }
                }
            }

            Arquivo::query()
                ->where([
                        'produto_id' => $produto->id,
                        'excluido' => null
                ])
                ->whereNotIn('id', $idsArquivosRecebidos)
                ->update(['excluido' => now()]);

            DB::commit();

            return redirect()->route('Manager.Produtos.index', ['lang' => request()->get('lang', 'pt')])
                ->with('success', 'Produto atualizado com sucesso!');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Erro ao atualizar o produto: ' . $e->getMessage()]);
        }
    }

    public function baixarArquivo($produtoId, $id)
    {
        $arquivo = Arquivo::where('id', $id)
            ->where('produto_id', $produtoId)
            ->whereNull('excluido')
            ->firstOrFail();

        $filePath = public_path('content/products/files/' . $arquivo->arquivo);

        if (!File::exists($filePath)) {
            abort(404, 'Arquivo não encontrado.');
        }

        return response()->download($filePath);
    }
}
