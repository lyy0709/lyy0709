#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const USERNAME = process.env.PROFILE_USERNAME || "lyy0709";

const FEATURED_REPOS = [
  {
    name: "grok-share-server-deploy",
    slug: "grok",
    category: "AI MIRROR",
    accent: "sky",
    secondaryTag: "Docker",
    lines: [
      "Grok 镜像部署方案，按模型可用配额自动切换账号，",
      "支持代理直连、多账号轮换与模型配额调度。",
    ],
  },
  {
    name: "cockroachai-oauth",
    slug: "oauth",
    category: "AUTH GATEWAY",
    accent: "emerald",
    secondaryTag: "Docker",
    lines: [
      "对接 cockroachai 的分布式第三方账户与鉴权系统，",
      "支持跨服部署及企业微信 / Telegram 机器人通知。",
    ],
  },
  {
    name: "ddddsharelist",
    slug: "sharelist",
    category: "WEB PANEL",
    accent: "emerald",
    secondaryTag: "Naive UI",
    lines: [
      "基于 Naive UI 打造的账号池可视化前端面板，",
      "支持明暗主题切换、下拉分页加载与状态实时刷新。",
    ],
  },
  {
    name: "ddclaude-share-server-deploy",
    slug: "claude",
    category: "CLAUDE MIRROR",
    accent: "amber",
    secondaryTag: "MySQL",
    lines: [
      "Claude 镜像部署方案，支持对话本地持久化保存、",
      "凭据加密存储与 MCP / Skills 独立路由代理。",
    ],
  },
  {
    name: "codex-perf-patches",
    slug: "codex",
    category: "CLI PERF",
    accent: "violet",
    secondaryTag: "Rust Patch",
    lines: [
      "Codex CLI 0.144.4 非官方性能补丁，修复启动期",
      "MCP OAuth 阻塞与 Windows 文件编辑 ACL 卡顿。",
    ],
  },
  {
    name: "hermes-agent-zh",
    slug: "hermes",
    category: "AGENT CI",
    accent: "sky",
    secondaryTag: "Actions",
    lines: [
      "Hermes Agent 中文翻译覆盖层，基于 SHA-256",
      "增量自动翻译、每日同步上游并双轨构建发布。",
    ],
  },
];

const TECH_GROUPS = [
  {
    id: "lang",
    eyebrow: "LANGUAGES & UI",
    subtitle: "语言与界面",
    accent: "sky",
    icon: "code",
    items: [
      { label: "Python", color: "#3572A5" },
      { label: "Go", color: "#00ADD8" },
      { label: "TypeScript", color: "#3178C6" },
      { label: "JavaScript", color: "#f1e05a" },
      { label: "Shell", color: "#89e051" },
      { label: "C++", color: "#f34b7d" },
      { label: "Vue", color: "#41b883" },
    ],
  },
  {
    id: "infra",
    eyebrow: "INFRA & DATA",
    subtitle: "部署与存储",
    accent: "emerald",
    icon: "server",
    items: [
      { label: "Docker", color: "#2496ED" },
      { label: "Linux", color: "#EAB308" },
      { label: "Nginx", color: "#009639" },
      { label: "MySQL", color: "#4479A1" },
      { label: "Redis", color: "#DC382D" },
      { label: "SQLite", color: "#38bdf8" },
      { label: "Reverse Proxy", color: "#14b8a6" },
    ],
  },
  {
    id: "ai",
    eyebrow: "AI & AUTOMATION",
    subtitle: "AI 与自动化",
    accent: "amber",
    icon: "spark",
    items: [
      { label: "MCP", color: "#38bdf8" },
      { label: "Codex CLI", color: "#a78bfa" },
      { label: "AI Agents", color: "#34d399" },
      { label: "GitHub Actions", color: "#2088FF" },
      { label: "CI / CD", color: "#f59e0b" },
      { label: "Tree-sitter", color: "#22c55e" },
      { label: "Userscript", color: "#64748b" },
    ],
  },
];

const THEMES = {
  dark: {
    mode: "dark",
    bgTop: "#121926",
    bgBottom: "#0d131d",
    surface: "#151e2c",
    surfaceAlt: "#192334",
    well: "#0b1018",
    border: "#243247",
    borderSoft: "#1d283a",
    sheenTop: "rgba(186, 214, 255, 0.16)",
    gridDot: "#2b3b54",
    ink: "#f1f5f9",
    inkSub: "#94a3b8",
    inkMuted: "#64748b",
    sky: "#38bdf8",
    skySoft: "rgba(56, 189, 248, 0.13)",
    skyBorder: "rgba(56, 189, 248, 0.34)",
    cobalt: "#60a5fa",
    emerald: "#34d399",
    emeraldSoft: "rgba(52, 211, 153, 0.13)",
    emeraldBorder: "rgba(52, 211, 153, 0.32)",
    amber: "#fbbf24",
    amberSoft: "rgba(251, 191, 36, 0.13)",
    amberBorder: "rgba(251, 191, 36, 0.32)",
    violet: "#a78bfa",
    violetSoft: "rgba(167, 139, 250, 0.14)",
    violetBorder: "rgba(167, 139, 250, 0.32)",
    chipBg: "#172131",
    chipBorder: "#26354c",
    trackBg: "#1a2436",
    cellEmpty: "#161f2d",
    cellEaten: "#121a26",
    cellStroke: "rgba(255, 255, 255, 0.04)",
    levels: ["#161f2d", "#0e4429", "#006d32", "#26a641", "#39d353"],
    snakeColors: ["#38bdf8", "#4cb3f8", "#60a5fa", "#7194f9", "#818cf8", "#6366f1"],
    snakeEye: "#07131f",
    snakeFlash: "#38bdf8",
    glowOpacity: "0.18",
  },
  light: {
    mode: "light",
    bgTop: "#ffffff",
    bgBottom: "#f8fafc",
    surface: "#ffffff",
    surfaceAlt: "#f1f5f9",
    well: "#f8fafc",
    border: "#d8e1ec",
    borderSoft: "#e6edf5",
    sheenTop: "rgba(255, 255, 255, 0.9)",
    gridDot: "#cbd5e1",
    ink: "#0f172a",
    inkSub: "#475569",
    inkMuted: "#64748b",
    sky: "#0284c7",
    skySoft: "rgba(2, 132, 199, 0.09)",
    skyBorder: "rgba(2, 132, 199, 0.28)",
    cobalt: "#2563eb",
    emerald: "#059669",
    emeraldSoft: "rgba(5, 150, 105, 0.09)",
    emeraldBorder: "rgba(5, 150, 105, 0.28)",
    amber: "#d97706",
    amberSoft: "rgba(217, 119, 6, 0.09)",
    amberBorder: "rgba(217, 119, 6, 0.28)",
    violet: "#7c3aed",
    violetSoft: "rgba(124, 58, 237, 0.09)",
    violetBorder: "rgba(124, 58, 237, 0.28)",
    chipBg: "#ffffff",
    chipBorder: "#dce4ef",
    trackBg: "#e2e8f0",
    cellEmpty: "#ebedf0",
    cellEaten: "#e4ebf3",
    cellStroke: "rgba(15, 23, 42, 0.05)",
    levels: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
    snakeColors: ["#0284c7", "#0ea5e9", "#2563eb", "#3b82f6", "#6366f1", "#818cf8"],
    snakeEye: "#ffffff",
    snakeFlash: "#0ea5e9",
    glowOpacity: "0.10",
  },
};

const FONT_SANS =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif';
const FONT_MONO =
  '"SFMono-Regular", ui-monospace, "JetBrains Mono", Menlo, Monaco, Consolas, monospace';

const LEVEL_MAP = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function fmtNum(n) {
  return Number(n || 0).toLocaleString("en-US");
}

function round(n, decimals = 1) {
  const factor = 10 ** decimals;
  return Math.round(n * factor) / factor;
}

function estimateTextWidth(text, fontSize, mono = false) {
  let width = 0;
  for (const ch of String(text)) {
    const code = ch.codePointAt(0);
    if (
      (code >= 0x2e80 && code <= 0x9fff) ||
      (code >= 0xf900 && code <= 0xfaff) ||
      (code >= 0xff00 && code <= 0xffef)
    ) {
      width += fontSize * 1.03;
    } else if (mono) {
      width += fontSize * 0.61;
    } else if ("ilI.,:;|! ".includes(ch)) {
      width += fontSize * 0.34;
    } else if ("MW@#%&".includes(ch)) {
      width += fontSize * 0.82;
    } else if (ch >= "A" && ch <= "Z") {
      width += fontSize * 0.66;
    } else if (ch >= "0" && ch <= "9") {
      width += fontSize * 0.6;
    } else {
      width += fontSize * 0.56;
    }
  }
  return Math.ceil(width);
}

