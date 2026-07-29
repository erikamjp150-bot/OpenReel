import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, SafeAreaView, Text } from 'react-native';
import VideoCard from '../components/VideoCard';
import { getFeed } from '../services/api';

const FeedScreen = ({ navigation }) => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);

    const loadVideos = useCallback(async () => {
        if (loading) return;
        setLoading(true);
        
        try {
            const response = await getFeed(page);
            setVideos(prev => [...prev, ...response.data.results]);
            setLoading(false);
        } catch (error) {
            console.error('Error loading feed:', error);
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        loadVideos();
    }, [loadVideos]);

    const handleLike = (videoId) => {
        setVideos(prev =>
            prev.map(video =>
                video.id === videoId
                    ? { ...video, like_count: video.like_count + 1, liked: true }
                    : video
            )
        );
    };

    const renderItem = ({ item }) => (
        <VideoCard
            video={item}
            onLike={() => handleLike(item.id)}
            onPress={() => navigation.navigate('VideoPlayer', { videoId: item.id })}
        />
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>OpenReel</Text>
            </View>
            <FlatList
                data={videos}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                onEndReached={() => setPage(page + 1)}
                onEndReachedThreshold={0.5}
                showsVerticalScrollIndicator={false}
            />
            {loading && <Text style={styles.loading}>Loading...</Text>}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        padding: 16,
        backgroundColor: '#000',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    loading: {
        color: '#fff',
        textAlign: 'center',
        padding: 16,
    },
});

export default FeedScreen;
