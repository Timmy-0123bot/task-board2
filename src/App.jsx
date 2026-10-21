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

  return (
    <main className="board">
      <h1>タスクボード</h1>

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
        <p className="empty">タスクはまだありません</p>
      ) : (
        <>
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
                >
                  削除
                </button>
              </li>
            ))}
          </ul>
          <p className="summary">
            完了 {doneCount} / 全 {tasks.length} 件
          </p>
        </>
      )}
    </main>
  )
}

export default App
