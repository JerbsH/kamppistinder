import * as eva from '@eva-design/eva';
import {ApplicationProvider} from '@ui-kitten/components';
import {MainProvider} from './contexts/MainContext';
import Navigator from './navigators/Navigator';

export default () => (
  <ApplicationProvider {...eva} theme={eva.light}>
    <MainProvider>
      <Navigator />
    </MainProvider>
  </ApplicationProvider>
);
