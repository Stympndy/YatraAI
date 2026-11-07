import React, { useState } from 'react';
import { MapPin, ArrowRight } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - in a real app, validate credentials here
    if (email && password) {
      onLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-40"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center bg-orange-500 w-12 h-12 rounded-xl text-white mb-4 shadow-lg shadow-orange-500/30">
              <MapPin size={24} />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome to YatraAI</h1>
            <p className="text-slate-300">Your smart companion for exploring India.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
              <input 
                type="email" 
                required
                className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                placeholder="traveler@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
              <input 
                type="password" 
                required
                className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3.5 rounded-lg shadow-lg shadow-orange-900/20 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
            >
              Start Exploring <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            <p>By continuing, you agree to our Terms & Privacy Policy.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;