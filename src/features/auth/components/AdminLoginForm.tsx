"use client";

import React, { useState } from "react";
import { Shield, Lock, User, Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminAuth } from "../hooks/useAdminAuth";

export default function AdminLoginForm() {
  const { login, loading, error } = useAdminAuth();

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(credentials);
  };

  return (
    <div className="min-h-screen w-full bg-[#09090b] flex items-center justify-center px-4 font-sans text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl backdrop-blur-md"
      >
        <header className="text-center mb-8">
          <div className="w-12 h-12 bg-orange-600/10 border border-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="text-orange-500" size={24} />
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tight italic">
            HQ <span className="text-orange-500">Portal.</span>
          </h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mt-1">
            Authorized management personnel only
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User size={16} className="text-zinc-600" />
            </div>
            <input
              type="text"
              required
              placeholder="Admin Username"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              className="w-full pl-12 pr-4 py-3 text-sm bg-zinc-950 border border-zinc-800 rounded-xl focus:border-orange-500 transition-all font-medium text-white outline-none placeholder:text-zinc-600"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock size={16} className="text-zinc-600" />
            </div>
            <input
              type="password"
              required
              placeholder="Security Password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              className="w-full pl-12 pr-4 py-3 text-sm bg-zinc-950 border border-zinc-800 rounded-xl focus:border-orange-500 transition-all font-medium text-white outline-none placeholder:text-zinc-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50 transition cursor-pointer"
          >
            {loading ? (
              <><Loader2 className="animate-spin" size={16} /> <span>Authenticating...</span></>
            ) : (
              <span>Establish Session</span>
            )}
          </button>
        </form>

        <div className="w-full min-h-[40px] mt-4">
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="w-full p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3"
              >
                <AlertCircle size={16} className="text-red-500 shrink-0" />
                <p className="text-red-400 text-xs font-semibold leading-tight">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}