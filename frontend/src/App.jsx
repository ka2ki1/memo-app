import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MemoList from './pages/MemoList'
import MemoNew from './pages/MemoNew'
import MemoDetail from './pages/MemoDetail'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MemoList />} />
        <Route path="/memos/new" element={<MemoNew />} />
        <Route path="/memos/:id" element={<MemoDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
