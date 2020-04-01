function validUserId(userId) {
  return (
    userId &&
    userId !== 'primaryKey' &&
    userId !== 'visible' &&
    userId !== 'groupId' &&
    userId !== 'ttl'
  );
}

module.exports = {
  validUserId,
};
