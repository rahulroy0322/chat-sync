import type { FC } from 'react';
import SettingsPage from '@/pages/settings.page';
import TabsContent from './main.tabs';

const SettingsTab: FC = () => {
  return (
    <TabsContent value={'setting'}>
      <SettingsPage />
    </TabsContent>
  );
};

export default SettingsTab;
