import { Show, SignInButton } from '@clerk/react'
import Dashboard from './components/Dashboard'

function App() {
  return (
    <>
      <Show when="signed-out">
        {/* BACKGROUND COM DEGRADÊ PROFISSIONAL */}
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900 via-slate-900 to-black flex flex-col items-center justify-center p-4">

          <div className="max-w-4xl w-full text-center space-y-8">
            {/* LOGO GRANDE */}
            <div className="flex flex-col items-center space-y-2">
              <div className="text-6xl font-bold text-white flex items-center gap-3">
                <span className="text-docmind-accent">DocMind</span> AI
              </div>
              <p className="text-blue-300 tracking-[0.2em] uppercase text-sm font-medium">Soluções Inteligentes de Documentos</p>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight">
              Aumente sua Produtividade <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                com Inteligência
              </span>
            </h1>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-12">
              <div className="flex items-center gap-6 text-slate-300 text-sm border border-slate-700/50 p-4 rounded-2xl bg-slate-800/30 backdrop-blur-xl">
                <span className="flex items-center gap-2">✨ Gerar</span>
                <span className="text-slate-600">|</span>
                <span className="flex items-center gap-2">📊 Resumir</span>
                <span className="text-slate-600">|</span>
                <span className="flex items-center gap-2">📂 Analisar</span>
              </div>
            </div>

            <div className="flex gap-4 justify-center mt-12">
              <SignInButton mode="modal">
                <button className="px-10 py-5 bg-gradient-to-r from-cyan-400 to-blue-600 text-white font-bold rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:scale-105 hover:shadow-[0_0_40px_rgba(6,182,212,0.5)] transition-all duration-300">
                  Comece Grátis
                </button>
              </SignInButton>
            </div>
          </div>
        </div>
      </Show>

      <Show when="signed-in">
        <Dashboard />
      </Show>
    </>
  )
}

export default App