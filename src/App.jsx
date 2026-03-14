import { useState, useEffect, useRef } from "react"

export default function App() {

  const [list, setList] = useState(() => {
    const saved = localStorage.getItem('list');
    return saved ? JSON.parse(saved) : [];
  })
  const selectionRef = useRef('')
  const descriptionRef = useRef('')
  const importRef = useRef('')
  const [message, setMessage] = useState('')
  const [modal, setModal] = useState(false)
  const [modalConfirmOperation, setModalConfirmOperation] = useState(false)
  const [tempOperation, setTempOperation] = useState(null)

  useEffect(() => {
    localStorage.setItem('list', JSON.stringify(list));
  }, [list])

  // Calcolo importo budget
  const totalBudget =
    list.reduce((acc, curr) => {
      if (curr.import > 0) {
        return acc + curr.import;
      }
      return acc;
    }, 0)

  // Calcolo importo spese
  const totalSpent =
    list.reduce((acc, curr) => {
      if (curr.import < 0) {
        return acc + curr.import;
      }
      return acc;
    }, 0)

  // Calcolo importo rimasto
  const remainingBudget = totalBudget + totalSpent;

  const showMessage = (msg) => {
    setModal(true)
    setMessage(msg)
    setTimeout(() => setModal(false), 3000)
  }

  function formattedBudget(budget) {
    const formatted = budget.toLocaleString('it-IT', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    return `€ ${formatted}`
  }

  const addOperation = (e) => {
    e.preventDefault()

    if (descriptionRef.current.value === '') {
      return showMessage('Descrizione non valida');
    }

    const amount = parseFloat(importRef.current.value);

    if (isNaN(amount) || amount === 0) {
      return showMessage('Importo non valido');
    }

    const newOperation = {
      id: Date.now(),
      date: new Date().toISOString(),
      description: descriptionRef.current.value,
      import: selectionRef.current.value === 'uscita' && amount > 0 ? -amount : amount
    }
    console.log(newOperation)
    setList([newOperation, ...list]);
    showMessage('Operazione registrata');

    descriptionRef.current.value = '';
    importRef.current.value = '';
    selectionRef.current.value = 'entrata';
  }

  const deleteOperation = (id) => {
    const newList = list.filter(operation => operation.id !== id)
    setList(newList)
    showMessage('Operazione eliminata con successo')
  }

  const deleteAllOperations = () => {
    setList([])
    showMessage('Operazioni eliminate con successo')
  }

  return (
    <div className="max-w-6xl mx-auto my-10">
      <h1 className="text-4xl font-bold text-slate-900 text-center my-10">Budget Tracker</h1>
      <div className="flex justify-around items-center">
        <div className="border-2 border-gray-200 rounded-3xl p-4 shadow-sm w-72">
          <p className="text-sm text-slate-500 font-medium text-center mb-1">Budget Totale</p>
          <p className="text-2xl font-bold text-green-500 text-center">{formattedBudget(totalBudget)}</p>
        </div>
        <div className="border-2 border-gray-200 rounded-3xl p-4 shadow-sm w-72">
          <p className="text-sm text-slate-500 font-medium text-center mb-1">Budget Speso</p>
          <p className="text-2xl font-bold text-red-500 text-center">{formattedBudget(totalSpent)}</p>
        </div>
        <div className="border-2 border-gray-200 rounded-3xl p-4 shadow-sm w-72">
          <p className="text-sm text-slate-500 font-medium text-center mb-1">Budget Residuo</p>
          <p className="text-2xl font-bold text-yellow-500 text-center">{formattedBudget(remainingBudget)}</p>
        </div>
      </div>
      <form onSubmit={addOperation} className="my-10">
        <p className="text-md font-medium text-slate-700 mb-1">Inserisci un'operazione</p>
        <div className="bg-slate-100 p-6 rounded-3xl flex gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Movimento</label>
            <select name="selection" ref={selectionRef} className="bg-slate-900 text-white px-6 py-2 rounded-xl font-bold">
              <option value={'entrata'}>Entrata</option>
              <option value={'uscita'}>Uscita</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">Descrizione</label>
            <input type="text" name="description" ref={descriptionRef} className="w-full p-2 rounded-xl border-none ring-1 ring-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Es. Affitto" />
          </div>
          <div className="w-40">
            <label className="block text-sm font-medium text-slate-700 mb-1">Importo (€)</label>
            <input type="number" name="import" step={0.01} ref={importRef} className="w-full p-2 rounded-xl border-none ring-1 ring-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <button type="submit" className="bg-slate-900 text-white px-6 py-2 rounded-xl font-bold">
            Aggiungi
          </button>
        </div>
      </form>
      <p className="text-2xl font-bold text-slate-900">Operazioni:</p>
      {list.length === 0 ?
        <p className="text-2xl font-bold text-slate-900 text-center mt-18">📭 Nessuna operazione trovata. Inizia aggiungendone una sopra!</p> :
        <div className="my-5">
          <button onClick={() => deleteAllOperations()} className="bg-red-800 text-white px-6 py-2 rounded-xl font-bold mb-5">Elimina tutte le operazioni</button>
          {list.map(operation => {
            return (
              <div key={operation.id}>
                <div className={`bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100 flex justify-between items-center gap-4 mb-3 ${operation.import > 0 ?
                  'hover:bg-green-50' :
                  'hover:bg-red-50'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${operation.import > 0 ?
                      'bg-emerald-100 text-emerald-600' :
                      'bg-red-100 text-red-600'}`}>
                      <div className="flex items-center justify-center w-6 h-6">
                        <span className={`text-2xl font-bold ${operation.import > 0 ?
                          'text-green-500' :
                          'text-red-500'}`}
                        >€</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-md text-slate-500 font-medium">{operation.description} - <span className="text-sm">{new Date(operation.date).toLocaleString('it-IT', {
                        day: '2-digit',
                        month: '2-digit',
                        year: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</span></p>
                      <p className="text-2xl font-bold text-slate-900">{formattedBudget(operation.import)}</p>
                    </div>
                  </div>
                  <div className="p-2 rounded-2xl">
                    <button className="cursor-pointer" onClick={() => {
                      setTempOperation(operation)
                      setModalConfirmOperation(true)
                    }}>❌</button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      }
      {modal && <div className={`fixed bottom-5 right-5 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl ${message === 'Importo non valido' || message === 'Descrizione non valida' ? 'bg-red-200' : 'bg-green-200'}`}>
        <div>
          <button className="cursor-pointer" onClick={() => setModal(false)}>✕</button>
        </div>
        <p className="text-slate-900">{message}</p>
      </div>}
      {modalConfirmOperation && <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center">
          <div className="relative bg-white p-8 rounded-3xl shadow-2xl max-w-md">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-7">Confermi di voler eliminare l'operazione {tempOperation.description} dall'importo di {formattedBudget(tempOperation.import)}?</h2>
              <div className="flex justify-between">
                <div><button className="bg-slate-900 text-white px-6 py-2 rounded-xl font-bold" onClick={() => setModalConfirmOperation(false)}>Annulla</button></div>
                <div><button className="bg-red-800 text-white px-6 py-2 rounded-xl font-bold" onClick={() => confirmDelete(tempOperation.id)}>Conferma</button></div>
              </div>
            </div>
          </div>
        </div>
      </div>}
    </div>
  )
}