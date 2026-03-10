import { useToast } from "../contexts/ToastContext";

/**
 * トーストライブラリ切り替えコンポーネント
 * @returns 切り替えボタン要素
 */
export const ToastSwitcher = () => {
	const { library, setLibrary } = useToast();

	return (
		<div className="toast-switcher">
			<span className="toast-switcher-label">Toast Library:</span>
			<div className="toast-switcher-buttons">
				<button
					type="button"
					className={`toast-switcher-btn ${library === "goey-toast" ? "active" : ""}`}
					onClick={() => setLibrary("goey-toast")}
				>
					goey-toast
				</button>
				<button
					type="button"
					className={`toast-switcher-btn ${library === "sonner" ? "active" : ""}`}
					onClick={() => setLibrary("sonner")}
				>
					Sonner
				</button>
			</div>
		</div>
	);
};
