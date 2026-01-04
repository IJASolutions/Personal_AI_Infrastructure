# CLAUDE.md - AI Assistant Guide for PAI

> **Purpose**: This file provides essential context for AI assistants (Claude, GPT, etc.) working with the Personal AI Infrastructure (PAI) codebase.

---

## Project Overview

**PAI (Personal AI Infrastructure)** is an open-source framework for building personalized AI assistant systems. It provides modular, self-contained "packs" that add specific capabilities to AI coding assistants like Claude Code, Cursor, or Windsurf.

**Core Philosophy:**
- **Modular by design** - Pick what you need, leave the rest
- **AI-installable** - Packs contain complete instructions for autonomous installation
- **Platform-agnostic** - Works with any AI agent platform
- **Battle-tested** - Extracted from production systems

**The Two Loops (Foundation):**
1. **Outer Loop**: Current State → Desired State (goal-oriented)
2. **Inner Loop**: 7-phase scientific method (OBSERVE → THINK → PLAN → BUILD → EXECUTE → VERIFY → LEARN)

---

## Repository Structure

```
Personal_AI_Infrastructure/
├── Bundles/                    # Curated pack collections
│   ├── Kai/                    # The official Kai bundle
│   │   ├── README.md           # Bundle documentation
│   │   └── install.ts          # Interactive installation wizard
│   └── README.md               # Bundle system documentation
│
├── Packs/                      # Individual capability packs
│   ├── icons/                  # Pack icons (256x256 PNG)
│   ├── kai-hook-system/        # Event-driven automation (foundation)
│   ├── kai-history-system/     # Context tracking and memory
│   ├── kai-core-install/       # Skills + Identity + Architecture
│   ├── kai-voice-system/       # Voice notifications (ElevenLabs)
│   ├── kai-observability-server/ # Real-time monitoring dashboard
│   ├── kai-prompting-skill/    # Meta-prompting templates
│   ├── kai-agents-skill/       # Dynamic agent composition
│   ├── kai-art-skill/          # Visual content generation
│   └── README.md               # Pack system documentation
│
├── Tools/                      # Utilities and templates
│   ├── CheckPAIState.md        # Installation diagnostic tool
│   ├── PAIPackTemplate.md      # Pack creation template
│   └── PAIBundleTemplate.md    # Bundle creation template
│
├── README.md                   # Main documentation
├── PACKS.md                    # Pack system reference
├── PLATFORM.md                 # Platform compatibility status
├── SECURITY.md                 # Security guidelines
├── .env.example                # Environment template
└── LICENSE                     # MIT License
```

---

## Pack Structure (v2.0 Directory Format)

Each pack is a **directory** containing:

```
pack-name/
├── README.md      # Overview, architecture, what problem it solves
├── INSTALL.md     # Step-by-step installation instructions
├── VERIFY.md      # Mandatory verification checklist
└── src/           # Actual source code files
    ├── hooks/     # TypeScript hook implementations
    ├── skills/    # Skill definitions and workflows
    ├── tools/     # CLI utilities
    └── lib/       # Shared libraries
```

**Important**: Packs also have a legacy single-file format (`pack-name.md`) which is being phased out. The directory format is preferred.

---

## Key Concepts

### Packs
Self-contained capability modules. Two types:
- **Feature Packs**: Infrastructure systems (hooks, history, observability)
- **Skill Packs**: Action capabilities (art generation, prompting, agents)

### Bundles
Curated collections of packs designed to work together. The **Kai Bundle** is the flagship bundle containing 8 packs.

### Hooks
Event-driven automation triggered by Claude Code events:
- `PreToolUse` - Before a tool runs (security validation)
- `PostToolUse` - After a tool completes
- `Stop` - Session ends
- `SubagentStop` - Subagent completes

### Skills
Modular capabilities with:
- `SKILL.md` - Definition and routing
- `workflows/` - Step-by-step processes
- `tools/` - Supporting utilities

### PAI_DIR
The installation directory (default: `~/.claude`). All paths use `$PAI_DIR` or `${PAI_DIR}` for portability.

---

## Development Workflow

### When Installing Packs
1. Read the pack's `README.md` for context
2. Follow `INSTALL.md` step by step
3. Copy files from `src/` to the target system
4. Complete `VERIFY.md` checklist

### When Creating Packs
1. Use `Tools/PAIPackTemplate.md` as the specification
2. Create the directory structure with README.md, INSTALL.md, VERIFY.md, and src/
3. Include ALL code - no snippets or placeholders
4. Test with a fresh installation

### Pack Installation Order (Kai Bundle)
1. `kai-hook-system` - Foundation (no dependencies)
2. `kai-history-system` - Requires hooks
3. `kai-core-install` - Requires hooks, history
4. `kai-prompting-skill` - Requires core
5. `kai-voice-system` - Requires hooks, core (optional)
6. `kai-agents-skill` - Requires core (optional)
7. `kai-art-skill` - Requires core (optional)
8. `kai-observability-server` - Requires hooks (optional)

---

## Code Conventions

### Language & Runtime
- **Primary**: TypeScript with Bun runtime
- **Secondary**: Python when required (data science, ML)
- **Package Manager**: `bun` (NEVER npm/yarn/pnpm)
- **Markup**: Markdown (not HTML for basic content)

