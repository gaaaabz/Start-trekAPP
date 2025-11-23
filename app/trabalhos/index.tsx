
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useLocalSearchParams, Link, useRouter } from 'expo-router';
import TrabalhoCard from '../../components/TrabalhoCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://localhost:8080';

type Trabalho = {
  idTrabalho: number;
  nomeTrabalho: string;
  conteudoTrabalho: string;
  categoria?: { idCategoria: number; nomeCategoria: string };
};

type Comentario = {
  idComentario: number;
  nomeUsuario: string;
  conteudoComentario: string;
};

export default function Trabalhos() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const idCategoria = params.categoria as string | undefined;

  const [trabalhos, setTrabalhos] = useState<Trabalho[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [comentariosMap, setComentariosMap] = useState<Record<number, Comentario[]>>({});

  useEffect(() => {
    (async () => {
      const t = await AsyncStorage.getItem('token');
      setToken(t);

      if (idCategoria) carregarTrabalhos(idCategoria);
      else setLoading(false);
    })();
  }, [idCategoria]);

  async function carregarTrabalhos(id: string) {
    try {
      setLoading(true);
      const resp = await fetch(`${BASE_URL}/trabalhos/categoria/${id}`);
      if (!resp.ok) throw new Error('Erro ao carregar trabalhos.');

      const lista: Trabalho[] = await resp.json();
      setTrabalhos(lista);

      // carrega comentários
      for (const tb of lista) {
        const cs = await carregarComentarios(tb.idTrabalho);
        setComentariosMap(prev => ({ ...prev, [tb.idTrabalho]: cs }));
      }

    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Erro ao carregar trabalhos.');
    } finally {
      setLoading(false);
    }
  }

  async function carregarComentarios(idTrabalho: number) {
    try {
      const resp = await fetch(`${BASE_URL}/comentarios/trabalho/${idTrabalho}`);
      if (!resp.ok) return [];
      return await resp.json();
    } catch {
      return [];
    }
  }

  async function comentar(idTrabalho: number, texto: string, onSuccess: () => void) {
    if (!texto.trim()) return Alert.alert('Digite um comentário.');

    if (!token) {
      Alert.alert('Faça login para comentar.');
      return;
    }

    try {
      const resp = await fetch(`${BASE_URL}/comentarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ conteudoComentario: texto, idTrabalho }),
      });

      if (!resp.ok) return Alert.alert('Erro', 'Erro ao comentar.');

      const novos = await carregarComentarios(idTrabalho);
      setComentariosMap(prev => ({ ...prev, [idTrabalho]: novos }));
      onSuccess();

    } catch {
      Alert.alert('Erro ao conectar.');
    }
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20, backgroundColor: '#0b0f19' }}>

      <TouchableOpacity
        onPress={() => router.back()}
        style={{ marginBottom: 20, paddingVertical: 6, paddingHorizontal: 8 }}
      >
        <Text style={{ color: '#63b3ff', fontSize: 18 }}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={{ fontSize: 24, color: '#9d7dff', fontWeight: '700', marginBottom: 12 }}>
        {trabalhos.length > 0 && trabalhos[0].categoria
          ? `Trabalhos da Categoria: ${trabalhos[0].categoria.nomeCategoria}`
          : 'Trabalhos'}
      </Text>

      {loading && <Text style={{ color: '#fff' }}>Carregando...</Text>}
      {!loading && trabalhos.length === 0 && (
        <Text style={{ color: '#fff' }}>Nenhum trabalho encontrado.</Text>
      )}

      {trabalhos.map(tb => (
        <View key={tb.idTrabalho} style={{ backgroundColor: '#161b33', padding: 16, borderRadius: 12, marginBottom: 12 }}>
          <TrabalhoCard
            trabalho={{
              id: tb.idTrabalho,
              titulo: tb.nomeTrabalho,
              resumo: tb.conteudoTrabalho
            }}
          />

          <Text style={{ color: '#9fbaff', marginTop: 10, fontWeight: '700' }}>Comentários</Text>

          {(comentariosMap[tb.idTrabalho] || []).map(c => (
            <View key={c.idComentario} style={{ marginTop: 8 }}>
              <Text style={{ color: '#fff' }}>
                <Text style={{ fontWeight: '700' }}>{c.nomeUsuario}</Text>: {c.conteudoComentario}
              </Text>
            </View>
          ))}

          {token ? (
            <ComentarioBox
              onSend={texto => comentar(tb.idTrabalho, texto, () => {})}
            />
          ) : (
            <Link href="/login" asChild>
              <TouchableOpacity style={{ marginTop: 10 }}>
                <Text style={{ color: '#8ab4ff' }}>Faça login</Text>
              </TouchableOpacity>
            </Link>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

function ComentarioBox({ onSend }: { onSend: (texto: string) => void }) {
  const [texto, setTexto] = useState('');
  return (
    <View style={{ marginTop: 10 }}>
      <TextInput
        value={texto}
        onChangeText={setTexto}
        placeholder="Escreva um comentário..."
        placeholderTextColor="#9aa3c6"
        multiline
        style={{ backgroundColor: '#1f1e2b', borderRadius: 8, padding: 10, color: '#fff', minHeight: 70 }}
      />

      <TouchableOpacity
        style={{ marginTop: 8, backgroundColor: '#9d7dff', padding: 10, borderRadius: 6 }}
        onPress={() => { onSend(texto); setTexto(''); }}
      >
        <Text style={{ color: '#fff', fontWeight: '700' }}>Enviar</Text>
      </TouchableOpacity>
    </View>
  );
}
