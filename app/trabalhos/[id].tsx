
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://10.0.2.2:8080'; // ajuste

type Trabalho = {
  idTrabalho: number;
  nomeTrabalho: string;
  conteudoTrabalho: string;
  categoria?: { nomeCategoria: string };
};

export default function TrabalhoDetalhe() {
  const { id } = useLocalSearchParams();
  const [trabalho, setTrabalho] = useState<Trabalho | null>(null);
  const [comentario, setComentario] = useState('');
  const [comentarios, setComentarios] = useState<{ idComentario: number; nomeUsuario: string; conteudoComentario: string; }[]>([]);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const t = await AsyncStorage.getItem('token');
      setToken(t);
      if (id) carregarDetalhe(Number(id));
    })();
  }, [id]);

  async function carregarDetalhe(idNum: number) {
    try {
      const resp = await fetch(`${BASE_URL}/trabalhos/${idNum}`);
      if (!resp.ok) throw new Error('Erro ao carregar trabalho.');
      const data: Trabalho = await resp.json();
      setTrabalho(data);
      const cs = await carregarComentarios(idNum);
      setComentarios(cs);
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Não foi possível carregar o trabalho.');
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

  async function enviarComentario() {
    if (!comentario.trim()) {
      Alert.alert('Digite um comentário.');
      return;
    }
    try {
      if (!token) {
        Alert.alert('Faça login para comentar.');
        return;
      }
      const resp = await fetch(`${BASE_URL}/comentarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ conteudoComentario: comentario, idTrabalho: trabalho!.idTrabalho }),
      });
      if (!resp.ok) {
        Alert.alert('Erro', 'Erro ao enviar comentário.');
        return;
      }
      setComentario('');
      const novos = await carregarComentarios(trabalho!.idTrabalho);
      setComentarios(novos);
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Erro ao conectar com o servidor.');
    }
  }

  if (!trabalho) return <View style={{ padding: 20, backgroundColor: '#0b0f19' }}><Text style={{ color: '#fff' }}>Carregando...</Text></View>;

  return (
    <ScrollView contentContainerStyle={{ padding: 20, backgroundColor: '#0b0f19' }}>
      <Text style={{ color: '#7aa7ff', fontSize: 22, fontWeight: '700', marginBottom: 8 }}>{trabalho.nomeTrabalho}</Text>
      <Text style={{ color: '#cbd5f5', marginBottom: 12 }}>{trabalho.conteudoTrabalho}</Text>

      <Text style={{ color: '#9fbaff', fontWeight: '700', marginBottom: 8 }}>Comentários</Text>
      {comentarios.length === 0 ? <Text style={{ color: '#cbd5f5' }}>Nenhum comentário ainda.</Text> : comentarios.map(c => (
        <View key={c.idComentario} style={{ marginBottom: 8 }}>
          <Text style={{ color: '#fff' }}><Text style={{ fontWeight: '700' }}>{c.nomeUsuario}</Text>: {` ${c.conteudoComentario}`}</Text>
        </View>
      ))}

      <TextInput value={comentario} onChangeText={setComentario} placeholder="Escreva um comentário..." placeholderTextColor="#9aa3c6" style={{ backgroundColor: '#1f1e2b', borderRadius: 8, padding: 12, color: '#fff', marginTop: 10 }} multiline />

      <TouchableOpacity onPress={enviarComentario} style={{ marginTop: 10, backgroundColor: '#9d7dff', padding: 12, borderRadius: 8 }}>
        <Text style={{ color: '#fff', fontWeight: '700', textAlign: 'center' }}>Enviar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