function getAccent(t, name) {
  const map = {
    sky: { fg: t.sky, bg: t.skySoft, bd: t.skyBorder },
    emerald: { fg: t.emerald, bg: t.emeraldSoft, bd: t.emeraldBorder },
    amber: { fg: t.amber, bg: t.amberSoft, bd: t.amberBorder },
    violet: { fg: t.violet, bg: t.violetSoft, bd: t.violetBorder },
  };
  return map[name] || map.sky;
}

async function graphql(query, variables, token) {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "lyy0709-profile-builder",
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) {
    throw new Error(`GitHub GraphQL HTTP ${res.status}`);
  }
  const payload = await res.json();
  if (payload.errors?.length) {
    throw new Error(payload.errors.map((e) => e.message).join("; "));
  }
  return payload.data;
}

async function fetchProfileData(username) {
  const contribToken = process.env.SNAKE_GITHUB_TOKEN || process.env.GITHUB_TOKEN;
  const publicToken = process.env.GITHUB_TOKEN || process.env.SNAKE_GITHUB_TOKEN;
  if (!contribToken) {
    throw new Error("Missing SNAKE_GITHUB_TOKEN or GITHUB_TOKEN");
  }

  const contribQuery = `
    query($login: String!) {
      user(login: $login) {
        login
        name
        bio
        location
        createdAt
        followers { totalCount }
        contributionsCollection {
          totalCommitContributions
          totalPullRequestContributions
          totalIssueContributions
          totalPullRequestReviewContributions
          restrictedContributionsCount
          contributionCalendar {
            totalContributions
            weeks {
              firstDay
              contributionDays {
                date
                weekday
                contributionCount
                contributionLevel
              }
            }
          }
        }
      }
    }
  `;

  const publicQuery = `
    query($login: String!) {
      user(login: $login) {
        publicRepos: repositories(
          first: 100
          ownerAffiliations: OWNER
          privacy: PUBLIC
          orderBy: { field: STARGAZERS, direction: DESC }
        ) {
          totalCount
          nodes {
            name
            isFork
            isArchived
            stargazerCount
            forkCount
            pushedAt
            primaryLanguage { name color }
            languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
              edges {
                size
                node { name color }
              }
            }
          }
        }
      }
    }
  `;

  const contribData = await graphql(contribQuery, { login: username }, contribToken);
  let publicData;
  try {
    publicData = await graphql(publicQuery, { login: username }, contribToken);
  } catch {
    publicData = await graphql(publicQuery, { login: username }, publicToken);
  }

  const user = contribData.user;
  if (!user) throw new Error(`User not found: ${username}`);
  const cc = user.contributionsCollection;
  const weeks = cc.contributionCalendar.weeks;
  const days = [];
  const weeklyTotals = [];

  for (let x = 0; x < weeks.length; x++) {
    let weekSum = 0;
    for (const day of weeks[x].contributionDays) {
      const level = LEVEL_MAP[day.contributionLevel] ?? 0;
      weekSum += day.contributionCount;
      days.push({
        x,
        y: day.weekday,
        date: day.date,
        count: day.contributionCount,
        level,
      });
    }
    weeklyTotals.push({
      x,
      firstDay: weeks[x].firstDay,
      count: weekSum,
    });
  }

  let longestStreak = 0;
  let running = 0;
  let activeDays = 0;
  let peakDay = { date: "", count: 0 };
  for (const d of days) {
    if (d.count > 0) {
      activeDays += 1;
      running += 1;
      if (running > longestStreak) longestStreak = running;
      if (d.count > peakDay.count) peakDay = { date: d.date, count: d.count };
    } else {
      running = 0;
    }
  }

  let currentStreak = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].count > 0) {
      currentStreak += 1;
    } else if (currentStreak === 0 && i === days.length - 1) {
      continue;
    } else {
      break;
    }
  }

  const repoNodes = publicData.user.publicRepos.nodes || [];
  const ownPublic = repoNodes.filter((r) => !r.isFork);
  const ownStars = ownPublic.reduce((sum, r) => sum + r.stargazerCount, 0);
  const ownForks = ownPublic.reduce((sum, r) => sum + r.forkCount, 0);

  const langTotals = new Map();
  for (const repo of ownPublic) {
    for (const edge of repo.languages?.edges || []) {
      const name = edge.node.name;
      const cur = langTotals.get(name) || { name, color: edge.node.color || "#64748b", size: 0 };
      cur.size += edge.size;
      langTotals.set(name, cur);
    }
  }
  const totalBytes = [...langTotals.values()].reduce((s, x) => s + x.size, 0) || 1;
  const languages = [...langTotals.values()]
    .sort((a, b) => b.size - a.size)
    .map((item) => ({
      name: item.name,
      color: item.color,
      size: item.size,
      pct: round((item.size / totalBytes) * 100, 1),
    }));

  const repoMap = new Map(repoNodes.map((r) => [r.name, r]));
  const featured = FEATURED_REPOS.map((spec) => {
    const live = repoMap.get(spec.name);
    return {
      ...spec,
      stars: live?.stargazerCount ?? 0,
      forks: live?.forkCount ?? 0,
      language: live?.primaryLanguage?.name || "Shell",
      languageColor: live?.primaryLanguage?.color || "#89e051",
      pushedAt: live?.pushedAt ? live.pushedAt.slice(0, 7) : "2026-01",
    };
  });

  const lastDate = days.at(-1)?.date || new Date().toISOString().slice(0, 10);

  return {
    username: user.login,
    bio: user.bio || "躺平～",
    location: user.location || "Beijing",
    sinceYear: (user.createdAt || "2020").slice(0, 4),
    followers: user.followers.totalCount,
    publicRepoCount: publicData.user.publicRepos.totalCount,
    ownPublicCount: ownPublic.length,
    ownStars,
    ownForks,
    totalContributions: cc.contributionCalendar.totalContributions,
    commits: cc.totalCommitContributions,
    prs: cc.totalPullRequestContributions,
    issues: cc.totalIssueContributions,
    activeDays,
    longestStreak,
    currentStreak,
    peakDay,
    weeklyTotals,
    calendar: {
      width: weeks.length,
      height: 7,
      cells: days,
    },
    languages,
    featured,
    updatedDate: lastDate,
  };
}

function cardDefs(idPrefix, t) {
  return `
    <linearGradient id="${idPrefix}-bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${t.bgTop}"/>
      <stop offset="100%" stop-color="${t.bgBottom}"/>
    </linearGradient>
    <linearGradient id="${idPrefix}-accent-line" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${t.sky}" stop-opacity="0"/>
      <stop offset="28%" stop-color="${t.sky}" stop-opacity="0.85"/>
      <stop offset="72%" stop-color="${t.emerald}" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="${t.emerald}" stop-opacity="0"/>
    </linearGradient>
  `;
}

