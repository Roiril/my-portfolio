const photo = '/demos/couple-sync/demo-memory.jpg';

export function coupleSeedRows() {
  const now = Date.now();
  const today = new Date();
  const date = day => `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const base = { created_at: now, updated_at: now, is_deleted: false, field_meta: {} };
  return {
    date_infos: [
      { ...base, id: date(8), date: date(8), is_date: true, status: 'confirmed', time_text: '水族館へ行く', is_anniversary: false, anniversary_name: null },
      { ...base, id: date(14), date: date(14), is_date: false, status: null, time_text: '', is_anniversary: true, anniversary_name: 'はじめて一緒に料理した日' },
    ],
    daily_schedules: [
      { ...base, id: `${date(8)}_taisei`, date: date(8), user_id: 'taisei', content: '18:30 駅前で待ち合わせ' },
      { ...base, id: `${date(8)}_hina`, date: date(8), user_id: 'hina', content: '帰りにパンを買う' },
    ],
    memo_lines: [
      { ...base, id: 'demo-note-1', author: 'tai', sort_key: 'a0', content: '今月やりたいこと：夜の散歩' },
      { ...base, id: 'demo-note-2', author: 'hina', sort_key: 'a1', content: '次の休みに写真を整理する' },
    ],
    date_memories: [{ ...base, id: date(8), date: date(8), memo: '川沿いを歩いて焼き菓子を買った。', photo_url: photo }],
    health_records: [{ ...base, id: `${date(today.getDate())}_common`, date: date(today.getDate()), user_id: 'common', breakfast_text: 'トースト', lunch_text: 'おにぎり', dinner_text: '野菜スープ', sleep_hours: '7', sleep_quality: 'gussuri', mood: 'good', wore_contacts: false, removed_contacts: false, period_start: '', period_on: false, period_pain: '' }],
    shubie_posts: [{ ...base, id: 'demo-chat', kind: 'chat', date: date(today.getDate()), title: '', content: 'ここは公開デモです。ふたりの記録は架空のものです。', created_at: now - 600000, updated_at: now - 600000 }],
    shubie_replies: [{ ...base, id: 'demo-message-tai', post_id: 'demo-chat', author: 'tai', content: '次の休みは何をしよう。', reaction: null, origin: null, status: null, created_at: now - 300000 }],
  };
}
