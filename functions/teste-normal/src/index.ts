import { Handler } from 'aws-lambda'

export const handler: Handler = async (event: any) => {
  console.log('Eu alterei')
  // TODO implement
  const response = {
    statusCode: 200,
    body: JSON.stringify('Eu alterei')
  }
  return response
}
