export default function mapValuesAsync<T, K>(
  obj: T,
  asyncFn: (value: T[keyof T], key: keyof T) => Promise<K>
): Promise<{ [P in keyof T]: K }> {
  const keys = Object.keys(obj);
  const promises = keys.map((k) => {
    return asyncFn(obj[k as keyof T], k as keyof T).then((newValue) => {
      return { key: k, value: newValue };
    });
  });

  return Promise.all(promises).then((values) => {
    const newObj = {} as { [P in keyof T]: K };
    values.forEach((v) => {
      newObj[v.key as keyof T] = v.value;
    });

    return newObj as { [P in keyof T]: K };
  });
}
