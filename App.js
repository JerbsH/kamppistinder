import * as eva from '@eva-design/eva';
import { ApplicationProvider, Button, Layout, Text } from '@ui-kitten/components';

const App = () => {
  return (
     <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <Text category='h1'>HOME</Text>
    <Button>MORO</Button>
  </Layout>
  );
};

export default () => (
  <ApplicationProvider {...eva} theme={eva.light}>
    <App/>
  </ApplicationProvider>
);
