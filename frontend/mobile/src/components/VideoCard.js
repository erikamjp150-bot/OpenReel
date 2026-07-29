import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const VideoCard = ({ video, onLike, onPress }) => {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <View style={styles.preview}>
                <Image source={{ uri: video.thumbnail_url }} style={styles.thumbnail} />
            </View>
            <View style={styles.meta}>
                <Text style={styles.title}>{video.title || 'Untitled'}</Text>
                <Text style={styles.stats}>{video.like_count} likes · {video.view_count} views</Text>
                <View style={styles.actionsRow}>
                    <TouchableOpacity onPress={onLike} style={styles.likeButton}>
                        <Text style={styles.likeText}>Like</Text>
                    </TouchableOpacity>
                    <Text style={styles.commentText}>{(video.comment_count || 0)} comments</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: 16,
        backgroundColor: '#111',
        borderRadius: 12,
        overflow: 'hidden',
    },
    preview: {
        width: '100%',
        aspectRatio: 16 / 9,
        backgroundColor: '#222',
    },
    thumbnail: {
        width: '100%',
        height: '100%',
    },
    meta: {
        padding: 12,
    },
    title: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 4,
    },
    stats: {
        color: '#aaa',
        marginBottom: 8,
    },
    likeButton: {
        backgroundColor: '#ff2d55',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 16,
        alignSelf: 'flex-start',
    },
    likeText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default VideoCard;
