import path from 'path'
import fs from 'fs'
import { JsonTest, JsonTestSuite } from './types/testJson'
import { CPU } from './cpu'

const loadFile = (name: string) => {
  const filePath = path.join(__dirname, `./testJson/${name}.json`)
  const file = fs.readFileSync(filePath, 'utf8')
  const json = JSON.parse(file) as JsonTestSuite
  return json
}

const setInitialState = (cpu: CPU, json: JsonTest) => {
  cpu.memory.writeByte(0xff50, 1)
  cpu.registers.set('a', json.initial.a)
  cpu.registers.set('b', json.initial.b)
  cpu.registers.set('c', json.initial.c)
  cpu.registers.set('d', json.initial.d)
  cpu.registers.set('e', json.initial.e)
  cpu.registers.set('f', json.initial.f)
  cpu.registers.set('h', json.initial.h)
  cpu.registers.set('l', json.initial.l)
  cpu.registers.set('pc', json.initial.pc)
  cpu.registers.set('sp', json.initial.sp)
  cpu.interruptEnable = json.initial.ie === 1
  cpu.interrupMasterEnabled = json.initial.ime === 1

  json.initial.ram.forEach((row) => {
    cpu.memory.writeByte(row[0], row[1])
  })
}

const testFinalState = (cpu: CPU, json: JsonTest) => {
  expect(cpu.registers.get('a')).toEqual(json.final.a)
  expect(cpu.registers.get('b')).toEqual(json.final.b)
  expect(cpu.registers.get('c')).toEqual(json.final.c)
  expect(cpu.registers.get('d')).toEqual(json.final.d)
  expect(cpu.registers.get('e')).toEqual(json.final.e)
  expect(cpu.registers.get('h')).toEqual(json.final.h)
  expect(cpu.registers.get('l')).toEqual(json.final.l)
  expect(cpu.registers.get('pc')).toEqual(json.final.pc)
  expect(cpu.registers.get('sp')).toEqual(json.final.sp)
  expect(cpu.registers.getFlag('Zero')).toEqual((json.final.f & 128) >> 7 === 1)
  expect(cpu.registers.getFlag('Subtraction')).toEqual((json.final.f & 64) >> 6 === 1)
  expect(cpu.registers.getFlag('HalfCarry')).toEqual((json.final.f & 32) >> 5 === 1)
  expect(cpu.registers.getFlag('Carry')).toEqual((json.final.f & 16) >> 4 === 1)
  expect(cpu.registers.get('f')).toEqual(json.final.f)
  cpu.interruptEnable = json.final.ie === 1
  cpu.interrupMasterEnabled = json.final.ime === 1

  json.final.ram.forEach((row) => {
    expect(cpu.memory.readByte(row[0])).toBe(row[1])
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
  const cpu = new CPU(() => {})

  setInitialState(cpu, testData)
  cpu.step()
  testFinalState(cpu, testData)
})
