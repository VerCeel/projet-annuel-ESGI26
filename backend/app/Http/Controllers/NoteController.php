<?php

namespace App\Http\Controllers;

use App\Models\Note;
use Illuminate\Http\Request;

class NoteController extends Controller
{
    public function index()
    {
        $notes = Note::orderBy('updated_at', 'desc')->get();

        return response()->json($notes);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
        ]);

        $note = Note::create($validated);

        return response()->json($note, 201);
    }

    public function show(int $id)
    {
        $note = Note::find($id);
        if (!$note) {
            return response()->json(['error' => 'Note not found'], 404);
        }

        return response()->json($note);
    }

    public function update(Request $request, int $id)
    {
        $note = Note::find($id);
        if (!$note) {
            return response()->json(['error' => 'Note not found'], 404);
        }

        $validated = $request->validate([
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'content' => ['sometimes', 'required', 'string'],
        ]);

        $note->update($validated);

        return response()->json($note);
    }

    public function destroy(int $id)
    {
        $note = Note::find($id);
        if (!$note) {
            return response()->json(['error' => 'Note not found'], 404);
        }

        $note->delete();

        return response()->json(['message' => 'Note deleted successfully']);
    }
}
