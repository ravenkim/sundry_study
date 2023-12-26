import React from 'react';
import {DndContext, PointerSensor, useSensor, useSensors} from '@dnd-kit/core';
import {restrictToVerticalAxis} from '@dnd-kit/modifiers';
import {
    SortableContext,
    arrayMove,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import {Table} from 'antd';

const SSorderDragTable = () => {
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Age',
            dataIndex: 'age',
        },
        {
            title: 'Address',
            dataIndex: 'address',
        },
    ]

    const Row = (props) => {
        const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({
            id: props['data-row-key'],
        });
        const style = {
            ...props.style,
            transform: CSS.Transform.toString(
                transform && {
                    ...transform,
                    scaleY: 1,
                },
            ),
            transition,
            cursor: 'move',
            ...(isDragging
                ? {
                    position: 'relative',
                    zIndex: 9999,
                }
                : {}),
        };
        return <tr {...props} ref={setNodeRef} style={style} {...attributes} {...listeners} />;
    };


    const [dataSource, setDataSource] = useState([
        {
            key: '1',
            name: 'John Brown',
            age: 32,
            address:
                'Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text Long text',
        },
        {
            key: '2',
            name: 'Jim Green',
            age: 42,
            address: 'London No. 1 Lake Park',
        },
        {
            key: '3',
            name: 'Joe Black',
            age: 32,
            address: 'Sidney No. 1 Lake Park',
        },
    ]);
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                // https://docs.dndkit.com/api-documentation/sensors/pointer#activation-constraints
                distance: 1,
            },
        }),
    );
    const onDragEnd = ({active, over}) => {
        if (active.id !== over?.id) {
            setDataSource((prev) => {
                const activeIndex = prev.findIndex((i) => i.key === active.id);
                const overIndex = prev.findIndex((i) => i.key === over?.id);
                return arrayMove(prev, activeIndex, overIndex);
            });
        }
    };

    return (
         <DndContext sensors={sensors} modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
      <SortableContext
        // rowKey array
        items={dataSource.map((i) => i.key)}
        strategy={verticalListSortingStrategy}
      >
        <Table
          components={{
            body: {
              row: Row,
            },
          }}
          rowKey="key"
          columns={columns}
          dataSource={dataSource}
        />
      </SortableContext>
    </DndContext>
    );
};

export default SSorderDragTable;
