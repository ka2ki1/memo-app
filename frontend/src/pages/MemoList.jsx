import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES } from '../constants'
import { getMemos, deleteMemo } from '../api/memos'

function MemoList() {
  const [memos, setMemos] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState('newest')
  const [filterCategory, setFilterCategory] = useState('すべて')

  const fetchMemos = () => {
    getMemos().then(data => {
      setMemos(data)
      setLoading(false)
    })
  }

  useEffect(() => {
    fetchMemos()
  }, [])

  const handleDelete = (id) => {
    deleteMemo(id).then(() => {
      fetchMemos()
    })
  }

  const searchedMemos = memos.filter(memo =>
    memo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (memo.content && memo.content.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const filteredMemos = filterCategory === 'すべて'
    ? searchedMemos
    : searchedMemos.filter(memo => memo.category === filterCategory)

  const sortedMemos = [...filteredMemos].sort((a, b) => {
    const dateA = new Date(a.created_at)
    const dateB = new Date(b.created_at)
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB
  })

  return (
    <div className="app">
      <h1>📝 メモ一覧</h1>

      <Link to="/memos/new" className="btn btn-primary btn-new-link">
        + 新しいメモを作成
      </Link>

      <input
        type="text"
        className="search-input"
        placeholder="🔍 メモを検索..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="category-filter">
        {['すべて', ...CATEGORIES].map(cat => (
          <button
            key={cat}
            className={`btn-category ${filterCategory === cat ? 'active' : ''}`}
            onClick={() => setFilterCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

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
              <span className="category-tag">{memo.category}</span>
              <Link to={`/memos/${memo.id}`} className="memo-title-link">
                <h3>{memo.title}</h3>
              </Link>
              <p>{memo.content}</p>
              <div className="memo-actions">
                <Link to={`/memos/${memo.id}`} className="btn btn-edit">詳細・編集</Link>
                <button className="btn btn-delete" onClick={() => handleDelete(memo.id)}>削除</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default MemoList
