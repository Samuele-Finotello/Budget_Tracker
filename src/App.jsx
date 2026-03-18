import { useState, useEffect, useRef } from "react"
import { formattedBudget } from "./utils/formattedBudget";
import FormCard from "./components/FormCard";
import Modal from "./components/Modal";

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
  const [modalConfirmAll, setModalConfirmAll] = useState(false)
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
    setList([newOperation, ...list]);
    showMessage('Operazione registrata');

    descriptionRef.current.value = '';
    importRef.current.value = '';
    selectionRef.current.value = 'entrata';
  }

  const confirmDelete = (id) => {
    const newList = list.filter(operation => operation.id !== id)
    setList(newList)
    setModalConfirmOperation(false)
    showMessage('Operazione eliminata con successo')
  }

  const confirmDeleteAll = () => {
    setList([])
    setModalConfirmAll(false)
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
      <FormCard
        addOperation={addOperation}
        selectionRef={selectionRef}
        descriptionRef={descriptionRef}
        importRef={importRef}
      />
      <p className="text-2xl font-bold text-slate-900">Operazioni:</p>
      {list.length === 0 ?
        <p className="text-2xl font-bold text-slate-900 text-center mt-18">📭 Nessuna operazione trovata. Inizia aggiungendone una sopra!</p> :
        <div className="my-5">
          <button onClick={() => setModalConfirmAll(true)} className="bg-red-800 text-white px-6 py-2 rounded-xl font-bold mb-5">Elimina tutte le operazioni</button>
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
      {modal && <Modal
        message={message}
        setModal={setModal}
      />}
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
      {modalConfirmAll && <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center">
          <div className="relative bg-white p-8 rounded-3xl shadow-2xl max-w-md">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-7">Confermi di voler eliminare tutte le operazioni?</h2>
              <div className="flex justify-between">
                <div><button className="bg-slate-900 text-white px-6 py-2 rounded-xl font-bold" onClick={() => setModalConfirmAll(false)}>Annulla</button></div>
                <div><button className="bg-red-800 text-white px-6 py-2 rounded-xl font-bold" onClick={() => confirmDeleteAll()}>Conferma</button></div>
              </div>
            </div>
          </div>
        </div>
      </div>}
    </div>
  )
}