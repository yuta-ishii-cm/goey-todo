import { gooeyToast } from "goey-toast";
import { createContext, useCallback, useContext, useState } from "react";
import { toast as sonnerToast } from "sonner";

/** トーストライブラリの種類 */
type ToastLibrary = "goey-toast" | "sonner";

/** アクションボタンの設定 */
interface ToastAction {
	/** ボタンラベル */
	label: string;
	/** クリック時の処理 */
	onClick: () => void;
}

/** トースト表示オプション */
interface ToastOptions {
	/** アクションボタン */
	action?: ToastAction;
}

/** トースト更新オプション */
interface ToastUpdateOptions {
	/** タイトル */
	title: string;
	/** トーストタイプ */
	type: "success" | "error" | "warning" | "info";
	/** アイコン（nullで非表示） */
	icon: null;
}

/** Contextの型定義 */
interface ToastContextType {
	/** 現在のトーストライブラリ */
	library: ToastLibrary;
	/** トーストライブラリを切り替える */
	setLibrary: (lib: ToastLibrary) => void;
	/** 通常トースト */
	toast: (message: string) => string | number;
	/** 成功トースト */
	success: (message: string, options?: ToastOptions) => string | number;
	/** エラートースト */
	error: (message: string, options?: ToastOptions) => string | number;
	/** 警告トースト */
	warning: (message: string, options?: ToastOptions) => string | number;
	/** 情報トースト */
	info: (message: string, options?: ToastOptions) => string | number;
	/** トーストを閉じる */
	dismiss: (id: string | number) => void;
	/** トーストを更新する */
	update: (id: string | number, options: ToastUpdateOptions) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

/**
 * トーストプロバイダー
 * @param props - children
 * @returns Provider要素
 */
export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
	const [library, setLibrary] = useState<ToastLibrary>("goey-toast");

	const toast = useCallback(
		(message: string): string | number => {
			if (library === "goey-toast") {
				return gooeyToast(message);
			}
			return sonnerToast(message);
		},
		[library],
	);

	const success = useCallback(
		(message: string, options?: ToastOptions): string | number => {
			if (library === "goey-toast") {
				return gooeyToast.success(message, options);
			}
			return sonnerToast.success(message, {
				action: options?.action
					? { label: options.action.label, onClick: options.action.onClick }
					: undefined,
			});
		},
		[library],
	);

	const error = useCallback(
		(message: string, options?: ToastOptions): string | number => {
			if (library === "goey-toast") {
				return gooeyToast.error(message, options);
			}
			return sonnerToast.error(message, {
				action: options?.action
					? { label: options.action.label, onClick: options.action.onClick }
					: undefined,
			});
		},
		[library],
	);

	const warning = useCallback(
		(message: string, options?: ToastOptions): string | number => {
			if (library === "goey-toast") {
				return gooeyToast.warning(message, options);
			}
			return sonnerToast.warning(message, {
				action: options?.action
					? { label: options.action.label, onClick: options.action.onClick }
					: undefined,
			});
		},
		[library],
	);

	const info = useCallback(
		(message: string, options?: ToastOptions): string | number => {
			if (library === "goey-toast") {
				return gooeyToast.info(message, options);
			}
			return sonnerToast.info(message, {
				action: options?.action
					? { label: options.action.label, onClick: options.action.onClick }
					: undefined,
			});
		},
		[library],
	);

	const dismiss = useCallback(
		(id: string | number) => {
			if (library === "goey-toast") {
				gooeyToast.dismiss(id);
			} else {
				sonnerToast.dismiss(id);
			}
		},
		[library],
	);

	const update = useCallback(
		(id: string | number, options: ToastUpdateOptions) => {
			if (library === "goey-toast") {
				gooeyToast.update(id, options);
			} else {
				sonnerToast.dismiss(id);
				if (options.type === "success") {
					sonnerToast.success(options.title);
				} else if (options.type === "error") {
					sonnerToast.error(options.title);
				} else if (options.type === "warning") {
					sonnerToast.warning(options.title);
				} else {
					sonnerToast.info(options.title);
				}
			}
		},
		[library],
	);

	return (
		<ToastContext.Provider
			value={{
				library,
				setLibrary,
				toast,
				success,
				error,
				warning,
				info,
				dismiss,
				update,
			}}
		>
			{children}
		</ToastContext.Provider>
	);
};

/**
 * トーストContextを使用するフック
 * @returns ToastContextType
 */
export const useToast = (): ToastContextType => {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error("useToast must be used within a ToastProvider");
	}
	return context;
};
