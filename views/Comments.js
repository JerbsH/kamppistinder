import React, {useContext, useState } from 'react';
import { useComment, useUser } from '../hooks/ApiHooks';
import { Divider } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, Card, Input, Layout, Text } from '@ui-kitten/components';
import { Image, KeyboardAvoidingView } from 'react-native';
import { mediaUrl } from '../utils/app-config';
import { useEffect } from 'react';
import PropTypes from 'prop-types';

import {MainContext} from '../contexts/MainContext';


const Comments = ({route}) => {
  const { postComment, getCommentsById, deleteComment } = useComment();
  const [comments, setComments] = useState([]);
  const [userComments, setUserComments] = useState('');
  const singleMedia = route.params;
  const {getUserById} = useUser();
  const {user} = useContext(MainContext);


useEffect(() => {
  fetchComments();
  setUsername();
}, []);


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

  const setUsername = async () => {
    const token = await AsyncStorage.getItem('userToken');
    const commentsData = await getCommentsById(singleMedia.file_id, token);
    console.log('length', commentsData.length);
    try {
      for (let i = 0; i < commentsData.length; i++) {
        const id = commentsData[i].user_id;
        const user = await getUserById(id, token);
        commentsData[i].user = user.username;
      }
    } catch (error) {
      console.error(error.message);
    }
    setComments(commentsData);
  };

  // Handle submitting a new comment
  const handleCommentSubmit = async () => {
    if (userComments.trim() === '') {
      alert('Comment can not be blank!');
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
        setUsername();
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
      setUsername();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
    <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={{ flex: 1 }}
    >
    <Card style={{ margin: 10 }}>
      {singleMedia && (
        <Layout>
          <Image
            source={{ uri: mediaUrl + singleMedia.filename }}
            resizeMode="cover"
            style={{ height: 300 , marginBottom: 10}}
          />
          <Text category="h5">{singleMedia.title}</Text>
          <Text>{singleMedia.description}</Text>
        </Layout>
      )}
      <Text category="h6" style={{ marginTop: 10 }}>
        Comments:
      </Text>
      {comments.map((comment) => (
        <Layout key={comment.comment_id} style={{ marginTop: 10 }}>
          <Layout
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text>{comment.comment} Added by: {comment.user}</Text>
            {user.user_id === comment.user_id && (
              <Button
                appearance="ghost"
                status="danger"
                onPress={() => handleCommentDelete(comment.comment_id)}>
                Delete
              </Button>
            )}
          </Layout>
        </Layout>
      ))}
      <Input
        value={userComments}
        onChangeText={(text) => setUserComments(text)}
        placeholder="Add a comment..."
        style={{ marginTop: 10 }}
      />
      <Button
        onPress={handleCommentSubmit}
        appearance="outline"
        style={{ marginTop: 10 }}>
        Submit
      </Button>
    </Card>
    </KeyboardAvoidingView>
  );
};

Comments.propTypes = {
  route: PropTypes.object,
  user: PropTypes.object,
};

export default Comments;









