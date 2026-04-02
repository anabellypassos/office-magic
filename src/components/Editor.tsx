import { useState, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { supabase } from '../lib/supabase'

// DEFINIÇÃO DAS PROPS (Isso resolve o erro 'docId does not exist')
interface EditorProps {
    docId: string;
    initialContent: string;
}

export default function Editor({ docId, initialContent }: EditorProps) {
    const [loading, setLoading] = useState(false);

    const editor = useEditor({
        extensions: [StarterKit],
        content: initialContent,
        editorProps: {
            attributes: {
                class: 'prose prose-slate max-w-none focus:outline-none min-h-[500px] py-4',
            },
        },
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            saveToSupabase(html);
        }
    });

    // Atualiza o conteúdo se mudar de documento na sidebar
    useEffect(() => {
        if (editor && initialContent !== editor.getHTML()) {
            editor.commands.setContent(initialContent);
        }
    }, [initialContent, editor]);

    async function saveToSupabase(content: string) {
        await supabase
            .from('documents')
            .update({ content: content })
            .eq('id', docId);
    }

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
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": apiKey 
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ 
                            text: `Você é um editor. Sua tarefa é ${tipo} o seguinte texto: "${selectedText}". Retorne APENAS o resultado final.` 
                        }]
                    }]
                })
            });

            const data = await response.json();
            
            if (data.candidates && data.candidates[0].content.parts) {
                const aiResult = data.candidates[0].content.parts[0].text;
                editor.chain().focus().insertContent(aiResult).run();
            } else {
                throw new Error(data.error?.message || "Erro na IA");
            }

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
            console.error("Erro na IA:", error);
            alert("Erro: " + errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-8 border border-slate-200 rounded-2xl overflow-hidden shadow-2xl bg-white animate-in zoom-in-95 duration-300">
            <div className="bg-slate-50 border-b border-slate-100 p-3 flex gap-3 items-center">
                <div className="px-3 py-1 bg-docmind-dark text-[10px] font-bold text-docmind-accent rounded-full uppercase tracking-tighter">
                    {loading ? "AI Thinking..." : "DocMind Tools"}
                </div>
                
                <button
                    disabled={loading}
                    onClick={() => handleIA('Resumir')}
                    className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:bg-docmind-accent hover:text-white hover:border-docmind-accent transition-all shadow-sm"
                >
                    ✨ Summarize
                </button>

                <button
                    disabled={loading}
                    onClick={() => handleIA('Reescrever')}
                    className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm"
                >
                    🔄 Rewrite
                </button>
            </div>

            <div className="p-8 min-h-[600px]">
                <EditorContent editor={editor} />
            </div>
        </div>
    )
}