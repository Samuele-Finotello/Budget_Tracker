import { useState, useEffect, useRef } from "react"

export default function App() {

  const [list, setList] = useState(() => {
    const saved = localStorage.getItem('list');
    return saved ? JSON.parse(saved) : [];
  })
  const selectionRef = useRef('')

  useEffect(() => {
    localStorage.setItem('list', JSON.stringify(list));
  }, [list])

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
      <form className="my-10">
        <p className="text-md font-medium text-slate-700 mb-1">Inserisci un'operazione</p>
        <div className="bg-slate-100 p-6 rounded-3xl flex gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Movimento</label>
            <select name="selection" ref={selectionRef} className="bg-slate-900 text-white px-6 py-2 rounded-xl font-bold">
              <option value={'entrata'}>Entrata</option>
              <option value={'uscita'}>Uscita</option>
            </select>
          </div>
        </div>
      </form>
    </div>
  )
}