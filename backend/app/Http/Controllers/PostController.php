<?php

namespace App\Http\Controllers;

use App\Models\Posts;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Posts::latest()->get());
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
        ]);

        $post = Posts::create($validated);

        return response()->json($post, 201);
    }

    public function show(Posts $post): JsonResponse
    {
        return response()->json($post);
    }

    public function update(Request $request, Posts $post): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'content' => ['sometimes', 'required', 'string'],
        ]);

        $post->update($validated);

        return response()->json($post);
    }

    public function destroy(Posts $post): JsonResponse
    {
        $post->delete();

        return response()->json(null, 204);
    }
}
