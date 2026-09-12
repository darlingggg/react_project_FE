import type { FC, JSX } from 'react'
import { DndContext, closestCenter, MouseSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

type PropsType = {
  children: JSX.Element | JSX.Element[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: Array<{ id: string; [key: string]: any }>
  onDragEnd: (oldIndex: number, newIndex: number) => void
}
const SortableContainer: FC<PropsType> = prop => {
  const { children, items, onDragEnd } = prop

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 10 } }) // 鼠标移动小于10px则不触发拖拽
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over === null) return

    if (active.id !== over.id) {
      const oldIndex = items.findIndex(c => c.fe_id === active.id)
      const newIndex = items.findIndex(c => c.fe_id === over.id)
      onDragEnd(oldIndex, newIndex)
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  )
}
export default SortableContainer
