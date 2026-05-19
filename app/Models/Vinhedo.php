<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vinhedo extends Model {
    protected $table = 'vinhedos';
    
    const CREATED_AT = 'criado';
    const UPDATED_AT = 'modificado';

    public function vinhedosIdiomas()
    {
        return $this->hasMany(VinhedoIdioma::class);
    }
}