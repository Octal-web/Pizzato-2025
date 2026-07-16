<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Produto extends Model {
    protected $table = 'produtos';
    
    const CREATED_AT = 'criado';
    const UPDATED_AT = 'modificado';

    public function produtosIdiomas()
    {
        return $this->hasMany(ProdutoIdioma::class);
    }

    public function linha()
    {
        return $this->belongsTo(Linha::class);
    }

    public function categoria()
    {
        return $this->belongsTo(Categoria::class);
    }

    public function detalhes()
    {
        return $this->hasMany(Detalhe::class);
    }
    
    public function arquivos()
    {
        return $this->hasMany(Arquivo::class);
    }
    
    public function volumes()
    {
        return $this->belongsToMany(Volume::class, 'produtos_volumes');
    }
}