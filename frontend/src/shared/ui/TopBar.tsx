import { AppImage } from './AppImage';
import { useRouter } from 'next/router';
import { AuthAdapter } from '@/features/auth';
import { routes } from '@/routes';

interface TopBarProps {
  user?: {
    username: string;
  };
}

export function TopBar({ user }: TopBarProps) {
  const router = useRouter();
  const adapter = new AuthAdapter();

  const handleLogout = async () => {
    await adapter.logout();
    router.push(routes.login);
  };
  return (
    <div className="w-full bg-primary px-4 py-4">
      <div className="flex items-center justify-between flex-wrap gap-y-2">
        <div className="flex flex-col">
          <div className="flex items-center space-x-6">
            <div className="relative w-10 h-10">
              <AppImage 
                src="/Pokeball.png" 
                alt="Pokéball" 
                width={96} 
                height={96}
                className="w-full h-full transform transition-transform duration-500 hover:rotate-180"
              />
            </div>
            <h1 className="text-4xl font-extrabold text-white">
              Pokédex
            </h1>
          </div>

          {user && (
            <span className="text-white text-sm mt-2 hidden max-[450px]:block">
              Welcome, {user.username}
            </span>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 flex-wrap">
          {user && (
            <span className="text-white text-sm inline max-[450px]:hidden">
              Welcome, {user.username}
            </span>
          )}

          <button
            onClick={handleLogout}
            className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-xl hover:bg-white/30 transition-all duration-200 group cursor-pointer"
            title="Logout"
          >
            <svg 
              className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
