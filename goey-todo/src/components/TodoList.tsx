import {
	DndContext,
	type DragEndEvent,
	PointerSensor,
	closestCenter,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	SortableContext,
	arrayMove,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
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
	/** アクティブタスクの並べ替え時のコールバック */
	onReorderActive: (todos: Todo[]) => void;
	/** 完了済みタスクの並べ替え時のコールバック */
	onReorderDone: (todos: Todo[]) => void;
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
	onReorderActive,
	onReorderDone,
}: TodoListProps) => {
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		}),
	);

	/**
	 * アクティブタスクのドラッグ終了時の処理
	 */
	const handleDragEndActive = (event: DragEndEvent) => {
		const { active: draggedItem, over } = event;
		if (over && draggedItem.id !== over.id) {
			const oldIndex = active.findIndex((t) => t.id === draggedItem.id);
			const newIndex = active.findIndex((t) => t.id === over.id);
			onReorderActive(arrayMove(active, oldIndex, newIndex));
		}
	};

	/**
	 * 完了済みタスクのドラッグ終了時の処理
	 */
	const handleDragEndDone = (event: DragEndEvent) => {
		const { active: draggedItem, over } = event;
		if (over && draggedItem.id !== over.id) {
			const oldIndex = done.findIndex((t) => t.id === draggedItem.id);
			const newIndex = done.findIndex((t) => t.id === over.id);
			onReorderDone(arrayMove(done, oldIndex, newIndex));
		}
	};

	return (
		<div className="todo-list">
			{active.length > 0 && (
				<section className="todo-section">
					<h2 className="section-title">タスク ({active.length})</h2>
					<DndContext
						sensors={sensors}
						collisionDetection={closestCenter}
						onDragEnd={handleDragEndActive}
					>
						<SortableContext
							items={active.map((t) => t.id)}
							strategy={verticalListSortingStrategy}
						>
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
						</SortableContext>
					</DndContext>
				</section>
			)}

			{done.length > 0 && (
				<section className="todo-section">
					<h2 className="section-title done-title">
						完了済み ({done.length})
					</h2>
					<DndContext
						sensors={sensors}
						collisionDetection={closestCenter}
						onDragEnd={handleDragEndDone}
					>
						<SortableContext
							items={done.map((t) => t.id)}
							strategy={verticalListSortingStrategy}
						>
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
						</SortableContext>
					</DndContext>
				</section>
			)}

			{active.length === 0 && done.length === 0 && (
				<div className="empty-state">
					<div className="empty-icon">
						<svg
							width="64"
							height="64"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M12 3v18" />
							<path d="M5 10l7-7 7 7" />
							<rect x="4" y="14" width="16" height="6" rx="2" />
						</svg>
					</div>
					<p className="empty-title">タスクがありません</p>
					<p className="empty-hint">
						上のフォームから追加するか、
						<br />
						CSVまたはJSONファイルをドロップしてください
					</p>
				</div>
			)}
		</div>
	);
};
