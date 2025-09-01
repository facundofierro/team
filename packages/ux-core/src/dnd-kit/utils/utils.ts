export function mergeRefs<T>(
  ...refs: Array<React.Ref<T> | undefined>
): React.RefCallback<T> {
  return (value: T) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value)
      } else if (ref != null) {
        const refObject = ref as React.RefObject<T | null>
        if (refObject.current !== undefined) {
          ;(refObject as any).current = value
        }
      }
    })
  }
}
