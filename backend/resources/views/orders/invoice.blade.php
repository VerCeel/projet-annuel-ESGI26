<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <title>Facture #{{ $order->id }}</title>
    <style>
        * { box-sizing: border-box; }
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
            color: #1a1a1a;
            margin: 0;
            padding: 32px;
        }
        .header {
            display: table;
            width: 100%;
            margin-bottom: 32px;
        }
        .header-left, .header-right {
            display: table-cell;
            vertical-align: top;
        }
        .header-right { text-align: right; }
        h1 {
            font-size: 22px;
            margin: 0 0 4px;
        }
        .muted { color: #666; }
        .section { margin-bottom: 24px; }
        .section-title {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #666;
            margin-bottom: 8px;
        }
        table.items {
            width: 100%;
            border-collapse: collapse;
            margin-top: 8px;
        }
        table.items th,
        table.items td {
            border-bottom: 1px solid #ddd;
            padding: 10px 8px;
            text-align: left;
        }
        table.items th {
            background: #f5f5f5;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.04em;
        }
        table.items td.num,
        table.items th.num { text-align: right; }
        .total-row td {
            border-bottom: none;
            font-weight: bold;
            font-size: 14px;
            padding-top: 16px;
        }
        .status {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 999px;
            background: #eee;
            font-size: 11px;
            text-transform: capitalize;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="header-left">
            <h1>Facture</h1>
            <p class="muted">Commande #{{ $order->id }}</p>
        </div>
        <div class="header-right">
            <p><strong>Date de commande :</strong> {{ $order->order_date->format('d/m/Y') }}</p>
            <p><strong>Date de livraison :</strong> {{ $order->delivery_date->format('d/m/Y') }}</p>
            <p><strong>Statut :</strong> <span class="status">{{ $order->status }}</span></p>
        </div>
    </div>

    @php
        $clients = $order->clients;
    @endphp

    @if($clients->isNotEmpty())
        <div class="section">
            <div class="section-title">Client</div>
            @foreach($clients as $client)
                <p style="margin: 0 0 8px;">
                    <strong>{{ $client->first_name }} {{ $client->last_name }}</strong><br>
                    {{ $client->email }}<br>
                    @if($client->phone){{ $client->phone }}<br>@endif
                    @if($client->address){{ $client->address }}@endif
                    @if($client->zip) {{ $client->zip }}@endif
                </p>
            @endforeach
        </div>
    @endif

    <div class="section">
        <div class="section-title">Adresse de livraison</div>
        <p style="margin: 0;">{{ $order->delivery_address }}</p>
    </div>

    <div class="section">
        <div class="section-title">Détail des produits</div>
        <table class="items">
            <thead>
                <tr>
                    <th>Produit</th>
                    <th class="num">Prix unitaire</th>
                    <th class="num">Quantité</th>
                    <th class="num">Total</th>
                </tr>
            </thead>
            <tbody>
                @foreach($order->products as $product)
                    @php
                        $quantity = $product->pivot->quantity ?? 1;
                        $lineTotal = $product->price * $quantity;
                    @endphp
                    <tr>
                        <td>{{ $product->name }}</td>
                        <td class="num">{{ number_format($product->price, 2, ',', ' ') }} €</td>
                        <td class="num">{{ $quantity }}</td>
                        <td class="num">{{ number_format($lineTotal, 2, ',', ' ') }} €</td>
                    </tr>
                @endforeach
                <tr class="total-row">
                    <td colspan="3" class="num">Total</td>
                    <td class="num">{{ number_format($order->total_price, 2, ',', ' ') }} €</td>
                </tr>
            </tbody>
        </table>
    </div>
</body>
</html>
