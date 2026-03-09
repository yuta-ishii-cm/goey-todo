/** Todoアイテムの型定義 */
interface Todo {
  /** 一意のID */
  id: number
  /** タスクのテキスト */
  text: string
  /** 完了フラグ */
  done: boolean
}

/** インポートされたJSONアイテムの型 */
interface ImportedItem {
  /** タスクのテキスト */
  text?: string
  /** タスク名（別形式） */
  task?: string
  /** タイトル（別形式） */
  title?: string
  /** 名前（別形式） */
  name?: string
}

/** インポートされたJSONデータの型 */
interface ImportedData {
  /** TODOアイテムの配列 */
  todos?: (string | ImportedItem)[]
}

/**
 * JSON文字列からタスク名の配列を抽出する
 * @param text - JSON形式の文字列
 * @returns タスク名の配列
 */
export const parseJSON = (text: string): string[] => {
  const data: (string | ImportedItem)[] | ImportedData = JSON.parse(text)

  // 配列形式: ["タスク1", "タスク2"]
  if (Array.isArray(data)) {
    return data.map(item => {
      if (typeof item === 'string') {
        return item
      }
      return item.text || item.task || item.title || item.name || String(item)
    })
  }

  // オブジェクト形式: { todos: [...] }
  if (data.todos && Array.isArray(data.todos)) {
    return data.todos.map((item) =>
      typeof item === 'string' ? item : (item.text || item.task || item.title || String(item))
    )
  }

  return []
}

/**
 * TODOリストをJSONファイルとしてエクスポートする
 * @param todos - エクスポートするTODOの配列
 */
export const exportJSON = (todos: Todo[]): void => {
  const data = {
    exportedAt: new Date().toISOString(),
    todos: todos.map(({ text, done }) => ({ text, done })),
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `goey-todo-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}
