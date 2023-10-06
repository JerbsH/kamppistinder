import React, { useState } from 'react';
import { useComment, useUser } from '../hooks/ApiHooks';
import { Divider } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, Card, Input, Layout, Text } from '@ui-kitten/components';
import { Image } from 'react-native';
import { mediaUrl } from '../utils/app-config';
import { useEffect } from 'react';
import PropTypes from 'prop-types';


const Comments = ({ route }) => {
  const { postComment, getCommentsById, deleteComment } = useComment();
  const { user } = useUser();
  const [comments, setComments] = useState([]);
  const [userComments, setUserComments] = useState('');
  const singleMedia = route.params;


useEffect(() => {
  fetchComments();
}, [userComments]);


  const fetchComments = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const commentsData = await getCommentsById(singleMedia.file_id, token);
      console.log('Comments data:', commentsData); // for debugging
      setComments(commentsData);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  // Handle submitting a new comment
  const handleCommentSubmit = async () => {
    if (userComments.trim() === '') {
      return;
    }
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await postComment(
        singleMedia.file_id,
        userComments,
        token,
      );
      if (response) {
        setUserComments(''); //Clear the comment input
        fetchComments();
      };
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  // Handle deleting a comment
  const handleCommentDelete = async (commentId) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      await deleteComment(commentId, token);
      fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
    <Card>
      <Divider />
      {singleMedia && (
        <Layout>
          <Image
            source={{ uri: mediaUrl + singleMedia.filename }}
            resizeMode="center"
            style={{ height: 300 }}
          />
          <Text>Title: {singleMedia.title}</Text>
          <Text>Description: {singleMedia.description}</Text>
        </Layout>
      )}
      <Divider />
      <Text>Comments:</Text>
      {comments.map((comment) => (
        <Layout key={comment.comment_id}>
          <Layout style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text>{comment.comment}</Text>
            {user && user.user_id === comment.user_id && (
              <Button
                onPress={() => handleCommentDelete(comment.comment_id)}>
                Delete
              </Button>
            )}
          </Layout>
          <Divider></Divider>
        </Layout>
      ))}
      <Input
        value={userComments}
        onChangeText={(text) => setUserComments(text)}
        placeholder="Add a comment..."
      />
      <Button onPress={handleCommentSubmit}>Submit</Button>
    </Card>
  );
};

Comments.propTypes = {
  route: PropTypes.object,
};

export default Comments;





