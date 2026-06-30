<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use App\Models\Order;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with(['clients', 'products'])->latest()->get();

        return response()->json($orders);
    }

    public function store(StoreOrderRequest $request)
    {
        $validated = $request->validated();
        $clientIds = $validated['client_ids'];
        $products = $validated['products'];
        unset($validated['client_ids'], $validated['products']);

        $order = Order::create($validated);
        $order->clients()->sync($clientIds);
        $order->products()->sync($this->formatProductSync($products));

        return response()->json($order->load(['clients', 'products']), 201);
    }

    public function show(int $id)
    {
        $order = Order::with(['clients', 'products'])->find($id);
        if (!$order) {
            return response()->json(['error' => 'Order not found'], 404);
        }

        return response()->json($order);
    }

    public function update(UpdateOrderRequest $request, int $id)
    {
        $order = Order::find($id);
        if (!$order) {
            return response()->json(['error' => 'Order not found'], 404);
        }

        $validated = $request->validated();
        $clientIds = $validated['client_ids'];
        $products = $validated['products'];
        unset($validated['client_ids'], $validated['products']);

        $order->update($validated);
        $order->clients()->sync($clientIds);
        $order->products()->sync($this->formatProductSync($products));

        return response()->json($order->load(['clients', 'products']));
    }

    public function destroy(int $id)
    {
        $order = Order::find($id);
        if (!$order) {
            return response()->json(['error' => 'Order not found'], 404);
        }

        $order->delete();

        return response()->json(['message' => 'Order deleted successfully']);
    }

    /**
     * @param  array<int, array{id: int, quantity: int}>  $products
     * @return array<int, array{quantity: int}>
     */
    private function formatProductSync(array $products): array
    {
        $sync = [];
        foreach ($products as $product) {
            $sync[$product['id']] = ['quantity' => $product['quantity']];
        }

        return $sync;
    }
}
