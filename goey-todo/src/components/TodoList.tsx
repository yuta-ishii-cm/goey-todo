import { TodoItem } from "./TodoItem";

/** Todoアイテムの型定義 */
interface Todo {
	/** 一意のID */
	id: number;
	/** タスクのテキスト */
	text: string;
	/** 完了フラグ */
	done: boolean;
}

/** TodoListコンポーネントのプロパティ */
interface TodoListProps {
	/** アクティブなTodoの配列 */
	active: Todo[];
	/** 完了済みTodoの配列 */
	done: Todo[];
	/** 完了時のコールバック */
	onComplete: (todo: Todo) => void;
	/** 完了取り消し時のコールバック */
	onUndo: (todo: Todo) => void;
	/** 削除時のコールバック */
	onDelete: (todo: Todo) => void;
}

/**
 * Todoリストコンポーネント（アクティブ/完了済みを分けて表示）
 * @param props - TodoListのプロパティ
 * @returns TodoList要素
 */
export const TodoList = ({
	active,
	done,
	onComplete,
	onUndo,
	onDelete,
}: TodoListProps) => {
	return (
		<div className="todo-list">
			{active.length > 0 && (
				<section className="todo-section">
					<h2 className="section-title">タスク ({active.length})</h2>
					<div className="todo-items">
						{active.map((todo) => (
							<TodoItem
								key={todo.id}
								todo={todo}
								onComplete={onComplete}
								onDelete={onDelete}
							/>
						))}
					</div>
				</section>
			)}

			{done.length > 0 && (
				<section className="todo-section">
					<h2 className="section-title done-title">完了済み ({done.length})</h2>
					<div className="todo-items">
						{done.map((todo) => (
							<TodoItem
								key={todo.id}
								todo={todo}
								onUndo={onUndo}
								onDelete={onDelete}
							/>
						))}
					</div>
				</section>
			)}

			{active.length === 0 && done.length === 0 && (
				<div className="empty-state">
					<p>タスクがありません</p>
					<p className="empty-hint">
						上のフォームから追加するか、CSVまたはJSONファイルをドロップしてください
					</p>
				</div>
			)}
		</div>
	);
};
