import React, { useState } from 'react';
import { Sprout, Mail, Lock, ChevronRight, User } from 'lucide-react';
import { authService } from '../services/authService';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isRegister) {
        await authService.signup(email, password, name);
      } else {
        await authService.login(email, password);
      }
      onLogin();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await authService.googleLogin();
      onLogin();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="inline-block bg-emerald-600 p-4 rounded-[2rem] text-white shadow-xl shadow-emerald-200 mb-6">
            <Sprout size={48} />
          </div>
          <h1 className="text-4xl font-bold text-stone-900 tracking-tight">Kilimo Smart</h1>
          <p className="text-stone-500 mt-2">Empowering farmers with AI intelligence.</p>
        </div>

        <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-stone-200 border border-stone-100">
          <div className="space-y-6">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-xl font-bold text-stone-800">Welcome Back</h2>
              <p className="text-stone-500 text-sm">Sign in to access your farm intelligence dashboard.</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-sm font-medium">
                {error}
              </div>
            )}

            <button 
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full bg-white border-2 border-stone-100 hover:border-emerald-500 hover:bg-emerald-50/30 text-stone-700 py-5 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 shadow-sm group"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
                  <span className="text-lg">Continue with Google</span>
                </>
              )}
            </button>

            <div className="pt-4 text-center">
              <p className="text-xs text-stone-400 font-medium px-4">
                By continuing, you agree to Kilimo Smart's Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-stone-400 text-sm font-medium">
            Need help? <a href="#" className="text-emerald-600 hover:underline">Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
