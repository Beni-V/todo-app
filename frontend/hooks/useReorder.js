import { useCallback } from 'react';

const useReorder = (items, setItems) => {
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onDragEnd = useCallback(
    (result) => {
      if (!result.destination) {
        return;
      }

      const newItems = reorder(items, result.source.index, result.destination.index);

      setItems(
        newItems.map((item, index) => ({
          ...item,
          orderId: index.toString()
        }))
      );
    },
    [items, setItems]
  );

  return onDragEnd;
};

export default useReorder;
