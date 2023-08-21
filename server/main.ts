function InitModule(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, initializer: nkruntime.Initializer) {
  logger.info('JS GameDev Summit 23 Demo Module Loaded.');

  // Create a leaderboard
  nk.leaderboardCreate('weekly_leaderboard', false, nkruntime.SortOrder.DESCENDING, nkruntime.Operator.BEST);

  initializer.registerAfterWriteLeaderboardRecord(afterWriteLeaderboardRecord);
}

function afterWriteLeaderboardRecord(ctx: nkruntime.Context, logger: nkruntime.Logger, nk: nkruntime.Nakama, data: nkruntime.LeaderboardRecord, request: nkruntime.WriteLeaderboardRecordRequest) {
  if (data.score >= 1000) {
      nk.walletUpdate(data.ownerId, { coins: 1000});
  }
}