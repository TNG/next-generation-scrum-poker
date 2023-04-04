import { renderHook } from '@testing-library/preact';
import { useDeepCompareMemoize } from './helpers';

describe('useDeepCompareMemoize', () => {
  it('returns initial value on rerenders with deep equals second input', () => {
    // given
    const initialValue = { key: 'value', deep: { key: 'value' } };
    const secondValue = { key: 'value', deep: { key: 'value' } };
    const { result, rerender } = renderHook(useDeepCompareMemoize, { initialProps: initialValue });

    // then
    expect(initialValue).not.toBe(secondValue);
    expect(initialValue).toEqual(secondValue);
    expect(result.current).toBe(initialValue);

    // when
    rerender(secondValue);

    // then
    expect(result.current).toBe(initialValue);
  });

  it('changes value on rerender if no deep equal', () => {
    // given
    const initialValue = { key: 'value', deep: { key: 'value' } };
    const secondValue = { key: 'value', deep: { key: 'value2' } };
    const { result, rerender } = renderHook(useDeepCompareMemoize, { initialProps: initialValue });

    // then
    expect(initialValue).not.toEqual(secondValue);
    expect(result.current).toBe(initialValue);

    // when
    rerender(secondValue);

    // then
    expect(result.current).toBe(secondValue);
  });
});
