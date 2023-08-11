import mongoose, { Schema, Document } from 'mongoose'

export interface CitiesData extends Document {
  ibgeId: number
  name: string
  state: string
}

const citiesSchema = new Schema<CitiesData>(
  {
    ibgeId: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
    collection: 'cities'
  }
)

export const CitiesModel = mongoose.model<CitiesData>('Cities', citiesSchema)
