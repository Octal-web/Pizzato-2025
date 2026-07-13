<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pergunta extends Model {
    protected $table = 'perguntas';
    
    const CREATED_AT = 'criado';
    const UPDATED_AT = 'modificado';

}