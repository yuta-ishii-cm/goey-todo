import { useState } from 'react'
import { GooeyToaster } from 'goey-toast'
import { Header } from './components/Header'
import { TodoInput } from './components/TodoInput'
import { TodoList } from './components/TodoList'
import { FileDropZone } from './components/FileDropZone'
import { useTodos } from './hooks/useTodos'
import './App.css'

/**
 * アプリケーションのルートコンポーネント
 * @returns App要素
 */
const App = () => {
  const todoState = useTodos()
  const [isToastExpanded, setIsToastExpanded] = useState(false)

  return (
    <div className="app">
      <div
        className="toast-area"
        onClick={() => setIsToastExpanded(prev => !prev)}
      >
        <GooeyToaster
          position="top-right"
          preset="bouncy"
          showProgress
          maxQueue={10}
          queueOverflow="drop-oldest"
          duration={3000}
          expand={isToastExpanded}
          visibleToasts={10}
        />
      </div>
      <FileDropZone onFileDrop={todoState.importFile} />
      <div className="container">
        <Header
          completedCount={todoState.completedCount}
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
        />
      </div>
    </div>
  )
}

export default App
