import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
export const Content = ({ children }) => {
    return (
    <DndProvider backend={HTML5Backend}>
        <div className="Content">
            {children}
        </div>
    </DndProvider>
    )
}