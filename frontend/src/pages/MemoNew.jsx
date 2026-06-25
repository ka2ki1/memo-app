import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { CATEGORIES } from '../constants'
import { createMemo } from '../api/memos'

function MemoNew() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('その他')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()

    createMemo({ title, content, category }).then(() => {
      navigate('/')
    })
  }

  return (
    <div className="app">
      <h1>📝 新しいメモ</h1>

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
          <button type="submit" className="btn btn-primary">作成する</button>
          <Link to="/" className="btn btn-secondary">キャンセル</Link>
        </div>
      </form>
    </div>
  )
}

export default MemoNew