function renderHeroSvg(data, t) {
  const W = 840;
  const H = 248;
  const id = `hero-${t.mode}`;

  const domainPills = [
    { label: "AI Infra", color: t.sky },
    { label: "Automation", color: t.emerald },
    { label: "CLI Perf", color: t.amber },
    { label: "Full-Stack", color: t.violet },
  ];

  let pillX = 36;
  const pillsMarkup = domainPills
    .map((pill) => {
      const pw = estimateTextWidth(pill.label, 11.5, true) + 32;
      const out = `
        <g transform="translate(${pillX}, 190)">
          <rect width="${pw}" height="26" rx="13" fill="${t.chipBg}" stroke="${t.chipBorder}" stroke-width="1"/>
          <circle cx="13" cy="13" r="3.2" fill="${pill.color}"/>
          <text x="23" y="16.8" fill="${t.ink}" font-family='${FONT_MONO}' font-size="11.2" font-weight="500">${esc(pill.label)}</text>
        </g>`;
      pillX += pw + 9;
      return out;
    })
    .join("");

  const bioText = data.bio || "躺平～";
  const bioW = estimateTextWidth(bioText, 12, false) + 28;
  const nameWidth = estimateTextWidth(data.username, 42, false);
  const bioX = 36 + nameWidth + 4;

  const metrics = [
    { x: 544, y: 80, val: fmtNum(data.totalContributions), label: "年度贡献 (含私有)", color: t.sky },
    { x: 678, y: 80, val: fmtNum(data.ownStars), label: "原创星标 Stars", color: t.amber },
    { x: 544, y: 142, val: `${data.longestStreak}天`, label: "最长连更 Streak", color: t.emerald },
    { x: 678, y: 142, val: fmtNum(data.followers), label: "关注者 Followers", color: t.violet },
  ];

  const metricsMarkup = metrics
    .map(
      (m) => `
      <text x="${m.x}" y="${m.y + 18}" fill="${m.color}" font-family='${FONT_MONO}' font-size="22" font-weight="700" letter-spacing="-0.4">${esc(m.val)}</text>
      <text x="${m.x}" y="${m.y + 36}" fill="${t.inkMuted}" font-family='${FONT_SANS}' font-size="11">${esc(m.label)}</text>`
    )
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(data.username)} GitHub Profile Hero">
  <style>
    @keyframes pulseRing {
      0% { r: 3.5; opacity: 0.75; }
      70% { r: 10; opacity: 0; }
      100% { r: 10; opacity: 0; }
    }
    @keyframes scanSweep {
      0% { transform: translateX(-90px); opacity: 0; }
      20% { opacity: 0.9; }
      80% { opacity: 0.9; }
      100% { transform: translateX(250px); opacity: 0; }
    }
    .ping { animation: pulseRing 2.6s cubic-bezier(0.2, 0.7, 0.3, 1) infinite; }
    .scan { animation: scanSweep 4.8s ease-in-out infinite; }
    @media (prefers-reduced-motion: reduce) {
      .ping, .scan { animation: none; opacity: 0.4; }
    }
  </style>
  <defs>
    ${cardDefs(id, t)}
    <pattern id="${id}-dots" width="22" height="22" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1" fill="${t.gridDot}" opacity="${t.mode === "dark" ? "0.45" : "0.55"}"/>
    </pattern>
    <linearGradient id="${id}-dot-fade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#fff" stop-opacity="0.06"/>
      <stop offset="42%" stop-color="#fff" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="#fff" stop-opacity="0.95"/>
    </linearGradient>
    <mask id="${id}-dot-mask">
      <rect width="${W}" height="${H}" fill="url(#${id}-dot-fade)"/>
    </mask>
    <radialGradient id="${id}-glow-a" cx="78%" cy="16%" r="48%">
      <stop offset="0%" stop-color="${t.sky}" stop-opacity="${t.glowOpacity}"/>
      <stop offset="100%" stop-color="${t.sky}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="${id}-glow-b" cx="92%" cy="88%" r="42%">
      <stop offset="0%" stop-color="${t.violet}" stop-opacity="${t.mode === "dark" ? "0.14" : "0.07"}"/>
      <stop offset="100%" stop-color="${t.violet}" stop-opacity="0"/>
    </radialGradient>
    <clipPath id="${id}-clip">
      <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="16"/>
    </clipPath>
    <clipPath id="${id}-scan-clip">
      <rect x="544" y="198" width="248" height="3" rx="1.5"/>
    </clipPath>
  </defs>

  <g clip-path="url(#${id}-clip)">
    <rect width="${W}" height="${H}" fill="url(#${id}-bg)"/>
    <rect width="${W}" height="${H}" fill="url(#${id}-dots)" mask="url(#${id}-dot-mask)"/>
    <rect width="${W}" height="${H}" fill="url(#${id}-glow-a)"/>
    <rect width="${W}" height="${H}" fill="url(#${id}-glow-b)"/>
    <rect x="0" y="0" width="${W}" height="2" fill="url(#${id}-accent-line)"/>
  </g>
  <rect x="0.75" y="0.75" width="${W - 1.5}" height="${H - 1.5}" rx="15.5" fill="none" stroke="${t.border}" stroke-width="1.2"/>

  <!-- Left Identity Column -->
  <g>
    <circle cx="42" cy="42" r="3.5" fill="${t.emerald}" class="ping"/>
    <circle cx="42" cy="42" r="3.5" fill="${t.emerald}"/>
    <text x="55" y="45.8" fill="${t.inkMuted}" font-family='${FONT_MONO}' font-size="11" font-weight="600" letter-spacing="1">ONLINE · BEIJING · UTC+8 · SINCE ${esc(data.sinceYear)}</text>

    <text x="36" y="102" fill="${t.ink}" font-family='${FONT_SANS}' font-size="42" font-weight="800" letter-spacing="-1.2">${esc(data.username)}</text>
    <g transform="translate(${bioX}, 75)">
      <rect width="${bioW}" height="25" rx="12.5" fill="${t.skySoft}" stroke="${t.skyBorder}" stroke-width="1"/>
      <text x="${bioW / 2}" y="16.5" text-anchor="middle" fill="${t.sky}" font-family='${FONT_SANS}' font-size="12" font-weight="600">${esc(bioText)}</text>
    </g>

    <text x="36" y="142" fill="${t.ink}" font-family='${FONT_SANS}' font-size="17" font-weight="600">把 AI 工具部署好，把重复工作自动化。</text>
    <text x="36" y="167" fill="${t.inkSub}" font-family='${FONT_SANS}' font-size="12.5">AI 基础设施 · 代理与镜像部署 · CLI 性能调优 · 全栈开发</text>

    ${pillsMarkup}
  </g>

  <!-- Right Live Telemetry Panel -->
  <g>
    <rect x="524" y="26" width="286" height="196" rx="13" fill="${t.surface}" stroke="${t.border}" stroke-width="1.1"/>
    <line x1="538" y1="26.6" x2="796" y2="26.6" stroke="${t.sheenTop}" stroke-width="1"/>

    <text x="544" y="50" fill="${t.inkMuted}" font-family='${FONT_MONO}' font-size="10.2" font-weight="600" letter-spacing="1.1">SYSTEM TELEMETRY</text>
    <g transform="translate(744, 37)">
      <rect width="48" height="18" rx="9" fill="${t.emeraldSoft}" stroke="${t.emeraldBorder}" stroke-width="0.9"/>
      <circle cx="11" cy="9" r="2.5" fill="${t.emerald}"/>
      <text x="19" y="12.5" fill="${t.emerald}" font-family='${FONT_MONO}' font-size="9.5" font-weight="700">LIVE</text>
    </g>

    <line x1="544" y1="64" x2="792" y2="64" stroke="${t.borderSoft}" stroke-width="1"/>
    <line x1="664" y1="76" x2="664" y2="184" stroke="${t.borderSoft}" stroke-width="1"/>
    <line x1="544" y1="130" x2="792" y2="130" stroke="${t.borderSoft}" stroke-width="1"/>

    ${metricsMarkup}

    <rect x="544" y="198" width="248" height="3" rx="1.5" fill="${t.trackBg}"/>
    <g clip-path="url(#${id}-scan-clip)">
      <rect x="544" y="198" width="84" height="3" rx="1.5" fill="url(#${id}-accent-line)" class="scan"/>
    </g>
    <text x="544" y="213" fill="${t.inkMuted}" font-family='${FONT_MONO}' font-size="9.2">SYNCED ${esc(data.updatedDate)}</text>
    <text x="792" y="213" text-anchor="end" fill="${t.inkMuted}" font-family='${FONT_MONO}' font-size="9.2">${data.ownPublicCount} ORIGINAL REPOS</text>
  </g>
