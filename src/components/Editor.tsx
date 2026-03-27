import { useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

export default function Editor() {
    const [loading, setLoading] = useState(false);

    const editor = useEditor({
        extensions: [StarterKit],
        content: '<p>Escreva algo aqui, selecione o texto e use a IA...</p>',
        editorProps: {
            attributes: {
                class: 'prose prose-slate max-w-none focus:outline-none min-h-[500px] py-4',
            },
        },
    });

const handleIA = async (tipo: string) => {
        if (!editor || loading) return;
        
        const { from, to } = editor.state.selection;
        const selectedText = editor.state.doc.textBetween(from, to, ' ');

        if (!selectedText) {
            alert("Por favor, selecione um trecho de texto primeiro!");
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
                            text: `Aja como um editor profissional. Sua tarefa é ${tipo} o seguinte texto: "${selectedText}". Retorne APENAS o texto resultante, sem introduções ou explicações.` 
                        }]
                    }]
                })
            });

            const data = await response.json();
            
            if (!response.ok) {
                console.error("Erro detalhado do Google:", data);
                throw new Error(data.error?.message || "Erro na API do Google");
            }

            if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts) {
                const aiResult = data.candidates[0].content.parts[0].text;
                editor.chain().focus().insertContent(aiResult).run();
            } else {
                throw new Error("A IA não conseguiu gerar uma resposta válida.");
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
        <div className="mt-4 border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
            
            <div className="bg-gray-50 border-b border-gray-200 p-2 flex gap-2 items-center">
                <span className="text-xs font-bold text-gray-400 uppercase px-2">
                    {loading ? "✨ IA Processando..." : "Comandos de IA:"}
                </span>
                
                <button
                    disabled={loading}
                    onClick={() => handleIA('Resumir')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-purple-200 text-purple-700 rounded-md text-sm font-medium hover:bg-purple-50 transition shadow-sm disabled:opacity-50"
                >
                    ✨ Resumir
                </button>

                <button
                    disabled={loading}
                    onClick={() => handleIA('Reescrever')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-blue-200 text-blue-700 rounded-md text-sm font-medium hover:bg-blue-50 transition shadow-sm disabled:opacity-50"
                >
                    🔄 Reescrever
                </button>
            </div>

            <div className="p-6">
                <EditorContent editor={editor} />
            </div>

        </div>
    );
}