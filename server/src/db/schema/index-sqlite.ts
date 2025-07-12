export { rooms } from './rooms-sqlite.ts'
export { questions } from './questions-sqlite.ts'  
export { audioChunks } from './audio-chunks-sqlite.ts'

import { rooms } from './rooms-sqlite.ts'
import { questions } from './questions-sqlite.ts'
import { audioChunks } from './audio-chunks-sqlite.ts'

export const schema = {
  rooms,
  questions,
  audioChunks,
}