</svg>`;
}

function buildSmoothSparkline(points, x0, y0, width, height) {
  if (!points.length) return { line: "", area: "", coords: [] };
  const maxVal = Math.max(...points.map((p) => p.count), 1);
  const coords = points.map((p, i) => {
    const x = x0 + (i / Math.max(points.length - 1, 1)) * width;
    const norm = p.count / maxVal;
    const y = y0 + height - norm * (height - 10) - 4;
    return { x: round(x, 1), y: round(y, 1), count: p.count, firstDay: p.firstDay };
  });

  let d = `M ${coords[0].x} ${coords[0].y}`;
  for (let i = 0; i < coords.length - 1; i++) {
    const p0 = coords[Math.max(i - 1, 0)];
    const p1 = coords[i];
    const p2 = coords[i + 1];
    const p3 = coords[Math.min(i + 2, coords.length - 1)];
    const cp1x = round(p1.x + (p2.x - p0.x) / 6, 1);
    const cp1y = round(Math.min(y0 + height - 2, Math.max(y0 + 2, p1.y + (p2.y - p0.y) / 6)), 1);
    const cp2x = round(p2.x - (p3.x - p1.x) / 6, 1);
    const cp2y = round(Math.min(y0 + height - 2, Math.max(y0 + 2, p2.y - (p3.y - p1.y) / 6)), 1);
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }

  const last = coords.at(-1);
  const first = coords[0];
  const area = `${d} L ${last.x} ${y0 + height} L ${first.x} ${y0 + height} Z`;
  return { line: d, area, coords };
}

function renderActivitySvg(data, t) {
  const W = 412;
  const H = 236;
  const id = `act-${t.mode}`;

  const chartX = 28;
  const chartY = 109;
  const chartW = 356;
  const chartH = 51;
  const spark = buildSmoothSparkline(data.weeklyTotals, chartX, chartY, chartW, chartH);

  let peakCoord = spark.coords[0];
  for (const c of spark.coords) {
    if (c.count >= peakCoord.count) peakCoord = c;
  }
  const latestCoord = spark.coords.at(-1) || { x: chartX + chartW, y: chartY + chartH - 4 };

  const peakLabel = `峰值 ${data.peakDay.count}/天`;
  const peakPillW = estimateTextWidth(peakLabel, 9.8, false) + 16;
  let peakPillX = peakCoord.x - peakPillW / 2;
  if (peakPillX < chartX) peakPillX = chartX;
  if (peakPillX + peakPillW > chartX + chartW) peakPillX = chartX + chartW - peakPillW;
  const totalText = fmtNum(data.totalContributions);
  const totalLabelX = 22 + estimateTextWidth(totalText, 30, true) + 10;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="年度活跃度统计">
  <style>
    @keyframes dotPulse {
      0%, 100% { r: 3.5; opacity: 1; }
      50% { r: 5.5; opacity: 0.45; }
    }
    .live-dot { animation: dotPulse 2.4s ease-in-out infinite; }
    @media (prefers-reduced-motion: reduce) {
      .live-dot { animation: none; }
    }
  </style>
  <defs>
    ${cardDefs(id, t)}
    <linearGradient id="${id}-stroke" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${t.cobalt}"/>
      <stop offset="55%" stop-color="${t.sky}"/>
      <stop offset="100%" stop-color="${t.emerald}"/>
    </linearGradient>
    <linearGradient id="${id}-area" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${t.sky}" stop-opacity="${t.mode === "dark" ? "0.32" : "0.22"}"/>
      <stop offset="100%" stop-color="${t.sky}" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <rect x="0.75" y="0.75" width="${W - 1.5}" height="${H - 1.5}" rx="14" fill="url(#${id}-bg)" stroke="${t.border}" stroke-width="1.2"/>
  <line x1="20" y1="1.3" x2="${W - 20}" y2="1.3" stroke="${t.sheenTop}" stroke-width="1"/>

  <!-- Header -->
  <circle cx="24" cy="26" r="3.5" fill="${t.sky}"/>
  <text x="35" y="29.5" fill="${t.inkMuted}" font-family='${FONT_MONO}' font-size="10.5" font-weight="600" letter-spacing="0.9">ACTIVITY · LAST 365D</text>
  <g transform="translate(316, 16)">
    <rect width="76" height="19" rx="9.5" fill="${t.skySoft}" stroke="${t.skyBorder}" stroke-width="0.9"/>
    <text x="38" y="13" text-anchor="middle" fill="${t.sky}" font-family='${FONT_SANS}' font-size="10" font-weight="600">含私有贡献</text>
  </g>

  <!-- Main KPI -->
  <text x="22" y="68" fill="${t.ink}" font-family='${FONT_MONO}' font-size="30" font-weight="800" letter-spacing="-0.8">${esc(totalText)}</text>
  <text x="${totalLabelX}" y="67" fill="${t.inkMuted}" font-family='${FONT_SANS}' font-size="11.5">近一年总贡献</text>
  <text x="390" y="56" text-anchor="end" fill="${t.inkSub}" font-family='${FONT_MONO}' font-size="10.5">${esc(fmtNum(data.commits))} commits</text>
  <text x="390" y="71" text-anchor="end" fill="${t.inkMuted}" font-family='${FONT_MONO}' font-size="10.5">${esc(fmtNum(data.prs))} PRs · ${esc(fmtNum(data.issues))} issues</text>

  <!-- Sparkline Well -->
  <rect x="20" y="84" width="372" height="82" rx="10" fill="${t.well}" stroke="${t.borderSoft}" stroke-width="1"/>
  <line x1="${chartX}" y1="${chartY + 16}" x2="${chartX + chartW}" y2="${chartY + 16}" stroke="${t.borderSoft}" stroke-width="0.8" stroke-dasharray="3 3"/>
  <line x1="${chartX}" y1="${chartY + 34}" x2="${chartX + chartW}" y2="${chartY + 34}" stroke="${t.borderSoft}" stroke-width="0.8" stroke-dasharray="3 3"/>
  <path d="${spark.area}" fill="url(#${id}-area)"/>
  <path d="${spark.line}" fill="none" stroke="url(#${id}-stroke)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>

  <!-- Peak Annotation -->
  <line x1="${peakCoord.x}" y1="${peakCoord.y}" x2="${peakCoord.x}" y2="${chartY + chartH}" stroke="${t.amber}" stroke-width="0.9" stroke-dasharray="2 2" opacity="0.65"/>
  <circle cx="${peakCoord.x}" cy="${peakCoord.y}" r="3.2" fill="${t.amber}"/>
  <g transform="translate(${round(peakPillX, 1)}, 88)">
    <rect width="${peakPillW}" height="16.5" rx="8.25" fill="${t.amberSoft}" stroke="${t.amberBorder}" stroke-width="0.8"/>
    <text x="${peakPillW / 2}" y="11.4" text-anchor="middle" fill="${t.amber}" font-family='${FONT_SANS}' font-size="9.5" font-weight="600">${esc(peakLabel)}</text>
  </g>

  <!-- Latest Pulse -->
  <circle cx="${latestCoord.x}" cy="${latestCoord.y}" r="4.5" fill="${t.emerald}" opacity="0.35" class="live-dot"/>
  <circle cx="${latestCoord.x}" cy="${latestCoord.y}" r="3" fill="${t.emerald}"/>

  <!-- Bottom 3-Column Metrics -->
  <line x1="142" y1="181" x2="142" y2="218" stroke="${t.borderSoft}" stroke-width="1"/>
  <line x1="270" y1="181" x2="270" y2="218" stroke="${t.borderSoft}" stroke-width="1"/>

  <text x="24" y="199" fill="${t.ink}" font-family='${FONT_MONO}' font-size="16" font-weight="700">${data.activeDays} 天</text>
  <text x="24" y="216" fill="${t.inkMuted}" font-family='${FONT_SANS}' font-size="10.5">年度活跃天数</text>

  <text x="158" y="199" fill="${t.emerald}" font-family='${FONT_MONO}' font-size="16" font-weight="700">${data.longestStreak} 天</text>
  <text x="158" y="216" fill="${t.inkMuted}" font-family='${FONT_SANS}' font-size="10.5">最长连续贡献</text>

  <text x="286" y="199" fill="${t.sky}" font-family='${FONT_MONO}' font-size="16" font-weight="700">${data.currentStreak} 天</text>
  <text x="286" y="216" fill="${t.inkMuted}" font-family='${FONT_SANS}' font-size="10.5">当前连续天数</text>
</svg>`;
}

