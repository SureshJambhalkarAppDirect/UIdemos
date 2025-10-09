#!/bin/bash

# Script to set up personal GitHub authentication
# This script will help you configure authentication for your personal repository

echo "🔐 Setting up Personal GitHub Authentication"
echo "=========================================="

echo ""
echo "Choose your authentication method:"
echo "1. Personal Access Token (Recommended)"
echo "2. SSH Key Setup"
echo "3. GitHub CLI"
echo ""

read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo "📝 Personal Access Token Setup:"
        echo "1. Go to: https://github.com/settings/tokens"
        echo "2. Click 'Generate new token' → 'Generate new token (classic)'"
        echo "3. Name: 'UIdemos Personal Repo'"
        echo "4. Select scope: 'repo' (full control)"
        echo "5. Copy the token"
        echo ""
        read -p "Enter your personal GitHub username: " username
        read -s -p "Enter your personal access token: " token
        echo ""
        
        # Update remote URL with token
        git remote set-url personal https://${username}:${token}@github.com/sureshjambhalkar/appdirectUI.git
        echo "✅ Personal remote updated with token authentication"
        ;;
    2)
        echo ""
        echo "🔑 SSH Key Setup:"
        echo "1. Generate new SSH key:"
        echo "   ssh-keygen -t ed25519 -C 'your-personal-email@example.com' -f ~/.ssh/id_ed25519_personal"
        echo "2. Add to GitHub: https://github.com/settings/keys"
        echo "3. Copy public key: cat ~/.ssh/id_ed25519_personal.pub"
        echo ""
        echo "After setting up SSH key, run:"
        echo "git remote set-url personal git@github.com:sureshjambhalkar/appdirectUI.git"
        ;;
    3)
        echo ""
        echo "🛠️  GitHub CLI Setup:"
        echo "1. Install: brew install gh"
        echo "2. Authenticate: gh auth login"
        echo "3. Test: gh repo view sureshjambhalkar/appdirectUI"
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "🧪 Testing personal repository access..."
if git push personal main; then
    echo "✅ Success! Personal repository is now accessible"
else
    echo "❌ Still having issues. Please check your authentication setup."
    echo "💡 Try running: git push personal main --verbose"
fi
