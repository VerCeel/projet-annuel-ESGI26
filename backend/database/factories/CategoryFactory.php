<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Category>
 */
class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->unique()->randomElement(['Electronics', 'Home & Kitchen', 'Furniture', 'Clothing', 'Sports & Outdoors', 'Books', 'Toys & Games', 'Beauty & Health', 'Automotive', 'Garden', 'Office Supplies', 'Pet Supplies', 'Groceries', 'Tools', 'Footwear']),
        ];
    }
}
