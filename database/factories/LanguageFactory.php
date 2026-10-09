<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Language>
 */
class LanguageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $code = fake()->unique()->regexify('[a-z]{2}');

        return [
            'code' => $code,
            'name' => ucfirst($code),
            'native_name' => ucfirst($code),
            'is_default' => false,
            'is_active' => true,
            'sort_order' => 0,
        ];
    }
}