function renderLanguagesSvg(data, t) {
  const W = 412;
  const H = 236;
  const id = `lang-${t.mode}`;

  const top6 = data.languages.slice(0, 6);
  const usedPct = top6.reduce((s, l) => s + l.pct, 0);
  const otherPct = round(Math.max(0, 100 - usedPct), 1);
  const barItems = otherPct >= 0.4
    ? [...top6, { name: "Other", color: t.inkMuted, pct: otherPct }]
    : top6;

  const barX = 22;
  const barY = 48;
  const barW = 368;
  const barH = 11;
  const gap = 2.2;
  const usableW = barW - gap * Math.max(barItems.length - 1, 0);
  let curX = barX;
  const barRects = barItems
    .map((item, idx) => {
      const segW = idx === barItems.length - 1
        ? Math.max(3, barX + barW - curX)
        : Math.max(3, round((item.pct / 100) * usableW, 1));
      const rect = `<rect x="${round(curX, 1)}" y="${barY}" width="${round(segW, 1)}" height="${barH}" fill="${item.color}"/>`;
      curX += segW + gap;
      return rect;
    })
    .join("");

  const maxPct = Math.max(...top6.map((l) => l.pct), 1);
  const rowsMarkup = top6
    .map((lang, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const gx = col === 0 ? 22 : 216;
      const gy = 78 + row * 31;
      const trackW = 174;
      const fillW = Math.max(4, round((lang.pct / maxPct) * trackW, 1));
      return `
        <g transform="translate(${gx}, ${gy})">
          <circle cx="5" cy="6" r="4" fill="${lang.color}"/>
          <text x="15" y="9.8" fill="${t.ink}" font-family='${FONT_SANS}' font-size="12" font-weight="600">${esc(lang.name)}</text>
          <text x="${trackW}" y="9.8" text-anchor="end" fill="${t.inkSub}" font-family='${FONT_MONO}' font-size="11">${lang.pct.toFixed(1)}%</text>
          <rect x="0" y="16" width="${trackW}" height="3.2" rx="1.6" fill="${t.trackBg}"/>
          <rect x="0" y="16" width="${fillW}" height="3.2" rx="1.6" fill="${lang.color}" opacity="0.88"/>
        </g>`;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="公开仓库语言分布">
  <defs>
    ${cardDefs(id, t)}
    <clipPath id="${id}-bar-clip">
      <rect x="${barX}" y="${barY}" width="${barW}" height="${barH}" rx="5.5"/>
    </clipPath>
  </defs>

  <rect x="0.75" y="0.75" width="${W - 1.5}" height="${H - 1.5}" rx="14" fill="url(#${id}-bg)" stroke="${t.border}" stroke-width="1.2"/>
  <line x1="20" y1="1.3" x2="${W - 20}" y2="1.3" stroke="${t.sheenTop}" stroke-width="1"/>

  <!-- Header -->
  <circle cx="24" cy="26" r="3.5" fill="${t.emerald}"/>
  <text x="35" y="29.5" fill="${t.inkMuted}" font-family='${FONT_MONO}' font-size="10.5" font-weight="600" letter-spacing="0.9">LANGUAGE DNA</text>
  <text x="390" y="29.5" text-anchor="end" fill="${t.inkMuted}" font-family='${FONT_MONO}' font-size="10">PUBLIC ORIGINAL</text>

  <!-- Proportion Bar -->
  <rect x="${barX}" y="${barY}" width="${barW}" height="${barH}" rx="5.5" fill="${t.trackBg}"/>
  <g clip-path="url(#${id}-bar-clip)">
    ${barRects}
  </g>

  <!-- 2x3 Language Matrix -->
  ${rowsMarkup}

  <!-- Bottom Footprint -->
  <line x1="22" y1="173" x2="390" y2="173" stroke="${t.borderSoft}" stroke-width="1"/>
  <line x1="142" y1="183" x2="142" y2="218" stroke="${t.borderSoft}" stroke-width="1"/>
  <line x1="270" y1="183" x2="270" y2="218" stroke="${t.borderSoft}" stroke-width="1"/>

  <text x="24" y="199" fill="${t.amber}" font-family='${FONT_MONO}' font-size="16" font-weight="700">${esc(fmtNum(data.ownStars))}★</text>
  <text x="24" y="216" fill="${t.inkMuted}" font-family='${FONT_SANS}' font-size="10.5">原创总星标</text>

  <text x="158" y="199" fill="${t.ink}" font-family='${FONT_MONO}' font-size="16" font-weight="700">${esc(fmtNum(data.ownForks))}</text>
  <text x="158" y="216" fill="${t.inkMuted}" font-family='${FONT_SANS}' font-size="10.5">原创总 Fork</text>

  <text x="286" y="199" fill="${t.ink}" font-family='${FONT_MONO}' font-size="16" font-weight="700">${data.ownPublicCount} / ${data.publicRepoCount}</text>
  <text x="286" y="216" fill="${t.inkMuted}" font-family='${FONT_SANS}' font-size="10.5">原创 / 公开仓库</text>
</svg>`;
}

function renderRepoCardSvg(repo, t) {
  const W = 412;
  const H = 156;
  const id = `card-${repo.slug}-${t.mode}`;
  const accent = getAccent(t, repo.accent);

  const catW = estimateTextWidth(repo.category, 9.5, true) + 18;
  const starStr = fmtNum(repo.stars);
  const forkStr = fmtNum(repo.forks);

  const starTextW = estimateTextWidth(starStr, 11.5, true);
  const forkTextW = estimateTextWidth(forkStr, 11.5, true);
  const showFork = repo.forks > 0;

  let statsMarkup = "";
  if (showFork) {
    const forkGroupX = W - 22 - forkTextW - 15;
    const starGroupX = forkGroupX - 14 - starTextW - 16;
    statsMarkup = `
      <g transform="translate(${starGroupX}, 17)">
        <path d="M6.5 1.2l1.62 3.28 3.62.53-2.62 2.55.62 3.6L6.5 9.46l-3.24 1.7.62-3.6L1.26 5.01l3.62-.53z" fill="${t.amber}"/>
        <text x="15.5" y="10.5" fill="${t.ink}" font-family='${FONT_MONO}' font-size="11.5" font-weight="700">${esc(starStr)}</text>
      </g>
      <g transform="translate(${forkGroupX}, 17)">
        <path d="M4.2 1.8a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4zm0 2.4a.7.7 0 1 1 0-1.4.7.7 0 0 1 0 1.4zm5.6-2.4a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4zm0 2.4a.7.7 0 1 1 0-1.4.7.7 0 0 1 0 1.4zM7 8.4a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4zm0 2.4a.7.7 0 1 1 0-1.4.7.7 0 0 1 0 1.4zM4.7 5.1v.9c0 .9.7 1.6 1.6 1.6h1.4c.9 0 1.6-.7 1.6-1.6v-.9h1v.9a2.6 2.6 0 0 1-2.6 2.6H7.5v.3h-1v-.3h-.2a2.6 2.6 0 0 1-2.6-2.6v-.9h1z" fill="${t.inkMuted}"/>
        <text x="14.5" y="10.5" fill="${t.inkSub}" font-family='${FONT_MONO}' font-size="11.5" font-weight="600">${esc(forkStr)}</text>
      </g>`;
  } else {
    const starGroupX = W - 22 - starTextW - 16;
    statsMarkup = `
      <g transform="translate(${starGroupX}, 17)">
        <path d="M6.5 1.2l1.62 3.28 3.62.53-2.62 2.55.62 3.6L6.5 9.46l-3.24 1.7.62-3.6L1.26 5.01l3.62-.53z" fill="${t.amber}"/>
        <text x="15.5" y="10.5" fill="${t.ink}" font-family='${FONT_MONO}' font-size="11.5" font-weight="700">${esc(starStr)}</text>
      </g>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(repo.name)}">
  <defs>
    ${cardDefs(id, t)}
    <radialGradient id="${id}-glow" cx="8%" cy="10%" r="55%">
      <stop offset="0%" stop-color="${accent.fg}" stop-opacity="${t.mode === "dark" ? "0.11" : "0.06"}"/>
      <stop offset="100%" stop-color="${accent.fg}" stop-opacity="0"/>
    </radialGradient>
    <clipPath id="${id}-clip">
      <rect x="0.75" y="0.75" width="${W - 1.5}" height="${H - 1.5}" rx="14"/>
    </clipPath>
  </defs>

  <g clip-path="url(#${id}-clip)">
    <rect width="${W}" height="${H}" fill="url(#${id}-bg)"/>
    <rect width="${W}" height="${H}" fill="url(#${id}-glow)"/>
  </g>
  <rect x="0.75" y="0.75" width="${W - 1.5}" height="${H - 1.5}" rx="14" fill="none" stroke="${t.border}" stroke-width="1.2"/>
  <line x1="20" y1="1.3" x2="${W - 20}" y2="1.3" stroke="${t.sheenTop}" stroke-width="1"/>

  <!-- Top Row: Category + Stars/Forks -->
  <g transform="translate(22, 16)">
    <rect width="${catW}" height="19" rx="9.5" fill="${accent.bg}" stroke="${accent.bd}" stroke-width="0.9"/>
    <text x="${catW / 2}" y="12.8" text-anchor="middle" fill="${accent.fg}" font-family='${FONT_MONO}' font-size="9.5" font-weight="700" letter-spacing="0.6">${esc(repo.category)}</text>
  </g>
  ${statsMarkup}

  <!-- Repo Title -->
  <rect x="22" y="47" width="3.2" height="19" rx="1.6" fill="${repo.languageColor}"/>
  <text x="33" y="61.5" fill="${t.ink}" font-family='${FONT_MONO}' font-size="15.5" font-weight="700" letter-spacing="-0.3">${esc(repo.name)}</text>
  <g transform="translate(378, 49)" opacity="0.7">
    <path d="M2 10L10 2M10 2H4.2M10 2V7.8" fill="none" stroke="${t.inkMuted}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </g>

  <!-- Description -->
  <text x="22" y="88" fill="${t.inkSub}" font-family='${FONT_SANS}' font-size="12.2">${esc(repo.lines[0])}</text>
  <text x="22" y="107" fill="${t.inkSub}" font-family='${FONT_SANS}' font-size="12.2">${esc(repo.lines[1])}</text>

  <!-- Footer -->
  <line x1="22" y1="122" x2="390" y2="122" stroke="${t.borderSoft}" stroke-width="1"/>
  <circle cx="27" cy="138" r="4" fill="${repo.languageColor}"/>
  <text x="37" y="141.8" fill="${t.ink}" font-family='${FONT_MONO}' font-size="11" font-weight="600">${esc(repo.language)}</text>
  <text x="${37 + estimateTextWidth(repo.language, 11, true) + 8}" y="141.8" fill="${t.inkMuted}" font-family='${FONT_MONO}' font-size="11">· ${esc(repo.secondaryTag)}</text>
  <text x="390" y="141.8" text-anchor="end" fill="${t.inkMuted}" font-family='${FONT_MONO}' font-size="10.2">ACTIVE ${esc(repo.pushedAt)}</text>
</svg>`;
}

function renderTechStackSvg(t) {
  const W = 840;
  const H = 204;
  const id = `stack-${t.mode}`;

  const icons = {
    code: (c) => `<path d="M5.5 4L2 7.5 5.5 11M10.5 4L14 7.5 10.5 11M8.8 2.8L7.2 12.2" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`,
    server: (c) => `<rect x="2" y="2.5" width="12" height="4.2" rx="1.2" fill="none" stroke="${c}" stroke-width="1.4"/><rect x="2" y="9" width="12" height="4.2" rx="1.2" fill="none" stroke="${c}" stroke-width="1.4"/><circle cx="4.6" cy="4.6" r="0.8" fill="${c}"/><circle cx="4.6" cy="11.1" r="0.8" fill="${c}"/>`,
    spark: (c) => `<path d="M8.5 1.8L3.2 8.6h4.4L6.8 14.2l6-7.2H8.4z" fill="none" stroke="${c}" stroke-width="1.4" stroke-linejoin="round"/>`,
  };

  const panelW = 258;
  const panelH = 164;
  const panelXs = [18, 291, 564];

  const panelsMarkup = TECH_GROUPS.map((group, idx) => {
    const px = panelXs[idx];
    const accent = getAccent(t, group.accent);

    let cx = 14;
    let cy = 62;
    const maxRowW = panelW - 28;
    const chipsMarkup = group.items
      .map((item) => {
        const cw = estimateTextWidth(item.label, 10.6, true) + 23;
        if (cx > 14 && cx - 14 + cw > maxRowW) {
          cx = 14;
          cy += 31;
        }
        const out = `
          <g transform="translate(${cx}, ${cy})">
            <rect width="${cw}" height="24" rx="7" fill="${t.chipBg}" stroke="${t.chipBorder}" stroke-width="1"/>
            <circle cx="10" cy="12" r="2.9" fill="${item.color}"/>
            <text x="18" y="15.5" fill="${t.ink}" font-family='${FONT_MONO}' font-size="10.5" font-weight="500">${esc(item.label)}</text>
          </g>`;
        cx += cw + 6;
        return out;
      })
      .join("");

    return `
      <g transform="translate(${px}, 20)">
        <rect width="${panelW}" height="${panelH}" rx="12" fill="${t.surface}" stroke="${t.borderSoft}" stroke-width="1.1"/>
        <g transform="translate(14, 15)">
          <rect width="26" height="26" rx="7" fill="${accent.bg}" stroke="${accent.bd}" stroke-width="0.9"/>
          <g transform="translate(5, 5.2)">${icons[group.icon](accent.fg)}</g>
        </g>
        <text x="49" y="25.5" fill="${t.ink}" font-family='${FONT_MONO}' font-size="10.8" font-weight="700" letter-spacing="0.7">${esc(group.eyebrow)}</text>
        <text x="49" y="40" fill="${t.inkMuted}" font-family='${FONT_SANS}' font-size="10.8">${esc(group.subtitle)}</text>
        <line x1="14" y1="51" x2="${panelW - 14}" y2="51" stroke="${t.borderSoft}" stroke-width="1"/>
        ${chipsMarkup}
      </g>`;
  }).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="核心技术栈矩阵">
  <defs>
    ${cardDefs(id, t)}
  </defs>
  <rect x="0.75" y="0.75" width="${W - 1.5}" height="${H - 1.5}" rx="16" fill="url(#${id}-bg)" stroke="${t.border}" stroke-width="1.2"/>
  <line x1="24" y1="1.3" x2="${W - 24}" y2="1.3" stroke="${t.sheenTop}" stroke-width="1"/>
  ${panelsMarkup}
</svg>`;
}

function renderSectionHeaderSvg({ idKey, eyebrow, title, rightLabel, accentName }, t) {
  const W = 840;
  const H = 38;
  const accent = getAccent(t, accentName);
  const badgeW = estimateTextWidth(eyebrow, 10, true) + 18;
  const titleX = badgeW + 14;
  const titleW = estimateTextWidth(title, 15.5, false);
  const rightW = Math.ceil(rightLabel.length * 7.5) + 8;
  const lineStart = titleX + titleW + 16;
  const lineEnd = W - rightW - 14;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(title)}">
  <g transform="translate(0, 9)">
    <rect width="${badgeW}" height="20" rx="10" fill="${accent.bg}" stroke="${accent.bd}" stroke-width="0.9"/>
    <text x="${badgeW / 2}" y="13.5" text-anchor="middle" fill="${accent.fg}" font-family='${FONT_MONO}' font-size="9.8" font-weight="700" letter-spacing="0.8">${esc(eyebrow)}</text>
  </g>
  <text x="${titleX}" y="24.5" fill="${t.ink}" font-family='${FONT_SANS}' font-size="15.5" font-weight="700">${esc(title)}</text>
  ${lineEnd > lineStart + 16 ? `<line x1="${lineStart}" y1="19.5" x2="${lineEnd}" y2="19.5" stroke="${t.border}" stroke-width="1"/>` : ""}
  <text x="${W}" y="23" text-anchor="end" fill="${t.inkMuted}" font-family='${FONT_MONO}' font-size="10" font-weight="600" letter-spacing="0.7">${esc(rightLabel)}</text>
</svg>`;
}

function renderFooterSvg(t) {
  const W = 840;
  const H = 48;
  const id = `footer-${t.mode}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Profile Footer">
  <defs>
    ${cardDefs(id, t)}
  </defs>
  <line x1="0" y1="1" x2="${W}" y2="1" stroke="url(#${id}-accent-line)" stroke-width="1.2"/>
  <text x="2" y="29" fill="${t.inkMuted}" font-family='${FONT_MONO}' font-size="10.2" letter-spacing="0.7">lyy0709 · BEIJING · BUILD ONCE, AUTOMATE FOREVER</text>
  <circle cx="${W - 2 - Math.ceil("ALL SYSTEMS NOMINAL".length * 7.7) - 10}" cy="25.5" r="3" fill="${t.emerald}"/>
  <text x="${W - 2}" y="29" text-anchor="end" fill="${t.inkMuted}" font-family='${FONT_MONO}' font-size="10.2" letter-spacing="0.7">ALL SYSTEMS NOMINAL</text>
</svg>`;
}

/**
 * Guaranteed collision-free Hamiltonian cycle with safe empty-cell shortcuts.
 */
function planSnakeRoute(calendar) {
  const width = calendar.width % 2 === 0 ? calendar.width : calendar.width + 1;
  const height = calendar.height;
  const cycle = [];

  for (let y = 0; y < height; y++) cycle.push({ x: 0, y });
  for (let x = 1; x < width; x++) {
    if (x % 2 === 1) {
      for (let y = height - 1; y >= 1; y--) cycle.push({ x, y });
    } else {
      for (let y = 1; y < height; y++) cycle.push({ x, y });
    }
  }
  for (let x = width - 1; x >= 1; x--) cycle.push({ x, y: 0 });

  const key = (p) => `${p.x},${p.y}`;
  const indices = new Map(cycle.map((p, idx) => [key(p), idx]));
  const size = cycle.length;
  const dist = (a, b) => (b - a + size) % size;

  const start = indices.get("0,5");
  const segCount = 6;
  let body = Array.from({ length: segCount }, (_, i) => (start - i + size) % size);
  const initial = [...body];

  const food = new Map();
  for (const cell of calendar.cells) {
    if (cell.count > 0) {
      const idx = indices.get(key(cell));
      if (idx === undefined) throw new Error(`Cell out of cycle bounds: ${key(cell)}`);
      food.set(idx, cell);
    }
  }

  const frames = [body.map((idx) => cycle[idx])];
  const bites = new Map();

  while (food.size > 0 || body.some((idx, part) => idx !== initial[part])) {
    const head = body[0];
    let next = (head + 1) % size;
    if (food.size > 0) {
      const target = Math.min(...[...food.keys()].map((idx) => dist(head, idx)));
      const tailGap = dist(head, body.at(-1));
      const { x, y } = cycle[head];
      const neighbors = [
        { x: x + 1, y },
        { x: x - 1, y },
        { x, y: y + 1 },
        { x, y: y - 1 },
      ];
      for (const nb of neighbors) {
        const cand = indices.get(key(nb));
        if (cand === undefined) continue;
        const adv = dist(head, cand);
        if (adv > dist(head, next) && adv <= target && adv < tailGap) {
          next = cand;
        }
      }
    }
    body = [next, ...body.slice(0, -1)];
    frames.push(body.map((idx) => cycle[idx]));
    if (food.has(next)) {
      bites.set(key(food.get(next)), frames.length - 1);
      food.delete(next);
    }
    if (frames.length > size * 2) {
      throw new Error("Snake route exceeded cycle safety bound");
    }
  }

  // Self-verify orthogonality and non-overlap on every frame
  for (let f = 0; f < frames.length; f++) {
    const seen = new Set();
    for (const seg of frames[f]) {
      const k = key(seg);
      if (seen.has(k)) throw new Error(`Snake self-collision at frame ${f}`);
      seen.add(k);
    }
    if (f > 0) {
      const prev = frames[f - 1][0];
      const curr = frames[f][0];
      const stepDist = Math.abs(curr.x - prev.x) + Math.abs(curr.y - prev.y);
      if (stepDist !== 1) throw new Error(`Non-orthogonal snake move at frame ${f}`);
    }
  }

  return { frames, bites, width, height, segCount };
}

function renderSnakeSvg(data, t) {
  const W = 840;
  const H = 248;
  const id = `snake-${t.mode}`;
  const route = planSnakeRoute(data.calendar);

  const stageX = 22;
  const stageY = 50;
  const stageW = 796;
  const stageH = 148;

  const gridX = 64;
  const gridY = 82;
  const step = 13.6;
  const cellSize = 10.6;

  // Month labels above columns
  let lastMonth = -1;
  let lastMonthX = -100;
  const monthLabels = [];
  for (let w = 0; w < data.calendar.width; w++) {
    const cell = data.calendar.cells.find((c) => c.x === w && c.y === 0) || data.calendar.cells.find((c) => c.x === w);
    if (!cell) continue;
    const m = Number(cell.date.slice(5, 7)) - 1;
    const x = round(gridX + w * step, 1);
    if (m !== lastMonth && x - lastMonthX >= 34) {
      monthLabels.push(
        `<text x="${x}" y="71" fill="${t.inkMuted}" font-family='${FONT_MONO}' font-size="9.5">${MONTH_NAMES[m]}</text>`
      );
      lastMonth = m;
      lastMonthX = x;
    }
  }

  const weekdayLabels = [
    { row: 1, label: "Mon" },
    { row: 3, label: "Wed" },
    { row: 5, label: "Fri" },
  ]
    .map(
      (d) =>
        `<text x="34" y="${round(gridY + d.row * step + 8.5, 1)}" fill="${t.inkMuted}" font-family='${FONT_MONO}' font-size="9.5">${d.label}</text>`
    )
    .join("");

  const totalFrames = route.frames.length - 1;
  const startPct = 4;
  const endPct = 92;
  const activeSpan = endPct - startPct;
  const durationSec = round(Math.max(18, Math.min(28, totalFrames * 0.08)), 1);

  const framePct = (f) => round(startPct + (f / Math.max(totalFrames, 1)) * activeSpan, 3);

  // Build tile keyframes (only for active cells that get eaten)
  const cellRules = [];
  const cellElements = [];
  let activeIdx = 0;

  for (const cell of data.calendar.cells) {
    const cx = round(gridX + cell.x * step, 1);
    const cy = round(gridY + cell.y * step, 1);
    const baseFill = t.levels[cell.level];
    const k = `${cell.x},${cell.y}`;
    const biteFrame = route.bites.get(k);

    if (biteFrame !== undefined) {
      const cls = `e${activeIdx++}`;
      const pEat = framePct(biteFrame);
      const pBefore = round(Math.max(0, pEat - 0.12), 3);
      const pFlash = round(Math.min(97.5, pEat + 0.55), 3);
      const pGone = round(Math.min(98.2, pEat + 1.1), 3);
      cellRules.push(
        `@keyframes ${cls}{0%,${pBefore}%{fill:${baseFill}}${pEat}%,${pFlash}%{fill:${t.snakeFlash}}${pGone}%,98.2%{fill:${t.cellEaten}}100%{fill:${baseFill}}}.${cls}{fill:${baseFill};animation:${cls} ${durationSec}s linear infinite}`
      );
      cellElements.push(
        `<rect class="c ${cls}" x="${cx}" y="${cy}" width="${cellSize}" height="${cellSize}" rx="2.4" data-date="${cell.date}" data-count="${cell.count}" data-level="${cell.level}"/>`
      );
    } else {
      cellElements.push(
        `<rect class="c" x="${cx}" y="${cy}" width="${cellSize}" height="${cellSize}" rx="2.4" fill="${baseFill}" data-date="${cell.date}" data-count="${cell.count}" data-level="${cell.level}"/>`
      );
    }
  }

  // Build simplified linear snake segment keyframes (omit collinear intermediate frames!)
  const segSizes = [11.0, 10.0, 9.2, 8.4, 7.4, 6.2];
  const segOpacities = [1, 0.96, 0.9, 0.82, 0.72, 0.58];
  const snakeRules = [];
  const snakeElements = [];

  for (let s = route.segCount - 1; s >= 0; s--) {
    const size = segSizes[s];
    const offset = (cellSize - size) / 2;
    const pts = route.frames.map((frame) => ({
      x: round(gridX + frame[s].x * step + offset, 1),
      y: round(gridY + frame[s].y * step + offset, 1),
    }));

    const keyIndices = [0];
    for (let f = 1; f < pts.length - 1; f++) {
      const dx1 = pts[f].x - pts[f - 1].x;
      const dy1 = pts[f].y - pts[f - 1].y;
      const dx2 = pts[f + 1].x - pts[f].x;
      const dy2 = pts[f + 1].y - pts[f].y;
      if (Math.abs(dx1 - dx2) > 0.05 || Math.abs(dy1 - dy2) > 0.05) {
        keyIndices.push(f);
      }
    }
    keyIndices.push(pts.length - 1);

    const stops = [
      `0%,${startPct}%{transform:translate(${pts[0].x}px,${pts[0].y}px)}`,
    ];
    for (let i = 1; i < keyIndices.length; i++) {
      const f = keyIndices[i];
      stops.push(`${framePct(f)}%{transform:translate(${pts[f].x}px,${pts[f].y}px)}`);
    }
    stops.push(`100%{transform:translate(${pts.at(-1).x}px,${pts.at(-1).y}px)}`);

    snakeRules.push(
      `@keyframes sk${s}{${stops.join("")}}.sk${s}{transform:translate(${pts[0].x}px,${pts[0].y}px);animation:sk${s} ${durationSec}s linear infinite}`
    );

    const color = t.snakeColors[s];
    const rx = round(size * 0.32, 1);
    if (s === 0) {
      snakeElements.push(`
        <g class="sk0">
          <rect x="-2" y="-2" width="${round(size + 4, 1)}" height="${round(size + 4, 1)}" rx="5" fill="${color}" opacity="0.36" filter="url(#${id}-glow)"/>
          <rect width="${size}" height="${size}" rx="${rx}" fill="${color}"/>
          <circle cx="3.6" cy="4.2" r="1.15" fill="${t.snakeEye}"/>
          <circle cx="7.4" cy="4.2" r="1.15" fill="${t.snakeEye}"/>
        </g>`);
    } else {
      snakeElements.push(
        `<rect class="sk${s}" width="${size}" height="${size}" rx="${rx}" fill="${color}" opacity="${segOpacities[s]}"/>`
      );
    }
  }

  // Progress bar keyframes synced with active eating phase
  const progressWidth = 216;
  const progressRule = `@keyframes prog{0%,${startPct}%{transform:scaleX(0.02)}${endPct}%,97.5%{transform:scaleX(1)}100%{transform:scaleX(0.02)}}.prog-fill{transform-origin:0 0;animation:prog ${durationSec}s linear infinite}`;

  const legendSquares = t.levels
    .map(
      (col, idx) =>
        `<rect x="${idx * 13}" y="0" width="9.5" height="9.5" rx="2.2" fill="${col}" stroke="${t.cellStroke}" stroke-width="0.8"/>`
    )
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="lyy0709 最近一年 GitHub 贡献贪吃蛇动画">
  <style>
    .c { stroke: ${t.cellStroke}; stroke-width: 0.8; shape-rendering: geometricPrecision; }
    ${cellRules.join("\n    ")}
    ${snakeRules.join("\n    ")}
    ${progressRule}
    @media (prefers-reduced-motion: reduce) {
      .c, .sk0, .sk1, .sk2, .sk3, .sk4, .sk5, .prog-fill { animation: none !important; }
    }
  </style>
  <defs>
    ${cardDefs(id, t)}
    <filter id="${id}-glow" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="2.6"/>
    </filter>
    <linearGradient id="${id}-prog" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${t.sky}"/>
      <stop offset="100%" stop-color="${t.emerald}"/>
    </linearGradient>
    <clipPath id="${id}-prog-clip">
      <rect x="0" y="0" width="${progressWidth}" height="5" rx="2.5"/>
    </clipPath>
  </defs>

  <!-- Outer Card -->
  <rect x="0.75" y="0.75" width="${W - 1.5}" height="${H - 1.5}" rx="16" fill="url(#${id}-bg)" stroke="${t.border}" stroke-width="1.2"/>
  <line x1="24" y1="1.3" x2="${W - 24}" y2="1.3" stroke="${t.sheenTop}" stroke-width="1"/>

  <!-- Top Telemetry Header -->
  <circle cx="30" cy="27" r="3.6" fill="${t.sky}"/>
  <text x="41" y="30.5" fill="${t.ink}" font-family='${FONT_MONO}' font-size="11" font-weight="700" letter-spacing="0.9">CONTRIBUTION SNAKE · 365D LIVE GRAPH</text>
  <text x="816" y="30.5" text-anchor="end" fill="${t.inkSub}" font-family='${FONT_MONO}' font-size="10.5">${esc(fmtNum(data.totalContributions))} CONTRIBUTIONS · ${data.activeDays} ACTIVE DAYS · PEAK ${data.peakDay.count}/D</text>

  <!-- Recessed Contribution Stage -->
  <rect x="${stageX}" y="${stageY}" width="${stageW}" height="${stageH}" rx="11" fill="${t.well}" stroke="${t.borderSoft}" stroke-width="1"/>
  ${monthLabels.join("\n  ")}
  ${weekdayLabels}
  <g>
    ${cellElements.join("\n    ")}
  </g>
  <g>
    ${snakeElements.join("\n    ")}
  </g>

  <!-- Bottom Progress & Legend -->
  <text x="24" y="226" fill="${t.inkMuted}" font-family='${FONT_MONO}' font-size="9.8" font-weight="600" letter-spacing="0.8">CYCLE PROGRESS</text>
  <g transform="translate(124, 220)">
    <rect width="${progressWidth}" height="5" rx="2.5" fill="${t.trackBg}"/>
    <g clip-path="url(#${id}-prog-clip)">
      <rect class="prog-fill" width="${progressWidth}" height="5" rx="2.5" fill="url(#${id}-prog)"/>
    </g>
  </g>

  <g transform="translate(550, 217)">
    <text x="0" y="8.5" fill="${t.inkMuted}" font-family='${FONT_MONO}' font-size="9.5">Less</text>
    <g transform="translate(30, 0)">
      ${legendSquares}
    </g>
    <text x="102" y="8.5" fill="${t.inkMuted}" font-family='${FONT_MONO}' font-size="9.5">More</text>
    <text x="266" y="8.5" text-anchor="end" fill="${t.inkMuted}" font-family='${FONT_MONO}' font-size="9.5">UPDATED ${esc(data.updatedDate)}</text>
  </g>
</svg>`;
}

