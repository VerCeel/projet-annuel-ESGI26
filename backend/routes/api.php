<?php

use App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Route;

Route::get('/test', function () {
    return response()->json([
        'message' => 'API is working 🚀'
    ]);
});


Route::apiResource('posts', PostController::class);