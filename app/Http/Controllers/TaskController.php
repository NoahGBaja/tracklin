<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TaskController extends Controller
{
<<<<<<< HEAD
    // ==================== PAGE: /todolist ====================
    public function index(Request $request)
=======
    public function index()
{
    $tasks = Task::where('user_id', auth()->id())
                ->orderBy('date', 'asc')
                ->orderBy('time', 'asc')
                ->get();

    return inertia('todolist', [
        'tasks' => $tasks
    ]);
}

    public function todolist()
>>>>>>> 5e9964d (otp)
    {
        $user = $request->user(); // atau Auth::user()

        $tasks = Task::where('user_id', $user->id)
            ->orderBy('date', 'asc')
            ->orderBy('time', 'asc')
            ->get();

        return Inertia::render('todolist', [
            'tasks' => $tasks,
        ]);
    }

<<<<<<< HEAD
    // (opsional, sebenernya nggak perlu punya todolist() lagi)
    public function todolist(Request $request)
=======
    public function schedule()
>>>>>>> 5e9964d (otp)
    {
        return $this->index($request);
    }

    // ==================== PAGE: /schedule ====================
    public function schedule(Request $request)
    {
        $user = $request->user();

        $tasks = Task::where('user_id', $user->id)
            ->orderBy('date', 'asc')
            ->orderBy('time', 'asc')
            ->get();

        return Inertia::render('schedule', [
            'tasks' => $tasks,
        ]);
    }

    // ==================== API: POST /tasks ====================
    public function store(Request $request)
    {
        if (!Auth::check()) {
            // Kalau sampe sini Auth::id() = null, jangan maksain insert
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $data = $request->validate([
            'text' => 'required|string|max:255',
            'date' => 'nullable|date',
            'time' => 'nullable|string|max:5', // contoh: "14.30"
        ]);

        try {
            $task = Task::create([
                'user_id'   => Auth::id(),
                'text'      => $data['text'],
                'date'      => $data['date'] ?? null,
                'time'      => $data['time'] ?? null,
                'completed' => false,
            ]);

            // penting: JSON + 201
            return response()->json($task, 201);

        } catch (\Throwable $e) {
            // log ke laravel.log biar ketahuan kalau ada FK error, dsb
            \Log::error('Failed to create task', [
                'error' => $e->getMessage(),
                'user_id' => Auth::id(),
                'data' => $data,
            ]);

            return response()->json([
                'message' => 'Failed to create task',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    // ==================== API: PUT /tasks/{task} ====================
    public function update(Request $request, Task $task)
    {
        if ($task->user_id !== Auth::id()) {
            abort(403);
        }

        $data = $request->validate([
            'text'      => 'sometimes|required|string|max:255',
            'date'      => 'sometimes|nullable|date',
            'time'      => 'sometimes|nullable|string|max:5',
            'completed' => 'sometimes|boolean',
        ]);

        try {
            $task->update($data);

            return response()->json($task);

        } catch (\Throwable $e) {
            \Log::error('Failed to update task', [
                'error' => $e->getMessage(),
                'task_id' => $task->id,
            ]);

            return response()->json([
                'message' => 'Failed to update task',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    // ==================== API: DELETE /tasks/{task} ====================
    public function destroy(Request $request, Task $task)
    {
        if ($task->user_id !== Auth::id()) {
            abort(403);
        }

        try {
            $task->delete();

            return response()->json(['success' => true], 204);

        } catch (\Throwable $e) {
            \Log::error('Failed to delete task', [
                'error' => $e->getMessage(),
                'task_id' => $task->id,
            ]);

            return response()->json([
                'message' => 'Failed to delete task',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
}
