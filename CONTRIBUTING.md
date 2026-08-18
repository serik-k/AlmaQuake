# Contributing to AlmaQuake

Thanks for helping improve AlmaQuake.

## Development workflow

1. Fork the repository and create a focused branch.
2. Install dependencies with `npm install` in the root and `server/` folders.
3. Keep credentials in ignored `.env` or Firebase configuration files.
4. Run the quality checks before opening a pull request:

   ```bash
   npm run lint
   npm run typecheck
   npm --prefix server run build
   ```

5. Explain the user-facing impact and testing performed in the pull request.

Please keep emergency guidance factual, cite authoritative sources in the pull request, and avoid presenting AlmaQuake as an official warning system.
