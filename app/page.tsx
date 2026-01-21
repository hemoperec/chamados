<<<<<<< HEAD

=======
>>>>>>> 469620d32283c99111bff621cbe965468a293ee5
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
<<<<<<< HEAD
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { db } from "@/lib/firebase";
import { serverTimestamp, runTransaction, doc } from "firebase/firestore";
import { SECTORS } from "@/lib/sectors";
import { CATALOG, ServiceCategory, getResponsibleTech } from "@/lib/catalog";

// Helper to render dynamic icons
const DynamicIcon = ({ name, className }: { name: string; className?: string }) => {
  const Icon = (LucideIcons as any)[name];
  return Icon ? <Icon className={className} /> : <Activity className={className} />;
};

export default function Home() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    sectorId: "",
    description: "",
  });
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [selectedProblemTypeId, setSelectedProblemTypeId] = useState<string>("");
  
=======
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
>>>>>>> 469620d32283c99111bff621cbe965468a293ee5
  const [sectorSearch, setSectorSearch] = useState("");
  const [isSectorOpen, setIsSectorOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
<<<<<<< HEAD
  const [lastTicketId, setLastTicketId] = useState("");
=======
>>>>>>> 469620d32283c99111bff621cbe965468a293ee5

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

<<<<<<< HEAD
  const currentCategory = useMemo(
    () => CATALOG.find((c) => c.id === selectedCategory),
    [selectedCategory]
  );

  const currentItem = useMemo(
    () => currentCategory?.items.find((i) => i.id === selectedItemId),
    [currentCategory, selectedItemId]
  );

  const handleNextStep = () => {
    if (step === 1 && (!formData.name || !formData.sectorId)) return;
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory || !selectedItemId) return;

    setLoading(true);
    setStatus("idle");

    const responsibleTech = getResponsibleTech(selectedCategory, selectedItemId, selectedProblemTypeId);
    const categoryLabel = CATALOG.find(c => c.id === selectedCategory)?.label;
    const itemLabel = CATALOG.find(c => c.id === selectedCategory)?.items.find(i => i.id === selectedItemId)?.label;
    
    const problemTypeLabel = currentItem?.problemTypes?.find(p => p.id === selectedProblemTypeId)?.label;
    const finalProblemTitle = problemTypeLabel 
      ? `${categoryLabel} - ${itemLabel} - ${problemTypeLabel}`
      : `${categoryLabel} - ${itemLabel}`;

    try {
      // Use transaction to get sequential ID
      const newTicketId = await runTransaction(db, async (transaction) => {
        const counterRef = doc(db, "counters", "tickets");
        const counterDoc = await transaction.get(counterRef);

        let newCount = 1;
        if (counterDoc.exists()) {
          newCount = counterDoc.data().count + 1;
        }

        // Initialize or update counter
        transaction.set(counterRef, { count: newCount }, { merge: true });

        // Use the number as the document ID (converted to string)
        const ticketId = newCount.toString();
        const ticketRef = doc(db, "tickets", ticketId);

        transaction.set(ticketRef, {
          requesterName: formData.name,
          sectorId: formData.sectorId,
          sectorName: selectedSector
            ? selectedSector.name
            : formData.sectorId || sectorSearch,
          category: selectedCategory,
          categoryLabel: categoryLabel,
          serviceItem: selectedItemId,
          serviceItemLabel: itemLabel,
          problemTypeId: selectedProblemTypeId || null,
          problemTypeLabel: problemTypeLabel || null,
          problemTitle: finalProblemTitle,
          description: formData.description,
          priority: selectedSector ? selectedSector.priority : "3",
          status: "aberto",
          technicianName: responsibleTech || "Suporte N1",
          createdAt: serverTimestamp(),
        });

        return ticketId;
      });

      setLastTicketId(newTicketId);
      setStatus("success");
      // Reset form
      setFormData({ name: "", sectorId: "", description: "" });
      setSelectedCategory(null);
      setSelectedItemId("");
      setSelectedProblemTypeId("");
      setSectorSearch("");
      setStep(1);
=======
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
>>>>>>> 469620d32283c99111bff621cbe965468a293ee5
    } catch (error) {
      console.error("Error adding document: ", error);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
<<<<<<< HEAD
    hidden: { opacity: 0, x: 20 },
    show: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3 } },
