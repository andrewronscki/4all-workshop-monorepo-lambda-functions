export interface CitiesInterface {
  id: number
  nome: string
  municipio: {
    id: number
    nome: string
    microrregiao: {
      mesorregiao: {
        UF: {
          sigla: string
        }
      }
    }
  }
}
