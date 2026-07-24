import { Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { TanStackDevtools } from '@tanstack/react-devtools';
import '../styles.css';
import { Footer } from '@/components/footer';
import { AuthProvider } from '@/context/AuthContext';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow">
          <Outlet />
        </div>
        <Footer />
      </div>
      <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'TanStack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </AuthProvider>
  );
}
