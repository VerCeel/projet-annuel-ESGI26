<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $stock = fake()->numberBetween(0, 100);

        $adjective = fake()->randomElement(['Small', 'Ergonomic', 'Rustic', 'Intelligent', 'Gorgeous', 'Incredible', 'Fantastic', 'Practical', 'Sleek', 'Handcrafted', 'Refined', 'Durable', 'Modern', 'Premium', 'Compact']);
        $material = fake()->randomElement(['Steel', 'Wooden', 'Cotton', 'Granite', 'Rubber', 'Metal', 'Leather', 'Ceramic', 'Aluminum', 'Bamboo', 'Glass', 'Carbon', 'Plastic']);
        $item = fake()->randomElement(['Chair', 'Table', 'Lamp', 'Shoes', 'Bottle', 'Bag', 'Watch', 'Keyboard', 'Backpack', 'Mug', 'Jacket', 'Wallet', 'Headphones', 'Notebook', 'Speaker', 'Desk', 'Monitor', 'Cabinet']);

        return [
            'name' => $adjective . ' ' . $material . ' ' . $item,
            'description' => fake()->text(),
            'price' => fake()->randomFloat(2, 0, 1000),
            'image' => fake()->imageUrl(),
            'stock' => $stock,
            'status' => $stock > 0 ? 'in stock' : 'out of stock',
            'category_id' => rand(1, 10),
        ];
    }
}
