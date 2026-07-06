import IDish from "./IDish";

// Field names mirror the backend API contract (pt-BR) — do not translate them.
export default interface IRestaurant {
  id: number
  nome: string
  pratos: IDish[]
}
