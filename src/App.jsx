import { useState, useEffect, useRef } from "react"

export default function App() {

  const [list, setList] = useState(() => {
    const saved = localStorage.getItem('list');
    return saved ? JSON.parse(saved) : [];
  })
  const selectionRef = useRef('')
  const descriptionRef = useRef('')
  const importRef = useRef('')

  useEffect(() => {
    localStorage.setItem('list', JSON.stringify(list));
  }, [list])

  const addOperation = (e) => {
    e.preventDefault()

    if (descriptionRef.current.value === '') {
      alert('Descrizione non valida')
      return
    }

    const amount = parseFloat(importRef.current.value);

    if (isNaN(amount) || amount === 0) {
      alert('Importo non valido')
      return
    }
  }

  return (
    <div className="max-w-6xl mx-auto my-10">
      <h1 className="text-4xl font-bold text-slate-900 text-center my-10">Budget Tracker</h1>
      <div className="flex justify-around items-center">
        <div className="border-2 border-gray-200 rounded-3xl p-4 shadow-sm w-72">
          <p className="text-sm text-slate-500 font-medium text-center mb-1">Budget Totale</p>
        </div>
        <div className="border-2 border-gray-200 rounded-3xl p-4 shadow-sm w-72">
          <p className="text-sm text-slate-500 font-medium text-center mb-1">Budget Speso</p>
        </div>
        <div className="border-2 border-gray-200 rounded-3xl p-4 shadow-sm w-72">
          <p className="text-sm text-slate-500 font-medium text-center mb-1">Budget Residuo</p>
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
            <input type="text" name="description" ref={descriptionRef} className="w-full p-2 rounded-xl border-none ring-1 ring-slate-300 focus:ring-2 focus:ring-blue-500" placeholder="Es. Affitto" />
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
    </div>
  )
}