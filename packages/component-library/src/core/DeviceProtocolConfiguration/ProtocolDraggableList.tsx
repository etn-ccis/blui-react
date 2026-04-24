import { Box, Divider } from '@mui/material';
import { DragHandle } from '@mui/icons-material';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { BLUIColors } from '@brightlayer-ui/colors';
import { memo } from 'react';

const DraggableItem = memo(({ item, index, renderItem }: any) => (
    <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
        {(draggableProvided, snapshot) => (
            <div ref={draggableProvided.innerRef} {...draggableProvided.draggableProps}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'stretch', // Changed from 'center' to 'stretch'
                        bgcolor: snapshot.isDragging ? 'action.hover' : 'transparent',
                    }}
                >
                    <Box
                        {...draggableProvided.dragHandleProps}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            pl: 2,
                            pr: 2,
                            cursor: 'grab',
                            '&:active': {
                                cursor: 'grabbing',
                            },
                            '&:hover': {
                                bgcolor: 'action.hover',
                            },
                        }}
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering collapse when clicking drag handle
                        }}
                    >
                        <DragHandle sx={{ color: BLUIColors.black[200] }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>{renderItem(item)}</Box>
                </Box>
                <Divider />
            </div>
        )}
    </Draggable>
));

export const DraggableList = memo(
    ({
        items,
        onDragEnd,
        renderItem,
    }: {
        items: any[];
        onDragEnd: (sourceIndex: any, destinationIndex: any) => void;
        renderItem: (item: any) => JSX.Element;
    }): JSX.Element => {
        const handleDragEnd = (result: any): void => {
            if (!result.destination) {
                return;
            }

            onDragEnd(result.source.index, result.destination.index);
        };

        return (
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="droppable">
                    {(droppableProvided) => (
                        <div {...droppableProvided.droppableProps} ref={droppableProvided.innerRef}>
                            {items.map((item, index) => (
                                <DraggableItem key={item.id} item={item} index={index} renderItem={renderItem} />
                            ))}
                            {droppableProvided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        );
    }
);
