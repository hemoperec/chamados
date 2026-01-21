"use client";

import { useEffect, useState, useMemo } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  Timestamp,
<<<<<<< HEAD
  serverTimestamp,
  runTransaction,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { SECTORS } from "@/lib/sectors";
import { CATALOG, getResponsibleTech } from "@/lib/catalog";
=======
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { SECTORS } from "@/lib/sectors";
>>>>>>> 469620d32283c99111bff621cbe965468a293ee5
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  UserPlus,
<<<<<<< HEAD
=======
  LayoutDashboard,
>>>>>>> 469620d32283c99111bff621cbe965468a293ee5
  CheckCircle,
  Clock,
  AlertTriangle,
  Search,
<<<<<<< HEAD
=======
  Filter,
  MoreVertical,
  Trash2,
>>>>>>> 469620d32283c99111bff621cbe965468a293ee5
  X,
  Activity,
  BarChart3,
  PieChart,
  List,
  CheckSquare,
  MessageSquare,
<<<<<<< HEAD
  Share2,
  Users,
  User,
=======
>>>>>>> 469620d32283c99111bff621cbe965468a293ee5
} from "lucide-react";
import {
  PieChart as RePieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as ReTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  formatDistance,
  differenceInMinutes,
<<<<<<< HEAD
  addHours,
=======
>>>>>>> 469620d32283c99111bff621cbe965468a293ee5
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  isWithinInterval,
} from "date-fns";
import { ptBR } from "date-fns/locale";

interface Ticket {
  id: string;
  requesterName: string;
  sectorName: string;
  problemTitle: string;
  description: string;
  priority: "1" | "2" | "3";
  status: "aberto" | "em_andamento" | "concluido";
  createdAt: Timestamp;
  closedAt?: Timestamp;
  observation?: string;
  technicianName?: string;
  technicianId?: string;
<<<<<<< HEAD
  category?: string;
  serviceItem?: string;
  problemTypeId?: string;
}

const TECH_TEAMS = [
  "Suporte N1",
  "Suporte N2",
  "Suporte N3",
  "Infraestrutura",
  "Suporte MV",
  "Suporte SBS",
  "Cadastros",
  "Desenvolvimento",
];

const getSlaInfo = (ticket: Ticket) => {
  if (!ticket.createdAt || ticket.status === 'concluido') return null;
  
  const created = ticket.createdAt.toDate();
  let hours = 6; // Default priority 3 (Low)
  if (ticket.priority === '1') hours = 1; // Critical
  if (ticket.priority === '2') hours = 3; // Normal
  
  const deadline = addHours(created, hours);
  const now = new Date();
  const isOverdue = now > deadline;
  const minutesDiff = differenceInMinutes(deadline, now);
  
  // Calculate display time
  const absMinutes = Math.abs(minutesDiff);
  const h = Math.floor(absMinutes / 60);
  const m = absMinutes % 60;
  
  return { 
    deadline, 
    isOverdue, 
    timeString: `${h}h ${m}m ${isOverdue ? 'atrasado' : 'restantes'}`,
    minutesDiff // Positive = time remaining, Negative = overdue (wait, differenceInMinutes(left, right) = left - right)
    // deadline - now. If deadline > now (future), positive. If deadline < now (past), negative.
  };
};

