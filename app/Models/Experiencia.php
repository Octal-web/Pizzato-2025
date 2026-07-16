<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Experiencia extends Model {
    protected $table = 'experiencias';
    
    const CREATED_AT = 'criado';
    const UPDATED_AT = 'modificado';

    public function experienciasIdiomas()
    {
        return $this->hasMany(ExperienciaIdioma::class);
    }
}