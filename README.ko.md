# agent-team-maker

템플릿 기반으로 맞춤형 Claude Code 서브 에이전트 팀을 생성합니다.

**agent-team-maker**는 프리셋 에이전트 팀 템플릿을 프로젝트에 설치한 뒤, Claude Code 슬래시 커맨드를 통해 해당 템플릿에서 맞춤형 에이전트 설정을 생성합니다. 역할, 도구, 품질 게이트, 커뮤니케이션 프로토콜이 정의된 전문 AI 에이전트 팀을 구성할 수 있습니다.

[English README](./README.md)

## 빠른 시작

```bash
# 프로젝트에 템플릿 설치
npx agent-team-maker init

# Claude Code에서:
/team:create      # 에이전트 팀 생성
/team:list        # 프리셋 목록 보기
```

## 주요 기능

1. **템플릿 설치** — 에이전트 블루프린트와 슬래시 커맨드를 프로젝트의 `.claude/` 디렉토리에 복사
2. **에이전트 생성** — Claude Code가 템플릿을 읽고 프로젝트의 기술 스택에 맞춘 에이전트 파일을 생성
3. **오케스트레이션 설정** — `CLAUDE.md`에 조율 규칙을 추가하여 에이전트 간 계층 구조와 워크플로우를 구성

## 프리셋 목록

| 프리셋 | 에이전트 수 | 적합한 프로젝트 |
|--------|-----------|--------------|
| **fullstack-web** | 6 | React + Node.js 풀스택 프로젝트 (테크 리드 포함) |
| **code-review** | 4 | PR 리뷰, 보안 감사, 리팩토링 검증 |
| **data-ml** | 4 | 데이터 파이프라인, ML 모델 라이프사이클, 분석 |
| **docs** | 3 | API 문서, 튜토리얼, 아키텍처 다이어그램 |
| **product** | 5 | 스프린트 기반 피처 개발 (QA 통합) |

맞는 프리셋이 없다면? `/team:create`에서 **자유 형식 생성**도 지원합니다 — 필요한 내용을 설명하면 재사용 가능한 프래그먼트로 커스텀 팀을 구성합니다.

## 설치

### 방법 1: npx (권장)

```bash
npx agent-team-maker init
```

### 방법 2: 특정 디렉토리에 설치

```bash
npx agent-team-maker init --target=/path/to/your/project
```

### 방법 3: 셸 스크립트 (Node.js 불필요)

```bash
curl -fsSL https://raw.githubusercontent.com/0113bernoyoun/agent-team-maker/main/install.sh | bash
```

### 설치되는 파일 구조

```
your-project/
└── .claude/
    ├── templates/agent-team-maker/   # 에이전트 블루프린트와 생성 가이드
    │   ├── INDEX.md
    │   ├── GENERATION-GUIDE.md
    │   ├── fragments/                # 재사용 가능한 프롬프트 빌딩 블록
    │   └── presets/                   # 5개 프리셋 팀 템플릿
    ├── commands/team/                 # 슬래시 커맨드
    │   ├── create.md
    │   ├── list.md
    │   ├── add-agent.md
    │   └── customize.md
    └── agents/                       # 생성된 에이전트 파일 위치
```

## 커맨드

| 커맨드 | 설명 |
|--------|------|
| `/team:create` | 프리셋 또는 자유 형식으로 에이전트 팀 생성 |
| `/team:list` | 프리셋 목록과 에이전트 구성 확인 |
| `/team:add-agent` | 기존 팀에 에이전트 추가 |
| `/team:customize` | 기존 팀의 에이전트나 오케스트레이션 수정 |

## 작동 방식

### 1. 프리셋 선택

```
/team:create
```

Claude Code가 프로젝트에 대해 질문하고 적절한 프리셋을 추천합니다. 에이전트 목록과 커스터마이징 수준(빠른 설정 / 심층 설정)을 확인합니다.

### 2. 에이전트 생성

각 에이전트 블루프린트가 프로젝트의 기술 스택에 맞게 변환됩니다:
- 프레임워크 참조 교체 (예: React → Vue, Express → FastAPI)
- 파일 소유권 경로를 프로젝트 구조에 맞게 조정
- 품질 게이트 검사를 실제 도구에 맞게 변경 (예: `npm test` → `pytest`)

생성된 에이전트 파일은 `.claude/agents/`에 저장됩니다.

### 3. 오케스트레이션 구성

`CLAUDE.md`에 조율 섹션이 추가됩니다:
- 에이전트 계층 구조 (보고 체계)
- 트리거 매트릭스 (키워드별 담당 에이전트)
- 개입 정책 (승인 필요 vs 자율 실행)
- 표준 워크플로우 (피처 개발, 버그 수정, 스프린트)
- 품질 게이트와 에스컬레이션 경로

### 4. 자동 활성화

설정이 완료되면 Claude Code가 요청 내용에 따라 적절한 에이전트에 자동으로 위임합니다. 리드 에이전트가 팀을 조율합니다.

## 생성되는 에이전트 파일 형식

```yaml
---
name: tech-lead
description: "아키텍처 결정 및 코드 품질 감독..."
model: inherit
color: yellow
tools: [Read, Grep, Glob, Bash]
---
(역할, 책임, 커뮤니케이션 형식, 품질 게이트가 포함된 시스템 프롬프트)
```

- **model**: 리드는 `inherit` (사용자의 활성 모델과 동일), 팀 리드는 `sonnet`, IC는 `haiku`
- **tools**: 각 에이전트에 필요한 도구만 부여 — 리뷰어는 Read 전용, 구현자는 Edit+Write
- **description**: 에이전트 위임 시점을 보여주는 `<example>` 블록 포함

## 커스터마이징

### 빠른 모드 (기본값)
프레임워크/도구 참조를 프로젝트 스택으로 교체합니다. 나머지는 유지합니다.

### 심층 모드
프로젝트의 도메인, 컨벤션, 워크플로우에 맞게 시스템 프롬프트를 재작성합니다.

### 생성 후
- `.claude/agents/`의 에이전트 파일을 직접 편집
- `/team:customize`로 대화형 수정
- `/team:add-agent`로 전문 에이전트 추가

## 프로젝트 구조

```
agent-team-maker/
├── src/init.ts            # CLI 진입점
├── templates/             # 소스 템플릿 (init 시 복사)
│   ├── INDEX.md           # 프리셋 카탈로그
│   ├── GENERATION-GUIDE.md
│   ├── fragments/         # 재사용 가능한 프롬프트 빌딩 블록
│   └── presets/           # 5개 프리셋 팀 설정
├── commands/team/         # 슬래시 커맨드 정의
├── dist/                  # 컴파일된 출력
├── install.sh             # 셸 기반 설치 스크립트
└── package.json
```

## 요구 사항

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) CLI
- Node.js 18+ (`npx` 설치 시)

## 라이선스

MIT
