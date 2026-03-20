import { formattedBudget } from "../utils/formattedBudget"

export default function ModalConfirmOperation({ tempOperation, setModalConfirmOperation, confirmDelete }) {

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
    </div>
  )
}