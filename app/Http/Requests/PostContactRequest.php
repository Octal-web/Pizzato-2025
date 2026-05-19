<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PostContactRequest extends FormRequest
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
            'nome' => 'required',
            'email' => 'required|email',
            'telefone' => 'required|celular_com_ddd',
            'assunto'  => 'required',
            'mensagem' => 'required',
            'politica' => 'required|accepted',
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
            'nome.required' => __('default.nome_required'),
            'email.required' => __('default.email_required'),
            'email.email' => __('default.email_email'),
            'telefone.required' => __('default.telefone_required'),
            'telefone.celular_com_ddd' => __('default.telefone_valido'),
            'assunto.required' => __('default.assunto_required'),
            'mensagem.required' => __('default.mensagem_required'),
            'politica.required' => __('default.politica_required'),
            'politica.accepted' => __('default.politica_accepted'),
        ];
    }
}