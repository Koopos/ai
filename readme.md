# Monorepo 拆分指南

这个仓库可以通过 `git subtree split` 按一级目录拆分成多个独立 GitHub 仓库。

## 一键脚本

已提供脚本：

```bash
./scripts/split-top-level-repos.sh --owner <github_owner>
```

默认是 **dry-run**，只打印命令不执行，便于先检查。

## 推荐流程

1. 先预览将要执行的命令：

```bash
./scripts/split-top-level-repos.sh --owner <github_owner>
```

2. 确认无误后，实际执行拆分并推送：

```bash
./scripts/split-top-level-repos.sh --owner <github_owner> --push --execute
```

3. 若希望自动创建 GitHub 仓库（需要先安装并登录 `gh` CLI）：

```bash
./scripts/split-top-level-repos.sh --owner <github_owner> --create-remote --push --execute
```

## 常用参数

- `--owner`：必填，GitHub 用户名或组织名
- `--remote-base`：远程地址前缀（默认 `git@github.com:<owner>`）
- `--create-remote`：用 `gh` 自动创建仓库
- `--push`：推送 split 分支到对应远程仓库
- `--exclude`：要排除的一级目录（逗号分隔，默认 `.git,scripts`）
- `--execute`：关闭 dry-run，真正执行命令

## 脚本做了什么

对每个一级目录（排除 `.git`）依次执行：

1. `git subtree split --prefix=<目录> -b split/<目录>`
2. （可选）创建远程仓库 `<owner>/<目录>`
3. （可选）推送 `split/<目录>` 到远端 `main`

## 注意事项

- `--push` 使用 `--force` 推送，请确保目标仓库可覆盖。
- 如果你的默认分支不是 `main`，可先推送后在 GitHub 修改默认分支。
- 拆分后每个仓库仅保留对应子目录的历史。
