<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Arquivo extends Model {
    protected $table = 'produtos_arquivos';
    
    const CREATED_AT = 'criado';
    const UPDATED_AT = 'modificado';

    public function arquivosIdiomas()
    {
        return $this->hasMany(ArquivoIdioma::class);
    }

    public function produto()
    {
        return $this->belongsTo(Produto::class);
    }
}