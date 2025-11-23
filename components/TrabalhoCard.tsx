// components/TrabalhoCard.tsx
import React from 'react';
import { View, Text } from 'react-native';

type Props = { trabalho: { id: number; titulo: string; resumo: string } };

export default function TrabalhoCard({ trabalho }: Props) {
  return (
    <View style={{ backgroundColor: '#161b33', padding: 12, borderRadius: 12 }}>
      <Text style={{ color: '#7aa7ff', fontWeight: '700', fontSize: 18 }}>{trabalho.titulo}</Text>
      <Text style={{ color: '#cbd5f5', marginTop: 8 }}>{trabalho.resumo}</Text>
    </View>
  );
}
