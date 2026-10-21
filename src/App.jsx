import { useEffect, useState } from 'react'
import './App.css'

const STORAGE_KEY = 'task-board2.tasks'

// 保存済みのタスクを読み込む（保存がない・壊れている・読めない場合は空）
function loadTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

function App() {
  const [tasks, setTasks] = useState(loadTasks)
  const [text, setText] = useState('')

  // タスクが変わるたびにブラウザへ保存する
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    } catch {
      // 保存できない環境（プライベートモードなど）では保存せずに動かす
    }
  }, [tasks])

  // タスクを追加する（空白だけの入力は無視）
  const addTask = (e) => {
    e.preventDefault()
    const title = text.trim()
    if (!title) return
    setTasks([...tasks, { id: crypto.randomUUID(), title, done: false }])
    setText('')
  }

  // 完了・未完了を切り替える
  const toggleTask = (id) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, done: !task.done } : task)))
  }

  // タスクを削除する
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const doneCount = tasks.filter((task) => task.done).length
  const progress = tasks.length === 0 ? 0 : Math.round((doneCount / tasks.length) * 100)

  return (
    <main className="board">
      <header className="board-header">
        <p className="eyebrow">TASK BOARD</p>
        <h1>タスクボード</h1>
        <div className="progress">
          <div
            className="progress-track"
            role="progressbar"
            aria-label="完了率"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="progress-bar" style={{ width: `${progress}%` }} />
          </div>
          <p className="summary">
            完了 {doneCount} / 全 {tasks.length} 件
          </p>
        </div>
      </header>

      <form className="add-form" onSubmit={addTask}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="新しいタスクを入力"
          aria-label="新しいタスク"
        />
        <button type="submit" disabled={!text.trim()}>
          追加
        </button>
      </form>

      {tasks.length === 0 ? (
        <div className="empty">
          <p className="empty-title">タスクはまだありません</p>
          <p className="empty-hint">上の入力欄から最初のタスクを追加しましょう</p>
        </div>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className={task.done ? 'task done' : 'task'}>
              <label>
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleTask(task.id)}
                />
                <span className="title">{task.title}</span>
              </label>
              <button
                type="button"
                className="delete"
                onClick={() => deleteTask(task.id)}
                aria-label={`「${task.title}」を削除`}
                title="削除"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path
                    d="M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4h6v3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

export default App
