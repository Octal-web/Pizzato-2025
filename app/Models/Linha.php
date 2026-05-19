<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Linha extends Model {
    protected $table = 'linhas';
    
    const CREATED_AT = 'criado';
    const UPDATED_AT = 'modificado';

    public function produtos()
    {
        return $this->hasMany(Produto::class);
    }

    public function linhasIdiomas()
    {
        return $this->hasMany(LinhaIdioma::class);
    }
}