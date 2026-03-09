import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useState } from "react";

/** TodoInputコンポーネントのプロパティ */
interface TodoInputProps {
	/** タスク追加時のコールバック */
	onAdd: (text: string) => void;
}

/**
 * タスク入力フォームコンポーネント
 * @param props - TodoInputのプロパティ
 * @returns TodoInput要素
 */
export const TodoInput = ({ onAdd }: TodoInputProps) => {
	const [text, setText] = useState("");

	/**
	 * フォーム送信時の処理
	 * @param e - フォームsubmitイベント
	 */
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const trimmed = text.trim();
		if (trimmed) {
			onAdd(trimmed);
			setText("");
		}
	};

	return (
		<form onSubmit={handleSubmit} className="todo-input">
			<Input
				type="text"
				value={text}
				onChange={(e) => setText(e.target.value)}
				placeholder="新しいタスクを追加..."
				className="flex-1"
			/>
			<Button type="submit" disabled={!text.trim()}>
				<Plus className="w-4 h-4 mr-2" />
				追加
			</Button>
		</form>
	);
};
