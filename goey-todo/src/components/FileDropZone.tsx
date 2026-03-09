import { useCallback, useEffect, useRef, useState } from "react";

/** FileDropZoneコンポーネントのプロパティ */
interface FileDropZoneProps {
	/** ファイルドロップ時のコールバック */
	onFileDrop: (file: File) => void;
}

/**
 * ファイルドラッグ＆ドロップゾーンコンポーネント
 * ファイルをドラッグ中はフルスクリーンオーバーレイを表示
 * @param props - FileDropZoneのプロパティ
 * @returns FileDropZone要素
 */
export const FileDropZone = ({ onFileDrop }: FileDropZoneProps) => {
	const [isDragging, setIsDragging] = useState(false);
	const dragCounterRef = useRef(0);

	/**
	 * ドラッグ進入時の処理
	 */
	const handleDragEnter = useCallback((e: DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		dragCounterRef.current += 1;
		if (e.dataTransfer?.items && e.dataTransfer.items.length > 0) {
			setIsDragging(true);
		}
	}, []);

	/**
	 * ドラッグ離脱時の処理
	 */
	const handleDragLeave = useCallback((e: DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		dragCounterRef.current -= 1;
		if (dragCounterRef.current === 0) {
			setIsDragging(false);
		}
	}, []);

	/**
	 * ドラッグオーバー時の処理
	 */
	const handleDragOver = useCallback((e: DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
	}, []);

	/**
	 * ドロップ時の処理
	 */
	const handleDrop = useCallback(
		(e: DragEvent) => {
			e.preventDefault();
			e.stopPropagation();
			setIsDragging(false);
			dragCounterRef.current = 0;

			if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
				const file = e.dataTransfer.files[0];
				onFileDrop(file);
			}
		},
		[onFileDrop],
	);

	useEffect(() => {
		window.addEventListener("dragenter", handleDragEnter);
		window.addEventListener("dragleave", handleDragLeave);
		window.addEventListener("dragover", handleDragOver);
		window.addEventListener("drop", handleDrop);

		return () => {
			window.removeEventListener("dragenter", handleDragEnter);
			window.removeEventListener("dragleave", handleDragLeave);
			window.removeEventListener("dragover", handleDragOver);
			window.removeEventListener("drop", handleDrop);
		};
	}, [handleDragEnter, handleDragLeave, handleDragOver, handleDrop]);

	if (!isDragging) {
		return null;
	}

	return (
		<div className="file-drop-overlay">
			<div className="file-drop-content">
				<p className="file-drop-title">ファイルをドロップ</p>
				<p className="file-drop-hint">CSV または JSON ファイルに対応</p>
			</div>
		</div>
	);
};
