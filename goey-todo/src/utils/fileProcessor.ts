import { gooeyToast } from "goey-toast";
import { parseCSV } from "./csvParser";
import { parseJSON } from "./jsonHandler";

/**
 * ファイルを処理してタスクをインポートする（Promise Morph演出付き）
 * @param file - 処理するファイル
 * @param onImport - タスクがパースされた後に呼ばれるコールバック
 */
export const processFile = (
	file: File,
	onImport: (tasks: string[]) => void,
): void => {
	const ext = file.name.split(".").pop()?.toLowerCase();

	if (ext !== "csv" && ext !== "json") {
		gooeyToast.error(`非対応の形式: .${ext}`);
		return;
	}

	// Promise Morph: loading 開始
	const toastId = gooeyToast("読み込み中...");

	const reader = new FileReader();

	reader.onload = (e) => {
		// 意図的な遅延でモーフィング演出
		const delay = 600 + Math.random() * 800;
		setTimeout(() => {
			try {
				const text = e.target?.result as string;
				const tasks = ext === "csv" ? parseCSV(text) : parseJSON(text);

				if (!tasks.length) {
					gooeyToast.update(toastId, {
						title: "タスクが見つかりませんでした",
						type: "warning",
						icon: null,
					});
					return;
				}

				onImport(tasks);

				// Morph to success!
				gooeyToast.update(toastId, {
					title: `${tasks.length} 件のタスクをインポート!`,
					type: "success",
					icon: null,
				});
			} catch (err) {
				// Morph to error
				gooeyToast.update(toastId, {
					title: `読み込み失敗: ${(err as Error).message}`,
					type: "error",
					icon: null,
				});
			}
		}, delay);
	};

	reader.onerror = () => {
		gooeyToast.update(toastId, {
			title: "ファイルの読み込みに失敗しました",
			type: "error",
			icon: null,
		});
	};

	reader.readAsText(file);
};
