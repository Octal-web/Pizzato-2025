<?php

namespace App\Http\Requests\Manager;

use Illuminate\Foundation\Http\FormRequest;

class PostVineyardRequest extends FormRequest
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
            'nome'  => 'required',
            'subtitulo'  => 'required',
            'descricao'  => 'required',
            'localizacao'  => 'required',
            'composicao_solo'  => 'required',
            'clima'  => 'required',
            'arquitetura'  => 'required',
            'img' => inertia()->getShared('action') === 'novo' ? 'required|image|mimes:png,jpg|max:2048' : 'nullable|image|mimes:png,jpg|max:2048',
            'img_mobile' => inertia()->getShared('action') === 'novo' ? 'required|image|mimes:png,jpg|max:2048' : 'nullable|image|mimes:png,jpg|max:2048',
            
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
            'subtitulo.required' => 'Por favor, informe o subtítulo.',
            'descricao.required' => 'Por favor, informe a descrição.',
            'localizacao.required' => 'Por favor, informe a localização.',
            'composicao_solo.required' => 'Por favor, informe a composição do solo.',
            'clima.required' => 'Por favor, informe o clima.',
            'arquitetura.required' => 'Por favor, informe a arquitetura.',

            'img.required' => 'Por favor, selecione um banner.',
            'img.image' => 'Por favor, selecione um banner válido.',
            'img.mimes' => 'Os formatos de banner válidos são: JPG e PNG.',
            'img.max' => 'Por favor, envie um arquivo menor que 2MB.',

            'img_mobile.required' => 'Por favor, selecione um banner mobile.',
            'img_mobile.image' => 'Por favor, selecione um banner mobile válido.',
            'img_mobile.mimes' => 'Os formatos de banner mobile válidos são: JPG e PNG.',
            'img_mobile.max' => 'Por favor, envie um arquivo menor que 2MB.',
        ];
    }
}