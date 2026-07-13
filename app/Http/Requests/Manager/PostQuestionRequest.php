<?php

namespace App\Http\Requests\Manager;

use Illuminate\Foundation\Http\FormRequest;

class PostQuestionRequest extends FormRequest
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
            'titulo' => 'required|min:5|max:255',
            'texto' => 'required|min:5|max:500',
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
            'titulo.required' => 'Por favor, informe a pergunta.',
            'titulo.min' => 'A pergunta deve ter no mínimo 5 caracteres.',
            'titulo.max' => 'A pergunta deve ter no máximo 255 caracteres.',
            'texto.required' => 'Por favor, informe a resposta.',
            'texto.min' => 'A resposta deve ter no mínimo 5 caracteres.',
            'texto.max' => 'A resposta deve ter no máximo 255 caracteres.',

        ];
    }
}
