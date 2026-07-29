import React, { useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');

const VideoPlayerScreen = ({ route }) => {
    const { video } = route.params;
    const [paused, setPaused] = useState(false);
    const [liked, setLiked] = useState(false);
    const videoRef = useRef(null);

    const handleLike = () => {
        setLiked(!liked);
        // API call to like video
    };

    return (
        <View style={styles.container}>
            <Video
                ref={videoRef}
                source={{ uri: video.video_url }}
                style={styles.video}
                paused={paused}
                repeat={true}
                resizeMode="cover"
                onError={(e) => console.error('Video error:', e)}
            />

            <TouchableOpacity
                style={styles.overlay}
                onPress={() => setPaused(!paused)}
                activeOpacity={1}
            />

            <View style={styles.actions}>
                <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
                    <Icon name={liked ? 'favorite' : 'favorite-border'} size={32} color={liked ? '#ff4444' : '#fff'} />
                    <Text style={styles.actionText}>{video.like_count}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton}>
                    <Icon name="comment" size={32} color="#fff" />
                    <Text style={styles.actionText}>{video.comment_count || 0}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton}>
                    <Icon name="share" size={32} color="#fff" />
                    <Text style={styles.actionText}>{video.share_count || 0}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.info}>
                <Text style={styles.username}>@{video.creator_username || 'creator'}</Text>
                <Text style={styles.description}>{video.description}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    video: {
        width: width,
        height: height,
        position: 'absolute',
        top: 0,
        left: 0,
    },
    overlay: {
        width: width,
        height: height,
        position: 'absolute',
        top: 0,
        left: 0,
    },
    actions: {
        position: 'absolute',
        right: 16,
        bottom: 120,
        alignItems: 'center',
    },
    actionButton: {
        alignItems: 'center',
        marginBottom: 20,
    },
    actionText: {
        color: '#fff',
        fontSize: 12,
        marginTop: 4,
    },
    info: {
        position: 'absolute',
        bottom: 40,
        left: 16,
        right: 16,
    },
    username: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 4,
    },
    description: {
        color: '#fff',
        fontSize: 14,
    },
});

export default VideoPlayerScreen;
