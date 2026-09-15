<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('importacoes', function (Blueprint $table) {
            $table->string('imagem', 36)->nullable()->change();
        });
    }

    public function down(): void
    {
        DB::table('importacoes')->whereNull('imagem')->update(['imagem' => '']);

        Schema::table('importacoes', function (Blueprint $table) {
            $table->string('imagem', 36)->nullable(false)->change();
        });
    }
};
