import fs from 'fs';
import path from 'path';

const requiredFiles = [
  'README.md',
  'package.json',
  '.github/workflows/validate.yml',
  'docs/SAFE_DELEGATION_PROTOCOL.md',
  'docs/TASK_CATALOG.md',
  'docs/WHY_MISTRAL_SUBAGENT.md',
  'mistral-subagent/SKILL.md',
  'mistral-subagent/scripts/mistral-subagent.mjs',
  'mistral-subagent/references/delegation-playbook.md',
  'mistral-subagent/references/mistral-api.md',
  'mistral-subagent/references/mistral-task-matrix.md',
  'mistral-subagent/references/model-selection.md',
  'mistral-subagent/references/public-repo-checklist.md',
  'mistral-subagent/agents/openai.yaml'
];
const generatedOrchestratorFiles = new Set([
  'AUDIT_ARCHITECTURE.md',
  'AUDIT_NETTOYAGE.md',
  'AUDIT_OPTIMISATION.md',
  'AUDIT_ORCHESTRATEUR_INITIAL.md',
  'AUDIT_SECURITE.md',
  'CHANGELOG_FR.md',
  'FICHE_CONTENU_PROJET_DRAFT.md',
  'FICHE_PROJET.md',
  'INSTALLATION_FR.md',
  'PREPARATION_GITHUB.md',
  'RAPPORT_FONCTIONNALITE.md',
  'RAPPORT_REPARATION_FONCTIONNALITE.md',
  'README_GITHUB_PUBLIC.md'
]);

function checkRequiredFiles() {
  const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));
  if (missingFiles.length > 0) {
    console.error('Missing required files:', missingFiles);
    process.exit(1);
  }
}

function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(fullPath));
    if (entry.isFile()) files.push(fullPath);
  }
  return files;
}

function validateJsonFiles() {
  for (const file of walk('.').filter(file => file.endsWith('.json'))) {
    try {
      JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (error) {
      console.error(`Invalid JSON in ${file}: ${error.message}`);
      process.exit(1);
    }
  }
}

function validateSkillFrontmatter() {
  const skillPath = 'mistral-subagent/SKILL.md';
  const content = fs.readFileSync(skillPath, 'utf8');
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!match) {
    console.error('SKILL.md is missing YAML frontmatter.');
    process.exit(1);
  }
  for (const key of ['name:', 'description:']) {
    if (!match[1].includes(key)) {
      console.error(`SKILL.md frontmatter is missing ${key}`);
      process.exit(1);
    }
  }
}

function checkASCIICompliance() {
  const filesToCheck = walk('.')
    .filter(file => /\.(mjs|js|json|ya?ml|txt)$/.test(file))
    .filter(file => !isGeneratedOrchestratorFile(file));
  filesToCheck.forEach(file => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      if (!/^[\x00-\x7F]*$/.test(content)) {
        console.error(`Non-ASCII characters found in ${file}`);
        process.exit(1);
      }
    }
  });
}

function isGeneratedOrchestratorFile(file) {
  const base = path.basename(file);
  return generatedOrchestratorFiles.has(base)
    || /^AUDIT_.*\.(?:md|json)$/i.test(base)
    || /^RAPPORT_.*\.(?:md|json)$/i.test(base)
    || /^PREPARATION_GITHUB.*\.(?:md|json)$/i.test(base)
    || /^FICHE_CONTENU_PROJET.*\.(?:md|json)$/i.test(base)
    || base === '.project-orchestrator.json';
}

function validateRepo() {
  checkRequiredFiles();
  validateJsonFiles();
  validateSkillFrontmatter();
  checkASCIICompliance();
  console.log('Repository validation passed.');
}

validateRepo();
