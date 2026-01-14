---
description: 変更内容を原子的なコミットとして作成する
---

1. `git status` を実行して変更があるか確認する。変更がない場合は、その旨を報告して終了する。
2. 変更がある場合は `git diff --stat` を表示し、変更の要約を把握する。
3. `git add -p` を使用して、意図した変更のみをステージングする。
4. 差分に基づき、Conventional Commits 形式（例: `feat(scope): message`）のメッセージを提案する。
5. ユーザーの確認後、`git commit -m "[message]"` を実行する。
6. `git log -1` を実行し、作成されたコミット内容を表示して終了する。
