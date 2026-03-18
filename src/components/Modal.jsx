export default function Modal({ message, setModal }) {
  return (
    <div className={`fixed bottom-5 right-5 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl ${message === 'Importo non valido' || message === 'Descrizione non valida' ? 'bg-red-200' : 'bg-green-200'}`}>
      <div>
        <button className="cursor-pointer" onClick={() => setModal(false)}>✕</button>
      </div>
      <p className="text-slate-900">{message}</p>
    </div>
  )
}