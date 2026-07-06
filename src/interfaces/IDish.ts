// Field names mirror the backend API contract (pt-BR) — do not translate them.
export default interface IDish {
  id: number
  nome: string
  tag: string
  imagem: string
  descricao: string
  restaurante: number
}
