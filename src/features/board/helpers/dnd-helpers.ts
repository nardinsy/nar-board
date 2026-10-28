import { UniqueIdentifier } from '@dnd-kit/core';
import { ColumnData } from '../types';

export const findColumnId = (itemId: UniqueIdentifier, columns: ColumnData[]) => {
  if (columns.some((col) => col.status === itemId)) {
    return itemId;
  }

  return columns.find((col) => col.tasks.some((task) => task.id === itemId))?.status;
};
