import React from 'react';
import { Grid } from 'antd';
import { useDashboard } from '../features/dashboard/hooks/useDashboard';
import { DashboardDesktop } from '../features/dashboard/desktop/DashboardDesktop';
import { DashboardMobile } from '../features/dashboard/mobile/DashboardMobile';

export const Dashboard: React.FC = () => {
  const screens = Grid.useBreakpoint();
  const dashboardData = useDashboard();

  // If screens.md is true, we are on a desktop/tablet viewport.
  // If screens.md is false (or not loaded yet), we assume mobile viewport.
  const isMobile = screens.hasOwnProperty('md') ? !screens.md : true;

  if (isMobile) {
    return <DashboardMobile dashboardData={dashboardData} />;
  }

  return <DashboardDesktop dashboardData={dashboardData} />;
};
