import React from 'react';

interface WelcomeBannerProps {
  userName: string;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ userName }) => {
  return (
    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 mb-8 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative z-10">
        <h2 className="text-3xl font-bold mb-2">Welcome back, {userName}!</h2>
        <p className="text-indigo-100 text-lg">
          Ready to manage your educational network?
        </p>
      </div>
      <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
      <div className="absolute -left-8 -bottom-8 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
    </div>
  );
};
  