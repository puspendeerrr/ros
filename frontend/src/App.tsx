import { ConfigProvider, App as AntdApp } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppRoutes } from './routes/AppRoutes.js';
import { themeConfig } from './theme/theme.js';
import { InstallPrompt } from './pwa/InstallPrompt';
import { UpdatePrompt } from './pwa/UpdatePrompt';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retry: (failureCount, error: any) => {
        // Auto-retry network issues, timeouts, and server errors up to 3 times
        if (failureCount < 3) {
          if (!error?.response || error.response.status >= 500) {
            return true;
          }
        }
        return false;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={themeConfig}>
        <AntdApp>
          <AppRoutes />
          <InstallPrompt />
          <UpdatePrompt />
        </AntdApp>
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;
