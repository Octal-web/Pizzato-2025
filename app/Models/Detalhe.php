<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Detalhe extends Model {
    protected $table = 'detalhes';
    
    const CREATED_AT = 'criado';
    const UPDATED_AT = 'modificado';

    public function detalhesIdiomas()
    {
        return $this->hasMany(DetalheIdioma::class);
    }

    public function produto()
    {
        return $this->belongsTo(Produto::class);
    }

}