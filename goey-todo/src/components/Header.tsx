import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";
import { useRef } from "react";

/** Headerコンポーネントのプロパティ */
interface HeaderProps {
	/** 完了したタスクの数 */
	completedCount: number;
	/** 全タスクの数 */
	totalCount: number;
	/** ファイルインポート時のコールバック */
	onImport: (file: File) => void;
	/** エクスポートボタン押下時のコールバック */
	onExport: () => void;
}

/**
 * アプリケーションのヘッダーコンポーネント
 * タイトル、完了カウント、インポート/エクスポートボタンを表示
 * @param props - Headerのプロパティ
 * @returns Header要素
 */
export const Header = ({
	completedCount,
	totalCount,
	onImport,
	onExport,
}: HeaderProps) => {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

	/**
	 * インポートボタンクリック時にファイル入力をトリガー
	 */
	const handleImportClick = () => {
		fileInputRef.current?.click();
	};

	/**
	 * ファイル選択時の処理
	 * @param e - ファイル入力のchangeイベント
	 */
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			onImport(file);
			e.target.value = "";
		}
	};

	return (
		<header className="header">
			<div className="header-top">
				<div className="header-title">
					<h1>goey-todo</h1>
					{completedCount > 0 && (
						<span className="completed-badge">{completedCount} 完了</span>
					)}
				</div>
				<div className="header-actions">
					<input
						ref={fileInputRef}
						type="file"
						accept=".csv,.json"
						onChange={handleFileChange}
						className="hidden"
					/>
					<Button variant="outline" size="sm" onClick={handleImportClick}>
						<Upload className="w-4 h-4 mr-2" />
						インポート
					</Button>
					<Button variant="outline" size="sm" onClick={onExport}>
						<Download className="w-4 h-4 mr-2" />
						エクスポート
					</Button>
				</div>
			</div>
			{totalCount > 0 && (
				<div className="progress-container">
					<div className="progress-bar">
						<div
							className="progress-fill"
							style={{ width: `${progressPercent}%` }}
						/>
					</div>
					<span className="progress-text">
						{completedCount} / {totalCount} タスク完了
					</span>
				</div>
			)}
		</header>
	);
};
