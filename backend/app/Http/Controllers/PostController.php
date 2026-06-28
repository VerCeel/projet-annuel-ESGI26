<?php

namespace App\Http\Controllers;

use App\Models\Posts;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index()
    {
        $posts = Posts::orderBy('updated_at', 'desc')->get();
        return response()->json($posts);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
        ]);

        $post = Posts::create($validated);

        return response()->json($post, 201);
    }

    public function show(Posts $post)
    {
        return response()->json($post);
    }

    public function update(Request $request, Posts $post)
    {
        $validated = $request->validate([
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'content' => ['sometimes', 'required', 'string'],
        ]);

        $post->update($validated);

        return response()->json($post);
    }

    public function destroy(Posts $post)
    {
        $post->delete();

        return response()->json(null, 204);
    }
}
