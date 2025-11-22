import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const BASE_URL = 'http://localhost:8080';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function verificarLogin() {
      const token = await AsyncStorage.getItem('token');
      if (token) router.replace('./(tabs)/perfil');
    }
    verificarLogin();
  }, []);

  async function handleLogin() {
    if (!email || !senha) {
      Alert.alert('Preencha todos os campos!');
      return;
    }

    setLoading(true);

    try {
      const resp = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      if (!resp.ok) {
        const txt = await resp.text();
        Alert.alert('Erro', txt || 'Email ou senha incorretos.');
        return;
      }

      const data = await resp.json();

      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('idUsuario', String(data.usuario.idUsuario));
      await AsyncStorage.setItem('emailUsuario', data.usuario.email);
      await AsyncStorage.setItem('nomeUsuario', data.usuario.nomeUsuario);

      router.replace('./categorias');

    } catch (err) {
      Alert.alert('Erro', 'Erro ao conectar com o servidor.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#1e1e2f', padding: 20 }}>


      <TouchableOpacity onPress={() => router.push('/')}
        style={{ paddingVertical: 8, marginBottom: 10, width: 80 }}>
        <Text style={{ color: '#63b3ff', fontSize: 16 }}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={{ fontSize: 28, color: '#63b3ff', fontWeight: '800', marginBottom: 18 }}>
        Entrar
      </Text>

      <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 16 }}>

        <Text style={{ color: '#555', marginBottom: 8 }}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={{
            backgroundColor: '#f6f6f6',
            padding: 10,
            borderRadius: 8,
            marginBottom: 12,
          }}
        />

        <Text style={{ color: '#555', marginBottom: 8 }}>Senha</Text>
        <TextInput
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          style={{
            backgroundColor: '#f6f6f6',
            padding: 10,
            borderRadius: 8,
            marginBottom: 12,
          }}
        />

        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          style={{
            backgroundColor: '#6c5ce7',
            padding: 12,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '700' }}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace('./cadastro')} style={{ marginTop: 12 }}>
          <Text style={{ color: '#6c5ce7', textAlign: 'center' }}>
            Ainda não tem conta? Cadastre-se
          </Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}
