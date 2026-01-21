"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ArrowLeft,
  Loader2,
  AlertCircle,
  FileText,
  Clock,
  User,
  CheckCircle2,
  Activity,
} from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { formatDistance } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id") || "";

  const [ticketId, setTicketId] = useState(initialId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ticket, setTicket] = useState<any>(null);

  // Auto-search if ID is present in URL
  useEffect(() => {
    if (initialId) {
      handleSearch(new Event("submit") as any, initialId);
    }
  }, [initialId]);

  const handleSearch = async (e: React.FormEvent, idOverride?: string) => {
    e.preventDefault();
    const idToSearch = idOverride || ticketId;

    if (!idToSearch.trim()) {
      setError("Por favor, digite o número do chamado.");
      return;
    }

    setLoading(true);
    setError("");
    setTicket(null);

    try {
      const docRef = doc(db, "tickets", idToSearch.trim());
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setTicket({ id: docSnap.id, ...docSnap.data() });
      } else {
        setError("Chamado não encontrado. Verifique o código e tente novamente.");
      }
    } catch (err) {
      console.error(err);
      setError("Erro ao buscar chamado. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "aberto":
        return "text-yellow-600 bg-yellow-100 border-yellow-200";
      case "em_andamento":
        return "text-blue-600 bg-blue-100 border-blue-200";
      case "concluido":
        return "text-green-600 bg-green-100 border-green-200";
      default:
        return "text-gray-600 bg-gray-100 border-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "aberto":
        return "Aberto - Na Fila";
      case "em_andamento":
        return "Em Andamento";
      case "concluido":
        return "Concluído";
      default:
        return status;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white/90 backdrop-blur-2xl border border-white/60 p-6 md:p-8 rounded-[2rem] shadow-2xl shadow-red-900/30 w-full max-w-lg relative overflow-hidden z-10"
    >
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 to-red-400" />

      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 hover:text-red-600 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Voltar para Início
        </Link>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Search className="w-6 h-6 text-red-600" />
          Acompanhar Chamado
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Digite o código do chamado para ver o status atual.
        </p>
      </div>

      <form onSubmit={handleSearch} className="mb-8 relative">
        <div className="relative">
          <input
            type="text"
            value={ticketId}
            onChange={(e) => setTicketId(e.target.value)}
            placeholder="Ex: 7F3k9..."
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all text-gray-800 font-mono placeholder:font-sans"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="w-5 h-5" />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="absolute right-2 top-2 bottom-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Buscar"
          )}
        </button>
      </form>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 text-sm border border-red-100"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </motion.div>
        )}

        {ticket && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="space-y-6"
          >
            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                    Status Atual
                  </span>
                  <div
                    className={`mt-1 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold border ${getStatusColor(
                      ticket.status
                    )}`}
                  >
                    {ticket.status === "concluido" && (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    {ticket.status === "em_andamento" && (
                      <Activity className="w-4 h-4" />
                    )}
                    {ticket.status === "aberto" && (
                      <Clock className="w-4 h-4" />
                    )}
                    {getStatusLabel(ticket.status)}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                    Aberto há
                  </span>
                  <div className="mt-1 text-sm font-medium text-gray-700">
                    {ticket.createdAt
                      ? formatDistance(
                          ticket.createdAt.toDate(),
                          new Date(),
                          { addSuffix: true, locale: ptBR }
                        )
                      : "Recente"}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-1 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    {ticket.problemTitle}
                  </h3>
                  <p className="text-sm text-gray-600 bg-white p-3 rounded-lg border border-gray-100">
                    {ticket.description}
                  </p>
                </div>

                {ticket.technicianName && (
                  <div className="pt-2 border-t border-gray-200 mt-2">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <User className="w-3 h-3" />
                      Responsável:{" "}
                      <span className="font-medium text-gray-800">
                        {ticket.technicianName}
                      </span>
                    </span>
                  </div>
                )}
                
                {ticket.observation && (
                   <div className="pt-2">
                      <span className="text-xs font-semibold text-gray-500 block mb-1">Observações do Técnico:</span>
                      <p className="text-sm text-gray-600 bg-yellow-50 p-2 rounded border border-yellow-100 italic">
                        "{ticket.observation}"
                      </p>
                   </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function TrackPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden bg-gradient-to-br from-red-600 via-red-500 to-white animate-gradient-slow relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-white/10 blur-[100px] animate-float-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-red-800/20 blur-[120px] animate-float-delayed" />
      </div>

      <Suspense fallback={<Loader2 className="w-10 h-10 text-white animate-spin" />}>
        <SearchContent />
      </Suspense>
    </div>
  );
}
