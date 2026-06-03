# Public Repository Checklist

Use this checklist when preparing or improving public repositories with Mistral's assistance. Ensure repositories are safe, well-documented, and ready for collaboration.

## General Readiness

- [ ] **License**: Include an open-source license (MIT, Apache 2.0, GPL, etc.) in a `LICENSE` or `LICENSE.md` file.
- [ ] **README**: Provide a clear README with project name, description, setup, usage, and contribution guidelines.
- [ ] **Code of Conduct**: Add a `CODE_OF_CONDUCT.md` to set community standards.
- [ ] **Contributing Guidelines**: Include `CONTRIBUTING.md` with instructions for contributions, testing, and pull requests.
- [ ] **Security Policy**: Add `SECURITY.md` with vulnerability reporting and disclosure process.

## Documentation

- [ ] **Project Overview**: Describe purpose, features, and target audience in the README.
- [ ] **Setup Instructions**: Provide clear steps for installation, configuration, and dependencies.
- [ ] **Usage Examples**: Include code snippets or commands demonstrating key functionality.
- [ ] **API Documentation**: Document endpoints, parameters, and responses if applicable.
- [ ] **Architecture**: High-level overview of components and data flow for complex projects.

## Code Quality

- [ ] **Consistent Style**: Follow a consistent code style (e.g., ESLint, Prettier, Black).
- [ ] **Linting**: Configure and run linters to enforce code quality.
- [ ] **Formatting**: Use automated formatting tools to maintain consistency.
- [ ] **Type Checking**: Add type hints or use TypeScript for better maintainability.
- [ ] **Comments**: Include inline comments for complex logic and public API explanations.

## Testing

- [ ] **Unit Tests**: Cover core functions and edge cases with unit tests.
- [ ] **Integration Tests**: Test interactions between components and external services.
- [ ] **End-to-End Tests**: Validate user flows and full system behavior.
- [ ] **Test Coverage**: Aim for high coverage of critical paths; document coverage goals.
- [ ] **CI/CD Pipeline**: Set up continuous integration to run tests on pushes and pull requests.

## Dependency Management

- [ ] **Dependency List**: Maintain an up-to-date list of dependencies (e.g., `package.json`, `requirements.txt`).
- [ ] **Version Pinning**: Pin dependency versions to ensure reproducibility.
- [ ] **Security Audits**: Regularly audit dependencies for vulnerabilities (e.g., `npm audit`, `safety check`).
- [ ] **Minimal Dependencies**: Avoid unnecessary dependencies to reduce attack surface and complexity.

## Security

- [ ] **Secret Management**: Never commit secrets. Use environment variables or secret management tools.
- [ ] **.gitignore**: Exclude sensitive files, build outputs, and local configurations.
- [ ] **Dependency Scanning**: Integrate security scanning into CI/CD.
- [ ] **Input Validation**: Validate and sanitize all user inputs to prevent injection attacks.
- [ ] **Authentication**: Implement secure authentication and authorization mechanisms.

## GitHub Metadata

- [ ] **Issue Templates**: Add templates in `.github/ISSUE_TEMPLATE/` for bug reports and feature requests.
- [ ] **Pull Request Template**: Include a `PULL_REQUEST_TEMPLATE.md` with guidelines for contributors.
- [ ] **GitHub Actions**: Set up workflows for testing, building, and deploying.
- [ ] **Branch Protection**: Enable branch protection for main branches (require reviews, status checks).
- [ ] **Labels**: Define and apply labels for issues and pull requests (e.g., `bug`, `enhancement`, `good first issue`).

## Accessibility

- [ ] **Readable Fonts**: Use clear, readable fonts and sufficient contrast in documentation.
- [ ] **Alt Text**: Provide alternative text for images and diagrams.
- [ ] **Keyboard Navigation**: Ensure web interfaces support keyboard navigation.
- [ ] **Screen Reader Support**: Test with screen readers for accessibility compliance.

## Localization

- [ ] **Language Support**: Consider internationalization (i18n) for user-facing text.
- [ ] **Locale Files**: Organize translations in a standard format (e.g., JSON, YAML).
- [ ] **Fallback Language**: Provide a fallback language for unsupported locales.

## Performance

- [ ] **Benchmarking**: Include performance benchmarks for critical operations.
- [ ] **Optimizations**: Document and apply optimizations for speed and memory usage.
- [ ] **Caching**: Implement caching for expensive operations where appropriate.

## Community

- [ ] **Communication Channels**: List channels for support (e.g., Discord, Slack, mailing list).
- [ ] **Roadmap**: Share a high-level roadmap or milestone plan.
- [ ] **Contributor Recognition**: Acknowledge contributors in `CONTRIBUTORS.md` or release notes.
- [ ] **Governance**: Document governance model for decision-making and leadership.

## Legal

- [ ] **Trademarks**: Respect trademarks and attribute properly.
- [ ] **Copyright Notices**: Include copyright notices in source files and documentation.
- [ ] **Compliance**: Ensure compliance with relevant regulations (e.g., GDPR, CCPA).

## Mistral-Specific Tips

- **Bounded Tasks**: Delegate specific, bounded tasks to Mistral (e.g., README improvements, issue template drafting).
- **Filtered Context**: Use `project-scan` to provide only necessary, redacted context.
- **Structured Outputs**: Request complete file content or patches in JSON format for easy integration.
- **Validation**: Always validate Mistral's output before applying changes.

Example command for repository improvement:

```powershell
node C:\Users\ysche\.codex\skills\mistral-subagent\scripts\mistral-subagent.mjs project-action --path D:\path\repo --goal "Improve GitHub metadata and documentation" --model mistral-medium-latest --max-files 5 --max-tokens 1200
```

By following this checklist, you ensure public repositories are well-prepared, secure, and ready for collaboration.
