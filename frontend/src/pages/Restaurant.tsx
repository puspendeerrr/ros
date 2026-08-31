import React from 'react';
import { Grid } from 'antd';
import { useRestaurant } from '../features/restaurant/hooks/useRestaurant';
import { RestaurantDesktop } from '../features/restaurant/desktop/RestaurantDesktop';
import { RestaurantMobile } from '../features/restaurant/mobile/RestaurantMobile';

export const Restaurant: React.FC = () => {
  const screens = Grid.useBreakpoint();
  const restaurantData = useRestaurant();

  // If screens.md is true, we are on a desktop/tablet viewport.
  // If screens.md is false (or not loaded yet), we assume mobile viewport.
  const isMobile = screens.hasOwnProperty('md') ? !screens.md : true;

  if (isMobile) {
    return <RestaurantMobile restaurantData={restaurantData} />;
  }

  return <RestaurantDesktop restaurantData={restaurantData} />;
};
