<?php

namespace App\Http\Requests\Manager;

use Illuminate\Foundation\Http\FormRequest;

class PostProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules()
    {  
        return [
            'nome' => 'required|string|max:120',
            'linha_id' => 'required|exists:linhas,id',
            'categoria_id' => 'required|exists:categorias,id',
            'link_loja' => 'nullable|url|max:255',
            'colheitas' => 'nullable|string|max:60',
            'descricao' => 'required|string|max:1080',
            'destaques' => 'nullable|string|max:1080',
            'destaque' => 'required|boolean',
            'produtos_volumes' => 'required|array|min:1',
            'img' => inertia()->getShared('action') == 'novo' ? 'required|image|mimes:png,jpg|max:2048' : 'nullable|image|mimes:png,jpg|max:2048',
            'img_bg' => inertia()->getShared('action') == 'novo' ? 'required|image|mimes:png,jpg|max:4096' : 'nullable|image|mimes:png,jpg|max:4096',
            'img_full' => inertia()->getShared('action') == 'novo' ? 'required|image|mimes:png,jpg|max:4096' : 'nullable|image|mimes:png,jpg|max:4096',
            // 'arq'   => 'nullable|mimes:pdf,doc,docx,xls,xlsx,ppt,pptx|max:51200',
            'titulo_pagina' => 'required|string|max:70',
            'descricao_pagina' => 'required|string|max:220',

            'arq' => 'nullable|array',
            'arq.*.id' => 'nullable|integer|exists:produtos_arquivos,id',
            // 'arq.*.titulo' => 'required_with:arq.*|string|max:30',
            'arq.*.arquivo' => 'nullable|file|mimes:pdf,doc,docx,xls,xlsx|max:10240',
            // 'arq.*._deleted' => 'nullable|boolean',
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages()
    {
        return [
            'nome.required' => 'Por favor, informe o nome.',
            'nome.max' => 'Por favor, informe um nome com até 120 caracteres.',
            'linha_id.required' => 'Por favor, selecione uma linha.',
            'linha_id.exists' => 'Por favor, selecione uma linha válida.',
            'categoria_id.required' => 'Por favor, selecione uma categoria.',
            'categoria_id.exists' => 'Por favor, selecione uma categoria válida.',
            'link_loja.url' => 'Por favor, informe uma URL válida.',
            'colheitas.max' => 'Por favor, informe as colheitas com até 60 caracteres.',
            'descricao.required' => 'Por favor, informe a descrição.',
            'descricao.max' => 'Por favor, informe uma descrição com até 1080 caracteres.',
            'destaques.max' => 'Por favor, informe os destaques com até 1080 caracteres.',
            'destaque.required' => 'Por favor, selecione se é destaque ou não.',
            'destaque.boolean' => 'Por favor, selecione uma opção válida para destaque.',

            'img.required' => 'Por favor, selecione uma imagem principal.',
            'img.image' => 'Por favor, selecione uma imagem válida.',
            'img.mimes' => 'Os formatos de imagem válidos são: JPG e PNG.',
            'img.max' => 'Por favor, envie um arquivo menor que 2MB.',

            'img_bg.required' => 'Por favor, selecione uma imagem de fundo.',
            'img_bg.image' => 'Por favor, selecione uma imagem de fundo válida.',
            'img_bg.mimes' => 'Os formatos de imagem de fundo válidos são: JPG e PNG.',
            'img_bg.max' => 'Por favor, envie uma imagem de fundo menor que 2MB.',

            'img_full.required' => 'Por favor, selecione uma imagem infinito.',
            'img_full.image' => 'Por favor, selecione uma imagem infinito válida.',
            'img_full.mimes' => 'Os formatos de imagem infinito válidos são: JPG e PNG.',
            'img_full.max' => 'Por favor, envie uma imagem infinito menor que 2MB.',

            // 'arq.required' => 'Por favor, selecione uma ficha técnica.',
            // 'arq.mimes' => 'Os formatos de arquivo válidos são: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX.',
            // 'arq.max' => 'Por favor, envie um arquivo menor que 50MB.',

            'produtos_volumes.required' => 'Por favor, selecione pelo menos um volume.',
            'produtos_volumes.array' => 'Os volumes devem ser enviadas como uma lista.',
            'produtos_volumes.min' => 'Selecione pelo menos um volume.',

            'titulo_pagina.required' => 'Por favor, informe o título da página.',
            'titulo_pagina.max' => 'Por favor, informe um título da página com até 70 caracteres.',
            'descricao_pagina.required' => 'Por favor, informe a descrição da página.',
            'descricao_pagina.max' => 'Por favor, informe uma descrição da página com até 220 caracteres.',

            'arq.array' => 'Por favor, envie os arquivos em formato de lista.',
            'arq.*.id.integer' => 'O ID do arquivo deve ser um número válido.',
            'arq.*.id.exists' => 'Algum dos arquivos selecionados não foi encontrado.',

            'arq.*.titulo.required_with' => 'Por favor, informe o título para cada arquivo enviado.',
            'arq.*.titulo.string' => 'O título do arquivo deve ser um texto válido.',
            'arq.*.titulo.max' => 'O título do arquivo deve ter no máximo 30 caracteres.',

            'arq.*.arquivo.file' => 'Por favor, envie um arquivo válido.',
            'arq.*.arquivo.mimes' => 'Os arquivos devem ser PDF, DOC, DOCX, XLS ou XLSX.',
            'arq.*.arquivo.max' => 'Cada arquivo deve ter no máximo 10MB.',

            'arq.*._deleted.boolean' => 'O campo de remoção do arquivo deve ser verdadeiro ou falso.',
        ];
    }
}