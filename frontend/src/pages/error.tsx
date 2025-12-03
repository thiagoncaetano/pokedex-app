import { PageHeader } from '@/shared/ui/PageHeader';
import { useRouter } from 'next/router';
import { routes } from '@/routes';

export default function ErrorPage() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push(routes.home);
  };

  return (
    <PageHeader title="Error">
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-blue-50 p-4">
        <div className="w-full max-w-lg text-center">
          {/* Animated Pokéball with error state */}
          <div className="relative w-24 h-24 mx-auto mb-8">
            {/* Outer glow effect */}
            <div className="absolute inset-0 bg-red-500 rounded-full opacity-20 animate-ping"></div>
            <div className="absolute inset-0 bg-red-400 rounded-full opacity-30 animate-pulse"></div>
            
            {/* Main Pokéball */}
            <div className="relative w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transform transition-transform hover:scale-105 overflow-hidden border-4 border-gray-900">
              {/* Top half - Red */}
              <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-br from-red-500 to-red-600"></div>
              
              {/* Bottom half - White */}
              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-white"></div>
              
              {/* Pokéball center line */}
              <div className="absolute w-full h-1 bg-gray-900 z-10"></div>
              
              {/* Center button */}
              <div className="relative z-20 w-8 h-8 bg-white rounded-full border-4 border-gray-900 flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full border-2 border-gray-900 animate-pulse"></div>
              </div>
              
              {/* Error icon */}
              <div className="absolute top-2 right-2 z-30 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-red-700 text-sm font-bold">!</span>
              </div>
            </div>
          </div>

          {/* Error content */}
          <div className="space-y-6">
            {/* Error title */}
            <h1 className="text-5xl font-extrabold text-gray-900">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-600">
                Oops!
              </span>
            </h1>
            
            {/* Error description */}
            <div className="space-y-2">
              <p className="text-lg text-gray-700 font-medium">
                Something went wrong
              </p>
              <p className="text-gray-600">
                We encountered an unexpected error. Don't worry, even the best Pokémon trainers face challenges!
              </p>
            </div>

            {/* Home button */}
            <div className="flex justify-center pt-4">
              <button
                onClick={handleGoHome}
                className="inline-flex items-center justify-center px-6 py-3 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 transition-all transform hover:scale-105"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageHeader>
  );
}
