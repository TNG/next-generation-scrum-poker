export function validUserId(userId: string) {
  return (
    userId &&
    userId !== 'primaryKey' &&
    userId !== 'visible' &&
    userId !== 'groupId' &&
    userId !== 'scale' &&
    userId !== 'ttl'
  );
}
