import { GooeyToaster } from "goey-toast";
import { Toaster as SonnerToaster } from "sonner";
import "./App.css";
import { FileDropZone } from "./components/FileDropZone";
import { Header } from "./components/Header";
import { ToastSwitcher } from "./components/ToastSwitcher";
import { TodoInput } from "./components/TodoInput";
import { TodoList } from "./components/TodoList";
import { ToastProvider, useToast } from "./contexts/ToastContext";
import { useTodos } from "./hooks/useTodos";

/**
 * メインコンテンツコンポーネント
 * @returns メインコンテンツ要素
 */
const AppContent = () => {
	const todoState = useTodos();
	const { library } = useToast();

	return (
		<div className="app">
			<div className="toast-area">
				{library === "goey-toast" ? (
					<GooeyToaster
						position="bottom-right"
						preset="bouncy"
						showProgress
						maxQueue={10}
						queueOverflow="drop-oldest"
						duration={6000}
						visibleToasts={10}
					/>
				) : (
					<SonnerToaster
						position="bottom-right"
						richColors
						duration={6000}
						visibleToasts={10}
					/>
				)}
			</div>
			<FileDropZone onFileDrop={todoState.importFile} />
			<div className="container">
				<ToastSwitcher />
				<Header
					completedCount={todoState.completedCount}
					totalCount={todoState.activeTodos.length + todoState.doneTodos.length}
					onImport={todoState.importFile}
					onExport={todoState.exportJSON}
				/>
				<TodoInput onAdd={todoState.addTodo} />
				<TodoList
					active={todoState.activeTodos}
					done={todoState.doneTodos}
					onComplete={todoState.completeTodo}
					onUndo={todoState.undoComplete}
					onDelete={todoState.deleteTodo}
					onReorderActive={todoState.reorderActiveTodos}
					onReorderDone={todoState.reorderDoneTodos}
				/>
			</div>
		</div>
	);
};

/**
 * アプリケーションのルートコンポーネント
 * @returns App要素
 */
const App = () => {
	return (
		<ToastProvider>
			<AppContent />
		</ToastProvider>
	);
};

export default App;
