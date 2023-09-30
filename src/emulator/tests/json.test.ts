import path from 'path'
import fs from 'fs'
import { JsonTest, JsonTestSuite } from '../types'
import { Emulator } from '../emulator'

const loadFile = (name: string) => {
  const filePath = path.join(__dirname, `./testJson/${name}.json`)
  const file = fs.readFileSync(filePath, 'utf8')
  const json = JSON.parse(file) as JsonTestSuite
  return json
}

const setInitialState = (emulator: Emulator, json: JsonTest) => {
  emulator.bus.writeByte(0xff50, 1)
  emulator.cpu.registers.set('a', json.initial.a)
  emulator.cpu.registers.set('b', json.initial.b)
  emulator.cpu.registers.set('c', json.initial.c)
  emulator.cpu.registers.set('d', json.initial.d)
  emulator.cpu.registers.set('e', json.initial.e)
  emulator.cpu.registers.set('f', json.initial.f)
  emulator.cpu.registers.set('h', json.initial.h)
  emulator.cpu.registers.set('l', json.initial.l)
  emulator.cpu.registers.set('pc', json.initial.pc)
  emulator.cpu.registers.set('sp', json.initial.sp)
  emulator.cpu.interruptEnable = json.initial.ie === 1
  emulator.cpu.interrupMasterEnabled = json.initial.ime === 1

  json.initial.ram.forEach((row) => {
    emulator.bus.writeByte(row[0], row[1])
  })
}

const testFinalState = (emulator: Emulator, json: JsonTest) => {
  expect(emulator.cpu.registers.get('a')).toEqual(json.final.a)
  expect(emulator.cpu.registers.get('b')).toEqual(json.final.b)
  expect(emulator.cpu.registers.get('c')).toEqual(json.final.c)
  expect(emulator.cpu.registers.get('d')).toEqual(json.final.d)
  expect(emulator.cpu.registers.get('e')).toEqual(json.final.e)
  expect(emulator.cpu.registers.get('h')).toEqual(json.final.h)
  expect(emulator.cpu.registers.get('l')).toEqual(json.final.l)
  expect(emulator.cpu.registers.get('pc')).toEqual(json.final.pc)
  expect(emulator.cpu.registers.get('sp')).toEqual(json.final.sp)
  expect(emulator.cpu.registers.getFlag('Zero')).toEqual((json.final.f & 128) >> 7 === 1)
  expect(emulator.cpu.registers.getFlag('Subtraction')).toEqual((json.final.f & 64) >> 6 === 1)
  expect(emulator.cpu.registers.getFlag('HalfCarry')).toEqual((json.final.f & 32) >> 5 === 1)
  expect(emulator.cpu.registers.getFlag('Carry')).toEqual((json.final.f & 16) >> 4 === 1)
  expect(emulator.cpu.registers.get('f')).toEqual(json.final.f)
  emulator.cpu.interruptEnable = json.final.ie === 1
  emulator.cpu.interrupMasterEnabled = json.final.ime === 1

  json.final.ram.forEach((row) => {
    expect(emulator.bus.readByte(row[0])).toBe(row[1])
  })
}

const mergeAllTests = (opts?: { limit?: number | null; tests?: string[] | null; skip?: string[] | null }) => {
  const files = fs.readdirSync(path.join(__dirname, './testJson'))
  let tests: JsonTestSuite = []

  files
    .map((file) => {
      return file.split('.')[0]
    })
    .filter((file) => {
      if (opts?.tests) {
        return opts?.tests.includes(file)
      }
      if (opts?.skip) {
        return !opts.skip.includes(file)
      }
      return true
    })
    .forEach((file) => {
      const suite = loadFile(file)

      if (opts?.limit) {
        tests = [...tests, ...suite.slice(0, opts.limit)]
      } else {
        tests = [...tests, ...suite]
      }
    })

  return tests
}

xtest.each(mergeAllTests())(`JSON Instruction: $name`, (testData) => {
  const emulator = new Emulator()

  setInitialState(emulator, testData)
  emulator.cpu.tick()
  testFinalState(emulator, testData)
})
