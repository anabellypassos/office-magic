import { Show, SignInButton, SignUpButton } from '@clerk/react'
import Dashboard from './components/Dashboard'

function App() {
  return (
    <>
      {/* O que aparece quando NÃO está logado */}
      <Show when="signed-out">
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
          <h1 className="text-4xl font-bold mb-6">Bem-vindo ao SaaS IA</h1>
          <p className="text-gray-600 mb-8">O seu editor inteligente estilo Notion.</p>
          <div className="flex gap-4">
            <SignInButton mode="modal">
              <button className="px-4 py-2 bg-white border border-gray-300 rounded shadow hover:bg-gray-50">
                Entrar
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="px-4 py-2 bg-black text-white rounded shadow hover:bg-gray-800">
                Criar Conta
              </button>
            </SignUpButton>
          </div>
        </div>
      </Show>

      {/* O que aparece quando ESTÁ logado */}
      <Show when="signed-in">
        <Dashboard />
      </Show>
    </>
  )
}

export default App