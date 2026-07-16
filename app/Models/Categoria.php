<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Categoria extends Model {
    protected $table = 'categorias';
    
    const CREATED_AT = 'criado';
    const UPDATED_AT = 'modificado';

    public function produtos()
    {
        return $this->hasMany(Produto::class);
    }

    public function categoriasIdiomas()
    {
        return $this->hasMany(CategoriaIdioma::class);
    }
}