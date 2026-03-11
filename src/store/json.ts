import fs from 'fs'

export function loadJSON<T>(filePath: string, defaultData: T): T {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2))
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T
}

export function saveJSON<T>(filePath: string, data: T) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
}
