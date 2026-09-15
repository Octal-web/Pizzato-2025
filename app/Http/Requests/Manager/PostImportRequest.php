<?php

namespace App\Http\Requests\Manager;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PostImportRequest extends FormRequest
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
            'pais' => ['required', 'string', 'max:72', Rule::in(array_column(
                json_decode(file_get_contents(resource_path('data/import-countries.json')), true, 512, JSON_THROW_ON_ERROR),
                'name'
            ))],
            'descricao' => 'required',
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
            'pais.required' => 'Por favor, informe o país.',
            'pais.max' => 'O país deve ter no máximo 72 caracteres.',
            'pais.in' => 'Por favor, selecione um país válido da lista.',
            'descricao.required' => 'Por favor, informe a descrição.',
        ];
    }
}
