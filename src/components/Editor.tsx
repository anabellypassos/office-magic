import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

export default function Editor() {
    const editor = useEditor({
        extensions: [
            StarterKit,
        ],
        content: '<p>Escreva algo aqui e use os botões acima para testar a IA...</p>',
        editorProps: {
            attributes: {
                class: 'prose prose-slate max-w-none focus:outline-none min-h-[500px] py-4',
            },
        },
    })

    const handleIA = (tipo: string) => {
        if (!editor) return;
        
        // Pega o texto que o usuário selecionou
        const selectedText = editor.state.doc.textBetween(
            editor.state.selection.from,
            editor.state.selection.to,
            ' '
        );

        if (!selectedText) {
            alert("Por favor, selecione um trecho de texto primeiro!");
            return;
        }

        alert(`🚀 IA Acionada!\nAção: ${tipo}\nTexto selecionado: "${selectedText}"\n\nPróximo passo: Conectar ao ChatGPT!`);
    }

    return (
        <div className="mt-4 border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
            
            {/* BARRA DE FERRAMENTAS FIXA (Substitui o BubbleMenu quebrado) */}
            <div className="bg-gray-50 border-b border-gray-200 p-2 flex gap-2 items-center">
                <span className="text-xs font-bold text-gray-400 uppercase px-2">Comandos de IA:</span>
                
                <button
                    onClick={() => handleIA('Resumir')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-purple-200 text-purple-700 rounded-md text-sm font-medium hover:bg-purple-50 transition shadow-sm"
                >
                    ✨ Resumir
                </button>

                <button
                    onClick={() => handleIA('Reescrever')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-blue-200 text-blue-700 rounded-md text-sm font-medium hover:bg-blue-50 transition shadow-sm"
                >
                    🔄 Reescrever
                </button>
            </div>

            {/* ÁREA DE EDIÇÃO */}
            <div className="p-6">
                <EditorContent editor={editor} />
            </div>

        </div>
    )
}