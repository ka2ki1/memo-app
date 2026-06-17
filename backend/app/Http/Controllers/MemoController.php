<?php

namespace App\Http\Controllers;

use App\Models\Memo;
use Illuminate\Http\Request;

class MemoController extends Controller
{
    // 一覧取得
    public function index()
    {
        return Memo::latest()->get();
    }

    // 新規作成
    public function store(Request $request)
    {
        $memo = Memo::create($request->validate([
            'title' => 'required|max:255',
            'content' => 'nullable',
        ]));
        return response()->json($memo, 201);
    }

    // 1件取得
    public function show(Memo $memo)
    {
        return $memo;
    }

    // 更新
    public function update(Request $request, Memo $memo)
    {
        $memo->update($request->validate([
            'title' => 'required|max:255',
            'content' => 'nullable',
        ]));
        return $memo;
    }

    // 削除
    public function destroy(Memo $memo)
    {
        $memo->delete();
        return response()->noContent();
    }
}
