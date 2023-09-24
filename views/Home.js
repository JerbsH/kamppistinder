import {Layout , Text} from '@ui-kitten/components';
import {PropTypes } from 'prop-types';

const Home = ({navigation}) => {
  return (
    <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text category="h1">HOME</Text>
    </Layout>
  );
};


Home.propTypes = {
  navigation: PropTypes.object,
};

export default Home;
