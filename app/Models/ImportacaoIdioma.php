<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ImportacaoIdioma extends Model {
    protected $table = 'importacoes_idiomas';
    
    const CREATED_AT = 'criado';
    const UPDATED_AT = 'modificado';

    public function importacao()
    {
        return $this->belongsTo(Importacao::class);
    }

    public function idiomas()
    {
        return $this->belongsTo(Idioma::class, 'idioma_id');
    }
}