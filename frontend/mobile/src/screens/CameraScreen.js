import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { uploadVideo } from '../services/api';

const CameraScreen = ({ navigation }) => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const pickVideo = () => {
        launchImageLibrary(
            {
                mediaType: 'video',
                videoQuality: 'high',
                includeBase64: false,
            },
            handleUpload
        );
    };

    const handleUpload = async (response) => {
        if (response.didCancel) return;
        if (response.errorCode) {
            Alert.alert('Error', 'Failed to select video');
            return;
        }

        const asset = response.assets?.[0];
        if (!asset) {
            Alert.alert('Error', 'No video selected');
            return;
        }

        setUploading(true);
        setProgress(0);

        try {
            const formData = new FormData();
            formData.append('file', {
                uri: asset.uri,
                type: asset.type || 'video/mp4',
                name: asset.fileName || 'video.mp4',
            });
            formData.append('description', 'My awesome video');

            await uploadVideo(formData, (progressEvent) => {
                const pct = Math.floor((progressEvent.loaded * 100) / progressEvent.total);
                setProgress(pct);
            });

            Alert.alert('Success', 'Video uploaded successfully!');
            navigation.navigate('Feed');
        } catch (error) {
            Alert.alert('Error', 'Failed to upload video');
        } finally {
            setUploading(false);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.uploadButton} onPress={pickVideo} disabled={uploading}>
                <Text style={styles.buttonText}>Select Video to Upload</Text>
            </TouchableOpacity>

            {uploading && (
                <View style={styles.progressContainer}>
                    <ActivityIndicator size="large" color="#fff" />
                    <Text style={styles.progressText}>Uploading {progress}%</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    uploadButton: {
        backgroundColor: '#ff2d55',
        padding: 18,
        borderRadius: 16,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    progressContainer: {
        marginTop: 24,
        alignItems: 'center',
    },
    progressText: {
        color: '#fff',
        marginTop: 12,
    },
});

export default CameraScreen;
