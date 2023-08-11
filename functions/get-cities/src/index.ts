import { Handler, EventBridgeEvent } from 'aws-lambda'
import axios from 'axios'
import https from 'https'
import crypto from 'crypto'

import { CitiesData, CitiesModel } from './cities.entity'
import { connectToDatabase } from './db'
import { CitiesInterface } from './cities.interface'

const agent = new https.Agent({
  secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT
})

const axiosInstance = axios.create({
  httpsAgent: agent
})

async function getCities(): Promise<CitiesData[]> {
  try {
    const { data } = await axiosInstance.get(process.env.IBGE_URL, { headers: { 'Content-Type': 'application/json' } })

    return data.map((city: CitiesInterface) => ({
      ibgeId: city.municipio.id,
      name: city.municipio.nome,
      state: city.municipio.microrregiao.mesorregiao.UF.sigla
    })) as CitiesData[]
  } catch (error) {
    console.error('Erro ao buscar cidades:', error.message)
    throw new Error(error)
  }
}

export const handler: Handler = async (event: EventBridgeEvent<any, any>) => {
  try {
    await connectToDatabase(process.env.DB_MONGO_URI)

    const cities = (await CitiesModel.find()) as CitiesData[]
    console.log('Cidades buscadas no banco de dados')

    const igbeCities = await getCities()
    console.log('Cidades buscadas no IBGE')

    const data: CitiesData[] = []
    const cityIds = cities.map((city) => city.ibgeId)

    igbeCities.forEach((ibgeCity) => {
      const ibgeId = ibgeCity.ibgeId

      if (!cityIds.includes(ibgeId)) {
        data.push(ibgeCity)
      }
    })

    if (data.length <= 0) {
      console.log('Não há cidades para popular na base')
    } else {
      console.log(`Há ${data.length} cidades para serem populadas na base`)

      await CitiesModel.insertMany(data)
      console.log('Cidades populadas na base')
    }

    return {
      statusCode: 201,
      body: {
        populated: data.length,
        data
      }
    }
  } catch (error) {
    console.error('Erro ao buscar ou salvar as cidades no banco de dados:', error)

    return {
      statusCode: 422,
      body: {
        code: 'GET_CITIES_ERROR',
        message: 'Erro ao buscar cidades'
      }
    }
  }
}
