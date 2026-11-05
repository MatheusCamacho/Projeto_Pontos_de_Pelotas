export const CATEGORIES = [
  { value: 'cultura', label: 'Cultura', color: '#b66b3d', symbol: 'C' },
  { value: 'gastronomia', label: 'Gastronomia', color: '#397a67', symbol: 'G' },
  { value: 'religioso', label: 'Religioso', color: '#7772a7', symbol: 'R' },
  { value: 'outros', label: 'Outros', color: '#687789', symbol: 'O' },
]

export function getCategory(value) {
  return CATEGORIES.find((category) => category.value === value) ?? CATEGORIES[3]
}
