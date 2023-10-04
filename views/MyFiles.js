import React from 'react';
import List from '../components/List';
import PropTypes from 'prop-types';

const MyFiles = ({navigation}) => {
  return <List navigation={navigation}  myFilesOnly={true} filterMyFiles={true}/>;
};

MyFiles.propTypes = {
  navigation: PropTypes.object,
};

export default MyFiles;
