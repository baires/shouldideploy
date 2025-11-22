export const Theme = {
  Light: 'Light',
  Dark: 'Dark'
} as const

export type ThemeType = (typeof Theme)[keyof typeof Theme]