function EscalateModal({
  ticket,
  onClose,
  onConfirm,
}: {
  ticket: Ticket;
  onClose: () => void;
  onConfirm: (
    techName: string,
    updates?: {
      category?: string;
      serviceItem?: string;
      problemTypeId?: string;
      problemTitle?: string;
    },
  ) => void;
}) {
  const [selectedTech, setSelectedTech] = useState(ticket.technicianName || "");
  const [reclassify, setReclassify] = useState(false);

  // Classification State
  const [selectedCategory, setSelectedCategory] = useState<string>(
    ticket.category || "",
  );
  const [selectedItem, setSelectedItem] = useState<string>(
    ticket.serviceItem || "",
  );
  const [selectedProblemType, setSelectedProblemType] = useState<string>(
    ticket.problemTypeId || "",
  );

  const currentCategory = useMemo(
    () => CATALOG.find((c) => c.id === selectedCategory),
    [selectedCategory],
  );
  const currentItem = useMemo(
    () => currentCategory?.items.find((i) => i.id === selectedItem),
    [currentCategory, selectedItem],
  );

  // Auto-suggest technician when classification changes
  useEffect(() => {
    if (reclassify && selectedCategory && selectedItem) {
      const suggestedTech = getResponsibleTech(
        selectedCategory,
        selectedItem,
        selectedProblemType,
      );
      if (suggestedTech) {
        setSelectedTech(suggestedTech);
      }
    }
  }, [selectedCategory, selectedItem, selectedProblemType, reclassify]);

  const handleConfirm = () => {
    if (reclassify) {
      const categoryLabel = currentCategory?.label;
      const itemLabel = currentItem?.label;
      const problemTypeLabel = currentItem?.problemTypes?.find(
        (p) => p.id === selectedProblemType,
      )?.label;

      const newTitle = problemTypeLabel
        ? `${categoryLabel} - ${itemLabel} - ${problemTypeLabel}`
        : `${categoryLabel} - ${itemLabel}`;

      onConfirm(selectedTech, {
        category: selectedCategory,
        serviceItem: selectedItem,
        problemTypeId: selectedProblemType,
        problemTitle: newTitle,
      });
    } else {
      onConfirm(selectedTech);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#1e293b] w-full max-w-md rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-white/5">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">
              Escalar / Reclassificar
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Chamado <strong>#{ticket.id.slice(0, 4)}</strong> -{" "}
            {ticket.problemTitle}
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              id="reclassify"
              checked={reclassify}
              onChange={(e) => setReclassify(e.target.checked)}
              className="w-4 h-4 rounded border-gray-600 bg-[#0f172a] text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="reclassify" className="text-sm text-gray-300">
              Corrigir Classificação (ITIL - N1)
            </label>
          </div>

          <AnimatePresence>
            {reclassify && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-3 overflow-hidden"
              >
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Categoria
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setSelectedItem("");
                      setSelectedProblemType("");
                    }}
                    className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500/50 outline-none"
                  >
                    <option value="">Selecione...</option>
                    {CATALOG.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedCategory && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Serviço / Item
                    </label>
                    <select
                      value={selectedItem}
                      onChange={(e) => {
                        setSelectedItem(e.target.value);
                        setSelectedProblemType("");
                      }}
                      className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500/50 outline-none"
                    >
                      <option value="">Selecione...</option>
                      {currentCategory?.items.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {currentItem?.problemTypes && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Tipo de Problema
                    </label>
                    <select
                      value={selectedProblemType}
                      onChange={(e) => setSelectedProblemType(e.target.value)}
                      className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500/50 outline-none"
                    >
                      <option value="">Selecione...</option>
                      {currentItem.problemTypes.map((prob) => (
                        <option key={prob.id} value={prob.id}>
                          {prob.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Nova Equipe / Técnico Responsável
            </label>
            <select
              value={selectedTech}
              onChange={(e) => setSelectedTech(e.target.value)}
              className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none"
            >
              <option value="">Selecione...</option>
              {TECH_TEAMS.map((tech) => (
                <option key={tech} value={tech}>
                  {tech}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-gray-300 font-bold rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={
                !selectedTech ||
                (selectedTech === ticket.technicianName && !reclassify)
              }
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors"
            >
              {reclassify ? "Salvar e Escalar" : "Escalar"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
=======
>>>>>>> 469620d32283c99111bff621cbe965468a293ee5
}

// Modal para criar chamado (Technician view)
function CreateTicketModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    sectorId: "",
    problem: "",
    description: "",
  });
  const [sectorSearch, setSectorSearch] = useState("");
  const [isSectorOpen, setIsSectorOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const filteredSectors = useMemo(() => {
    if (!sectorSearch) return SECTORS;
    const lower = sectorSearch.toLowerCase();
    return SECTORS.filter(
      (s) =>
        s.name.toLowerCase().includes(lower) ||
        (s.location && s.location.toLowerCase().includes(lower)),
    );
  }, [sectorSearch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const selectedSector = SECTORS.find((s) => s.id === formData.sectorId);
<<<<<<< HEAD
      
      await runTransaction(db, async (transaction) => {
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
          problemTitle: formData.problem,
          description: formData.description,
          priority: selectedSector ? selectedSector.priority : "3",
          status: "aberto",
          createdAt: serverTimestamp(),
        });
      });

=======
      await addDoc(collection(db, "tickets"), {
        requesterName: formData.name,
        sectorId: formData.sectorId,
        sectorName: selectedSector
          ? selectedSector.name
          : formData.sectorId || sectorSearch,
        problemTitle: formData.problem,
        description: formData.description,
        priority: selectedSector ? selectedSector.priority : "3",
        status: "aberto",
        createdAt: serverTimestamp(),
      });
>>>>>>> 469620d32283c99111bff621cbe965468a293ee5
      onClose();
    } catch (error) {
      console.error("Error adding ticket: ", error);
      alert("Erro ao criar chamado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#1e293b] p-8 rounded-3xl border border-white/10 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Novo Chamado</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Nome do Solicitante
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full bg-[#0f172a] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Nome completo"
              />
            </div>
            {/* Sector */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Setor
              </label>
              <input
                type="text"
                value={sectorSearch}
                onChange={(e) => {
                  setSectorSearch(e.target.value);
                  setIsSectorOpen(true);
                }}
                onFocus={() => setIsSectorOpen(true)}
                className="w-full bg-[#0f172a] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Pesquise o setor..."
              />
              {isSectorOpen && (
                <div className="absolute w-full mt-2 bg-[#0f172a] rounded-xl shadow-xl border border-white/10 max-h-48 overflow-y-auto z-30">
                  {filteredSectors.map((sector) => (
                    <button
                      key={sector.id}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, sectorId: sector.id });
                        setSectorSearch(sector.name);
                        setIsSectorOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-white/5 text-gray-300 hover:text-white text-sm"
                    >
                      {sector.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Problem */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Resumo do Problema
            </label>
            <input
              type="text"
              required
              value={formData.problem}
              onChange={(e) =>
                setFormData({ ...formData, problem: e.target.value })
              }
              className="w-full bg-[#0f172a] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Ex: Impressora sem funcionar"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Descrição Detalhada
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full bg-[#0f172a] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors h-32 resize-none"
              placeholder="Descreva o problema..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Registrando..." : "Registrar Chamado"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

// Modal para criar usuário
function CreateUserModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
<<<<<<< HEAD
  const [role, setRole] = useState<"N1" | "N2" | "N3">("N1");
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
=======
>>>>>>> 469620d32283c99111bff621cbe965468a293ee5
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

<<<<<<< HEAD
  const toggleSpecialty = (itemId: string) => {
    setSelectedSpecialties(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

=======
>>>>>>> 469620d32283c99111bff621cbe965468a293ee5
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
<<<<<<< HEAD
=======
      // 1. Create user via API Route (admin-only operation)
      // Since we don't have a backend yet, we'll simulate or use a client-side workaround
      // WARNING: Client-side user creation with secondary auth instance is complex.
      // Ideally, use a Next.js API route with firebase-admin.
      // For now, we will assume the user has the permission or use a temporary workaround.
      // But wait, the previous context mentioned using REST API to avoid session conflict.

>>>>>>> 469620d32283c99111bff621cbe965468a293ee5
      const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            returnSecureToken: true,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.error?.message === "CONFIGURATION_NOT_FOUND") {
          throw new Error(
            "Erro de Configuração: O provedor de Email/Senha não está ativado no Firebase Console. Vá em Authentication > Sign-in method e ative-o.",
          );
        }
        throw new Error(data.error?.message || "Erro ao criar usuário");
      }

<<<<<<< HEAD
      // 2. Update profile (name) in Auth
      const idToken = data.idToken;
      const uid = data.localId;
      
=======
      // 2. Update profile (name)
      const idToken = data.idToken;
>>>>>>> 469620d32283c99111bff621cbe965468a293ee5
      await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            idToken,
            displayName: name,
            returnSecureToken: false,
          }),
        },
      );

<<<<<<< HEAD
      // 3. Create User Document in Firestore with Role and Specialties
      await setDoc(doc(db, "users", uid), {
        uid,
        name,
        email,
        role,
        specialties: selectedSpecialties,
        createdAt: serverTimestamp(),
      });

=======
>>>>>>> 469620d32283c99111bff621cbe965468a293ee5
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
<<<<<<< HEAD
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] overflow-y-auto py-10">
=======
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60]">
>>>>>>> 469620d32283c99111bff621cbe965468a293ee5
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
<<<<<<< HEAD
        className="bg-[#1e293b] p-8 rounded-3xl border border-white/10 w-full max-w-2xl shadow-2xl my-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Novo Técnico / Analista</h2>
=======
        className="bg-[#1e293b] p-8 rounded-3xl border border-white/10 w-full max-w-md shadow-2xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Novo Técnico</h2>
>>>>>>> 469620d32283c99111bff621cbe965468a293ee5
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {success ? (
          <div className="bg-emerald-500/10 text-emerald-500 p-4 rounded-xl border border-emerald-500/20 text-center">
            <CheckCircle className="w-8 h-8 mx-auto mb-2" />
            <p className="font-bold">Usuário criado com sucesso!</p>
          </div>
        ) : (
<<<<<<< HEAD
          <form onSubmit={handleCreate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Informações Básicas</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#0f172a] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Ex: João Silva"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#0f172a] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="joao@hemope.pe.gov.br"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Senha
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#0f172a] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="******"
                    minLength={6}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Nível de Acesso (ITIL)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["N1", "N2", "N3"].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r as any)}
                        className={`py-2 rounded-lg border text-sm font-bold transition-all ${
                          role === r
                            ? "bg-blue-600 border-blue-500 text-white"
                            : "bg-[#0f172a] border-white/5 text-gray-400 hover:bg-white/5"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {role === "N1" && "Service Desk: Triagem e resoluções rápidas."}
                    {role === "N2" && "Suporte Técnico: Resolução presencial e problemas específicos."}
                    {role === "N3" && "Especialista: Infraestrutura, Banco de Dados e Sistemas Críticos."}
                  </p>
                </div>
              </div>

              {/* Specialties */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Especialidades (Catálogo)</h3>
                <div className="bg-[#0f172a] rounded-xl border border-white/5 p-4 h-[320px] overflow-y-auto custom-scrollbar">
                  {CATALOG.map((category) => (
                    <div key={category.id} className="mb-4 last:mb-0">
                      <h4 className="text-xs font-bold text-gray-300 uppercase mb-2 flex items-center gap-2">
                         {category.label}
                      </h4>
                      <div className="space-y-1">
                        {category.items.map((item) => (
                          <label
                            key={item.id}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer group"
                          >
                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                              selectedSpecialties.includes(item.id)
                                ? "bg-blue-500 border-blue-500"
                                : "border-gray-600 group-hover:border-gray-500"
                            }`}>
                              {selectedSpecialties.includes(item.id) && <CheckSquare className="w-3 h-3 text-white" />}
                            </div>
                            <span className={`text-sm ${
                              selectedSpecialties.includes(item.id) ? "text-white" : "text-gray-400"
                            }`}>
                              {item.label}
                            </span>
                            <input
                              type="checkbox"
                              className="hidden"
                              checked={selectedSpecialties.includes(item.id)}
                              onChange={() => toggleSpecialty(item.id)}
                            />
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  Selecione os itens que este técnico é responsável por atender.
                </p>
              </div>
=======
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Nome Completo
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#0f172a] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Ex: João Silva"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0f172a] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="joao@hemope.pe.gov.br"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Senha
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0f172a] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="******"
                minLength={6}
              />
>>>>>>> 469620d32283c99111bff621cbe965468a293ee5
            </div>

            {error && (
              <div className="bg-red-500/10 text-red-500 p-3 rounded-xl text-sm border border-red-500/20">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 mt-4"
            >
              {loading ? "Criando..." : "Criar Usuário"}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}

// Modal para fechar chamado
function CloseTicketModal({
  ticket,
  onClose,
  onConfirm,
}: {
  ticket: Ticket;
  onClose: () => void;
  onConfirm: (observation: string) => void;
}) {
  const [observation, setObservation] = useState("");

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#1e293b] p-8 rounded-3xl border border-white/10 w-full max-w-md shadow-2xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Finalizar Chamado</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-300 mb-2">
            Confirmar finalização do chamado:
          </p>
          <div className="bg-[#0f172a] p-4 rounded-xl border border-white/5">
            <p className="font-medium text-white">{ticket.problemTitle}</p>
            <p className="text-sm text-gray-400 mt-1">{ticket.description}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Observação Técnica (Opcional)
            </label>
            <textarea
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              className="w-full bg-[#0f172a] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors h-24 resize-none"
              placeholder="Descreva a solução aplicada..."
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => onConfirm(observation)}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-colors"
            >
              Confirmar
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, color }: any) {
  const colorClasses: any = {
    blue: "from-blue-600 to-blue-800 shadow-blue-500/20",
    emerald: "from-emerald-600 to-emerald-800 shadow-emerald-500/20",
    purple: "from-purple-600 to-purple-800 shadow-purple-500/20",
    yellow: "from-yellow-600 to-yellow-800 shadow-yellow-500/20",
  };

  return (
    <div className="bg-[#1e293b] p-6 rounded-3xl border border-white/5 shadow-xl hover:translate-y-[-2px] transition-transform duration-300">
      <div className="flex justify-between items-start mb-4">
        <div
          className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} shadow-lg`}
        >
          {icon}
        </div>
        <span
          className={`text-xs font-medium px-2 py-1 rounded-lg bg-${color}-500/10 text-${color}-400 border border-${color}-500/20`}
        >
          {trend}
        </span>
      </div>
      <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const styles: any = {
    "1": "bg-red-500/10 text-red-500 border-red-500/20",
<<<<<<< HEAD
    "2": "bg-blue-500/10 text-blue-500 border-blue-500/20",
    "3": "bg-gray-500/10 text-gray-400 border-gray-500/20",
  };
  const labels: any = {
    "1": "Crítica (1h)",
    "2": "Normal (3h)",
    "3": "Baixa (6h)",
=======
    "2": "bg-orange-500/10 text-orange-500 border-orange-500/20",
    "3": "bg-blue-500/10 text-blue-500 border-blue-500/20",
  };
  const labels: any = {
    "1": "Urgente",
    "2": "Média",
    "3": "Normal",
>>>>>>> 469620d32283c99111bff621cbe965468a293ee5
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[priority]}`}
    >
      {labels[priority]}
    </span>
  );
}

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const [selectedTicketToClose, setSelectedTicketToClose] =
    useState<Ticket | null>(null);
<<<<<<< HEAD
  const [selectedTicketToEscalate, setSelectedTicketToEscalate] =
    useState<Ticket | null>(null);
  const [techViewMode, setTechViewMode] = useState<
    "all" | "mine" | "unassigned"
  >("mine");
=======
>>>>>>> 469620d32283c99111bff621cbe965468a293ee5
  const router = useRouter();

  const isAdmin = useMemo(() => {
    if (!user) return false;
    // Check for Dev Bypass
    if (
      typeof window !== "undefined" &&
      localStorage.getItem("admin_bypass") === "true"
    )
      return true;
    // Check for specific admin email
    if (user.email === "admin@hemope.com" || user.email === "hemope@hemope.com")
      return true;
    return false;
  }, [user]);

  // Auth Check
  useEffect(() => {
    // Check for Dev Bypass
    const isBypass =
      typeof window !== "undefined" &&
      localStorage.getItem("admin_bypass") === "true";
    if (isBypass) {
      setUser({
        uid: "dev-admin",
        email: "admin@hemope.com",
        displayName: "Administrador (Dev)",
      });
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Fetch Tickets
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "tickets"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const ticketsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Ticket[];
        setTickets(ticketsData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching tickets:", error);
        // If permission denied (common if auth rules are strict and we are in bypass), show empty or mock
        if (error.code === "permission-denied") {
          alert(
            "Aviso: Permissão negada no Firestore. Verifique as Regras de Segurança no Firebase Console.",
          );
        }
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [user]);

  const handleLogout = async () => {
    if (localStorage.getItem("admin_bypass")) {
      localStorage.removeItem("admin_bypass");
      setUser(null);
      router.push("/login");
      return;
    }
    await signOut(auth);
    router.push("/login");
  };

  const updateStatus = async (
    ticketId: string,
    newStatus: string,
    observation?: string,
  ) => {
    try {
      const updateData: any = {
        status: newStatus,
        updatedAt: new Date(),
      };

      if (newStatus === "concluido") {
        updateData.closedAt = new Date();
        if (observation) {
          updateData.observation = observation;
        }
        if (user) {
          updateData.technicianName = user.displayName || user.email;
          updateData.technicianId = user.uid;
        }
      }

      if (newStatus === "em_andamento" && user) {
        updateData.technicianName = user.displayName || user.email;
        updateData.technicianId = user.uid;
      }

      await updateDoc(doc(db, "tickets", ticketId), updateData);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

<<<<<<< HEAD
  const handleEscalate = async (
    ticketId: string,
    newTechName: string,
    updates?: any,
  ) => {
    try {
      const updateData: any = {
        technicianName: newTechName,
        updatedAt: new Date(),
        status: "aberto", // Reopen ticket for new team/tech
      };

      if (updates) {
        Object.assign(updateData, updates);
      }

      await updateDoc(doc(db, "tickets", ticketId), updateData);
    } catch (error) {
      console.error("Error escalating ticket:", error);
    }
  };

=======
>>>>>>> 469620d32283c99111bff621cbe965468a293ee5
  // Stats Calculations
  const stats = useMemo(() => {
    const total = tickets.length;
    const open = tickets.filter((t) => t.status === "aberto").length;
    const inProgress = tickets.filter(
      (t) => t.status === "em_andamento",
    ).length;
    const closed = tickets.filter((t) => t.status === "concluido").length;

    // Avg Time Calculation
    const closedTickets = tickets.filter(
      (t) => t.status === "concluido" && t.closedAt && t.createdAt,
    );
    let avgMinutes = 0;
    if (closedTickets.length > 0) {
      const totalMinutes = closedTickets.reduce((acc, t) => {
        const start = t.createdAt.toDate();
        const end = t.closedAt!.toDate();
        return acc + differenceInMinutes(end, start);
      }, 0);
      avgMinutes = totalMinutes / closedTickets.length;
    }

    const hours = Math.floor(avgMinutes / 60);
    const mins = Math.round(avgMinutes % 60);
    const avgTimeStr = `${hours}h ${mins}m`;

    return { total, open, inProgress, closed, avgTimeStr };
  }, [tickets]);

  // Admin Specific Stats
  const adminStats = useMemo(() => {
    if (!isAdmin) return null;

    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    const yearStart = startOfYear(now);
    const yearEnd = endOfYear(now);

    const monthTickets = tickets.filter((t) =>
      t.createdAt
        ? isWithinInterval(t.createdAt.toDate(), {
            start: monthStart,
            end: monthEnd,
          })
        : false,
    );

    const yearTickets = tickets.filter((t) =>
      t.createdAt
        ? isWithinInterval(t.createdAt.toDate(), {
            start: yearStart,
            end: yearEnd,
          })
        : false,
    );

    // Technician Performance
    const techPerformance: Record<string, number> = {};
    tickets
      .filter((t) => t.status === "concluido" && t.technicianName)
      .forEach((t) => {
        const name = t.technicianName!;
        techPerformance[name] = (techPerformance[name] || 0) + 1;
      });

    const techData = Object.entries(techPerformance)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // Prepare chart data
    const monthlyChartData = [
      { name: "Total", value: monthTickets.length, fill: "#3b82f6" },
      {
        name: "Resolvidos",
        value: monthTickets.filter((t) => t.status === "concluido").length,
        fill: "#10b981",
      },
    ];

    const yearlyChartData = [
      { name: "Total", value: yearTickets.length, fill: "#8b5cf6" },
      {
        name: "Resolvidos",
        value: yearTickets.filter((t) => t.status === "concluido").length,
        fill: "#10b981",
      },
    ];

<<<<<<< HEAD
    // Team Load (Real-time)
    const teamLoadMap: Record<string, { open: number; inProgress: number }> = {};
    TECH_TEAMS.forEach((team) => (teamLoadMap[team] = { open: 0, inProgress: 0 }));
    // Also track individual techs if they are not in the predefined list?
    tickets.forEach((t) => {
      if (t.status === "concluido") return;
      const tech = t.technicianName || "Suporte N1";
      // If tech is not in map, add it (dynamic techs)
      if (!teamLoadMap[tech]) teamLoadMap[tech] = { open: 0, inProgress: 0 };
      
      if (t.status === "aberto") teamLoadMap[tech].open++;
      if (t.status === "em_andamento") teamLoadMap[tech].inProgress++;
    });

    const teamLoad = Object.entries(teamLoadMap)
      .map(([name, counts]) => ({ name, ...counts }))
      .sort((a, b) => (b.open + b.inProgress) - (a.open + a.inProgress));

=======
>>>>>>> 469620d32283c99111bff621cbe965468a293ee5
    return {
      monthTotal: monthTickets.length,
      monthClosed: monthTickets.filter((t) => t.status === "concluido").length,
      yearTotal: yearTickets.length,
      yearClosed: yearTickets.filter((t) => t.status === "concluido").length,
      techData,
      monthlyChartData,
      yearlyChartData,
<<<<<<< HEAD
      teamLoad,
=======
>>>>>>> 469620d32283c99111bff621cbe965468a293ee5
    };
  }, [tickets, isAdmin]);

  // Chart Data
  const priorityData = useMemo(() => {
    const p1 = tickets.filter((t) => t.priority === "1").length;
    const p2 = tickets.filter((t) => t.priority === "2").length;
    const p3 = tickets.filter((t) => t.priority === "3").length;
    return [
      { name: "Urgente", value: p1, color: "#ef4444" }, // red-500
      { name: "Média", value: p2, color: "#f97316" }, // orange-500
      { name: "Normal", value: p3, color: "#3b82f6" }, // blue-500
    ].filter((d) => d.value > 0);
  }, [tickets]);

  const sectorData = useMemo(() => {
    const sectorCounts: Record<string, number> = {};
    tickets.forEach((t) => {
      const sector = t.sectorName || "Outros";
      sectorCounts[sector] = (sectorCounts[sector] || 0) + 1;
    });
    return Object.entries(sectorCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Top 5 sectors
  }, [tickets]);

<<<<<<< HEAD
  // Technician View Filter
  const filteredTechTickets = useMemo(() => {
    if (!user) return [];
    const pending = tickets.filter((t) => t.status !== "concluido");

    if (techViewMode === "mine") {
      return pending.filter(
        (t) =>
          t.technicianName === (user.displayName || user.email) ||
          t.technicianId === user.uid,
      );
    }
    // "all" shows everything not closed
    return pending;
  }, [tickets, user, techViewMode]);

=======
>>>>>>> 469620d32283c99111bff621cbe965468a293ee5
  const openTickets = tickets.filter((t) => t.status !== "concluido");
  const closedTickets = tickets.filter((t) => t.status === "concluido");

  // RENDER FOR TECHNICIAN
  if (!loading && !isAdmin) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-red-500/30">
        <nav className="fixed top-0 w-full z-50 bg-[#1e293b]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-2 rounded-lg shadow-lg shadow-blue-500/20">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Área do <span className="text-blue-500">Técnico</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-sm font-medium text-gray-200">
                {user?.email}
              </span>
              <span className="text-xs text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />{" "}
                Online
              </span>
            </div>
            <button
              onClick={() => setShowCreateTicket(true)}
              className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 rounded-full transition-colors border border-blue-500/20"
              title="Novo Chamado"
            >
              <MessageSquare className="w-5 h-5" />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-full transition-colors border border-red-500/20"
              title="Sair"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </nav>

        <main className="pt-24 pb-12 px-4 sm:px-8 max-w-[1200px] mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-1">Chamados Abertos</h1>
              <p className="text-gray-400 text-sm">
                Lista de solicitações aguardando atendimento.
              </p>
            </div>
          </div>

<<<<<<< HEAD
          <div className="flex gap-4 border-b border-white/5 pb-1">
            <button
              onClick={() => setTechViewMode("mine")}
              className={`pb-3 px-2 text-sm font-medium transition-colors relative ${
                techViewMode === "mine" ? "text-blue-400" : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Meus Atendimentos
              {techViewMode === "mine" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                />
              )}
            </button>
            <button
              onClick={() => setTechViewMode("all")}
              className={`pb-3 px-2 text-sm font-medium transition-colors relative ${
                techViewMode === "all" ? "text-blue-400" : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Fila Geral
              {techViewMode === "all" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                />
              )}
            </button>
          </div>

          <div className="bg-[#1e293b] rounded-3xl border border-white/5 shadow-xl overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <List className="w-5 h-5 text-gray-400" /> 
                {techViewMode === "mine" ? "Meus Chamados" : "Todos os Chamados"}
              </h3>
              <span className="text-xs font-medium px-3 py-1 bg-white/5 rounded-full text-gray-400">
                {filteredTechTickets.length} pendentes
=======
          <div className="bg-[#1e293b] rounded-3xl border border-white/5 shadow-xl overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <List className="w-5 h-5 text-gray-400" /> Fila de Atendimento
              </h3>
              <span className="text-xs font-medium px-3 py-1 bg-white/5 rounded-full text-gray-400">
                {openTickets.length} pendentes
>>>>>>> 469620d32283c99111bff621cbe965468a293ee5
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-[#0f172a]/50 text-gray-200 uppercase font-bold text-xs">
                  <tr>
                    <th className="px-6 py-4">Prioridade</th>
                    <th className="px-6 py-4">Problema</th>
<<<<<<< HEAD
                    <th className="px-6 py-4">Responsável</th>
                    <th className="px-6 py-4">Setor / Solicitante</th>
                    <th className="px-6 py-4">Criação / SLA</th>
=======
                    <th className="px-6 py-4">Setor / Solicitante</th>
                    <th className="px-6 py-4">Tempo</th>
>>>>>>> 469620d32283c99111bff621cbe965468a293ee5
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
<<<<<<< HEAD
                  {filteredTechTickets.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        Nenhum chamado encontrado nesta fila.
                      </td>
                    </tr>
                  ) : (
                    filteredTechTickets.map((ticket) => (
=======
                  {openTickets.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        Nenhum chamado pendente. Bom trabalho!
                      </td>
                    </tr>
                  ) : (
                    openTickets.map((ticket) => (
>>>>>>> 469620d32283c99111bff621cbe965468a293ee5
                      <tr
                        key={ticket.id}
                        className="hover:bg-white/5 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <PriorityBadge priority={ticket.priority} />
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-white">
                            {ticket.problemTitle}
                          </div>
                          <div className="text-xs truncate max-w-[200px] mt-1">
                            {ticket.description}
                          </div>
                        </td>
                        <td className="px-6 py-4">
<<<<<<< HEAD
                           {ticket.technicianName ? (
                             <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs border border-blue-500/20">
                               <User className="w-3 h-3" /> {ticket.technicianName}
                             </span>
                           ) : (
                             <span className="text-gray-500 italic">Não atribuído</span>
                           )}
                        </td>
                        <td className="px-6 py-4">
=======
>>>>>>> 469620d32283c99111bff621cbe965468a293ee5
                          <div className="text-white">{ticket.sectorName}</div>
                          <div className="text-xs">{ticket.requesterName}</div>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs">
<<<<<<< HEAD
                          {(() => {
                             const sla = getSlaInfo(ticket);
                             if (!ticket.createdAt) return "-";
                             return (
                               <div className="flex flex-col gap-1">
                                 <span className="text-gray-400">
                                   {formatDistance(
                                     ticket.createdAt.toDate(),
                                     new Date(),
                                     { addSuffix: true, locale: ptBR },
                                   )}
                                 </span>
                                 {sla && (
                                   <span className={`font-bold ${sla.isOverdue ? "text-red-400" : "text-emerald-400"}`}>
                                     {sla.timeString}
                                   </span>
                                 )}
                               </div>
                             );
                           })()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            {/* Assumir Chamado */}
                            {(!ticket.technicianName || (ticket.technicianName !== user.displayName && ticket.technicianName !== user.email)) && (
=======
                          {ticket.createdAt
                            ? formatDistance(
                                ticket.createdAt.toDate(),
                                new Date(),
                                { addSuffix: true, locale: ptBR },
                              )
                            : "-"}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            {ticket.status === "aberto" && (
>>>>>>> 469620d32283c99111bff621cbe965468a293ee5
                              <button
                                onClick={() =>
                                  updateStatus(ticket.id, "em_andamento")
                                }
                                className="p-2 hover:bg-blue-500/20 text-blue-500 rounded-lg transition-colors border border-blue-500/20"
<<<<<<< HEAD
                                title="Assumir Chamado"
=======
                                title="Iniciar Atendimento"
>>>>>>> 469620d32283c99111bff621cbe965468a293ee5
                              >
                                <Activity className="w-4 h-4" />
                              </button>
                            )}
<<<<<<< HEAD
                            
                            {/* Escalar */}
                            <button
                                onClick={() => setSelectedTicketToEscalate(ticket)}
                                className="p-2 hover:bg-purple-500/20 text-purple-500 rounded-lg transition-colors border border-purple-500/20"
                                title="Escalar / Redirecionar"
                              >
                                <Share2 className="w-4 h-4" />
                            </button>

                            {/* Finalizar */}
=======
>>>>>>> 469620d32283c99111bff621cbe965468a293ee5
                            <button
                              onClick={() => setSelectedTicketToClose(ticket)}
                              className="p-2 hover:bg-emerald-500/20 text-emerald-500 rounded-lg transition-colors border border-emerald-500/20"
                              title="Finalizar Chamado"
                            >
                              <CheckSquare className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
        {showCreateTicket && (
          <CreateTicketModal onClose={() => setShowCreateTicket(false)} />
        )}
<<<<<<< HEAD
        {selectedTicketToEscalate && (
          <EscalateModal
            ticket={selectedTicketToEscalate}
            onClose={() => setSelectedTicketToEscalate(null)}
            onConfirm={(techName, updates) => {
              handleEscalate(selectedTicketToEscalate.id, techName, updates);
              setSelectedTicketToEscalate(null);
            }}
          />
        )}
=======
>>>>>>> 469620d32283c99111bff621cbe965468a293ee5
        {selectedTicketToClose && (
          <CloseTicketModal
            ticket={selectedTicketToClose}
            onClose={() => setSelectedTicketToClose(null)}
            onConfirm={(obs) => {
              updateStatus(selectedTicketToClose.id, "concluido", obs);
              setSelectedTicketToClose(null);
            }}
          />
        )}
      </div>
    );
  }

  // RENDER FOR ADMIN
  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-red-500/30">
      {/* Top Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#1e293b]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-red-600 to-red-800 p-2 rounded-lg shadow-lg shadow-red-500/20">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Hemope<span className="text-red-500">Admin</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end mr-2">
            <span className="text-sm font-medium text-gray-200">
              {user?.email}
            </span>
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />{" "}
              Online
            </span>
          </div>
          <button
            onClick={() => setShowCreateUser(true)}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/5"
            title="Novo Técnico"
          >
            <UserPlus className="w-5 h-5 text-gray-300" />
          </button>
          <button
            onClick={handleLogout}
            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-full transition-colors border border-red-500/20"
            title="Sair"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <main className="pt-24 pb-12 px-4 sm:px-8 max-w-[1600px] mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">Visão Geral</h1>
            <p className="text-gray-400 text-sm">
              Acompanhe o desempenho e gerencie chamados em tempo real.
            </p>
          </div>
          <div className="flex gap-2">
            <span className="px-4 py-2 bg-[#1e293b] rounded-xl text-xs font-medium text-gray-400 border border-white/5 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {new Date().toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Chamados Abertos"
            value={stats.open}
            icon={<AlertTriangle className="w-6 h-6 text-yellow-500" />}
            trend="Aguardando atenção"
            color="yellow"
          />
          <StatCard
            title="Em Andamento"
            value={stats.inProgress}
            icon={<Activity className="w-6 h-6 text-blue-500" />}
            trend="Sendo resolvidos"
            color="blue"
          />
          <StatCard
            title="Finalizados"
            value={stats.closed}
            icon={<CheckCircle className="w-6 h-6 text-emerald-500" />}
            trend="Total acumulado"
            color="emerald"
          />
          <StatCard
            title="Tempo Médio"
            value={stats.avgTimeStr}
            icon={<Clock className="w-6 h-6 text-purple-500" />}
            trend="Para resolução"
            color="purple"
          />
        </div>

        {/* Admin Specific Monthly/Yearly Stats */}
        {adminStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#1e293b] p-6 rounded-3xl border border-white/5 shadow-xl flex flex-col h-[350px]">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-blue-400">
                <BarChart3 className="w-5 h-5" /> Balanço Mensal
              </h3>
              <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={adminStats.monthlyChartData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      horizontal={false}
                      stroke="#334155"
                    />
                    <XAxis type="number" stroke="#94a3b8" hide />
                    <YAxis
                      dataKey="name"
                      type="category"
                      stroke="#94a3b8"
                      width={80}
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <ReTooltip
                      cursor={{ fill: "#334155", opacity: 0.4 }}
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        borderColor: "#334155",
                        borderRadius: "12px",
                        color: "#fff",
                      }}
                    />
                    <Bar
                      dataKey="value"
                      radius={[0, 4, 4, 0]}
                      barSize={40}
                      label={{ position: "right", fill: "#fff", fontSize: 12 }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-[#1e293b] p-6 rounded-3xl border border-white/5 shadow-xl flex flex-col h-[350px]">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-purple-400">
                <PieChart className="w-5 h-5" /> Balanço Anual
              </h3>
              <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={adminStats.yearlyChartData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      horizontal={false}
                      stroke="#334155"
                    />
                    <XAxis type="number" stroke="#94a3b8" hide />
                    <YAxis
                      dataKey="name"
                      type="category"
                      stroke="#94a3b8"
                      width={80}
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <ReTooltip
                      cursor={{ fill: "#334155", opacity: 0.4 }}
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        borderColor: "#334155",
                        borderRadius: "12px",
                        color: "#fff",
                      }}
                    />
                    <Bar
                      dataKey="value"
                      radius={[0, 4, 4, 0]}
                      barSize={40}
                      label={{ position: "right", fill: "#fff", fontSize: 12 }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

<<<<<<< HEAD
        {/* Team Load (Real-time) */}
        {isAdmin && adminStats && (
          <div className="bg-[#1e293b] p-6 rounded-3xl border border-white/5 shadow-xl">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" /> Carga da Equipe (Tempo Real)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {adminStats.teamLoad.map((team) => (
                <div
                  key={team.name}
                  className="bg-[#0f172a] p-4 rounded-2xl border border-white/5 flex justify-between items-center hover:border-white/10 transition-colors"
                >
                  <div>
                    <span className="text-sm font-medium text-white block mb-1">
                      {team.name}
                    </span>
                    <div className="flex gap-2 text-xs">
                      <span className="text-yellow-500 font-medium">
                        {team.open} fila
                      </span>
                      <span className="text-gray-600">|</span>
                      <span className="text-blue-500 font-medium">
                        {team.inProgress} atuando
                      </span>
                    </div>
                  </div>
                  {team.open > 0 || team.inProgress > 0 ? (
                    <div
                      className={`w-2 h-2 rounded-full ${
                        team.inProgress > 0
                          ? "bg-blue-500 animate-pulse"
                          : "bg-yellow-500"
                      }`}
                    />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-gray-700" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

=======
>>>>>>> 469620d32283c99111bff621cbe965468a293ee5
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Donut Chart */}
          <div className="bg-[#1e293b] p-6 rounded-3xl border border-white/5 shadow-xl col-span-1">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-gray-400" /> Distribuição por
              Prioridade
            </h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {priorityData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke="none"
                      />
                    ))}
                  </Pie>
                  <ReTooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                    itemStyle={{ color: "#fff" }}
                  />
                </RePieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              {priorityData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center gap-2 text-xs text-gray-400"
                >
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  {item.name} ({item.value})
                </div>
              ))}
            </div>
          </div>

          {/* Sector Chart (Moved here to be next to Priority) */}
          <div className="bg-[#1e293b] p-6 rounded-3xl border border-white/5 shadow-xl col-span-1 lg:col-span-2">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-gray-400" /> Top Setores com
              Chamados
            </h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sectorData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#334155"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <ReTooltip
                    cursor={{ fill: "#334155", opacity: 0.4 }}
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                  />
                  <Bar
                    dataKey="value"
                    fill="#ef4444"
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Technician Performance (Full width) */}
        {isAdmin && adminStats && adminStats.techData.length > 0 && (
          <div className="bg-[#1e293b] p-6 rounded-3xl border border-white/5 shadow-xl">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" /> Top Técnicos
              (Encerrados)
            </h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={adminStats.techData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#334155"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <ReTooltip
                    cursor={{ fill: "#334155", opacity: 0.4 }}
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                  />
                  <Bar
                    dataKey="value"
                    fill="#10b981" // emerald-500
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Active Tickets List */}
        <div className="bg-[#1e293b] rounded-3xl border border-white/5 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <List className="w-5 h-5 text-gray-400" /> Chamados Pendentes
            </h3>
            <span className="text-xs font-medium px-3 py-1 bg-white/5 rounded-full text-gray-400">
              {openTickets.length} chamados
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="bg-[#0f172a]/50 text-gray-200 uppercase font-bold text-xs">
                <tr>
                  <th className="px-6 py-4">Prioridade</th>
                  <th className="px-6 py-4">Problema</th>
<<<<<<< HEAD
                  <th className="px-6 py-4">Responsável</th>
                  <th className="px-6 py-4">Setor / Solicitante</th>
                  <th className="px-6 py-4">Criação / SLA</th>
=======
                  <th className="px-6 py-4">Setor / Solicitante</th>
                  <th className="px-6 py-4">Tempo</th>
>>>>>>> 469620d32283c99111bff621cbe965468a293ee5
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {openTickets.length === 0 ? (
                  <tr>
                    <td
<<<<<<< HEAD
                      colSpan={6}
=======
                      colSpan={5}
>>>>>>> 469620d32283c99111bff621cbe965468a293ee5
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      Nenhum chamado pendente no momento.
                    </td>
                  </tr>
                ) : (
                  openTickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <PriorityBadge priority={ticket.priority} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">
                          {ticket.problemTitle}
                        </div>
                        <div className="text-xs truncate max-w-[200px] mt-1">
                          {ticket.description}
                        </div>
                      </td>
                      <td className="px-6 py-4">
<<<<<<< HEAD
                         {ticket.technicianName ? (
                           <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs border border-blue-500/20">
                             <User className="w-3 h-3" /> {ticket.technicianName}
                           </span>
                         ) : (
                           <span className="text-gray-500 italic text-xs">Aguardando</span>
                         )}
                      </td>
                      <td className="px-6 py-4">
=======
>>>>>>> 469620d32283c99111bff621cbe965468a293ee5
                        <div className="text-white">{ticket.sectorName}</div>
                        <div className="text-xs">{ticket.requesterName}</div>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs">
<<<<<<< HEAD
                        {(() => {
                           const sla = getSlaInfo(ticket);
                           if (!ticket.createdAt) return "-";
                           return (
                             <div className="flex flex-col gap-1">
                               <span className="text-gray-400">
                                 {formatDistance(
                                   ticket.createdAt.toDate(),
                                   new Date(),
                                   { addSuffix: true, locale: ptBR },
                                 )}
                               </span>
                               {sla && (
                                 <span className={`font-bold ${sla.isOverdue ? "text-red-400" : "text-emerald-400"}`}>
                                   {sla.timeString}
                                 </span>
                               )}
                             </div>
                           );
                         })()}
=======
                        {ticket.createdAt
                          ? formatDistance(
                              ticket.createdAt.toDate(),
                              new Date(),
                              { addSuffix: true, locale: ptBR },
                            )
                          : "-"}
>>>>>>> 469620d32283c99111bff621cbe965468a293ee5
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {ticket.status === "aberto" && (
                            <button
                              onClick={() =>
                                updateStatus(ticket.id, "em_andamento")
                              }
                              className="p-2 hover:bg-blue-500/20 text-blue-500 rounded-lg transition-colors border border-blue-500/20"
                              title="Iniciar Atendimento"
                            >
                              <Activity className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedTicketToClose(ticket)}
                            className="p-2 hover:bg-emerald-500/20 text-emerald-500 rounded-lg transition-colors border border-emerald-500/20"
                            title="Finalizar Chamado"
                          >
                            <CheckSquare className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Closed Tickets List */}
        <div className="bg-[#1e293b] rounded-3xl border border-white/5 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" /> Chamados
              Encerrados
            </h3>
            <span className="text-xs font-medium px-3 py-1 bg-white/5 rounded-full text-gray-400">
              {closedTickets.length} chamados
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="bg-[#0f172a]/50 text-gray-200 uppercase font-bold text-xs">
                <tr>
                  <th className="px-6 py-4">Problema</th>
                  <th className="px-6 py-4">Solicitante / Setor</th>
                  <th className="px-6 py-4">Técnico Responsável</th>
                  <th className="px-6 py-4">Encerrado em</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {closedTickets.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      Nenhum chamado encerrado ainda.
                    </td>
                  </tr>
                ) : (
                  closedTickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">
<<<<<<< HEAD
                           {ticket.categoryLabel ? (
                             <span className="text-emerald-300 font-bold">{ticket.categoryLabel}</span>
                          ) : (
                             ticket.problemTitle
                          )}
                        </div>
                        {ticket.serviceItemLabel && (
                           <div className="text-xs text-blue-200 font-semibold mt-0.5">
                             &bull; {ticket.serviceItemLabel}
                           </div>
                        )}
                        <div className="text-xs truncate max-w-[200px] mt-1 text-gray-400">
=======
                          {ticket.problemTitle}
                        </div>
                        <div className="text-xs truncate max-w-[200px] mt-1">
>>>>>>> 469620d32283c99111bff621cbe965468a293ee5
                          {ticket.description}
                        </div>
                        {ticket.observation && (
                          <div className="mt-2 text-xs text-gray-500 italic bg-white/5 p-2 rounded border border-white/5">
                            obs: {ticket.observation}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white">{ticket.requesterName}</div>
                        <div className="text-xs">{ticket.sectorName}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs border border-blue-500/20">
                          <UserPlus className="w-3 h-3" />
                          {ticket.technicianName || "Não atribuído"}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs">
                        {ticket.closedAt
                          ? ticket.closedAt.toDate().toLocaleString("pt-BR")
                          : "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showCreateUser && (
          <CreateUserModal onClose={() => setShowCreateUser(false)} />
        )}
        {selectedTicketToClose && (
          <CloseTicketModal
            ticket={selectedTicketToClose}
            onClose={() => setSelectedTicketToClose(null)}
            onConfirm={(obs) => {
              updateStatus(selectedTicketToClose.id, "concluido", obs);
              setSelectedTicketToClose(null);
            }}
          />
        )}
      </main>
    </div>
  );
}
