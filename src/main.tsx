import { StrictMode, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

type Account = { id: string; name: string; games: string[]; status: 'Disponível' | 'Reservada' | 'Vendida'; value: number }

const initialAccounts: Account[] = [
  { id: 'ST-001', name: 'Conta 001', games: ['Spider-Man 2', 'Cyberpunk 2077'], status: 'Disponível', value: 79.9 },
  { id: 'ST-002', name: 'Conta 002', games: ['Black Myth: Wukong'], status: 'Disponível', value: 69.9 },
  { id: 'ST-003', name: 'Conta 003', games: ['WWE 2K24', 'EA Sports FC 25'], status: 'Reservada', value: 59.9 },
  { id: 'ST-004', name: 'Conta 004', games: ['Cyberpunk 2077'], status: 'Vendida', value: 49.9 },
]

function App() {
  const [page, setPage] = useState('Dashboard')
  const [accounts, setAccounts] = useState(initialAccounts)
  const [query, setQuery] = useState('')
  const [modal, setModal] = useState(false)

  const filtered = useMemo(() => accounts.filter(a =>
    `${a.id} ${a.name} ${a.games.join(' ')}`.toLowerCase().includes(query.toLowerCase())
  ), [accounts, query])

  const available = accounts.filter(a => a.status === 'Disponível').length
  const reserved = accounts.filter(a => a.status === 'Reservada').length
  const sold = accounts.filter(a => a.status === 'Vendida').length
  const stockValue = accounts.filter(a => a.status !== 'Vendida').reduce((sum, a) => sum + a.value, 0)

  function addAccount() {
    const number = String(accounts.length + 1).padStart(3, '0')
    setAccounts([...accounts, { id: `ST-${number}`, name: `Conta ${number}`, games: [], status: 'Disponível', value: 0 }])
    setModal(false)
  }

  return <div className="app">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark">S</div><div><strong>Gerenciador</strong><span>STEAM</span></div></div>
      <nav>
        {['Dashboard', 'Contas', 'Jogos', 'Vendas', 'Estoque'].map(item =>
          <button key={item} className={page === item ? 'nav active' : 'nav'} onClick={() => setPage(item)}>
            <span>{({Dashboard:'⌂', Contas:'◉', Jogos:'▣', Vendas:'↗', Estoque:'▤'} as Record<string,string>)[item]}</span>{item}
          </button>
        )}
      </nav>
      <div className="sidebar-bottom"><button className="nav" onClick={() => setPage('Configurações')}><span>⚙</span>Configurações</button><div className="version">v0.1.0 • local</div></div>
    </aside>

    <main>
      <header className="topbar"><div><p className="eyebrow">ESTOQUE</p><h1>{page}</h1></div><button className="primary" onClick={() => setModal(true)}>＋ Nova conta</button></header>

      {page === 'Dashboard' && <>
        <section className="cards">
          <Stat title="Total de contas" value={accounts.length} detail="no estoque" icon="◉" />
          <Stat title="Disponíveis" value={available} detail="prontas para venda" icon="✓" positive />
          <Stat title="Reservadas" value={reserved} detail="aguardando venda" icon="◷" />
          <Stat title="Valor do estoque" value={`R$ ${stockValue.toFixed(2).replace('.', ',')}`} detail="contas não vendidas" icon="R$" />
        </section>
        <section className="panel"><div className="panel-head"><div><h2>Contas recentes</h2><p>Visão rápida do seu estoque</p></div><button className="ghost" onClick={() => setPage('Contas')}>Ver todas →</button></div><AccountTable accounts={filtered.slice(0, 5)} /></section>
      </>}

      {page === 'Contas' && <section className="panel full"><div className="panel-head"><div><h2>Contas Steam</h2><p>{accounts.length} registros cadastrados</p></div><div className="toolbar"><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Pesquisar conta ou jogo..." /><button className="primary" onClick={() => setModal(true)}>＋ Nova conta</button></div></div><AccountTable accounts={filtered} /></section>}

      {['Jogos', 'Vendas', 'Estoque', 'Configurações'].includes(page) && <section className="empty panel"><div className="empty-icon">{page === 'Jogos' ? '▣' : page === 'Vendas' ? '↗' : page === 'Estoque' ? '▤' : '⚙'}</div><h2>{page}</h2><p>Esta área será construída na próxima etapa do projeto.</p><button className="primary" onClick={() => setPage('Contas')}>Voltar para contas</button></section>}
    </main>

    {modal && <div className="overlay" onClick={() => setModal(false)}><div className="modal" onClick={e => e.stopPropagation()}><h2>Nova conta</h2><p>A estrutura inicial será criada com um registro vazio.</p><div className="modal-actions"><button className="ghost" onClick={() => setModal(false)}>Cancelar</button><button className="primary" onClick={addAccount}>Criar conta</button></div></div></div>}
  </div>
}

function Stat({ title, value, detail, icon, positive = false }: { title: string; value: string | number; detail: string; icon: string; positive?: boolean }) {
  return <div className="stat"><div className={positive ? 'stat-icon positive' : 'stat-icon'}>{icon}</div><div><p>{title}</p><strong>{value}</strong><small>{detail}</small></div></div>
}

function AccountTable({ accounts }: { accounts: Account[] }) {
  return <div className="table-wrap"><table><thead><tr><th>ID</th><th>Conta</th><th>Jogos</th><th>Status</th><th>Valor</th></tr></thead><tbody>{accounts.map(a => <tr key={a.id}><td className="muted">{a.id}</td><td><strong>{a.name}</strong></td><td>{a.games.length ? <div className="chips">{a.games.map(g => <span key={g}>{g}</span>)}</div> : <span className="muted">Nenhum jogo</span>}</td><td><span className={`status ${a.status.toLowerCase()}`}>{a.status}</span></td><td>R$ {a.value.toFixed(2).replace('.', ',')}</td></tr>)}{accounts.length === 0 && <tr><td colSpan={5} className="no-results">Nenhuma conta encontrada.</td></tr>}</tbody></table></div>
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)
