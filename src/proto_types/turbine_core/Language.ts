// Original file: proto/turbine.proto

export const Language = {
  GOLANG: 0,
  PYTHON: 1,
  JAVASCRIPT: 2,
  RUBY: 3,
} as const;

export type Language =
  | 'GOLANG'
  | 0
  | 'PYTHON'
  | 1
  | 'JAVASCRIPT'
  | 2
  | 'RUBY'
  | 3

export type Language__Output = typeof Language[keyof typeof Language]
