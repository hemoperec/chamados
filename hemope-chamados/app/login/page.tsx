'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, User, Loader2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Transform username to email if it's just a username
    const emailToUse = email.includes('@') ? email : `${email}@hemope.com`;

    try {
      await signInWithEmailAndPassword(auth, emailToUse, password);
      router.push('/admin');
    } catch (err: any) {
      // Auto-create the superuser if it doesn't exist and credentials match
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        if (email === 'hemope' && password === 'hemope26') {
          try {
            await createUserWithEmailAndPassword(auth, emailToUse, password);
            router.push('/admin');
            return;
          } catch (createErr) {
            console.error(createErr);
          }
        }
      }
      setError('Credenciais inválidas ou erro no sistema.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden bg-gradient-to-br from-red-600 via-red-500 to-white animate-gradient-slow relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-white/10 blur-[100px] animate-float-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-red-800/20 blur-[120px] animate-float-delayed" />
        <div className="absolute top-[40%] left-[20%] w-[200px] h-[200px] rounded-full bg-white/5 blur-[50px] animate-pulse-slow" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white/90 backdrop-blur-2xl border border-white/60 p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-red-900/30 w-full max-w-md relative overflow-hidden z-10"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 to-red-400" />
        
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="w-20 h-20 bg-gradient-to-br from-red-100 to-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-red-100"
          >
            <Lock className="w-10 h-10 text-red-600" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Acesso Restrito</h1>
          <p className="text-gray-500 text-sm">Painel Administrativo para Técnicos</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <label className="text-sm font-bold text-gray-700 ml-1">Usuário</label>
            <div className="relative group">
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3.5 pl-11 outline-none transition-all focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-gray-900 placeholder:text-gray-400 font-medium group-hover:bg-white"
                placeholder="Ex: hemope"
              />
              <User className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-red-500" />
            </div>
          </motion.div>

          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-2"
          >
            <label className="text-sm font-bold text-gray-700 ml-1">Senha</label>
            <div className="relative group">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3.5 pl-11 outline-none transition-all focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-gray-900 placeholder:text-gray-400 font-medium group-hover:bg-white"
                placeholder="••••••••"
              />
              <Lock className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-red-500" />
            </div>
          </motion.div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 text-red-700 bg-red-50 p-4 rounded-xl text-sm border border-red-100"
            >
              <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
              <span className="font-medium">{error}</span>
            </motion.div>
          )}

          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-900/20 transition-all flex items-center justify-center gap-2 mt-4"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Acessar Sistema'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
