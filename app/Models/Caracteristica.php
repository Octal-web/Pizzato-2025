<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Caracteristica extends Model {
    protected $table = 'caracteristicas';
    
    const CREATED_AT = 'criado';
    const UPDATED_AT = 'modificado';

    public function caracteristicasIdiomas()
    {
        return $this->hasMany(CaracteristicaIdioma::class);
    }

    public function produto()
    {
        return $this->belongsTo(Produto::class);
    }
}