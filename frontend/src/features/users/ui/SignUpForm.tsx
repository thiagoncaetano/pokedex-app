'use client';

import React from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';
import { useApi } from '@/shared/api/useApi';
import { UserAdapter } from '../lib/UserAdapter';
import { userSignupSchema, UserSignupFormData } from '../model/signup.schema';
import { AuthResponse } from '@/shared/models/auth';
import { routes } from '@/routes';

const SignUpForm: React.FC = () => {
  const { request, loading } = useApi<AuthResponse>();
  const adapter = new UserAdapter();
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const { 
    register, 
    handleSubmit, 
    clearErrors,
    formState: { errors } 
  } = useForm<UserSignupFormData>({
    resolver: zodResolver(userSignupSchema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: { username: '', password: '' }
  });

  const onSubmit = async (data: UserSignupFormData) => {
    const result = await request(
      () => adapter.signup(data),
      {
        successMessage: 'Account created successfully!',
        errorMessage: 'Unable to create account. Please try again.',
      }
    );

    if (!result) return;

    router.push(routes.home);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-blue-50">
      <div className="w-full max-w-md px-4">
        {/* Header with Pokéball and Title */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center space-x-4 mb-2">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 bg-[#C12239] rounded-full opacity-20 animate-ping"></div>
              <Image 
                src="/Pokeball.png" 
                alt="Pokéball" 
                width={48} 
                height={48}
                className="relative z-10 transform transition-transform duration-500 hover:rotate-180"
                priority
              />
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#C12239] to-[#FF4565]">
                Pokédex
              </span>
            </h1>
          </div>
          <p className="text-gray-600">Create your account to start your journey</p>
        </div>

        {/* Sign Up Form */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="px-8 py-8 sm:p-10">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <div className="relative rounded-md">
                  <input
                    id="username"
                    {...register('username', {
                      onChange: (e) => {
                        if (e.target.value === '') clearErrors('username');
                      }
                    })}
                    type="text"
                    className={`block w-full px-4 py-3 border ${
                      errors.username ? 'border-red-500' : 'border-gray-200'
                    } rounded-xl focus:ring-2 focus:ring-[#C12239] focus:border-[#C12239] transition-all duration-200 placeholder-gray-400 text-gray-900`}
                    placeholder="Choose a username"
                    disabled={loading}
                  />
                </div>
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative rounded-md">
                  <input
                    id="password"
                    {...register('password', {
                      onChange: (e) => {
                        if (e.target.value === '') clearErrors('password');
                      }
                    })}
                    type={showPassword ? "text" : "password"}
                    className={`block w-full px-4 py-3 pr-12 border ${
                      errors.password ? 'border-red-500' : 'border-gray-200'
                    } rounded-xl focus:ring-2 focus:ring-[#C12239] focus:border-[#C12239] transition-all duration-200 placeholder-gray-400 text-gray-900`}
                    placeholder="Create a password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center py-3 px-4 text-sm font-medium rounded-xl text-white bg-[#C12239] border border-transparent transition-all duration-150 active:scale-95 active:opacity-90 ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Sign In Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => router.push(routes.login)}
              className="font-medium text-[#C12239] hover:opacity-80 transition-colors cursor-pointer"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
