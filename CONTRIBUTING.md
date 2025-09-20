# Contributing to Tube Insights

We love your input! We want to make contributing to Tube Insights as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

## Pull Requests

Pull requests are the best way to propose changes to the codebase. We actively welcome your pull requests:

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/aref-vc/tube-insights.git
   cd tube-insights
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   # Add your API keys to .env.local
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## Code Style

- We use ESLint and Prettier for code formatting
- Run `npm run lint` to check code style
- Run `npm run typecheck` for TypeScript validation
- Follow existing code patterns and conventions

## Commit Message Guidelines

We follow conventional commits for consistent versioning:

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code formatting changes
- `refactor:` Code restructuring without changing functionality
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Example:
```
feat: add video thumbnail preview in search results

- Display thumbnails for better video identification
- Add hover effects for enhanced UX
- Optimize image loading with lazy loading
```

## Testing

- Write tests for new features
- Ensure existing tests pass: `npm test`
- Add integration tests for API endpoints
- Test UI components with user interactions

## Documentation

- Update README.md for significant changes
- Add JSDoc comments for new functions
- Update API documentation for service changes
- Include usage examples for new features

## Issue Reporting

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/aref-vc/tube-insights/issues).

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## Feature Requests

We welcome feature requests! Please provide:

- Clear description of the feature
- Use case and motivation
- Expected behavior
- Possible implementation approach
- Screenshots/mockups if applicable

## Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

Examples of behavior that contributes to creating a positive environment include:

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

### Enforcement

Project maintainers are responsible for clarifying the standards of acceptable behavior and are expected to take appropriate and fair corrective action in response to any instances of unacceptable behavior.

## Getting Help

- 📧 Email: [your-email@domain.com](mailto:your-email@domain.com)
- 💬 Discussions: [GitHub Discussions](https://github.com/aref-vc/tube-insights/discussions)
- 🐛 Issues: [GitHub Issues](https://github.com/aref-vc/tube-insights/issues)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Recognition

Contributors will be recognized in our README.md and release notes. We appreciate all contributions, whether they're code, documentation, bug reports, or feature suggestions!

---

Thank you for contributing to Tube Insights! 🎬✨