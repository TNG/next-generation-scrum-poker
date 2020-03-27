function validUserId(userId) {
  return userId && userId !== 'primaryKey' && userId !== 'visible' && userId !== 'groupId';
}

module.exports = {
  validUserId,
};
