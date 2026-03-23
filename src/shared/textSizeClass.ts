const sizeMap: Record<string, string> = {
  '-4': 'zui-text--4',
  '-3': 'zui-text--3',
  '-2': 'zui-text--2',
  '-1': 'zui-text--1',
  base: 'zui-text-base',
  '1': 'zui-text-1',
  '2': 'zui-text-2',
  '3': 'zui-text-3',
  '4': 'zui-text-4',
  '5': 'zui-text-5',
  '6': 'zui-text-6',
}

export type TextSize = keyof typeof sizeMap

export function textSizeClass(size: TextSize): string {
  return sizeMap[size] ?? 'zui-text-base'
}
