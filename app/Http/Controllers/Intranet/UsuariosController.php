<?php

namespace App\Http\Controllers\Intranet;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class UsuariosController extends Controller
{
    /**
     * Exibe a página de login
     */
    public function login()
    {
        if (Auth::guard('intranet')->check()) {
            return redirect()->route('Intranet.index');
        }

        return Inertia::render('Intranet/Login');
    }

    /**
     * Processa o login do usuário
     */
    public function authenticate(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
            'remember' => 'boolean'
        ], [
            'email.required' => 'O campo email é obrigatório.',
            'email.email' => 'Por favor, informe um email válido.',
            'password.required' => 'O campo senha é obrigatório.'
        ]);

        $credentials = $request->only('email', 'password');
        $remember = $request->boolean('remember');

        if (Auth::guard('intranet')->attempt($credentials, $remember)) {
            $request->session()->regenerate();
            
            return redirect()->intended(route('Intranet.index'));
        }

        return back()->with(['message' => [
                'type' => 'error',
                'message' => 'E-mail ou senha inválidos.'
            ]
        ]);
    }

    public function logout(Request $request)
    {
        Auth::guard('intranet')->logout();
        
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        
        return redirect()->route('Intranet.Usuarios.login');
    }
}