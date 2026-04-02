import { useState, useEffect, useCallback } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { supabase } from '../lib/supabase'

interface EditorProps {
    docId: string;
    initialContent: string;
}

export default function Editor({ docId, initialContent }: EditorProps) {
    const [loading, setLoading] = useState(false);

    const saveToSupabase = useCallback(async (content: string) => {
        await supabase.from('documents').update({ content: content }).eq('id', docId);
    }, [docId]);

    const editor = useEditor({
        extensions: [StarterKit],
        content: initialContent,
        editorProps: {
            attributes: {
                class: 'prose prose-slate max-w-none focus:outline-none min-h-[400px] lg:min-h-[600px] py-4 text-sm lg:text-base text-slate-900',
            },
        },
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            saveToSupabase(html);
        }
    });

    useEffect(() => {
        if (editor && initialContent !== editor.getHTML()) {
            editor.commands.setContent(initialContent);
        }
    }, [initialContent, editor]);

    const handleIA = async (tipo: string) => {
        if (!editor || loading) return;
        const { from, to } = editor.state.selection;
        const selectedText = editor.state.doc.textBetween(from, to, ' ');

        if (!selectedText) {
            alert("Selecione um texto primeiro!");
            return;
        }

        setLoading(true);
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: `Aja como um editor profissional. Sua tarefa é ${tipo} o seguinte texto: "${selectedText}". Retorne APENAS o resultado final.` }] }]
                })
            });

            const data = await response.json();
            if (data.candidates && data.candidates[0].content.parts) {
                const aiResult = data.candidates[0].content.parts[0].text;
                editor.chain().focus().insertContent(aiResult).run();
            }
        } catch (error) {
            console.error("Erro na IA:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-4 lg:mt-8 border border-slate-200 rounded-2xl lg:rounded-[2.5rem] overflow-hidden shadow-2xl bg-white animate-in zoom-in-95 duration-300">
            <div className="bg-slate-50 border-b border-slate-100 p-2 lg:p-4 flex flex-wrap gap-2 items-center">
                <div className="px-3 py-1 bg-docmind-dark text-[8px] lg:text-[10px] font-black text-docmind-accent rounded-full uppercase tracking-tighter">
                    {loading ? "Pensando..." : "AI Tools"}
                </div>
                <button disabled={loading} onClick={() => handleIA('Resumir')} className="flex-1 lg:flex-none px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-[10px] lg:text-xs font-bold hover:bg-docmind-accent hover:text-white transition-all shadow-sm">✨ Resumir</button>
                <button disabled={loading} onClick={() => handleIA('Reescrever')} className="flex-1 lg:flex-none px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-[10px] lg:text-xs font-bold hover:bg-blue-600 hover:text-white transition-all shadow-sm">🔄 Reescrever</button>
            </div>
            <div className="p-4 lg:p-10">
                <EditorContent editor={editor} />
            </div>
        </div>
    )
}