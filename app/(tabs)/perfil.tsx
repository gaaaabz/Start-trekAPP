
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

const BASE_URL = 'http://localhost:8080';

export default function Profile() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const id = await AsyncStorage.getItem('idUsuario');
      const t = await AsyncStorage.getItem('token');
      setUserId(id);
      setToken(t);
      if (!id) {
        Alert.alert('Nenhum usuário logado!');
        router.replace('/login');
        return;
      }
      carregarPerfil(id);
    })();
  }, []);

  async function carregarPerfil(id: string) {
    try {
      const resp = await fetch(`${BASE_URL}/usuarios/${id}`);
      if (!resp.ok) throw new Error('Erro ao carregar o perfil.');
      const data = await resp.json();
      setNome(data.nomeUsuario);
      setEmail(data.email);
      if (data.fotoBase64) {
        setFotoUri(`data:image/png;base64,${data.fotoBase64}`);
      }
    } catch (err: any) {
      console.error(err);
      setMensagem(err?.message || 'Erro ao carregar perfil.');
    }
  }

  async function pickImage() {
    const p = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!p.granted) {
      Alert.alert('Permissão negada para acessar fotos.');
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({ base64: false, quality: 0.7 });
    if (!res.canceled) {
      setFotoUri(res.assets[0].uri);
    }
  }

  async function handleSalvar() {
    if (!userId) return;
    setLoading(true);
    try {
      const body = { nomeUsuario: nome, email, senha: senha || null };
      const resp = await fetch(`${BASE_URL}/usuarios/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!resp.ok) {
        const erro = await resp.text();
        throw new Error(erro);
      }
      // upload de foto
      if (fotoUri && fotoUri.startsWith('file')) {
        const fd = new FormData();
        // @ts-ignore: FormData type for react native blob
        fd.append('foto', {
          uri: fotoUri,
          name: 'foto.jpg',
          type: 'image/jpeg',
        });
        const r2 = await fetch(`${BASE_URL}/usuarios/${userId}/foto`, {
          method: 'PATCH',
          body: fd,
          headers: { 'Content-Type': 'multipart/form-data', Authorization: token ? `Bearer ${token}` : '' },
        });
        if (!r2.ok) throw new Error('Erro ao enviar foto.');
      }

      setMensagem('Perfil atualizado com sucesso!');
    } catch (err: any) {
      console.error(err);
      setMensagem(err?.message || 'Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await AsyncStorage.clear();
    router.replace('./');
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20, backgroundColor: '#0b0f19' }}>
      <Text style={{ color: '#4eaaff', fontSize: 22, fontWeight: '700', marginBottom: 12 }}>Meu Perfil</Text>

      <View style={{ alignItems: 'center', marginBottom: 16 }}>
        <TouchableOpacity onPress={pickImage} style={{ alignItems: 'center' }}>
          <Image source={fotoUri ? { uri: fotoUri } : require('../../assets/images/default-avatar-profile-icon.jpg')} style={{ width: 130, height: 130, borderRadius: 999, borderWidth: 3, borderColor: '#4eaaff' }} />
          <Text style={{ color: '#cbd5f5', marginTop: 8 }}>Alterar foto</Text>
        </TouchableOpacity>
      </View>

      <View style={{ backgroundColor: '#141a29', padding: 16, borderRadius: 12 }}>
        <Text style={{ color: '#cbd5f5', marginBottom: 6 }}>Nome</Text>
        <TextInput value={nome} onChangeText={setNome} style={{ backgroundColor: '#1f2537', padding: 10, borderRadius: 8, color: '#fff', marginBottom: 8 }} />

        <Text style={{ color: '#cbd5f5', marginBottom: 6 }}>Email</Text>
        <TextInput value={email} onChangeText={setEmail} keyboardType="email-address" style={{ backgroundColor: '#1f2537', padding: 10, borderRadius: 8, color: '#fff', marginBottom: 8 }} />

        <Text style={{ color: '#cbd5f5', marginBottom: 6 }}>Senha (deixe em branco para não alterar)</Text>
        <TextInput value={senha} onChangeText={setSenha} secureTextEntry style={{ backgroundColor: '#1f2537', padding: 10, borderRadius: 8, color: '#fff', marginBottom: 12 }} />

        <TouchableOpacity onPress={handleSalvar} style={{ backgroundColor: '#4eaaff', padding: 12, borderRadius: 8, marginBottom: 8 }}>
          <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '700' }}>{loading ? 'Salvando...' : 'Salvar'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogout} style={{ backgroundColor: '#be2c2c', padding: 12, borderRadius: 8 }}>
          <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '700' }}>Logout</Text>
        </TouchableOpacity>

        {mensagem ? <Text style={{ textAlign: 'center', marginTop: 12, color: '#fff' }}>{mensagem}</Text> : null}
      </View>
    </ScrollView>
  );
}
