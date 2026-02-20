import { useEffect, useState } from 'react'

/**
 * 값의 변경을 지연시켜 불필요한 연산을 줄이는 훅
 * @param value - 디바운스 적용할 값
 * @param delay - 지연 시간 (밀리초, 기본값: 300ms)
 * @returns 지연된 값
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // delay 이후에 값을 업데이트
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // 새 값이 들어오면 이전 타이머 취소
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
