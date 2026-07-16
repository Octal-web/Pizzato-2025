<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Volume extends Model {
    protected $table = 'volumes';
    
    const CREATED_AT = 'criado';
    const UPDATED_AT = 'modificado';

    public function produtos()
    {
        return $this->belongsToMany(Produto::class, 'produtos_volumes');
    }
}