import * as eva from '@eva-design/eva';
import {ApplicationProvider,IconRegistry} from '@ui-kitten/components';
import {MainProvider} from './contexts/MainContext';
import Navigator from './navigators/Navigator';
import { EvaIconsPack } from '@ui-kitten/eva-icons';

export default () => (
  <>
    <IconRegistry icons={EvaIconsPack} />
    <ApplicationProvider {...eva} theme={eva.light}>
      <MainProvider>
        <Navigator />
      </MainProvider>
    </ApplicationProvider>
  </>
);
