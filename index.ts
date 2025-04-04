import { HumeClient } from "hume"
import fs from "fs/promises"
import path from "path"
import * as os from "os"

// Create the Hume client with the API key directly
const hume = new HumeClient({ 
  apiKey: "hR2oaLg9ELYijy0mgwsdoElDGFArsalDxdzvo086AE3GEvCl"
})

const outputDir = path.join(os.tmpdir(), `hume-audio-${Date.now()}`)
const writeResultToFile = async (base64EncodedAudio: string, filename: string) => {
  const filePath = path.join(outputDir, `${filename}.wav`)
  await fs.writeFile(filePath, Buffer.from(base64EncodedAudio, "base64"))
  console.log('Wrote', filePath)
}

const main = async () => {
  await fs.mkdir(outputDir)
  console.log('Writing to', outputDir)
  
  // Define a consistent voice name
  const voiceName = `aristocrat-${Date.now()}`
  console.log(`Using voice name: ${voiceName}`)
  
  // Text-to-Speech example
  const speech1 = await hume.tts.synthesizeJson({
    utterances: [{
      description: "A refined, British aristocrat",
      text: "Take an arrow from the quiver."
    }]
  })
  await writeResultToFile(speech1.generations[0].audio, "speech1_0")
  
  // Saving voices
  console.log(`Creating voice: ${voiceName}`)
  await hume.tts.voices.create({
    name: voiceName,
    generationId: speech1.generations[0].generationId,
  })
  
  // Continuity with multiple generations - using the saved voice name
  console.log(`Generating speech with voice: ${voiceName}`)
  const speech2 = await hume.tts.synthesizeJson({
    utterances: [{
      voice: { name: voiceName },
      text: "Now take a bow."
    }],
    context: {
      generationId: speech1.generations[0].generationId
    },
    numGenerations: 2,
  })
  await writeResultToFile(speech2.generations[0].audio, "speech2_0")
  await writeResultToFile(speech2.generations[1].audio, "speech2_1")
  
  // Acting Instructions
  console.log("Generating speech with acting instructions")
  const speech3 = await hume.tts.synthesizeJson({
    utterances: [{
      voice: { name: voiceName },
      description: "Murmured softly, with a heavy dose of sarcasm and contempt",
      text: "Does he even know how to use that thing?"
    }],
    context: {
      generationId: speech2.generations[0].generationId
    },
    numGenerations: 1
  })
  await writeResultToFile(speech3.generations[0].audio, "speech3_0")
  
  // Streaming speech
  console.log("Generating streaming speech")
  let i = 0
  for await (const snippet of await hume.tts.synthesizeJsonStreaming({
    context: {
      generationId: speech3.generations[0].generationId,
    },
    utterances: [{text: "He's drawn the bow..."}, {text: "he's fired the arrow..."}, {text: "I can't believe it! A perfect bullseye!"}],
  })) {
    await writeResultToFile(snippet.audio, `speech4_${i++}`)
  }
}

main().then(() => console.log('Done')).catch(console.error) 