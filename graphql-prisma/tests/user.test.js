import { getFirstName } from '../src/utils/user'

test('should return first name when given full name', () => {
    const result = getFirstName('Ricardo Borges')
    expect(result).toBe('Ricardo')
})