<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Importacao extends Model {
    protected $table = 'importacoes';
    
    const CREATED_AT = 'criado';
    const UPDATED_AT = 'modificado';

    public function importacoesIdiomas()
    {
        return $this->hasMany(ImportacaoIdioma::class);
    }
}