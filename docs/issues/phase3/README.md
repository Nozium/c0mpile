# Phase3: Post-MVP Experiments And Review Layers

## 目的

MVP の一本線が成立した後に、判断品質と実験速度を広げる。Phase2.5 で初期接続した Rork + Blaxel actuation を本格運用に拡張し、Virtual Staff、より深い user state / allocation refinement、Unbound による runtime governance をこの phase で扱う。

## Phase2.5 との関係

Phase2.5 (P2-4 Experience Actuation Stretch) で「1 proposal → 1 experience」の最小 actuation が成立している前提。Phase3 ではこれを複数 variant、experiment loop、自動 policy check に拡張する。

## 完了条件

- Rork + Blaxel で複数 variant の experiment loop を回せる
- Virtual Staff を advisory layer として実行できる
- user state / theme / allocation の精度を MVP より深く改善できる
- Unbound 系の runtime constitution governance を検証できる

## Issues

- `01_rork_experiment_loop_post_mvp.md`
- `02_virtual_staff_adversarial_review.md`
- `03_user_state_and_theme_inference_refinement.md`
