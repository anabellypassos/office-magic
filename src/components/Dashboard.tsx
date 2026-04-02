import { useEffect, useState, useCallback } from 'react'
import { UserButton, useUser } from '@clerk/react'
import Editor from './Editor'
import CalendarView from './CalendarView'
import TodoView from './TodoView'
import { supabase } from '../lib/supabase'
import toast, { Toaster } from 'react-hot-toast'

interface Document {
    id: string;
    title: string;
    content: string;
}

export default function Dashboard() {
    const { user } = useUser();
    const [view, setView] = useState<'editor' | 'calendar' | 'todo'>('editor');
    const [documents, setDocuments] = useState<Document[]>([]);
    const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const checkTodayEvents = useCallback(async () => {
        if (!user) return;
        const today = new Date().toISOString().split('T')[0];
        const { data } = await supabase.from('events').select('title').eq('user_id', user.id).eq('date', today);
        if (data && data.length > 0) {
            data.forEach(event => {
                toast(`🚨 Lembrete: Evento hoje: "${event.title}"`, {
                    duration: 6000,
                    style: { background: '#0F172A', color: '#06B6D4', borderRadius: '16px', fontWeight: 'bold' },
                    icon: '📅',
                });
            });
        }
    }, [user]);

    const fetchDocuments = useCallback(async () => {
        if (!user) return;
        const { data, error } = await supabase.from('documents').select('*').eq('user_id', user.id);
        if (!error && data) {
            setDocuments(data);
            if (data.length > 0 && !selectedDoc) setSelectedDoc(data[0]);
        }
    }, [user, selectedDoc]);

    useEffect(() => {
        let isMounted = true;
        const load = async () => {
            if (user && isMounted) {
                await fetchDocuments();
                await checkTodayEvents();
            }
        };
        load();
        return () => { isMounted = false };
    }, [user, fetchDocuments, checkTodayEvents]);

    async function handleCreateNew() {
        if (!user) return;
        const { data, error } = await supabase.from('documents').insert([{ title: 'Novo Documento', content: '', user_id: user.id }]).select();
        if (!error && data) {
            setSelectedDoc(data[0]);
            fetchDocuments();
            setView('editor');
            setIsSidebarOpen(false);
        }
    }

    async function handleUpdateTitle(id: string, newTitle: string) {
        await supabase.from('documents').update({ title: newTitle }).eq('id', id);
        setDocuments(docs => docs.map(d => d.id === id ? { ...d, title: newTitle } : d));
    }

    async function handleDelete(id: string, e: React.MouseEvent) {
        e.stopPropagation();
        if (!confirm("Excluir documento?")) return;
        const { error } = await supabase.from('documents').delete().eq('id', id);
        if (!error) { if (selectedDoc?.id === id) setSelectedDoc(null); fetchDocuments(); }
    }

    return (
        <div className="flex h-screen w-screen bg-slate-50 overflow-hidden font-sans relative text-gray-900">
            <Toaster />

            {/* HEADER MOBILE */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-20 bg-docmind-dark flex items-center justify-between px-8 z-40 text-white border-b border-slate-800">
                <span className="font-black italic text-2xl tracking-tighter">DocMind <span className="text-docmind-accent not-italic">AI</span></span>
                <button onClick={() => setIsSidebarOpen(true)} className="w-12 h-12 flex items-center justify-center bg-slate-800 rounded-2xl text-docmind-accent text-2xl">☰</button>
            </div>

            {/* OVERLAY MOBILE */}
            {isSidebarOpen && (
                <div className="lg:hidden fixed inset-0 bg-slate-950/80 backdrop-blur-md z-40" onClick={() => setIsSidebarOpen(false)} />
            )}

            {/* SIDEBAR */}
            <aside className={`fixed lg:relative z-50 h-full w-80 bg-gradient-to-b from-docmind-dark to-slate-900 text-white flex flex-col shadow-2xl transition-all duration-500 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <div className="p-8 border-b border-slate-800 flex justify-between items-start text-white">
                    <div className="flex flex-col">
                        <span className="text-3xl font-black tracking-tighter italic">DocMind <span className="text-docmind-accent not-italic">AI</span></span>
                        <span className="text-[10px] text-slate-500 uppercase tracking-[0.4em] mt-1 font-black">Soluções Inteligentes</span>
                    </div>
                    <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-3xl text-slate-500 hover:text-white transition">×</button>
                </div>

                <nav className="p-6 space-y-3">
                    <button onClick={() => { setView('editor'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-4 p-5 rounded-3xl font-black transition-all ${view === 'editor' ? 'bg-white text-slate-900 shadow-2xl scale-105' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}>
                        📝 <span className="text-[10px] uppercase tracking-[0.2em]">Arquivos</span>
                    </button>
                    <button onClick={() => { setView('calendar'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-4 p-5 rounded-3xl font-black transition-all ${view === 'calendar' ? 'bg-white text-slate-900 shadow-2xl scale-105' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}>
                        📅 <span className="text-[10px] uppercase tracking-[0.2em]">Calendário</span>
                    </button>
                    <button onClick={() => { setView('todo'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-4 p-5 rounded-3xl font-black transition-all ${view === 'todo' ? 'bg-white text-slate-900 shadow-xl scale-105' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}>
                        ✅ <span className="text-[10px] uppercase tracking-[0.2em]">Tarefas</span>
                    </button>
                </nav>

                <div className="px-6 py-2">
                    <button onClick={handleCreateNew} className="w-full bg-gradient-to-r from-cyan-400 to-blue-600 text-white rounded-2xl py-5 text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-cyan-500/30 hover:scale-[1.02] active:scale-95 transition-all">+ Novo Documento</button>
                </div>

                <nav className="flex-1 overflow-y-auto px-4 mt-8 pb-8 scrollbar-hide">
                    <ul className="space-y-2">
                        {documents.map((doc) => (
                            <li key={doc.id} onClick={() => { setSelectedDoc(doc); setView('editor'); setIsSidebarOpen(false); }} className={`group flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all ${selectedDoc?.id === doc.id && view === 'editor' ? 'bg-slate-800 text-docmind-accent border border-slate-700 shadow-xl' : 'text-slate-500 hover:bg-slate-800/30'}`}>
                                <span className="truncate font-black text-[11px] uppercase tracking-tight">{doc.title}</span>
                                <button onClick={(e) => handleDelete(doc.id, e)} className="lg:opacity-0 group-hover:opacity-100 text-red-400 p-2 hover:bg-red-500/10 rounded-lg transition">🗑️</button>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-10 flex justify-center border-t border-slate-800 pt-8 pb-4">
                        <UserButton />
                    </div>
                </nav>
            </aside>

            <main className="flex-1 bg-white p-6 lg:p-16 overflow-y-auto pt-28 lg:pt-16 transition-all duration-500">
                <div className="max-w-6xl mx-auto">
                    {view === 'calendar' ? (
                        <CalendarView />
                    ) : view === 'todo' ? (
                        <TodoView />
                    ) : selectedDoc ? (
                        <div className="animate-in fade-in zoom-in-95 duration-700">
                            <h1 
                                className="text-4xl lg:text-7xl font-black text-slate-900 mb-10 lg:mb-16 outline-none border-b-8 border-transparent focus:border-docmind-accent pb-6 transition-all tracking-tighter" 
                                contentEditable 
                                suppressContentEditableWarning 
                                onBlur={(e) => handleUpdateTitle(selectedDoc.id, e.currentTarget.innerText)}
                            >
                                {selectedDoc.title}
                            </h1>
                            <Editor docId={selectedDoc.id} initialContent={selectedDoc.content} />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-200">
                            <div className="text-6xl lg:text-9xl font-black opacity-10 tracking-tighter italic">DocMind AI</div>
                            <p className="text-slate-300 font-bold mt-4 uppercase tracking-[0.3em] text-xs">Espaço de Trabalho Inteligente</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}