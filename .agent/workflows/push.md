---
description: 現在のブランチをリモートに push する
---

1. `git branch --show-current` でブランチ名を確認する。 detached HEAD の場合は警告を出して中断する。
2. リモート設定を確認する。 upstream が未設定の場合は `git push -u origin [branch]` を、設定済みの場合は `git push` を使用する。
3. push 前に、対象のリモート（origin）およびブランチ名を明示する。
4. `git push` を実行する。
5. 完了後、どのブランチが push されたかの要約を表示して終了する。
