import React from 'react';
import { View, Dimensions } from 'react-native';

export default function SkeletonGrid({ columns = 2, itemSize = 150, rows = 6 }: { columns?: number; itemSize?: number; rows?: number }) {
  const items = Array.from({ length: columns * rows });
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', padding: 8 }}>
      {items.map((_, i) => (
        <View key={i} style={{
          width: itemSize,
          height: itemSize,
          borderRadius: 8,
          backgroundColor: '#d2cfcfd3',
          marginRight: (i + 1) % columns === 0 ? 0 : 8,
          marginBottom: 8,
        }} />
      ))}
    </View>
  );
}
