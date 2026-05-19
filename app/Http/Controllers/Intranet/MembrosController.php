<?php

namespace App\Http\Controllers\Intranet;

use App\Http\Controllers\Controller;
use App\Models\IntranetUsuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class MembrosController extends Controller
{
    protected $usuario;

    public function __construct()
    {
        $this->usuario = Auth::guard('intranet')->user();

        if (!$this->usuario || !$this->usuario->admin) {
            abort(403, 'Acesso negado. Apenas administradores podem acessar esta área.');
        }
    }

    /**
     * Display a listing of the users.
     */
    public function index(Request $request)
    {
        $query = IntranetUsuario::query();

        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('nome', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->filled('admin_filter')) {
            $adminFilter = $request->get('admin_filter');
            if ($adminFilter === 'admin') {
                $query->where('admin', true);
            } elseif ($adminFilter === 'user') {
                $query->where('admin', false);
            }
        }

        $sortBy = $request->get('sort', 'nome');
        $sortDirection = $request->get('direction', 'asc');
        
        if (in_array($sortBy, ['nome', 'email', 'admin', 'criado', 'modificado'])) {
            $query->orderBy($sortBy, $sortDirection);
        }

        $usuarios = $query->paginate(15)->withQueryString();

        return Inertia::render('Intranet/Usuarios/Index', [
            'usuarios' => $usuarios,
            'filters' => $request->only(['search', 'admin_filter', 'sort', 'direction'])
        ]);
    }

    /**
     * Show the form for creating a new user.
     */
    public function adicionar()
    {
        return Inertia::render('Intranet/Usuarios/Add');
    }

    /**
     * Store a newly created user in storage.
     */
    public function novo(Request $request)
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:intranet_usuarios,email',
            'password' => ['required', 'confirmed', Password::min(6)],
            'admin' => 'boolean'
        ], [
            'nome.required' => 'O nome é obrigatório.',
            'nome.string' => 'O nome deve ser um texto.',
            'nome.max' => 'O nome não pode ter mais de 255 caracteres.',
            'email.required' => 'O email é obrigatório.',
            'email.email' => 'Digite um email válido.',
            'email.unique' => 'Este email já está sendo usado por outro usuário.',
            'email.max' => 'O email não pode ter mais de 255 caracteres.',
            'password.required' => 'A senha é obrigatória.',
            'password.confirmed' => 'A confirmação da senha não confere.',
            'password.min' => 'A senha deve ter pelo menos 6 caracteres.',
            'admin.boolean' => 'O campo admin deve ser verdadeiro ou falso.'
        ]);

        IntranetUsuario::create([
            'nome' => $validated['nome'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'admin' => $validated['admin'] ?? false,
            'criado' => now(),
            'modificado' => now()
        ]);

        return redirect()
            ->route('admin.usuarios.index')
            ->with('success', 'Usuário criado com sucesso!');
    }

    /**
     * Display the specified user.
     */
    public function ver(IntranetUsuario $usuario)
    {
        return Inertia::render('Intranet/Usuarios/Show', [
            'usuario' => $usuario
        ]);
    }

    /**
     * Show the form for editing the specified user.
     */
    public function editar(IntranetUsuario $usuario)
    {
        return Inertia::render('Intranet/Usuarios/Edit', [
            'usuario' => $usuario
        ]);
    }

    /**
     * Update the specified user in storage.
     */
    public function atualizar(Request $request, IntranetUsuario $usuario)
    {
        $rules = [
            'nome' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:intranet_usuarios,email,' . $usuario->id,
            'admin' => 'boolean'
        ];

        $messages = [
            'nome.required' => 'O nome é obrigatório.',
            'nome.string' => 'O nome deve ser um texto.',
            'nome.max' => 'O nome não pode ter mais de 255 caracteres.',
            'email.required' => 'O email é obrigatório.',
            'email.email' => 'Digite um email válido.',
            'email.unique' => 'Este email já está sendo usado por outro usuário.',
            'email.max' => 'O email não pode ter mais de 255 caracteres.',
            'admin.boolean' => 'O campo admin deve ser verdadeiro ou falso.'
        ];

        if ($request->filled('password')) {
            $rules['password'] = ['required', 'confirmed', Password::min(6)];
            $messages['password.required'] = 'A senha é obrigatória.';
            $messages['password.confirmed'] = 'A confirmação da senha não confere.';
            $messages['password.min'] = 'A senha deve ter pelo menos 6 caracteres.';
        }

        $validated = $request->validate($rules, $messages);

        $updateData = [
            'nome' => $validated['nome'],
            'email' => $validated['email'],
            'admin' => $validated['admin'] ?? false,
            'modificado' => now()
        ];

        if ($request->filled('password')) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        $usuario->update($updateData);

        return redirect()
            ->route('admin.usuarios.index')
            ->with('success', 'Usuário atualizado com sucesso!');
    }

    /**
     * Remove the specified user from storage.
     */
    public function delete(IntranetUsuario $usuario)
    {
        if ($usuario->id === $this->usuario->id) {
            return redirect()
                ->back()
                ->with('error', 'Você não pode deletar seu próprio usuário.');
        }

        $usuario->delete();

        return redirect()
            ->route('admin.usuarios.index')
            ->with('success', 'Usuário deletado com sucesso!');
    }

    /**
     * Toggle admin status
     */
    public function mudarAdmin(IntranetUsuario $usuario)
    {
        if ($usuario->id === $this->usuario->id && $usuario->admin) {
            return redirect()
                ->back()
                ->with('error', 'Você não pode remover seus próprios privilégios de administrador.');
        }

        $usuario->update([
            'admin' => !$usuario->admin,
            'modificado' => now()
        ]);

        $status = $usuario->admin ? 'promovido a administrador' : 'removido da administração';

        return redirect()
            ->back()
            ->with('success', "Usuário {$status} com sucesso!");
    }
}