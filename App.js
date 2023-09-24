import * as eva from '@eva-design/eva';
import {ApplicationProvider, Button, Layout, Text} from '@ui-kitten/components';
import Navigator from './navigators/Navigator';
import {MainProvider} from './contexts/MainContext';

export default () => (
  <ApplicationProvider {...eva} theme={eva.light}>
    <MainProvider>
      <Navigator />
    </MainProvider>
  </ApplicationProvider>
);
