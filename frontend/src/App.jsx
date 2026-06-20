import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [memos, setMemos] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [editingId, setEditingId] = useState(null) // 編集中のメモID（nullなら新規作成モード）

  const fetchMemos = () => {
    fetch('http://localhost/api/memos')
      .then(res => res.json())
      .then(data => setMemos(data))
  }

  useEffect(() => {
    fetchMemos()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (editingId) {
      // 編集モード：PUTで更新
      fetch(`http://localhost/api/memos/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      })
        .then(res => res.json())
        .then(() => {
          resetForm()
          fetchMemos()
        })
    } else {
      // 新規作成モード：POSTで作成
      fetch('http://localhost/api/memos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      })
        .then(res => res.json())
        .then(() => {
          resetForm()
          fetchMemos()
        })
    }
  }

  const handleDelete = (id) => {
    fetch(`http://localhost/api/memos/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        fetchMemos()
      })
  }

  // 編集ボタンを押した時：フォームに値をセットして編集モードへ
  const handleEdit = (memo) => {
    setEditingId(memo.id)
    setTitle(memo.title)
    setContent(memo.content)
  }

  // フォームをリセット（新規作成モードに戻す）
  const resetForm = () => {
    setEditingId(null)
    setTitle('')
    setContent('')
  }

  return (
    <div>
      <h1>メモ一覧</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="タイトル"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <textarea
            placeholder="内容"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <button type="submit">
          {editingId ? '更新する' : 'メモを作成'}
        </button>
        {editingId && (
          <button type="button" onClick={resetForm}>
            キャンセル
          </button>
        )}
      </form>

      <ul>
        {memos.map(memo => (
          <li key={memo.id}>
            <strong>{memo.title}</strong>
            <p>{memo.content}</p>
            <button onClick={() => handleEdit(memo)}>編集</button>
            <button onClick={() => handleDelete(memo.id)}>削除</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
