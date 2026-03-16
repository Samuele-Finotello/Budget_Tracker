export function formattedBudget(budget) {
  const formatted = budget.toLocaleString('it-IT', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return `€ ${formatted}`
}