<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
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

    // Halaman ToDoList
    public function todolist()
    {
        $tasks = Task::where('user_id', Auth::id())
            ->orderBy('date')
            ->orderBy('time')
            ->get();

        return inertia('todolist', [
            'tasks' => $tasks,
        ]);
    }

    // Halaman Schedule
    public function schedule()
    {
        $tasks = Task::where('user_id', Auth::id())
            ->orderBy('date')
            ->orderBy('time')
            ->get();

        return inertia('schedule', [
            'tasks' => $tasks,
        ]);
    }

    // CREATE
    public function store(Request $request)
    {
        $data = $request->validate([
            'text' => 'required|string|max:255',
            'date' => 'nullable|date',
            'time' => 'nullable|string|max:5',
        ]);

        $task = Task::create([
            'user_id'   => Auth::id(),
            'text'      => $data['text'],
            'date'      => $data['date'] ?? null,
            'time'      => $data['time'] ?? null,
            'completed' => false,
        ]);

        return response()->json($task);
    }

    // UPDATE
    public function update(Request $request, Task $task)
    {
        if ($task->user_id !== Auth::id()) {
            abort(403);
        }

        $data = $request->validate([
            'text'      => 'sometimes|string|max:255',
            'date'      => 'sometimes|nullable|date',
            'time'      => 'sometimes|nullable|string|max:5',
            'completed' => 'sometimes|boolean',
        ]);

        $task->update($data);

        return response()->json($task);
    }

    // DELETE
    public function destroy(Task $task)
    {
        if ($task->user_id !== Auth::id()) {
            abort(403);
        }

        $task->delete();

        return response()->json(['success' => true]);
    }
}
