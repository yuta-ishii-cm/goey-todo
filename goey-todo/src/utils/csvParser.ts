/**
 * CSV文字列からタスク名の配列を抽出する
 * @param text - CSV形式の文字列
 * @returns タスク名の配列
 */
export const parseCSV = (text: string): string[] => {
	const lines = text
		.trim()
		.split("\n")
		.map((l) => l.trim())
		.filter(Boolean);
	if (!lines.length) {
		return [];
	}

	// ヘッダー行の自動検出
	const first = lines[0].toLowerCase();
	const hasHeader = ["task", "todo", "タスク", "name", "title"].some((h) =>
		first.includes(h),
	);
	const startIdx = hasHeader ? 1 : 0;

	return lines
		.slice(startIdx)
		.map((line) => {
			// 1列目を取得（ダブルクォート対応）
			const match = line.match(/^"([^"]*)"/) || line.match(/^([^,]*)/);
			return match ? match[1].trim() : line.trim();
		})
		.filter(Boolean);
};
