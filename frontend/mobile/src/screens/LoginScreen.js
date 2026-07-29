import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { loginUser } from '../services/auth';

const LoginScreen = ({ navigation, onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        try {
            const response = await loginUser({ username, password });
            await onLogin(response.data.access_token, response.data.refresh_token);
        } catch (e) {
            setError('Login failed');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#888"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#888"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.link}>Create an account</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        padding: 24,
        justifyContent: 'center',
    },
    heading: {
        color: '#fff',
        fontSize: 32,
        marginBottom: 24,
    },
    input: {
        backgroundColor: '#111',
        color: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#ff2d55',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginBottom: 16,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    link: {
        color: '#fff',
        textAlign: 'center',
    },
    error: {
        color: '#ff6b81',
        marginBottom: 16,
    },
});

export default LoginScreen;
