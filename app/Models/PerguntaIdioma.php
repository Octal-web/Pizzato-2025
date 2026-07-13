<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PerguntaIdioma extends Model
{
    protected $table = 'perguntas_idiomas';

    const CREATED_AT = 'criado';
    const UPDATED_AT = 'modificado';

    public function pergunta()
    {
        return $this->belongsTo(Pergunta::class);
    }

    public function idiomas()
    {
        return $this->belongsTo(Idioma::class, 'idioma_id');
    }
}
