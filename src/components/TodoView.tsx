import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useUser } from '@clerk/react'

interface Task {
    id: string | number;
    title: string;
    is_completed: boolean;
}

export default function TodoView() {
    const { user } = useUser();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState("");

    const fetchTasks = useCallback(async () => {
        if (!user) return;
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('user_id', user.id)
            .order('id', { ascending: false });
        if (!error && data) setTasks(data);
    }, [user]);

    useEffect(() => {
        let isMounted = true;
        const load = async () => { if (isMounted) await fetchTasks(); };
        load();
        return () => { isMounted = false };
    }, [fetchTasks]);

    async function addTask() {
        if (!newTask || !user) return;
        const { error } = await supabase.from('tasks').insert([{ title: newTask, user_id: user.id, is_completed: false }]);
        if (!error) { setNewTask(""); fetchTasks(); }
    }

    async function toggleTask(id: string | number, currentStatus: boolean) {
        await supabase.from('tasks').update({ is_completed: !currentStatus }).eq('id', id);
        fetchTasks();
    }

    async function deleteTask(id: string | number) {
        await supabase.from('tasks').delete().eq('id', id);
        fetchTasks();
    }

    const completedCount = tasks.filter(t => t.is_completed).length;
    const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

    return (
        <div className="animate-in fade-in duration-700 w-full max-w-4xl mx-auto pb-20 px-4 lg:px-0 text-gray-900">
            
            {/* CARD DE PROGRESSO RESPONSIVO */}
            <header className="mb-8 lg:mb-12 bg-white p-6 lg:p-12 rounded-[2.5rem] lg:rounded-[4rem] shadow-2xl border-b-4 border-docmind-accent relative overflow-hidden">
                <div className="relative z-10">
                    <p className="text-docmind-accent text-[8px] lg:text-[10px] font-black uppercase tracking-[0.4em] mb-2">Produtividade DocMind</p>
                    <h2 className="text-3xl lg:text-6xl font-black text-slate-900 tracking-tighter mb-6 italic">
                        Tasks <span className="text-docmind-accent not-italic">List</span>
                    </h2>
                    
                    <div className="flex items-center gap-4">
                        <div className="flex-1 h-3 lg:h-4 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                            <div 
                                className="h-full bg-gradient-to-r from-docmind-accent to-blue-600 transition-all duration-1000 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <span className="text-xs lg:text-sm font-black text-slate-400">{Math.round(progress)}%</span>
                    </div>
                </div>
            </header>

            {/* INPUT E BOTÃO TURBINADOS - RESPONSIVO APRIMORADO */}
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 mb-10 lg:mb-16">
                <div className="relative flex-1">
                    <input 
                        type="text" 
                        placeholder="O que precisa ser feito?"
                        className="w-full p-5 lg:p-7 bg-white border-2 border-slate-100 rounded-[1.5rem] lg:rounded-[2.5rem] outline-none focus:border-docmind-accent font-bold text-slate-800 shadow-lg transition-all placeholder:text-slate-300 text-sm lg:text-lg"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addTask()}
                    />
                </div>
                <button 
                    onClick={addTask}
                    className="w-full sm:w-auto px-8 lg:px-12 py-5 lg:py-7 bg-slate-900 text-docmind-accent font-black rounded-[1.5rem] lg:rounded-[2.5rem] hover:bg-docmind-accent hover:text-white transition-all shadow-xl active:scale-95 flex items-center justify-center text-2xl"
                >
                    <span className="sm:hidden text-base mr-2 uppercase tracking-widest">Adicionar</span> +
                </button>
            </div>

            {/* LISTAGEM DE TAREFAS */}
            <div className="space-y-4 lg:space-y-6">
                {tasks.map(task => (
                    <div 
                        key={task.id} 
                        className={`flex items-center justify-between p-5 lg:p-8 bg-white border-2 rounded-[1.5rem] lg:rounded-[2.5rem] transition-all duration-500 ${
                            task.is_completed ? 'border-transparent bg-slate-50/50 opacity-60 scale-[0.98]' : 'border-white shadow-xl hover:shadow-2xl hover:border-docmind-accent/20'
                        }`}
                    >
                        <div 
                            className="flex items-center gap-4 lg:gap-6 flex-1 cursor-pointer" 
                            onClick={() => toggleTask(task.id, task.is_completed)}
                        >
                            <div className={`w-7 h-7 lg:w-10 lg:h-10 rounded-2xl border-2 flex items-center justify-center transition-all shrink-0 ${
                                task.is_completed ? 'bg-docmind-accent border-docmind-accent shadow-lg shadow-cyan-500/40' : 'border-slate-200 bg-white'
                            }`}>
                                {task.is_completed && <span className="text-white text-xs lg:text-lg font-black">✓</span>}
                            </div>
                            
                            <span className={`font-bold text-sm lg:text-xl text-slate-700 transition-all uppercase tracking-tight ${
                                task.is_completed ? 'line-through text-slate-300' : ''
                            }`}>
                                {task.title}
                            </span>
                        </div>

                        <button 
                            onClick={() => deleteTask(task.id)} 
                            className="text-slate-200 hover:text-red-500 transition-colors p-2 ml-2"
                        >
                            <span className="text-xl lg:text-2xl">🗑️</span>
                        </button>
                    </div>
                ))}

                {/* EMPTY STATE MELHORADO */}
                {tasks.length === 0 && (
                    <div className="text-center py-20 lg:py-40 animate-pulse">
                        <div className="text-7xl lg:text-9xl mb-6 grayscale opacity-20">🖋️</div>
                        <p className="font-black uppercase tracking-[0.4em] text-[10px] lg:text-xs text-slate-300">Sua lista está limpa</p>
                    </div>
                )}
            </div>
        </div>
    )
}