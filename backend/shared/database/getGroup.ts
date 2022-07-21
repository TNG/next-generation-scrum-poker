import { Config, GroupItem } from '../types';
import { getItem } from './getItem';

export const getGroup = async (groupId: string, config: Config): Promise<GroupItem | void> =>
  getItem<GroupItem>('groupId', groupId, config.tableName, config.ddb);