function parseArgs(argv) {
  const args = { outputDir: null, staticDir: null, snapshot: null, saveSnapshot: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--output-dir") args.outputDir = argv[++i];
    else if (a === "--static-dir") args.staticDir = argv[++i];
    else if (a === "--snapshot") args.snapshot = argv[++i];
    else if (a === "--save-snapshot") args.saveSnapshot = argv[++i];
  }
  return args;
}

async function writeStaticAssets(staticDir) {
  await mkdir(staticDir, { recursive: true });
  const sections = [
    {
      idKey: "telemetry",
      eyebrow: "TELEMETRY",
      title: "工程数据与语言分布",
      rightLabel: "LIVE · DAILY SYNC",
      accentName: "sky",
    },
    {
      idKey: "projects",
      eyebrow: "FEATURED WORK",
      title: "精选开源项目",
      rightLabel: "CLICK CARD TO EXPLORE",
      accentName: "emerald",
    },
    {
      idKey: "stack",
      eyebrow: "TECH MATRIX",
      title: "核心技术栈",
      rightLabel: "SYSTEMS · INFRA · AI",
      accentName: "amber",
    },
    {
      idKey: "snake",
      eyebrow: "ACTIVITY GRAPH",
      title: "年度贡献轨迹",
      rightLabel: "INCLUDES PRIVATE TOTALS",
      accentName: "violet",
    },
  ];

  for (const mode of ["dark", "light"]) {
    const t = THEMES[mode];
    await writeFile(path.join(staticDir, `stack-${mode}.svg`), renderTechStackSvg(t), "utf8");
    await writeFile(path.join(staticDir, `footer-${mode}.svg`), renderFooterSvg(t), "utf8");
    for (const sec of sections) {
      await writeFile(
        path.join(staticDir, `section-${sec.idKey}-${mode}.svg`),
        renderSectionHeaderSvg(sec, t),
        "utf8"
      );
    }
  }
  console.log(`Generated static profile assets in ${staticDir}`);
}