=======
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
>>>>>>> 469620d32283c99111bff621cbe965468a293ee5
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 overflow-hidden bg-gradient-to-br from-red-600 via-red-500 to-white animate-gradient-slow relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-white/10 blur-[100px] animate-float-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-red-800/20 blur-[120px] animate-float-delayed" />
<<<<<<< HEAD
=======
        <div className="absolute top-[40%] left-[20%] w-[200px] h-[200px] rounded-full bg-white/5 blur-[50px] animate-pulse-slow" />
>>>>>>> 469620d32283c99111bff621cbe965468a293ee5
      </div>

      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
<<<<<<< HEAD
            className="w-full max-w-lg z-10 bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-red-900/30 p-12 text-center border border-white/50"
          >
=======
            className="w-full max-w-lg z-10 bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-red-900/30 p-12 text-center relative overflow-hidden border border-white/50"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-green-600" />
>>>>>>> 469620d32283c99111bff621cbe965468a293ee5
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
<<<<<<< HEAD
            <p className="text-gray-600 mb-4 leading-relaxed">
              Sua solicitação foi classificada e encaminhada para o técnico responsável.
            </p>
            
            <div className="bg-gray-100 p-4 rounded-xl mb-6 border border-gray-200">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
                Número do Chamado
              </p>
              <div className="text-2xl font-mono font-bold text-gray-800 select-all">
                {lastTicketId}
              </div>
              <p className="text-sm text-red-600 font-bold mt-2 bg-red-50 p-2 rounded-lg border border-red-100">
                IMPORTANTE: Guarde este código para acompanhar o status do seu chamado.
              </p>
            </div>

            <div className="space-y-3">
              <a
                href={`/acompanhar?id=${lastTicketId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 bg-red-600 text-white rounded-xl font-bold shadow-lg hover:bg-red-700 transition-all flex items-center justify-center gap-2"
              >
                <Search className="w-5 h-5" />
                Acompanhar Agora
              </a>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStatus("idle")}
                className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold shadow-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
              >
                Abrir Novo Chamado
              </motion.button>
            </div>
=======
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
>>>>>>> 469620d32283c99111bff621cbe965468a293ee5
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
<<<<<<< HEAD
            className="w-full max-w-5xl z-10 bg-white/95 backdrop-blur-3xl rounded-[2rem] shadow-2xl shadow-red-900/20 overflow-hidden border border-white/60 flex flex-col md:flex-row min-h-[600px]"
          >
            {/* Sidebar / Progress */}
            <div className="bg-gradient-to-br from-red-700 to-red-900 p-8 text-white relative overflow-hidden md:w-1/3 flex flex-col">
              <div className="relative z-10 mb-12">
                <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl shadow-inner border border-white/10 w-fit mb-6">
                  <HeartPulse className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">
                  Central de <br /> Serviços
                </h1>
                <p className="text-red-200 text-sm font-medium opacity-90">
                  HEMOPE - Tecnologia da Informação
                </p>
              </div>

              <div className="mb-8">
                <a
                  href="/acompanhar"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors border border-white/10"
                >
                  <Search className="w-4 h-4" />
                  Já tem um chamado? Acompanhe aqui
                </a>
              </div>

              {/* Steps Indicator */}
              <div className="relative z-10 space-y-8 flex-1">
                <div className={`flex items-center gap-4 transition-opacity ${step >= 1 ? 'opacity-100' : 'opacity-50'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'bg-white text-red-700 border-white' : 'border-white/30 text-white/50'}`}>
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Identificação</p>
                    <p className="text-xs text-red-200">Seus dados</p>
                  </div>
                </div>

                <div className={`flex items-center gap-4 transition-opacity ${step >= 2 ? 'opacity-100' : 'opacity-50'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'bg-white text-red-700 border-white' : 'border-white/30 text-white/50'}`}>
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Classificação</p>
                    <p className="text-xs text-red-200">Tipo de serviço</p>
                  </div>
                </div>

                <div className={`flex items-center gap-4 transition-opacity ${step >= 3 ? 'opacity-100' : 'opacity-50'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 3 ? 'bg-white text-red-700 border-white' : 'border-white/30 text-white/50'}`}>
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Detalhes</p>
                    <p className="text-xs text-red-200">Descrição do problema</p>
=======
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
>>>>>>> 469620d32283c99111bff621cbe965468a293ee5
                  </div>
                </div>
              </div>
            </div>

<<<<<<< HEAD
            {/* Main Content Area */}
            <div className="p-8 md:w-2/3 flex flex-col relative bg-gray-50/50">
              <div className="flex-1">
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      variants={containerVariants}
                      initial="hidden"
                      animate="show"
                      exit="exit"
                      className="space-y-6"
                    >
                      <h3 className="text-2xl font-bold text-gray-800">Quem está solicitando?</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                          <div className="relative">
                            <input
                              type="text"
                              value={formData.name}
                              onChange={(e) => setFormData({...formData, name: e.target.value})}
                              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 pl-10 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none text-gray-900 placeholder:text-gray-400"
                              placeholder="Digite seu nome"
                            />
                            <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Setor</label>
                          <div className="relative">
                            <input
                              type="text"
                              value={sectorSearch}
                              onChange={(e) => {
                                setSectorSearch(e.target.value);
                                setIsSectorOpen(true);
                              }}
                              onFocus={() => setIsSectorOpen(true)}
                              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 pl-10 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none text-gray-900 placeholder:text-gray-400"
                              placeholder="Pesquise seu setor..."
                            />
                            <Building2 className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            
                            {isSectorOpen && (
                              <div className="absolute w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 max-h-48 overflow-y-auto z-50">
                                {filteredSectors.map((s) => (
                                  <button
                                    key={s.id}
                                    onClick={() => {
                                      setFormData({...formData, sectorId: s.id});
                                      setSectorSearch(s.name);
                                      setIsSectorOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-2 hover:bg-red-50 text-sm text-gray-900"
                                  >
                                    {s.name}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step2"
                      variants={containerVariants}
                      initial="hidden"
                      animate="show"
                      exit="exit"
                      className="space-y-6"
                    >
                      <h3 className="text-2xl font-bold text-gray-800">O que você precisa?</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {CATALOG.map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => {
                              setSelectedCategory(cat.id);
                              setStep(3);
                            }}
                            className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] ${
                              selectedCategory === cat.id
                                ? "border-red-500 bg-red-50 text-red-700"
                                : "border-gray-100 bg-white text-gray-600 hover:border-red-200 hover:bg-red-50/30"
                            }`}
                          >
                            <div className={`p-3 rounded-full ${selectedCategory === cat.id ? "bg-red-200" : "bg-gray-100"}`}>
                              <DynamicIcon name={cat.icon} className="w-6 h-6" />
                            </div>
                            <span className="font-semibold text-sm">{cat.label}</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && currentCategory && (
                    <motion.div
                      key="step3"
                      variants={containerVariants}
                      initial="hidden"
                      animate="show"
                      exit="exit"
                      className="space-y-6"
                    >
                      <h3 className="text-2xl font-bold text-gray-800">Detalhes da Solicitação</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Selecione o Item Específico
                          </label>
                          <select
                            value={selectedItemId}
                            onChange={(e) => {
                              setSelectedItemId(e.target.value);
                              setSelectedProblemTypeId(""); // Reset problem type when item changes
                            }}
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none text-gray-900"
                          >
                            <option value="">Selecione...</option>
                            {currentCategory.items.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {currentItem?.problemTypes && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="space-y-2"
                          >
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Tipo de Problema (POP)
                            </label>
                            <select
                              value={selectedProblemTypeId}
                              onChange={(e) => setSelectedProblemTypeId(e.target.value)}
                              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none text-gray-900"
                            >
                              <option value="">Selecione o tipo de problema...</option>
                              {currentItem.problemTypes.map((pt) => (
                                <option key={pt.id} value={pt.id}>
                                  {pt.label}
                                </option>
                              ))}
                            </select>
                            <p className="text-xs text-gray-500">
                              Isso ajuda a direcionar para o técnico correto (Ex: Lyparly, Infra, etc).
                            </p>
                          </motion.div>
                        )}

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Descrição Detalhada
                          </label>
                          <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            placeholder="Descreva o problema ou solicitação com detalhes..."
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 min-h-[120px] focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none resize-none text-gray-900 placeholder:text-gray-400"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer / Navigation Buttons */}
              <div className="pt-6 border-t border-gray-100 flex justify-between mt-auto">
                {step > 1 ? (
                  <button
                    onClick={handlePrevStep}
                    className="px-6 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" /> Voltar
                  </button>
                ) : (
                  <div></div>
                )}

                {step < 3 ? (
                  <button
                    onClick={handleNextStep}
                    disabled={!formData.name || !formData.sectorId}
                    className="px-8 py-2.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Próximo <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={loading || !selectedItemId || !formData.description || (currentItem?.problemTypes && !selectedProblemTypeId)}
                    className="px-8 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all flex items-center gap-2 shadow-lg shadow-red-500/30 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Enviar Chamado
                  </button>
                )}
              </div>
=======
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
>>>>>>> 469620d32283c99111bff621cbe965468a293ee5
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
