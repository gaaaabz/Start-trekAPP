
import React from 'react';
import { View, Text, TouchableOpacity, } from 'react-native';
import { Link } from 'expo-router';

export default function Home() {
  return (
    <View style={{ flex: 1, backgroundColor: '#0b0f19' }}>
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

        <View
          style={{backgroundColor: '#12172b',
            borderRadius: 12,
            padding: 18,
            marginTop: 10,
            marginBottom: 26,
            borderWidth: 1,
            borderColor: '#1d2440',
          }}
        >
          <Text
            style={{
              color: '#cbd5f5',
              fontSize: 15,
              lineHeight: 22,
              textAlign: 'center',
            }}
          >
            Descubra como diferentes profissões moldaram o mundo ao longo da história
            e como novas carreiras podem surgir no futuro. O StartTrek é um projeto vivo 
            criado por estudantes curiosos com objetivo de preservar profissoes mortas, e 
            levantar debates sobre quais profissões podem deixar de existir ou que vão 
            existir no futuro. Aqui é um espaço livre para você compartilhar suas ideias,
            curiosidades, e experiências.
          </Text>
        </View>


        <Link href="./categorias" asChild>
          <TouchableOpacity style={{ padding: 14, borderRadius: 999, backgroundColor: '#63b3ff', marginBottom: 12 }}>
            <Text style={{ textAlign: 'center', color: '#fff', fontWeight: '700' }}>Começar Agora</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}