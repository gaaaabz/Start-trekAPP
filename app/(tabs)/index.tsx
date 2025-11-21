
import React from 'react';
import { View, Text, TouchableOpacity, } from 'react-native';
import { Link } from 'expo-router';

export default function Home() {
  return (
    <view style={{ flex: 1, backgroundColor: '#0b0f19' }}>
      <View style={{ padding: 20 }}>
        <View style={{ height: 70, backgroundColor: '#12172b', borderRadius: 10, justifyContent: 'center', paddingHorizontal: 16, marginBottom: 20 }}>
          <Text style={{ color: '#63b3ff', fontSize: 20, fontWeight: '800' }}>StartTrek</Text>
        </View>

        <View style={{ alignItems: 'center', marginVertical: 24 }}>
          <Text style={{ color: '#63b3ff', fontSize: 28, fontWeight: '800', marginBottom: 8 }}>Explore. Conecte. Aprenda.</Text>
          <Text style={{ color: '#cbd5f5', textAlign: 'center', maxWidth: 600 }}>
            Bem-vindo ao StartTrek — seu acervo de trabalhos que existiram, existem, ou vão existir.
          </Text>
        </View>

        <Link href="../login" asChild>
          <TouchableOpacity style={{ padding: 14, borderRadius: 999, backgroundColor: '#63b3ff', marginBottom: 12 }}>
            <Text style={{ textAlign: 'center', color: '#fff', fontWeight: '700' }}>Começar Agora</Text>
          </TouchableOpacity>
        </Link>

        <View style={{ marginTop: 24 }}>
          <Link href="/categorias" asChild>
            <TouchableOpacity style={{ padding: 14, borderRadius: 12, backgroundColor: '#141a29' }}>
              <Text style={{ color: '#7aa7ff', fontWeight: '700' }}>Explorar Categorias</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </view>
  );
}
