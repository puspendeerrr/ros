import React from 'react';
import { Grid } from 'antd';
import { useMenu } from '../features/menu/hooks/useMenu';
import { MenuDesktop } from '../features/menu/desktop/MenuDesktop';
import { MenuMobile } from '../features/menu/mobile/MenuMobile';

export const Menu: React.FC = () => {
  const screens = Grid.useBreakpoint();
  const menuData = useMenu();

  const isMobile = screens.hasOwnProperty('md') ? !screens.md : true;

  if (isMobile) {
    return <MenuMobile menuData={menuData} />;
  }

  return <MenuDesktop menuData={menuData} />;
};
