import React, { useState } from 'react';
import { useComment, useUser } from '../hooks/ApiHooks';
import { Divider } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, Card, Input, Layout, Text } from '@ui-kitten/components';
import { Image } from 'react-native';
import { mediaUrl } from '../utils/app-config';
import { useEffect } from 'react';
import {formatDate} from '../utils/functions';
import PropTypes from 'prop-types';


const Comments = ({ singleMedia, userId }) => {
  const { postComment, getCommentsById, deleteComment } = useComment();
  const { user } = useUser();
  const [comments, setComments] = useState([]);
  const [userComments, setUserComments] = useState('');



useEffect(() => {
  fetchComments();
}, [userComments]);

/* useEffect(() => {
  fetchOwner();
}, []); */

/* // fetch owner info
const fetchOwner = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const ownerData = await getUserById(userId, token);
    setOwner(ownerData);
  } catch (error) {
    console.error(error.message);
  }
}; */

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
  console.log(singleMedia);

  return (
    <Card>
      <Divider />
      {comments.map((comment) => (
        <Layout key={comment.comment_id}>
          <Layout style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text>{comment.comment}</Text>
            {user.user_id === comment.user_id && (
              <Button
                onPress={() => handleCommentDelete(comment.comment_id)}>
                Delete
              </Button>
            )}
          </Layout>
        </Layout>
      ))}
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
          {/* <Text>Added by: {username}</Text> */}
        </Layout>
      )}
      <Divider />
      <Text>Comments:</Text>
      <Input
        value={userComments}
        onChangeText={(text) => setUserComments(text)}
        placeholder="Add a comment..."
      />
      <Button title="Submit" onPress={handleCommentSubmit} />
    </Card>
  );
};

Comments.propTypes = {
  singleMedia: PropTypes.object,
  userId: PropTypes.object,
};


export default Comments;

