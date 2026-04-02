import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useUser } from '@clerk/react'

interface CalendarEvent {
    id: number;
    title: string;
    description: string;
    date: string;
    timer: string;
    user_id: string;
}

export default function CalendarView() {
    const { user } = useUser();
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showModal, setShowModal] = useState(false);
    
    const [newTitle, setNewTitle] = useState("");
    const [newTime, setNewTime] = useState("12:00");

    // 1. Função de busca protegida
    const fetchEvents = useCallback(async () => {
        if (!user) return;
        const { data, error } = await supabase
            .from('events')
            .select('*')
            .eq('user_id', user.id)
            .order('timer', { ascending: true });
        if (!error && data) setEvents(data);
    }, [user]);

    // 2. useEffect CORRIGIDO (Sem o erro de Cascading Renders)
    useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            if (isMounted) {
                // Chamada assíncrona pura para evitar bloqueio de renderização
                await fetchEvents();
            }
        };

        loadData();

        return () => {
            isMounted = false;
        };
    }, [fetchEvents]);

    async function handleAddEvent() {
        if (!newTitle || !user) return;
        const dateStr = selectedDate.toISOString().split('T')[0];
        const { error } = await supabase.from('events').insert([
            { title: newTitle, date: dateStr, timer: newTime, user_id: user.id, description: "" }
        ]);
        if (!error) { setNewTitle(""); setNewTime("12:00"); fetchEvents(); }
    }

    const selectedDateStr = selectedDate.toISOString().split('T')[0];
    const eventsToday = events.filter(e => e.date === selectedDateStr);
    const calendarDays = Array.from({ length: new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate() }, (_, i) => i + 1);

    return (
        <div className="animate-in fade-in duration-700 pb-10 text-gray-900">
            {/* CABEÇALHO */}
            <header className="mb-6 lg:mb-10 flex flex-col lg:flex-row gap-4 justify-between items-center bg-white p-6 lg:p-8 rounded-3xl lg:rounded-[3rem] shadow-xl border-b-4 border-docmind-accent">
                <div className="text-center lg:text-left text-slate-900">
                    <p className="text-docmind-accent text-[8px] lg:text-[10px] font-black uppercase tracking-[0.4em] mb-1">DocMind Productivity</p>
                    <h2 className="text-3xl lg:text-5xl font-black capitalize tracking-tighter">
                        {selectedDate.toLocaleString('default', { month: 'long' })} 
                        <span className="text-docmind-accent ml-2">{selectedDate.getFullYear()}</span>
                    </h2>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)))} className="w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center bg-slate-900 text-white rounded-2xl hover:bg-docmind-accent transition-all shadow-lg">←</button>
                    <button onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)))} className="w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center bg-slate-900 text-white rounded-2xl hover:bg-docmind-accent transition-all shadow-lg">→</button>
                </div>
            </header>

            {/* GRADE */}
            <div className="grid grid-cols-7 gap-2 lg:gap-6">
                {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, i) => (
                    <div key={`dayname-${i}`} className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{day}</div>
                ))}
                {calendarDays.map(day => {
                    const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const dayEvents = events.filter(e => e.date === dateStr);
                    const isToday = new Date().getDate() === day && new Date().getMonth() === selectedDate.getMonth() && new Date().getFullYear() === selectedDate.getFullYear();

                    return (
                        <div key={`date-${day}`} onClick={() => { setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day)); setShowModal(true); }}
                            className={`min-h-[70px] lg:min-h-[160px] bg-white border-2 rounded-2xl lg:rounded-[2.5rem] p-2 lg:p-6 transition-all cursor-pointer group relative shadow-sm ${isToday ? 'border-docmind-accent shadow-cyan-100 shadow-xl' : 'border-slate-100 hover:border-docmind-accent'}`}>
                            <span className={`text-sm lg:text-2xl font-black ${isToday ? 'text-docmind-accent' : 'text-slate-800'}`}>{day}</span>
                            <div className="mt-1 lg:mt-4 space-y-1">
                                {dayEvents.map(e => (
                                    <div key={e.id} className="h-1.5 w-1.5 lg:h-auto lg:w-full bg-slate-900 lg:bg-slate-900 text-docmind-accent lg:py-2 lg:px-4 rounded-full lg:rounded-xl truncate font-black lg:border-l-4 border-docmind-accent uppercase lg:tracking-tighter">
                                        <span className="hidden lg:inline text-[9px]">{e.timer?.slice(0, 5)} {e.title}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* MODAL RESPONSIVO PREMIUM */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center z-[100] p-4 text-slate-900">
                    <div className="bg-white p-6 lg:p-10 rounded-[2.5rem] lg:rounded-[3.5rem] w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-500 max-h-[90vh] overflow-y-auto flex flex-col border border-white/20">
                        
                        <div className="text-center mb-6">
                            <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-4 lg:hidden"></div>
                            <h3 className="text-2xl lg:text-3xl font-black tracking-tighter text-slate-900 uppercase italic">
                                <span className="text-docmind-accent not-italic">●</span> {selectedDate.toLocaleDateString()}
                            </h3>
                        </div>

                        <div className="flex-1 space-y-3 mb-6">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Compromissos</p>
                            {eventsToday.length > 0 ? (
                                eventsToday.map(e => (
                                    <div key={e.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm">
                                        <span className="text-[11px] font-black bg-docmind-dark text-docmind-accent px-2 py-1 rounded-lg">{e.timer?.slice(0, 5)}</span>
                                        <span className="text-sm font-bold text-slate-800 uppercase tracking-tight truncate">{e.title}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                    <p className="text-[10px] text-slate-300 font-bold uppercase italic">Sem registros para hoje</p>
                                </div>
                            )}
                        </div>

                        <div className="h-px bg-slate-100 w-full mb-6"></div>

                        <div className="space-y-4">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Agendar Novo</p>
                            <div className="grid grid-cols-1 gap-3">
                                <input 
                                    type="time" 
                                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-docmind-accent font-black text-slate-800 transition-all"
                                    value={newTime}
                                    onChange={(e) => setNewTime(e.target.value)}
                                />
                                <input 
                                    type="text" 
                                    placeholder="Descrição do evento..."
                                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-docmind-accent font-black text-slate-800 placeholder:text-slate-300 transition-all uppercase text-xs tracking-widest"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col gap-2 pt-2">
                                <button onClick={handleAddEvent} className="w-full py-4 bg-slate-900 text-docmind-accent rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-docmind-accent hover:text-white transition-all">
                                    Salvar Evento
                                </button>
                                <button onClick={() => setShowModal(false)} className="w-full py-3 text-slate-400 font-black text-[10px] uppercase tracking-widest transition">
                                    Sair
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}