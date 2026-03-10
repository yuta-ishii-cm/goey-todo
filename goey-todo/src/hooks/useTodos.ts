import { useCallback, useState } from "react";
import { useToast } from "../contexts/ToastContext";
import { processFile } from "../utils/fileProcessor";
import { exportJSON } from "../utils/jsonHandler";

/** Todoアイテムの型定義 */
interface Todo {
	/** 一意のID */
	id: number;
	/** タスクのテキスト */
	text: string;
	/** 完了フラグ */
	done: boolean;
}

/**
 * TODOの状態管理フック
 * @returns TODOの状態と操作関数
 */
export const useTodos = () => {
	const [todos, setTodos] = useState<Todo[]>([]);
	const [completedCount, setCompletedCount] = useState(0);
	const toastCtx = useToast();

	/**
	 * タスクを追加する
	 * @param text - タスクのテキスト
	 */
	const addTodo = useCallback(
		(text: string) => {
			setTodos((prev) => [{ id: Date.now(), text, done: false }, ...prev]);
			toastCtx.success(`追加: ${text}`);
		},
		[toastCtx],
	);

	/**
	 * タスクを完了する
	 * @param todo - 完了するタスク
	 */
	const completeTodo = useCallback(
		(todo: Todo) => {
			setTodos((prev) =>
				prev.map((t) => (t.id === todo.id ? { ...t, done: true } : t)),
			);
			setCompletedCount((c) => c + 1);
			toastCtx.success(`完了: "${todo.text}"`);
		},
		[toastCtx],
	);

	/**
	 * タスクを削除する（Action Button付きエラートースト）
	 * @param todo - 削除するタスク
	 */
	const deleteTodo = useCallback(
		(todo: Todo) => {
			setTodos((prev) => prev.filter((t) => t.id !== todo.id));

			const toastId = toastCtx.error(`削除: "${todo.text}"`, {
				action: {
					label: "元に戻す",
					onClick: () => {
						setTodos((prev) => [todo, ...prev]);
						toastCtx.dismiss(toastId);
						toastCtx.info("復元しました");
					},
				},
			});
		},
		[toastCtx],
	);

	/**
	 * 完了状態を戻す
	 * @param todo - 完了を戻すタスク
	 */
	const undoComplete = useCallback(
		(todo: Todo) => {
			setTodos((prev) =>
				prev.map((t) => (t.id === todo.id ? { ...t, done: false } : t)),
			);
			setCompletedCount((c) => Math.max(0, c - 1));
			toastCtx.warning(`戻しました: "${todo.text}"`);
		},
		[toastCtx],
	);

	/**
	 * ファイルからタスクをインポートする
	 * @param file - インポートするファイル
	 */
	const importFile = useCallback(
		(file: File) => {
			const toastId = toastCtx.toast("インポート中...");

			processFile(file, (tasks: string[]) => {
				const newTodos = tasks.map((text, idx) => ({
					id: Date.now() + idx,
					text,
					done: false,
				}));
				setTodos((prev) => [...newTodos, ...prev]);

				toastCtx.update(toastId, {
					title: `${tasks.length} 件のタスクをインポートしました`,
					type: "success",
					icon: null,
				});
			});
		},
		[toastCtx],
	);

	/**
	 * TODOをJSONファイルとしてエクスポートする
	 */
	const exportTodos = useCallback(() => {
		const toastId = toastCtx.toast("エクスポート中...");

		const delay = 400 + Math.random() * 400;
		setTimeout(() => {
			exportJSON(todos);
			toastCtx.update(toastId, {
				title: `${todos.length} 件のタスクをエクスポートしました`,
				type: "success",
				icon: null,
			});
		}, delay);
	}, [todos, toastCtx]);

	const activeTodos = todos.filter((t) => !t.done);
	const doneTodos = todos.filter((t) => t.done);

	/**
	 * アクティブなタスクの順序を更新する
	 * @param reorderedActive - 並べ替え後のアクティブタスク配列
	 */
	const reorderActiveTodos = useCallback((reorderedActive: Todo[]) => {
		setTodos((prev) => {
			const done = prev.filter((t) => t.done);
			return [...reorderedActive, ...done];
		});
	}, []);

	/**
	 * 完了済みタスクの順序を更新する
	 * @param reorderedDone - 並べ替え後の完了済みタスク配列
	 */
	const reorderDoneTodos = useCallback((reorderedDone: Todo[]) => {
		setTodos((prev) => {
			const active = prev.filter((t) => !t.done);
			return [...active, ...reorderedDone];
		});
	}, []);

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
		reorderActiveTodos,
		reorderDoneTodos,
	};
};
