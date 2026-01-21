'use client';

import { useEffect, useState, useMemo } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, Timestamp, addDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, 
  UserPlus, 
  LayoutDashboard, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Search,
  Filter,
  MoreVertical,
  Trash2,
  X,
  Activity,
  BarChart3,
  PieChart,
  List,
  CheckSquare,
  MessageSquare
} from 'lucide-react';
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
  CartesianGrid
} from 'recharts';
import { formatDistance, differenceInMinutes } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Ticket {
  id: string;
  requesterName: string;
  sectorName: string;
  problemTitle: string;
  description: string;
  priority: '1' | '2' | '3';
  status: 'aberto' | 'em_andamento' | 'concluido';
  createdAt: Timestamp;
  closedAt?: Timestamp;
  observation?: string;
}

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [selectedTicketToClose, setSelectedTicketToClose] = useState<Ticket | null>(null);
  const router = useRouter();

  // Auth Check
  useEffect(() => {
    // Check for Dev Bypass
    const isBypass = typeof window !== 'undefined' && localStorage.getItem('admin_bypass') === 'true';
    if (isBypass) {
      setUser({ uid: 'dev-admin', email: 'admin@hemope.com', displayName: 'Administrador (Dev)' });
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/login');
      } else {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Fetch Tickets
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'tickets'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ticketsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Ticket[];
      setTickets(ticketsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching tickets:", error);
      // If permission denied (common if auth rules are strict and we are in bypass), show empty or mock
      if (error.code === 'permission-denied') {
        alert("Aviso: Permissão negada no Firestore. Verifique as Regras de Segurança no Firebase Console.");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleLogout = async () => {
    if (localStorage.getItem('admin_bypass')) {
      localStorage.removeItem('admin_bypass');
      setUser(null);
      router.push('/login');
      return;
    }
    await signOut(auth);
    router.push('/login');
  };

  const updateStatus = async (ticketId: string, newStatus: string, observation?: string) => {
    try {
      const updateData: any = {
        status: newStatus,
        updatedAt: new Date()
      };

      if (newStatus === 'concluido') {
        updateData.closedAt = new Date();
        if (observation) {
          updateData.observation = observation;
        }
      }

      await updateDoc(doc(db, 'tickets', ticketId), updateData);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Stats Calculations
  const stats = useMemo(() => {
    const total = tickets.length;
    const open = tickets.filter(t => t.status === 'aberto').length;
    const inProgress = tickets.filter(t => t.status === 'em_andamento').length;
    const closed = tickets.filter(t => t.status === 'concluido').length;

    // Avg Time Calculation
    const closedTickets = tickets.filter(t => t.status === 'concluido' && t.closedAt && t.createdAt);
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

  // Chart Data
  const priorityData = useMemo(() => {
    const p1 = tickets.filter(t => t.priority === '1').length;
    const p2 = tickets.filter(t => t.priority === '2').length;
    const p3 = tickets.filter(t => t.priority === '3').length;
    return [
      { name: 'Urgente', value: p1, color: '#ef4444' }, // red-500
      { name: 'Média', value: p2, color: '#f97316' },   // orange-500
      { name: 'Normal', value: p3, color: '#3b82f6' },  // blue-500
    ].filter(d => d.value > 0);
  }, [tickets]);

  const sectorData = useMemo(() => {
    const sectorCounts: Record<string, number> = {};
    tickets.forEach(t => {
      const sector = t.sectorName || 'Outros';
      sectorCounts[sector] = (sectorCounts[sector] || 0) + 1;
    });
    return Object.entries(sectorCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Top 5 sectors
  }, [tickets]);

  const openTickets = tickets.filter(t => t.status !== 'concluido');

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-red-500/30">
      {/* Top Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#1e293b]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-red-600 to-red-800 p-2 rounded-lg shadow-lg shadow-red-500/20">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">Hemope<span className="text-red-500">Admin</span></span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end mr-2">
            <span className="text-sm font-medium text-gray-200">{user?.email}</span>
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online
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
            <p className="text-gray-400 text-sm">Acompanhe o desempenho e gerencie chamados em tempo real.</p>
          </div>
          <div className="flex gap-2">
            <span className="px-4 py-2 bg-[#1e293b] rounded-xl text-xs font-medium text-gray-400 border border-white/5 flex items-center gap-2">
              <Clock className="w-4 h-4" /> 
              {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
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

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Donut Chart */}
          <div className="bg-[#1e293b] p-6 rounded-3xl border border-white/5 shadow-xl col-span-1">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-gray-400" /> Distribuição por Prioridade
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
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <ReTooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </RePieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              {priorityData.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name} ({item.value})
                </div>
              ))}
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-[#1e293b] p-6 rounded-3xl border border-white/5 shadow-xl col-span-1 lg:col-span-2">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-gray-400" /> Top Setores com Chamados
            </h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sectorData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <ReTooltip 
                    cursor={{ fill: '#334155', opacity: 0.4 }}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                  />
                  <Bar dataKey="value" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

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
                  <th className="px-6 py-4">Setor / Solicitante</th>
                  <th className="px-6 py-4">Tempo</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {openTickets.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      Nenhum chamado pendente no momento.
                    </td>
                  </tr>
                ) : (
                  openTickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <PriorityBadge priority={ticket.priority} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">{ticket.problemTitle}</div>
                        <div className="text-xs truncate max-w-[200px] mt-1">{ticket.description}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white">{ticket.sectorName}</div>
                        <div className="text-xs">{ticket.requesterName}</div>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs">
                        {ticket.createdAt ? formatDistance(ticket.createdAt.toDate(), new Date(), { addSuffix: true, locale: ptBR }) : '-'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {ticket.status === 'aberto' && (
                            <button 
                              onClick={() => updateStatus(ticket.id, 'em_andamento')}
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
      </main>

      {/* Modals */}
      <AnimatePresence>
        {showCreateUser && (
          <CreateUserModal onClose={() => setShowCreateUser(false)} />
        )}
        {selectedTicketToClose && (
          <CloseTicketModal 
            ticket={selectedTicketToClose} 
            onClose={() => setSelectedTicketToClose(null)} 
            onConfirm={(obs) => {
              updateStatus(selectedTicketToClose.id, 'concluido', obs);
              setSelectedTicketToClose(null);
            }} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ title, value, icon, trend, color }: any) {
  const colors: any = {
    yellow: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    emerald: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    purple: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  };

  return (
    <div className="bg-[#1e293b] p-6 rounded-3xl border border-white/5 shadow-xl hover:translate-y-[-4px] transition-transform duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl border ${colors[color]}`}>
          {icon}
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${colors[color]} bg-opacity-20`}>
          {trend}
        </span>
      </div>
      <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
      <div className="text-3xl font-bold text-white">{value}</div>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const config = {
    '1': { label: 'Urgente', class: 'bg-red-500/20 text-red-400 border-red-500/20' },
    '2': { label: 'Média', class: 'bg-orange-500/20 text-orange-400 border-orange-500/20' },
    '3': { label: 'Normal', class: 'bg-blue-500/20 text-blue-400 border-blue-500/20' },
  }[priority] || { label: 'Baixa', class: 'bg-gray-500/20 text-gray-400' };

  return (
    <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${config.class}`}>
      {config.label}
    </span>
  );
}

function CloseTicketModal({ ticket, onClose, onConfirm }: { ticket: Ticket, onClose: () => void, onConfirm: (obs: string) => void }) {
  const [observation, setObservation] = useState('');

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div 
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-[#1e293b] border border-white/10 rounded-3xl p-8 w-full max-w-lg shadow-2xl relative"
      >
        <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full transition-colors">
          <X className="w-5 h-5 text-gray-400" />
        </button>

        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2 text-white">
          <CheckCircle className="w-6 h-6 text-emerald-500" /> Finalizar Chamado
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          Você está prestes a finalizar o chamado de <span className="text-white font-medium">{ticket.requesterName}</span>.
        </p>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-bold text-gray-300 mb-2 block">Observações Técnicas (Opcional)</label>
            <textarea
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              placeholder="Descreva o que foi feito para resolver o problema..."
              className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 min-h-[120px]"
            />
          </div>

          <div className="flex gap-3 mt-8">
            <button 
              onClick={onClose}
              className="flex-1 py-3.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 font-bold transition-all"
            >
              Cancelar
            </button>
            <button 
              onClick={() => onConfirm(observation)}
              className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold shadow-lg shadow-emerald-500/20 transition-all"
            >
              Confirmar Finalização
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function CreateUserModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');

    try {
      const tempAppName = 'temp-create-user-' + Date.now();
      const config = {
        apiKey: "AIzaSyCW_EuCIDzY3m69Lg4PynzLAtxCpav9vKM",
        authDomain: "chamados-hemope.firebaseapp.com",
        projectId: "chamados-hemope",
      };
      
      const tempApp = initializeApp(config, tempAppName);
      const tempAuth = getAuth(tempApp);
      const emailToUse = email.includes('@') ? email : `${email}@hemope.com`;
      
      await createUserWithEmailAndPassword(tempAuth, emailToUse, password);
      
      setMsg('Usuário criado com sucesso!');
      setTimeout(onClose, 2000);
    } catch (err: any) {
      console.error(err);
      setMsg('Erro: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div 
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-[#1e293b] border border-white/10 rounded-3xl p-8 w-full max-w-sm shadow-2xl relative"
      >
        <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full transition-colors">
          <X className="w-5 h-5 text-gray-400" />
        </button>

        <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-red-500" /> Novo Técnico
        </h2>
        
        <form onSubmit={handleCreate} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-300 ml-1">Usuário</label>
            <input 
              type="text" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ex: tecnico1"
              className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-white placeholder:text-gray-600"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-300 ml-1">Senha</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-white placeholder:text-gray-600"
            />
          </div>
          
          {msg && (
            <div className={`p-4 rounded-xl text-sm flex items-center gap-3 font-medium ${
              msg.includes('Erro') 
                ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            }`}>
              {msg}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-900/20 transition-all disabled:opacity-70 mt-2"
          >
            {loading ? 'Criando...' : 'Criar Usuário'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
