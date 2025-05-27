<?php

namespace Database\Factories;

use App\Models\Subscriptions;
use Illuminate\Database\Eloquent\Factories\Factory;

class SubscriptionsFactory extends Factory
{
    protected $model = Subscriptions::class;

    public function definition()
    {
        return [
            'name' => $this->faker->word,
            'description' => $this->faker->sentence,
            'cantUsers' => $this->faker->numberBetween(1, 10),
            'cantItems' => $this->faker->numberBetween(1, 1000),
        ];
    }
}