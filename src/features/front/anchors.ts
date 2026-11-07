// 作品ページからトップへ戻るときの行き先。作品が載っている面へ戻す
const FACE_OF_WORK: Record<string, string> = {
  mawarimi: 'mawarimi',
  'robot-collab': 'research',
  whiteout: 'whiteout',
  'couple-sync': 'apps',
  'cogni-storage': 'apps',
  intentlayer: 'sheets',
  'metaquest-devs': 'sheets',
  'ai-business-tools': 'sheets',
};

export const frontHrefOfWork = (workId: string): string => `/#${FACE_OF_WORK[workId] ?? 'small'}`;
