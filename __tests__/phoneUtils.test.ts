import { describe, it, expect } from 'vitest'
import { normalizePhoneNumber, isValidPhoneNumber, buildFaceTimeUrl } from '../lib/phoneUtils'

describe('normalizePhoneNumber', () => {
  it('Swedish mobile with leading 0', () => {
    expect(normalizePhoneNumber('0701234567')).toBe('+46701234567')
  })

  it('Swedish mobile with dashes and spaces', () => {
    expect(normalizePhoneNumber('070-123 45 67')).toBe('+46701234567')
  })

  it('Swedish mobile with parentheses', () => {
    expect(normalizePhoneNumber('(070) 123 45 67')).toBe('+46701234567')
  })

  it('Already international +46', () => {
    expect(normalizePhoneNumber('+46701234567')).toBe('+46701234567')
  })

  it('International with 0046 prefix', () => {
    expect(normalizePhoneNumber('0046701234567')).toBe('+46701234567')
  })

  it('International 0046 with formatting', () => {
    expect(normalizePhoneNumber('0046 70 123 45 67')).toBe('+46701234567')
  })

  it('Stockholm landline', () => {
    expect(normalizePhoneNumber('08-12345678')).toBe('+4681234567 8'.replace(' ', ''))
  })

  it('Stockholm landline full', () => {
    expect(normalizePhoneNumber('08-123 456 78')).toBe('+468123456 78'.replace(' ', ''))
  })

  it('Other international with 00 prefix', () => {
    expect(normalizePhoneNumber('0044701234567')).toBe('+44701234567')
  })

  it('Empty string', () => {
    expect(normalizePhoneNumber('')).toBe('')
  })

  it('Whitespace only', () => {
    expect(normalizePhoneNumber('   ')).toBe('')
  })
})

describe('isValidPhoneNumber', () => {
  it('Valid Swedish mobile', () => {
    expect(isValidPhoneNumber('+46701234567')).toBe(true)
  })

  it('Valid international UK', () => {
    expect(isValidPhoneNumber('+44701234567')).toBe(true)
  })

  it('Missing + prefix', () => {
    expect(isValidPhoneNumber('46701234567')).toBe(false)
  })

  it('Too short (< 7 digits after +)', () => {
    expect(isValidPhoneNumber('+46')).toBe(false)
    expect(isValidPhoneNumber('+4670')).toBe(false)
  })

  it('Too long (> 14 digits after +)', () => {
    expect(isValidPhoneNumber('+467012345678901234')).toBe(false)
  })

  it('Letters in number', () => {
    expect(isValidPhoneNumber('+4670abc')).toBe(false)
  })

  it('Empty string', () => {
    expect(isValidPhoneNumber('')).toBe(false)
  })
})

describe('buildFaceTimeUrl', () => {
  it('Builds correct FaceTime URL', () => {
    expect(buildFaceTimeUrl('+46701234567')).toBe('facetime://+46701234567')
  })
})
