import { API_BASE_URL } from '../constants'

// 一覧取得
export const getMemos = () => {
  return fetch(`${API_BASE_URL}/memos`).then(res => res.json())
}

// 1件取得
export const getMemo = (id) => {
  return fetch(`${API_BASE_URL}/memos/${id}`).then(res => res.json())
}

// 新規作成
export const createMemo = (data) => {
  return fetch(`${API_BASE_URL}/memos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(res => res.json())
}

// 更新
export const updateMemo = (id, data) => {
  return fetch(`${API_BASE_URL}/memos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(res => res.json())
}

// 削除
export const deleteMemo = (id) => {
  return fetch(`${API_BASE_URL}/memos/${id}`, {
    method: 'DELETE',
  })
}
