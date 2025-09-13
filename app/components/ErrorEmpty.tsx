import React from 'react';
import { View, Text, Button } from 'react-native';

export default function ErrorEmpty({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
      <Text style={{ marginBottom: 12 }}>{message || 'No data'}</Text>
      <Button title="Retry" onPress={onRetry} color= {'#F4BA44'}/>
    </View>
  );
}
