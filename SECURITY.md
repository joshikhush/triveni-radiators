# Security: malware incident and rules for this repository

Read this before you install, build, run, commit or deploy anything here.
This applies to people and to Claude.

## What happened (September to October 2026)

Several Tresto2025 repositories were infected with a hidden JavaScript
loader, the kind used in fake job-interview attacks. It was cleaned from
every branch on 2026-10-04, but it came back two or three times before
that, because it was being re-added from infected developer machines.

How it worked:

- Obfuscated code was appended to the end of a normal line, behind hundreds
  of spaces, so it was invisible in editors and diffs. Files hit:
  `postcss.config.js` / `postcss.config.mjs` (runs on every `npm run dev` or
  `npm run build`) and `src/routes/auth.js`.
- A fake font file, `public/fonts/fa-solid-600.eot`, actually contained the
  same JavaScript.
- `.vscode/tasks.json` had a hidden task with `"runOn": "folderOpen"` that
  ran that fake font with `node` as soon as the folder was opened in VS Code,
  and `.vscode/settings.json` turned on `task.allowAutomaticTasks`.
- When run, the loader read an Ethereum wallet's transactions (address
  starting `0xa322E5f3` and ending `90Ef1a`) through public RPC endpoints to
  get its command server, downloaded more code and started it as hidden,
  detached `node` processes. Treat any machine that ran it as compromised:
  browser passwords, crypto wallets, SSH keys, GitHub tokens and `.env`
  secrets may have been stolen.
- It also reached a commit as an "evil merge": the infected content
  appeared in a merge commit even though neither parent had it.

Git history before 2026-10-04 still contains the payload. It is harmless
as long as nobody checks out, reverts to or re-merges those old commits.

## Protections now in place

| Layer | What it does |
|---|---|
| `.github/scripts/malware_guard.py` | Read-only scanner: hidden code after long whitespace, known signatures, auto-run VS Code tasks, font/image files that contain script, and locked files that changed. |
| `.github/workflows/malware-guard.yml` | Runs the scanner on every push and pull request (check name `scan`). |
| `.github/locked-files.sha256` | SHA-256 lock on build configs, hook scripts, deploy files and this file. Changing one without updating the lock fails `scan`. |
| `.githooks/pre-commit`, `.githooks/pre-push` | Block an infected commit or push. Enabled by `npm install` (the `prepare` script) or `git config core.hooksPath .githooks`. |
| `.claude/hooks/malware-guard.sh` | Claude Code hook: scans at session start, and blocks `git commit`, `git push` and commands that run project code (`npm`, `node`, `composer`, `php`, ...) when the scan fails. |
| Deploy gates | Deploy workflows wait for `scan`; `deploy/deploy.sh` and `deploy/safe-update.sh` scan on the server before any code runs. |
| `.github/CODEOWNERS` | Changes to `.github/`, `.githooks/`, `.claude/`, `.vscode/`, build configs and `package.json` need the owner's review. |

## Rules for Claude

1. At the start of every session, run `python3 .github/scripts/malware_guard.py`.
   If it fails, stop. Do not install, build, run, commit or push anything.
   Tell the user what it found.
2. Never bypass the protections: no `--no-verify`, no disabling hooks, no
   editing `malware_guard.py`, the workflow, the hook scripts or
   `locked-files.sha256` to make a failure pass, no deleting this file.
3. Treat any change to `postcss.config.*`, other build configs, `.vscode/`,
   `public/fonts/` or `package.json` lifecycle scripts as suspicious. Read
   the full diff, including the ends of long lines, before committing it.
   Never add a VS Code task that runs on folder open.
4. Never check out, revert to, cherry-pick or merge commits from before
   2026-10-04, or old branches or forks, without scanning them first.
5. If you see any sign of the loader (long whitespace followed by code,
   `eval(atob(...))`, code that queries Ethereum RPC endpoints, a "font"
   that contains JavaScript, an auto-run task), stop and tell the user.
   Do not try to run or "test" it.
6. Deploy only with the gated paths: the deploy workflow, or on the VPS
   `sh deploy/safe-update.sh <branch>` instead of `git pull`.

## Rules for developers

1. Only work from a machine that has been cleaned or reinstalled since the
   incident. Never reuse a clone from an infected machine; clone fresh.
2. After cloning, enable the hooks (`npm install`, or
   `git config core.hooksPath .githooks`) and run
   `python3 .github/scripts/malware_guard.py`. It should print
   "Malware guard passed."
3. Keep VS Code Workspace Trust on and `task.allowAutomaticTasks` off. Never
   run code sent for an "interview task" or by strangers on this machine.
4. Never commit with `--no-verify`. If the "Malware guard" check turns red
   on GitHub, stop and investigate before merging or deploying.
5. If you suspect infection: disconnect the machine, do not push, tell the
   repository owner, rotate GitHub tokens, SSH keys and `.env` secrets from
   a clean device, and check deploy servers for unknown `node` processes.
