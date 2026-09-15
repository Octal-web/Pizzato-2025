<?php

namespace Tests\Feature;

use App\Http\Requests\Manager\PostImportRequest;
use Illuminate\Support\Facades\Validator;
use Tests\TestCase;

class ImportCountryValidationTest extends TestCase
{
    public function test_import_accepts_a_country_without_image_or_cities(): void
    {
        $request = new PostImportRequest;
        $validator = Validator::make(['pais' => 'Brasil', 'descricao' => '<p>Importador</p>'], $request->rules());

        $this->assertTrue($validator->passes());
        $this->assertArrayNotHasKey('img', $request->rules());
        $this->assertArrayNotHasKey('cidades', $request->rules());
    }

    public function test_import_rejects_a_country_outside_the_catalog(): void
    {
        $request = new PostImportRequest;
        $validator = Validator::make(['pais' => 'País inexistente', 'descricao' => 'Importador'], $request->rules());

        $this->assertTrue($validator->fails());
        $this->assertTrue($validator->errors()->has('pais'));
    }
}
