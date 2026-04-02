import { useEffect, useState, useCallback } from 'react'
import { UserButton, useUser } from '@clerk/react'
import Editor from './Editor'
import { supabase } from '../lib/supabase'

interface Document {
    id: string;
    title: string;
    content: string;
}

export default function Dashboard() {
    const { user } = useUser();
    const [documents, setDocuments] = useState<Document[]>([]);
    const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

    const fetchDocuments = useCallback(async () => {
        if (!user) return;
        const { data, error } = await supabase
            .from('documents')
            .select('*')
            .eq('user_id', user.id);

        if (!error && data) {
            setDocuments(data);
            if (data.length > 0 && !selectedDoc) {
                setSelectedDoc(data[0]);
            }
        }
    }, [user, selectedDoc]);

    async function handleCreateNew() {
        if (!user) return;
        const { data, error } = await supabase
            .from('documents')
            .insert([{ title: 'Novo Documento', content: '', user_id: user.id }])
            .select();

        if (!error && data) {
            setSelectedDoc(data[0]);
            fetchDocuments();
        }
    }

    async function handleUpdateTitle(id: string, newTitle: string) {
        const { error } = await supabase
            .from('documents')
            .update({ title: newTitle })
            .eq('id', id);

        if (!error) {
            setDocuments(docs => docs.map(d => d.id === id ? { ...d, title: newTitle } : d));
        }
    }

    async function handleDelete(id: string, e: React.MouseEvent) {
        e.stopPropagation();
        if (!confirm("Deseja realmente excluir este documento?")) return;

        const { error } = await supabase
            .from('documents')
            .delete()
            .eq('id', id);

        if (!error) {
            if (selectedDoc?.id === id) setSelectedDoc(null);
            fetchDocuments();
        }
    }

    // RESOLVE O ERRO DE CASCADING RENDERS
    useEffect(() => {
        let isMounted = true;

        const load = async () => {
            if (user && isMounted) {
                await fetchDocuments();
            }
        };

        load();

        return () => { isMounted = false };
    }, [user, fetchDocuments]);

    return (
        <div className="flex h-screen w-screen bg-slate-50 overflow-hidden font-sans">
            {/* SIDEBAR ESTILO DARK PREMIUM */}
            <aside className="w-72 bg-gradient-to-b from-docmind-dark to-slate-900 text-white flex flex-col shadow-2xl">

                <div className="p-8 border-b border-slate-800">
                    <div className="flex flex-col">
                        <span className="text-2xl font-bold tracking-tight">DocMind <span className="text-docmind-accent">AI</span></span>
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Intelligent Solutions</span>
                    </div>
                    <div className="mt-4">
                        <UserButton />
                    </div>
                </div>

                <div className="p-4">
                    <button
                        onClick={handleCreateNew}
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl py-3 text-sm font-bold hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-2"
                    >
                        + New Document
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto px-4 mt-4">
                    <p className="text-[10px] font-bold text-slate-500 mb-4 uppercase tracking-[0.2em]">Your Documents</p>
                    <ul className="space-y-2 text-sm">
                        {documents.map((doc) => (
                            <li
                                key={doc.id}
                                onClick={() => setSelectedDoc(doc)}
                                className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${selectedDoc?.id === doc.id
                                        ? 'bg-slate-800 text-docmind-accent shadow-lg border border-slate-700'
                                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                                    }`}
                            >
                                <div className="flex items-center gap-3 truncate">
                                    <div className={`w-2 h-2 rounded-full ${selectedDoc?.id === doc.id ? 'bg-docmind-accent' : 'bg-slate-700'}`}></div>
                                    <span className="truncate font-medium">{doc.title}</span>
                                </div>
                                <button onClick={(e) => handleDelete(doc.id, e)} className="opacity-0 group-hover:opacity-100 hover:text-red-400 p-1">
                                    🗑️
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 bg-white p-12 overflow-y-auto">
                <div className="max-w-4xl mx-auto">
                    {selectedDoc ? (
                        <div className="animate-in fade-in duration-500">
                            <h1
                                className="text-5xl font-extrabold text-slate-900 mb-10 outline-none focus:text-docmind-primary transition-colors"
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) => handleUpdateTitle(selectedDoc.id, e.currentTarget.innerText)}
                            >
                                {selectedDoc.title}
                            </h1>
                            <Editor docId={selectedDoc.id} initialContent={selectedDoc.content} />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-300">
                            <div className="text-6xl mb-4 opacity-20 text-docmind-dark font-bold">DocMind AI</div>
                            <p className="italic">Select a document to start your intelligent workflow.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}