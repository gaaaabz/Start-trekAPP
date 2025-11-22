import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  Alert, ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const BASE_URL = 'http://localhost:8080';

type TipoUsuario = { idTipoUsuario: number; nomeTipoUsuario: string };

export default function Register() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [tipos, setTipos] = useState<TipoUsuario[]>([]);
  const [tipoSelecionado, setTipoSelecionado] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Verifica se usuário já está logado
  useEffect(() => {
    async function verificarLogin() {
      const token = await AsyncStorage.getItem('token');
      if (token) router.push('/perfil');
    }
    verificarLogin();
    carregarTiposUsuario();
  }, []);

  async function carregarTiposUsuario() {
    try {
      const resp = await fetch(`${BASE_URL}/tipo-usuario/todos-tipos`);
      if (!resp.ok) return;

      const lista: TipoUsuario[] = await resp.json();
      setTipos(lista);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleCadastro() {
    if (!nome || !email || !senha || !tipoSelecionado) {
      Alert.alert('Preencha todos os campos!');
      return;
    }

    setLoading(true);
    try {
      const resposta = await fetch(`${BASE_URL}/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nomeUsuario: nome,
          email,
          senha,
          idTipoUsuario: tipoSelecionado,
        }),
      });

      if (!resposta.ok) {
        const erroTexto = await resposta.text();
        Alert.alert('Erro ao cadastrar', erroTexto || '');
        return;
      }

      Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
      router.replace('./categorias');

    } catch (err) {
      Alert.alert('Erro', 'Erro ao conectar ao servidor.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#1e1e2f' }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        
        <TouchableOpacity onPress={() => router.push('/')}
          style={{
            paddingVertical: 8,
            marginBottom: 10,
            width: 80,
          }}>
          <Text style={{ color: '#63b3ff', fontSize: 16 }}>← Voltar</Text>
        </TouchableOpacity>

        <Text style={{ color: '#63b3ff', fontSize: 26, fontWeight: '800', marginBottom: 18 }}>
          Cadastrar
        </Text>

        <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 18 }}>
          
          <Text style={{ color: '#555', marginBottom: 6 }}>Nome</Text>
          <TextInput
            value={nome}
            onChangeText={setNome}
            style={{
              backgroundColor: '#f6f6f6',
              padding: 10,
              borderRadius: 8,
              marginBottom: 10,
            }}
          />

          <Text style={{ color: '#555', marginBottom: 6 }}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={{
              backgroundColor: '#f6f6f6',
              padding: 10,
              borderRadius: 8,
              marginBottom: 10,
            }}
          />

          <Text style={{ color: '#555', marginBottom: 6 }}>Senha</Text>
          <TextInput
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            style={{
              backgroundColor: '#f6f6f6',
              padding: 10,
              borderRadius: 8,
              marginBottom: 10,
            }}
          />

          <Text style={{ color: '#555', marginBottom: 6 }}>Tipo de Usuário</Text>
          <View style={{ backgroundColor: '#f6f6f6', borderRadius: 8, marginBottom: 10 }}>
            
            {tipos.map(tp => (
              <TouchableOpacity
                key={tp.idTipoUsuario}
                onPress={() => setTipoSelecionado(tp.idTipoUsuario)}
                style={{
                  padding: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: '#e6e6e6',
                }}
              >
                <Text
                  style={{
                    color: tipoSelecionado === tp.idTipoUsuario ? '#6c5ce7' : '#333',
                  }}
                >
                  {tp.nomeTipoUsuario}
                </Text>
              </TouchableOpacity>
            ))}

            {tipos.length === 0 && (
              <Text style={{ padding: 10, color: '#999' }}>Carregando tipos...</Text>
            )}

          </View>

          <TouchableOpacity
            onPress={handleCadastro}
            disabled={loading}
            style={{
              backgroundColor: '#6c5ce7',
              padding: 12,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '700' }}>
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.replace('./login')} style={{ marginTop: 12 }}>
                    <Text style={{ color: '#6c5ce7', textAlign: 'center' }}>
                      já tem conta? faça log-in
                    </Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </View>
  );
}
