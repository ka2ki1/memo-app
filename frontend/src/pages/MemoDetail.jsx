import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'

const CATEGORIES = ['その他', '仕事', 'プライベート', '学習']

function MemoDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('その他')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`http://localhost/api/memos/${id}`)
      .then(res => res.json())
      .then(data => {
        setTitle(data.title)
        setContent(data.content || '')
        setCategory(data.category || 'その他')
        setLoading(false)
      })
  }, [id])

  const handleSubmit = (e) => {
    e.preventDefault()

    fetch(`http://localhost/api/memos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, category }),
    }).then(() => {
      navigate('/') // 更新後は一覧ページに戻る
    })
  }

  const handleDelete = () => {
    fetch(`http://localhost/api/memos/${id}`, {
      method: 'DELETE',
    }).then(() => {
      navigate('/') // 削除後は一覧ページに戻る
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