### TypeScript Style
```typescript
#!/usr/bin/env bun
// File header with purpose

import { $ } from "bun";

interface PayloadType {
  session_id: string;
  tool_name: string;
}

async function main() {
  try {
    const data = await Bun.stdin.text();
    // Process...
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
```

### Naming Conventions
- **Files**: kebab-case (`security-validator.ts`, `capture-all-events.ts`)
- **Directories**: kebab-case (`kai-hook-system/`)
- **Skills**: TitleCase (`CORE/`, `Art/`, `Agents/`)
- **Hooks**: kebab-case with purpose (`stop-hook.ts`, `pre-tool-use.ts`)

### Environment Variables
- `DA` - AI assistant name
- `TIME_ZONE` - User timezone
- `PAI_DIR` - Installation directory
- `PAI_SOURCE_APP` - Source identifier
- API keys in `$PAI_DIR/.env`

---

## Important Files

| File | Purpose |
|------|---------|
| `$PAI_DIR/settings.json` | Claude Code configuration, hook registration |
| `$PAI_DIR/.env` | API keys and secrets (NEVER commit) |
| `$PAI_DIR/skills/CORE/SKILL.md` | AI identity and core behavior |
| `$PAI_DIR/hooks/*.ts` | Event-driven automation scripts |
| `$PAI_DIR/history/` | Sessions, learnings, research, decisions |

---

## Security Guidelines

### Critical Rules (from SECURITY.md)
1. **NEVER commit `.env` files** - All API keys in `$PAI_DIR/.env`
2. **NEVER hardcode secrets** - Use environment variables
3. **NEVER include personal data** - This is a public repository
4. **ALWAYS validate external input** - See prompt injection defenses

### Security Validator
The `security-validator.ts` hook blocks dangerous operations:
- Tier 1: Catastrophic deletions (`rm -rf /`)
- Tier 2: Reverse shells
- Tier 3: Credential theft (curl | bash)
- Tier 4: Prompt injection patterns
- Tier 5-10: Various warnings and logging

### Before Committing
1. Audit all changes for sensitive data
2. Search for emails, keys, tokens
3. Verify all paths use `${PAI_DIR}`
4. Test in a clean environment

---

## Testing & Verification

### Pack Verification Pattern
Each pack has a `VERIFY.md` with:
- Directory existence checks
- File content validation
- Hook registration verification
- Functional smoke tests

### Common Verification Commands
```bash
# Check directory structure
ls -la ~/.claude/

# Verify hooks registered
cat ~/.claude/settings.json | grep -A 10 "hooks"

# Test a hook manually
echo '{"session_id":"test"}' | bun ~/.claude/hooks/hook-name.ts

# Check environment
echo $DA $PAI_DIR $TIME_ZONE
```

---

## Platform Compatibility

| Platform | Status |
|----------|--------|
| macOS | Fully supported |
| Linux | Fully supported |
| Windows | Not supported (community contributions welcome) |

**Platform detection pattern:**
```typescript
if (process.platform === 'darwin') {
  // macOS
} else if (process.platform === 'linux') {
  // Linux
}
```

---

## Common Tasks

### Installing the Kai Bundle
```bash
cd Bundles/Kai && bun run install.ts
```

### Checking PAI State
Give `Tools/CheckPAIState.md` to your AI:
```
Read CheckPAIState.md and check my PAI state.
```

### Creating a New Pack
```
Read Tools/PAIPackTemplate.md and help me create a pack for [CAPABILITY].
```

### Updating an Existing Installation
```bash
cd Bundles/Kai && bun run install.ts --update
```

---

## AI Assistant Instructions

### When Installing Packs
1. **IMPLEMENT EVERYTHING EXACTLY** - No simplification or shortcuts
2. **CREATE ALL FILES** - If the pack specifies 8 files, create 8 files
3. **INCLUDE ALL CONTENT** - Full code, not snippets
4. **COMPLETE VERIFICATION** - Run all checks in VERIFY.md

### When Modifying Code
1. Follow existing patterns and conventions
2. Use `$PAI_DIR` for all paths
3. Never hardcode API keys or personal data
4. Test changes before committing

### When Answering Questions
1. Reference specific files with paths
2. Check the relevant pack documentation
3. Use `Tools/CheckPAIState.md` for diagnostics
4. Consult `SECURITY.md` for security-related queries

---

## Quick Reference

| Need | Location |
|------|----------|
| Main docs | `README.md` |
| Pack system | `PACKS.md` |
| Security | `SECURITY.md` |
| Platform support | `PLATFORM.md` |
| Create a pack | `Tools/PAIPackTemplate.md` |
| Create a bundle | `Tools/PAIBundleTemplate.md` |
| Diagnose installation | `Tools/CheckPAIState.md` |
| Environment template | `.env.example` |

---

## Contributing

1. Fork the repository
2. Create your feature branch
3. Follow the pack/code conventions
4. Test thoroughly
5. Submit a PR with examples and evidence

**Pack submissions** must include:
- Clear problem statement
- Complete working code
- Real examples (not placeholders)
- Verification steps
- No hardcoded personal data

---

*Last updated: 2026-01-04*
*PAI Version: 2.1*
