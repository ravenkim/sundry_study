import React, {useEffect, useState} from 'react';
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

const SSorderDragTable = ({

                              columns,
                              reset,
                              data,
                              setFinalData

                          }) => {



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


    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        if (reset) {
            setDataSource(data.map((i, index) => {
                return {
                    ...i,
                    key: index + 1
                }
            }))
        }
    }, [reset, data]);




    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 1,
            },
        }),
    );


    useEffect(() => {
        setFinalData(dataSource.map((item, index) => {
                return {
                    boardSn: index + 1,
                    boardId: item.boardId
                }
            }
        ))
    }, [dataSource]);

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
                    rowKey={'key'}
                    columns={[
                        {
                            title: '순서',
                            render: (text, record, index) => index + 1,
                        },
                        ...columns
                    ]}
                    dataSource={dataSource}
                    pagination={false} // pagination 비활성화
                    scroll={{y: 400, scrollToFirstRowOnChange: true}} // 인피니티 스크롤 적용
                />
            </SortableContext>
        </DndContext>
    );
};

export default SSorderDragTable;
