<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
use App\Models\Order;
use Dompdf\Dompdf;
use Dompdf\Options;
use Illuminate\Support\Facades\DB;
use RuntimeException;

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

        try {
            $order = DB::transaction(function () use ($validated, $clientIds, $products) {
                $order = Order::create($validated);
                $order->clients()->sync($clientIds);
                $order->products()->sync($this->formatProductSync($products));

                if ($this->isStockCommitted($order->status)) {
                    $order->load('products');
                    $this->decrementStock($order);
                }

                return $order;
            });
        } catch (RuntimeException $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }

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

        try {
            $order = DB::transaction(function () use ($order, $validated, $clientIds, $products) {
                $order->load('products');
                $oldStatus = $order->status;
                $newStatus = $validated['status'];

                if (! $this->isStockCommitted($oldStatus) && $this->isStockCommitted($newStatus)) {
                    $this->decrementStock($order);
                } elseif ($this->isStockCommitted($oldStatus) && ! $this->isStockCommitted($newStatus)) {
                    $this->restoreStock($order);
                }

                $order->update($validated);
                $order->clients()->sync($clientIds);
                $order->products()->sync($this->formatProductSync($products));

                return $order;
            });
        } catch (RuntimeException $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }

        return response()->json($order->load(['clients', 'products']));
    }

    public function destroy(int $id)
    {
        $order = Order::find($id);
        if (!$order) {
            return response()->json(['error' => 'Order not found'], 404);
        }

        try {
            DB::transaction(function () use ($order) {
                $order->load('products');

                if ($this->isStockCommitted($order->status)) {
                    $this->restoreStock($order);
                }

                $order->delete();
            });
        } catch (RuntimeException $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }

        return response()->json(['message' => 'Order deleted successfully']);
    }

    public function invoice(int $id)
    {
        $order = Order::with(['clients', 'products'])->find($id);
        if (!$order) {
            return response()->json(['error' => 'Order not found'], 404);
        }

        $html = view('orders.invoice', compact('order'))->render();

        $options = new Options();
        $options->set('isRemoteEnabled', true);

        $dompdf = new Dompdf($options);
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4');
        $dompdf->render();

        $filename = 'invoice-order-'.$order->id.'.pdf';

        return response($dompdf->output(), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="'.$filename.'"',
        ]);
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

    private function isStockCommitted(string $status): bool
    {
        return in_array($status, ['confirmed', 'shipped', 'delivered'], true);
    }

    private function decrementStock(Order $order): void
    {
        foreach ($order->products as $product) {
            $quantity = (int) $product->pivot->quantity;

            if ($product->stock < $quantity) {
                throw new RuntimeException(
                    'Insufficient stock for "'.$product->name.'". Available: '.$product->stock.', required: '.$quantity.'.'
                );
            }

            $product->stock -= $quantity;
            $product->save();
        }
    }

    private function restoreStock(Order $order): void
    {
        foreach ($order->products as $product) {
            $quantity = (int) $product->pivot->quantity;
            $product->stock += $quantity;
            $product->save();
        }
    }
}
