<?php

namespace App\Http\Requests\Manager;

use Illuminate\Foundation\Http\FormRequest;

class PostGeneralDataRequest extends FormRequest
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
            'endereco'  => 'required',
            'cep'  => 'required|formato_cep',
            'telefones' => 'required|max:46',
            'instagram' => 'nullable|url',
            'facebook' => 'nullable|url',
            'link_mapa' => 'required|url',
            'link_loja' => 'required|url',
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
            'endereco.required' => 'Por favor, informe o endereço.',
            'cep.required' => 'Por favor, informe o CEP.',
            'cep.formato_cep' => 'Por favor, informe um CEP válido.',
            'telefones.required' => 'Por favor, informe o telefone.',
            'telefones.max' => 'Os telefones devem ter no máximo 46 caracteres.',
            'instagram.url' => 'Por favor, informe um link de instagram válido.',
            'facebook.url' => 'Por favor, informe um link de facebook válido.',
            'link_mapa.url' => 'Por favor, informe um link do Google Maps válido.',
            'link_mapa.required' => 'Por favor, informe o link para o Google Maps.',
            'link_loja.url' => 'Por favor, informe um link para loja virtual.',
            'link_loja.required' => 'Por favor, informe o link para a loja virtual.',
        ];
    }
}
