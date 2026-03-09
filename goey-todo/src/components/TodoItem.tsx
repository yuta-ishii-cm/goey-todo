import { Button } from '@/components/ui/button'
import { Check, X, RotateCcw } from 'lucide-react'

/** Todoアイテムの型定義 */
interface Todo {
  /** 一意のID */
  id: number
  /** タスクのテキスト */
  text: string
  /** 完了フラグ */
  done: boolean
}

/** TodoItemコンポーネントのプロパティ */
interface TodoItemProps {
  /** 表示するTodoアイテム */
  todo: Todo
  /** 完了時のコールバック */
  onComplete?: (todo: Todo) => void
  /** 完了取り消し時のコールバック */
  onUndo?: (todo: Todo) => void
  /** 削除時のコールバック */
  onDelete: (todo: Todo) => void
}

/**
 * 個別のTodoアイテムコンポーネント
 * @param props - TodoItemのプロパティ
 * @returns TodoItem要素
 */
export const TodoItem = ({ todo, onComplete, onUndo, onDelete }: TodoItemProps) => {
  return (
    <div className={`todo-item ${todo.done ? 'done' : ''}`}>
      <span className="todo-text">{todo.text}</span>
      <div className="todo-actions">
        {todo.done ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onUndo?.(todo)}
            className="undo-btn"
            title="完了を戻す"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onComplete?.(todo)}
            className="complete-btn"
            title="完了にする"
          >
            <Check className="w-4 h-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(todo)}
          className="delete-btn"
          title="削除"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
