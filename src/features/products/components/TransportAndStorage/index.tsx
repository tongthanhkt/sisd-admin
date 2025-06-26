import React from 'react';
import { SortableListField } from '../SortableListField';

export const TransportAndStorage = () => {
  return (
    <SortableListField
      fieldName='transportationAndStorage'
      title='Transportation and Storage'
      addButtonText='Add Rule'
      placeholder='Enter rule'
    />
  );
};
