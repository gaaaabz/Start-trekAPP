import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';

const BASE_URL = 'http://localhost:8080';

type Categoria = {
  idCategoria: number;
  nomeCategoria: string;
  conteudoCategoria: string;
};

export default function Categorias() {
  const router = useRouter();
  const [lista, setLista] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarTodasCategorias();
  }, []);

  async function carregarTodasCategorias() {
    try {
      const resposta = await fetch(`${BASE_URL}/categorias?page=0&size=20`);
      if (!resposta.ok) throw new Error('Erro ao buscar categorias.');
      const page = await resposta.json();
      setLista(page.content || []);
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Erro ao carregar categorias.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20, backgroundColor: '#0b0f19' }}>

      {/* 🔙 Botão voltar */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={{ marginBottom: 20, paddingVertical: 6, width: 80 }}
      >
        <Text style={{ color: '#63b3ff', fontSize: 18 }}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={{ color: '#7aa7ff', fontSize: 26, fontWeight: '700', marginBottom: 12 }}>
        Categorias
      </Text>

      {loading ? (
        <Text style={{ color: '#fff' }}>Carregando...</Text>
      ) : lista.length === 0 ? (
        <Text style={{ color: '#fff' }}>Nenhuma categoria encontrada.</Text>
      ) : (
        lista.map(cat => (
          <View key={cat.idCategoria} style={{ backgroundColor: '#161b33', padding: 16, borderRadius: 12, marginBottom: 12 }}>
            <Text style={{ color: '#7aa7ff', fontSize: 18, marginBottom: 6 }}>
              {cat.nomeCategoria}
            </Text>
            <Text style={{ color: '#cbd5f5', marginBottom: 10 }}>{cat.conteudoCategoria}</Text>

            <Link href={`/trabalhos?categoria=${encodeURIComponent(cat.idCategoria)}`} asChild>
              <TouchableOpacity style={{ paddingVertical: 8, paddingHorizontal: 14, borderRadius: 999, backgroundColor: '#7aa7ff' }}>
                <Text style={{ color: '#fff', fontWeight: '700' }}>Ver Mais</Text>
              </TouchableOpacity>
            </Link>
          </View>
        ))
      )}
    </ScrollView>
  );
}
