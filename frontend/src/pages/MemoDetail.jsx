import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { CATEGORIES } from '../constants'
import { getMemo, updateMemo, deleteMemo } from '../api/memos'

function MemoDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('その他')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMemo(id).then(data => {
      setTitle(data.title)
      setContent(data.content || '')
      setCategory(data.category || 'その他')
      setLoading(false)
    })
  }, [id])

  const handleSubmit = (e) => {
    e.preventDefault()

    updateMemo(id, { title, content, category }).then(() => {
      navigate('/')
    })
  }

  const handleDelete = () => {
    deleteMemo(id).then(() => {
      navigate('/')
    })
  }

  if (loading) {
    return <div className="app"><p className="empty-message">読み込み中...</p></div>
  }

  return (
    <div className="app">
      <h1>📝 メモを編集</h1>

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
        <select
          className="category-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <div className="form-buttons">
          <button type="submit" className="btn btn-primary">更新する</button>
          <Link to="/" className="btn btn-secondary">一覧に戻る</Link>
        </div>
      </form>

      <button className="btn btn-delete btn-delete-detail" onClick={handleDelete}>
        このメモを削除
      </button>
    </div>
  )
}

export default MemoDetail
