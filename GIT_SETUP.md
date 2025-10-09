# Git Dual Repository Setup

This repository is configured to push to both your personal and work GitHub accounts.

## Repository Configuration

- **Work Repository**: https://github.com/SureshJambhalkarAppDirect/UIdemos
- **Personal Repository**: https://github.com/sureshjambhalkar/appdirectUI

## How to Push Changes

### Option 1: Using the Script (Recommended)
```bash
# With commit message
./push-to-both.sh "Your commit message here"

# Or using git alias
git push-both "Your commit message here"
```

### Option 2: Manual Push
```bash
# Push to work repository
git push work main

# Push to personal repository  
git push personal main
```

### Option 3: Push to Both at Once
```bash
# Push to both repositories simultaneously
git push work main && git push personal main
```

## Current Status

✅ **Work Repository**: Up to date  
✅ **Personal Repository**: Up to date  
✅ **Dual Push Script**: Configured  
✅ **Git Alias**: `git push-both` available  

## Usage Examples

```bash
# Make changes to your code
# Stage and commit with message
./push-to-both.sh "Added new feature X"

# Or use the git alias
git push-both "Fixed bug in component Y"
```

## Troubleshooting

If you encounter issues:

1. **Authentication**: Make sure you're logged into both GitHub accounts
2. **Repository Access**: Ensure you have push access to both repositories
3. **Network Issues**: Check your internet connection
4. **Credentials**: Verify your SSH keys or personal access tokens are configured

## Repository URLs

- Work: `git@github.com:SureshJambhalkarAppDirect/UIdemos.git`
- Personal: `git@github.com:sureshjambhalkar/appdirectUI.git`
