<?php

namespace Database\Factories;

use App\Models\Client;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    public function definition(): array
    {
        $orderDate = fake()->dateTimeBetween('-1 year', 'now');

        return [
            'total_price' => fake()->randomFloat(2, 10, 5000),
            'status' => fake()->randomElement(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']),
            'order_date' => $orderDate->format('Y-m-d'),
            'delivery_date' => fake()->dateTimeBetween($orderDate, '+1 month')->format('Y-m-d'),
            'delivery_address' => fake()->address(),
        ];
    }

    public function configure(): static
    {
        return $this->afterCreating(function (Order $order) {
            $clientIds = Client::inRandomOrder()->limit(fake()->numberBetween(1, 3))->pluck('id');
            $order->clients()->attach($clientIds);

            $products = Product::inRandomOrder()->limit(fake()->numberBetween(1, 4))->get();
            $sync = [];
            foreach ($products as $product) {
                $sync[$product->id] = ['quantity' => fake()->numberBetween(1, 5)];
            }
            $order->products()->sync($sync);
        });
    }
}
