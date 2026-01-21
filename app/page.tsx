"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Search,
  Send,
  Building2,
  User,
  FileText,
  Activity,
  HeartPulse,
} from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { SECTORS, getSectorPriority } from "@/lib/sectors";

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    sectorId: "",
    problem: "",
    description: "",
  });
  const [sectorSearch, setSectorSearch] = useState("");
  const [isSectorOpen, setIsSectorOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const filteredSectors = useMemo(() => {
    if (!sectorSearch) return SECTORS;
    const lower = sectorSearch.toLowerCase();
    return SECTORS.filter(
      (s) =>
        s.name.toLowerCase().includes(lower) ||
        (s.location && s.location.toLowerCase().includes(lower)),
    );
  }, [sectorSearch]);

  const selectedSector = useMemo(
    () => SECTORS.find((s) => s.id === formData.sectorId),
    [formData.sectorId],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");

    try {
      await addDoc(collection(db, "tickets"), {
        requesterName: formData.name,
        sectorId: formData.sectorId,
        sectorName: selectedSector
          ? selectedSector.name
          : formData.sectorId || sectorSearch,
        problemTitle: formData.problem,
        description: formData.description,
        priority: selectedSector ? selectedSector.priority : "3", // Auto-priority
        status: "aberto",
        createdAt: serverTimestamp(),
      });
      setStatus("success");
      setFormData({ name: "", sectorId: "", problem: "", description: "" });
      setSectorSearch("");
    } catch (error) {
      console.error("Error adding document: ", error);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 overflow-hidden bg-gradient-to-br from-red-600 via-red-500 to-white animate-gradient-slow relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-white/10 blur-[100px] animate-float-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-red-800/20 blur-[120px] animate-float-delayed" />
        <div className="absolute top-[40%] left-[20%] w-[200px] h-[200px] rounded-full bg-white/5 blur-[50px] animate-pulse-slow" />
      </div>

      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-lg z-10 bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-red-900/30 p-12 text-center relative overflow-hidden border border-white/50"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-green-600" />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg shadow-green-200/50"
            >
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3 tracking-tight">
              Chamado Registrado!
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Sua solicitação foi enviada com sucesso para nossa central. <br />
              A equipe técnica iniciará o atendimento em breve.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setStatus("idle")}
              className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold shadow-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
            >
              Abrir Novo Chamado
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full max-w-5xl z-10 bg-white/85 backdrop-blur-3xl rounded-[2rem] shadow-2xl shadow-red-900/20 overflow-hidden border border-white/60 flex flex-col md:flex-row h-auto md:h-[500px]"
          >
            {/* Header Section - Side Panel on Desktop */}
            <div className="bg-gradient-to-br from-red-600 to-red-800 p-8 text-white relative overflow-hidden md:w-1/3 flex flex-col justify-between">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              <div className="absolute -right-20 -top-20 w-60 h-60 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-black/10 rounded-full blur-3xl"></div>

              <div className="relative z-10">
                <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl shadow-inner border border-white/10 w-fit mb-6">
                  <HeartPulse className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight mb-2 leading-tight">
                  Central de <br /> Chamados
                </h1>
                <p className="text-red-100 text-sm font-medium opacity-90 leading-relaxed">
                  HEMOPE - Fundação de Hematologia
                </p>
              </div>

              <div className="relative z-10 mt-8 hidden md:block">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-red-100/80 text-sm">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span>Registro rápido</span>
                  </div>
                  <div className="flex items-center gap-3 text-red-100/80 text-sm">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                      <Activity className="w-4 h-4" />
                    </div>
                    <span>Atendimento ágil</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Section */}
            <div className="p-6 md:p-8 md:w-2/3 overflow-y-auto">
              <motion.form
                variants={containerVariants}
                initial="hidden"
                animate="show"
                onSubmit={handleSubmit}
                className="h-full flex flex-col justify-center"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column: Identification */}
                  <div className="space-y-5">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Identificação
                      </span>
                      <div className="h-px flex-1 bg-gray-100"></div>
                    </div>

                    <motion.div variants={itemVariants} className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 ml-1">
                        Nome Completo
                      </label>
                      <div className="relative group">
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          placeholder="Seu nome"
                          className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 pl-10 outline-none transition-all focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-gray-800 placeholder:text-gray-400 font-medium text-sm group-hover:bg-white"
                        />
                        <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-red-500" />
                      </div>
                    </motion.div>

                    <motion.div
                      variants={itemVariants}
                      className="space-y-1.5 relative z-20"
                    >
                      <label className="text-xs font-bold text-gray-700 ml-1">
                        Setor
                      </label>
                      <div className="relative group">
                        <input
                          type="text"
                          value={sectorSearch}
                          onChange={(e) => {
                            setSectorSearch(e.target.value);
                            setIsSectorOpen(true);
                          }}
                          onFocus={() => setIsSectorOpen(true)}
                          onBlur={() =>
                            setTimeout(() => setIsSectorOpen(false), 200)
                          }
                          placeholder="Pesquise seu setor..."
                          className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 pl-10 outline-none transition-all focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-gray-800 placeholder:text-gray-400 font-medium text-sm group-hover:bg-white"
                        />
                        <Building2 className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-red-500" />
                      </div>

                      <AnimatePresence>
                        {isSectorOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 5, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 5, scale: 0.98 }}
                            className="absolute w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 max-h-48 overflow-y-auto z-30 scrollbar-thin scrollbar-thumb-gray-200"
                          >
                            {filteredSectors.length > 0 ? (
                              filteredSectors.map((sector) => (
                                <button
                                  key={sector.id}
                                  type="button"
                                  onClick={() => {
                                    setFormData({
                                      ...formData,
                                      sectorId: sector.id,
                                    });
                                    setSectorSearch(sector.name);
                                    setIsSectorOpen(false);
                                  }}
                                  className="w-full text-left px-4 py-2.5 hover:bg-red-50 transition-colors border-b border-gray-50 last:border-0 flex justify-between items-center group"
                                >
                                  <span className="text-gray-700 font-medium group-hover:text-red-700 text-xs">
                                    {sector.name}
                                  </span>
                                </button>
                              ))
                            ) : (
                              <div className="p-3 text-center text-gray-400 text-xs">
                                Nenhum setor encontrado
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </div>

                  {/* Right Column: Problem Details */}
                  <div className="space-y-5">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Detalhes
                      </span>
                      <div className="h-px flex-1 bg-gray-100"></div>
                    </div>

                    <motion.div variants={itemVariants} className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 ml-1">
                        O que está acontecendo?
                      </label>
                      <div className="relative group">
                        <input
                          type="text"
                          required
                          value={formData.problem}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              problem: e.target.value,
                            })
                          }
                          placeholder="Resumo do problema"
                          className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 pl-10 outline-none transition-all focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-gray-800 placeholder:text-gray-400 font-medium text-sm group-hover:bg-white"
                        />
                        <Activity className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-red-500" />
                      </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 ml-1">
                        Descrição Detalhada
                      </label>
                      <div className="relative group">
                        <textarea
                          required
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              description: e.target.value,
                            })
                          }
                          placeholder="Descreva com detalhes..."
                          className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 pl-10 outline-none transition-all focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-gray-800 placeholder:text-gray-400 font-medium text-sm min-h-[80px] resize-none group-hover:bg-white"
                        />
                        <FileText className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5 transition-colors group-focus-within:text-red-500" />
                      </div>
                    </motion.div>
                  </div>
                </div>

                <motion.div
                  variants={itemVariants}
                  className="pt-6 flex items-center justify-end"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={loading}
                    type="submit"
                    className="w-full md:w-auto bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-10 rounded-xl shadow-lg shadow-red-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-sm"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>Enviar Chamado</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>
                </motion.div>
              </motion.form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
