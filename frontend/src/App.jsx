import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [memos, setMemos] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState('newest') // 'newest' or 'oldest'

  const fetchMemos = () => {
    fetch('http://localhost/api/memos')
      .then(res => res.json())
      .then(data => {
        setMemos(data)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchMemos()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (editingId) {
      fetch(`http://localhost/api/memos/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      }).then(() => {
        resetForm()
        fetchMemos()
      })
    } else {
      fetch('http://localhost/api/memos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      }).then(() => {
        resetForm()
        fetchMemos()
      })
    }
  }

  const handleDelete = (id) => {
    fetch(`http://localhost/api/memos/${id}`, {
      method: 'DELETE',
    }).then(() => {
      fetchMemos()
    })
  }

  const handleEdit = (memo) => {
    setEditingId(memo.id)
    setTitle(memo.title)
    setContent(memo.content)
  }

  const resetForm = () => {
    setEditingId(null)
    setTitle('')
    setContent('')
  }

  // 検索 → 絞り込み
  const filteredMemos = memos.filter(memo =>
    memo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (memo.content && memo.content.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  // 並び替え（作成日時で比較）
  const sortedMemos = [...filteredMemos].sort((a, b) => {
    const dateA = new Date(a.created_at)
    const dateB = new Date(b.created_at)
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB
  })

  return (
    <div className="app">
      <h1>📝 メモ一覧</h1>

      <form className="memo-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="タイトル"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="内容"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="form-buttons">
          <button type="submit" className="btn btn-primary">
            {editingId ? '更新する' : 'メモを作成'}
          </button>
          {editingId && (
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
              キャンセル
            </button>
          )}
        </div>
      </form>

      <input
        type="text"
        className="search-input"
        placeholder="🔍 メモを検索..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="sort-buttons">
        <button
          className={`btn-sort ${sortOrder === 'newest' ? 'active' : ''}`}
          onClick={() => setSortOrder('newest')}
        >
          新しい順
        </button>
        <button
          className={`btn-sort ${sortOrder === 'oldest' ? 'active' : ''}`}
          onClick={() => setSortOrder('oldest')}
        >
          古い順
        </button>
      </div>

      {loading ? (
        <p className="empty-message">読み込み中...</p>
      ) : sortedMemos.length === 0 ? (
        <p className="empty-message">
          {searchTerm ? '見つかりませんでした' : 'メモがありません'}
        </p>
      ) : (
        <ul className="memo-list">
          {sortedMemos.map(memo => (
            <li key={memo.id} className="memo-item">
              <h3>{memo.title}</h3>
              <p>{memo.content}</p>
              <div className="memo-actions">
                <button className="btn btn-edit" onClick={() => handleEdit(memo)}>編集</button>
                <button className="btn btn-delete" onClick={() => handleDelete(memo.id)}>削除</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App
