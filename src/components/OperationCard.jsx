import { formattedBudget } from "../utils/formattedBudget";

export default function OperationCard({ operation, setTempOperation, setModalConfirmOperation }) {

  return (
    <div className={`bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100 flex justify-between items-center gap-4 mb-3 ${operation.import >= 0 ?
      'hover:bg-green-50' :
      'hover:bg-red-50'}`}>
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-full ${operation.import >= 0 ?
          'bg-emerald-100 text-emerald-600' :
          'bg-red-100 text-red-600'}`}>
          <div className="flex items-center justify-center w-6 h-6">
            <span className={`text-2xl font-bold ${operation.import >= 0 ?
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
  )
}