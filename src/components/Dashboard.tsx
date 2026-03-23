import { UserButton } from '@clerk/react'

export default function Dashboard() {
    return (
        <div className="flex h-screen w-screen bg-white">

            {/* BARRA LATERAL (SIDEBAR) */}
            <aside className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
                {/* Cabeçalho da Sidebar */}
                <div className="p-4 flex justify-between items-center border-b border-gray-200">
                    <span className="font-semibold text-gray-700">Meu Notion IA</span>
                    <UserButton /> {/* Botão do usuário logado */}
                </div>

                {/* Botão Novo Documento */}
                <div className="p-4">
                    <button className="w-full bg-black text-white rounded-md py-2 text-sm font-medium hover:bg-gray-800 transition">
                        + Novo Documento
                    </button>
                </div>

                {/* Lista de Documentos (Falsa por enquanto) */}
                <nav className="flex-1 overflow-y-auto p-2">
                    <p className="text-xs font-semibold text-gray-400 mb-2 px-2 uppercase">Seus Documentos</p>
                    <ul className="space-y-1 text-sm text-gray-600">
                        <li className="p-2 hover:bg-gray-200 rounded cursor-pointer bg-gray-200 font-medium">
                            📄 Roteiro de Vídeo
                        </li>
                        <li className="p-2 hover:bg-gray-200 rounded cursor-pointer">
                            📄 Ideias de Marketing
                        </li>
                        <li className="p-2 hover:bg-gray-200 rounded cursor-pointer">
                            📄 Resumo do PDF
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* ÁREA CENTRAL (ONDE VAI FICAR O EDITOR) */}
            <main className="flex-1 p-12 overflow-y-auto">
                <div className="max-w-3xl mx-auto">
                    {/* Título do Documento */}
                    <h1 className="text-4xl font-bold text-gray-800 outline-none mb-8" contentEditable suppressContentEditableWarning>
                        Roteiro de Vídeo
                    </h1>

                    {/* Placeholder para o futuro editor */}
                    <div className="text-gray-400">
                        O editor de texto com IA vai entrar aqui... Pressione / para comandos.
                    </div>
                </div>
            </main>

        </div>
    )
}