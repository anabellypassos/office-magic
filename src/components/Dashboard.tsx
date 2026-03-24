import { UserButton } from '@clerk/react'
import logo from '../assets/logo.png'
import Editor from './Editor'

export default function Dashboard() {
    return (
        <div className="flex h-screen w-screen bg-white">

            {/* SIDEBAR */}
            <aside className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">

                {/* HEADER (LOGO CENTRALIZADA GRANDE) */}
                <div className="p-6  justify-center border-b border-gray-200">
                    <img className="w-80" src={logo} alt="DocMind AI" />
                <div className="p-2 flex justify-end -mt-50">
                    <UserButton />
                </div>
                </div>
                
                {/* BOTÃO */}
                <div className="p-4">
                    <button className="w-full bg-black text-white rounded-lg py-2.5 text-sm font-medium hover:bg-gray-800 transition">
                        + Novo Documento
                    </button>
                </div>

                {/* LISTA */}
                <nav className="flex-1 overflow-y-auto px-2">
                    <p className="text-xs font-semibold text-gray-400 mb-3 px-2 uppercase tracking-wide">
                        Seus Documentos
                    </p>

                    <ul className="space-y-1 text-sm text-gray-600">
                        <li className="flex items-center gap-2 p-2 rounded-md cursor-pointer bg-gray-200 font-medium">
                            📄 <span>Roteiro de Vídeo</span>
                        </li>

                        <li className="flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-gray-200 transition">
                            📄 <span>Ideias de Marketing</span>
                        </li>

                        <li className="flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-gray-200 transition">
                            📄 <span>Resumo do PDF</span>
                        </li>
                    </ul>
                </nav>

               
            </aside>

            {/* MAIN */}
            <main className="flex-1 p-10 overflow-y-auto">
                <div className="max-w-3xl mx-auto">

                    <h1
                        className="text-4xl font-bold text-gray-800 outline-none mb-8"
                        contentEditable
                        suppressContentEditableWarning
                    >
                        Roteiro de Vídeo
                    </h1>
                      <Editor />

                    <div className="text-gray-400 text-lg leading-relaxed">
                        O editor de texto com IA vai entrar aqui...
                        <br />
                        Pressione <span className="bg-gray-200 px-2 py-1 rounded text-sm">/</span> para comandos.
                    </div>

                </div>
            </main>

        </div>
    )
}