async function writeDynamicAssets(outputDir, data) {
  await mkdir(outputDir, { recursive: true });

  for (const mode of ["dark", "light"]) {
    const t = THEMES[mode];
    await writeFile(path.join(outputDir, `hero-${mode}.svg`), renderHeroSvg(data, t), "utf8");
    await writeFile(path.join(outputDir, `activity-${mode}.svg`), renderActivitySvg(data, t), "utf8");
    await writeFile(path.join(outputDir, `languages-${mode}.svg`), renderLanguagesSvg(data, t), "utf8");

    for (const repo of data.featured) {
      await writeFile(
        path.join(outputDir, `card-${repo.slug}-${mode}.svg`),
        renderRepoCardSvg(repo, t),
        "utf8"
      );
    }
  }

  await writeFile(path.join(outputDir, "github-snake.svg"), renderSnakeSvg(data, THEMES.light), "utf8");
  await writeFile(path.join(outputDir, "github-snake-dark.svg"), renderSnakeSvg(data, THEMES.dark), "utf8");
  console.log(
    `Generated dynamic profile SVGs in ${outputDir} (${data.totalContributions} contributions, ${data.activeDays} active days)`
  );
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.outputDir && !args.staticDir) {
    args.outputDir = "dist";
  }

  if (args.staticDir) {
    await writeStaticAssets(args.staticDir);
  }

  if (args.outputDir) {
    const data = args.snapshot
      ? JSON.parse(await readFile(args.snapshot, "utf8"))
      : await fetchProfileData(USERNAME);
    if (args.saveSnapshot) {
      await writeFile(args.saveSnapshot, JSON.stringify(data, null, 2), "utf8");
    }
    await writeDynamicAssets(args.outputDir, data);
  }
}

main().catch((err) => {
  console.error(err?.stack || err);
  process.exit(1);
});
