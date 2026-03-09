import { useState, useCallback } from 'react'
import { gooeyToast } from 'goey-toast'
import { processFile } from '../utils/fileProcessor'
import { exportJSON } from '../utils/jsonHandler'

/** Todoアイテムの型定義 */
interface Todo {
  /** 一意のID */
  id: number
  /** タスクのテキスト */
  text: string
  /** 完了フラグ */
  done: boolean
}

/**
 * TODOの状態管理フック
 * @returns TODOの状態と操作関数
 */
export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([])
  const [completedCount, setCompletedCount] = useState(0)

  /**
   * タスクを追加する
   * @param text - タスクのテキスト
   */
  const addTodo = useCallback((text: string) => {
    setTodos(prev => [{ id: Date.now(), text, done: false }, ...prev])
    gooeyToast.success(`追加: ${text}`)
  }, [])

  /**
   * タスクを完了する（Promise Morph演出付き）
   * @param todo - 完了するタスク
   */
  const completeTodo = useCallback((todo: Todo) => {
    const id = gooeyToast('処理中...')

    // 800〜2000ms のランダム遅延で「処理感」を演出
    const delay = 800 + Math.random() * 1200
    setTimeout(() => {
      setTodos(prev => prev.map(t =>
        t.id === todo.id ? { ...t, done: true } : t
      ))
      setCompletedCount(c => c + 1)

      // ここで morph が発動
      gooeyToast.update(id, {
        title: `完了! "${todo.text}"`,
        type: 'success',
        icon: null,
      })
    }, delay)
  }, [])

  /**
   * タスクを削除する（Action Button付きエラートースト）
   * @param todo - 削除するタスク
   */
  const deleteTodo = useCallback((todo: Todo) => {
    setTodos(prev => prev.filter(t => t.id !== todo.id))

    const toastId = gooeyToast.error(`削除: "${todo.text}"`, {
      action: {
        label: '元に戻す',
        onClick: () => {
          setTodos(prev => [todo, ...prev])
          gooeyToast.dismiss(toastId)
          gooeyToast.info('復元しました')
        },
      },
    })
  }, [])

  /**
   * 完了状態を戻す
   * @param todo - 完了を戻すタスク
   */
  const undoComplete = useCallback((todo: Todo) => {
    setTodos(prev => prev.map(t =>
      t.id === todo.id ? { ...t, done: false } : t
    ))
    setCompletedCount(c => Math.max(0, c - 1))
    gooeyToast.warning(`戻しました: "${todo.text}"`)
  }, [])

  /**
   * ファイルからタスクをインポートする
   * @param file - インポートするファイル
   */
  const importFile = useCallback((file: File) => {
    processFile(file, (tasks: string[]) => {
      const newTodos = tasks.map((text, idx) => ({
        id: Date.now() + idx,
        text,
        done: false,
      }))
      setTodos(prev => [...newTodos, ...prev])
    })
  }, [])

  /**
   * TODOをJSONファイルとしてエクスポートする
   */
  const exportTodos = useCallback(() => {
    const toastId = gooeyToast('エクスポート中...')

    const delay = 400 + Math.random() * 400
    setTimeout(() => {
      exportJSON(todos)
      gooeyToast.update(toastId, {
        title: `${todos.length} 件のタスクをエクスポートしました`,
        type: 'success',
        icon: null,
      })
    }, delay)
  }, [todos])

  const activeTodos = todos.filter(t => !t.done)
  const doneTodos = todos.filter(t => t.done)

  return {
    todos,
    activeTodos,
    doneTodos,
    completedCount,
    addTodo,
    completeTodo,
    deleteTodo,
    undoComplete,
    importFile,
    exportJSON: exportTodos,
  }
}
