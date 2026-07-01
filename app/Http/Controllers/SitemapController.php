<?php

namespace App\Http\Controllers;

use App\Models\Conteudo;
use App\Models\Linha;
use App\Models\Pagina;
use App\Models\Produto;
use Illuminate\Support\Facades\Route;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;

class SitemapController
{
    public function __invoke()
    {
        $sitemap = Sitemap::create();

        $paginas = Pagina::query()
            ->where('excluido', null)
            ->get();

        foreach ($paginas as $pagina) {
            $route = $pagina->controladora . '.' . $pagina->acao;

            $ultimaModificacao = Conteudo::query()
                ->where([
                    'excluido' => NULL,
                    'controladora' => $pagina->controladora,
                    'acao' => $pagina->acao
                ])
                ->orderByDesc('modificado')
                ->first();;

            if (
                Route::has($route) &&
                $pagina->acao !== 'enviar' &&
                $pagina->acao !== 'linha' &&
                $pagina->acao !== 'produto' &&
                $pagina->acao !== 'download'
            ) {
                $sitemap->add(
                    Url::create(route($route))
                        ->setLastModificationDate(
                            $ultimaModificacao->modificado ?? $ultimaModificacao->criado ?? $pagina->modificado ?? $pagina->criado
                        )
                        ->setPriority(($pagina->controladora === 'Politicas' || $pagina->controladora === 'Manual') ? 0.3 : 1.0)
                );
            }
        }

        Linha::query()
            ->where([
                'excluido' => null,
                'visivel' => true
            ])
            ->get()
            ->each(function ($item) use ($sitemap) {
                $sitemap->add(
                    Url::create(
                        route('Linhas.linha', [
                            'slug' => $item->slug,
                        ])
                    )
                        ->setLastModificationDate($item->modificado ?? $item->criado)
                        ->setPriority(0.6)
                );
            });

        Produto::query()
            ->where([
                'excluido' => null,
                'visivel' => true
            ])
            ->get()
            ->each(function ($item) use ($sitemap) {
                $sitemap->add(
                    Url::create(
                        route('Produtos.produto', [
                            'slug' => $item->slug,
                        ])
                    )
                        ->setLastModificationDate($item->modificado ?? $item->criado)
                        ->setPriority(0.6)
                );
            });

        return $sitemap;
    }
}
