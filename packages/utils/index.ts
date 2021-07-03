export function noop(): void {}

export function isDef<T>(val: T): val is NonNullable<T> {
  return val !== undefined && val !== null
}

export function isObject(val: unknown): val is Object {
  return val !== null && typeof val === 'object'
}

export function isNumeric(val: string): boolean {
  return /^-?\d+(\.\d+)?$/.test(val)
}

export function transformUnit(
  value?: string | number,
  unit = 'px',
): string | undefined {
  if (!isDef(value)) return undefined

  value = String(value)
  return isNumeric(value) ? `${value}${unit}` : value
}

export function guuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function getScroller(
  el: HTMLElement,
  root: HTMLElement | Window = window,
) {
  let node = el

  while (
    node &&
    node.tagName !== 'HTML' &&
    node.nodeType === 1 &&
    node !== root
  ) {
    const { overflowY } = window.getComputedStyle(node)
    if (/scroll|auto/i.test(overflowY)) {
      if (node.tagName !== 'BODY') {
        return node
      }
      const { overflowY: htmlOverflowY } = window.getComputedStyle(
        node.parentNode as Element,
      )
      if (/scroll|auto/i.test(htmlOverflowY)) {
        return node
      }
    }
    node = node.parentNode as HTMLElement
  }

  return root
}
