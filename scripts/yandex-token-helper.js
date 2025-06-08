#!/usr/bin/env node

/**
 * Yandex Cloud IAM Token Helper
 *
 * This script helps you generate and validate Yandex Cloud IAM tokens
 * for use with the Search API.
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🔧 Yandex Cloud IAM Token Helper\n')

function runCommand(command, description) {
  console.log(`📋 ${description}...`)
  try {
    const output = execSync(command, { encoding: 'utf8', stdio: 'pipe' })
    console.log(`✅ Success:`)
    console.log(output)
    return output.trim()
  } catch (error) {
    console.log(`❌ Error: ${error.message}`)
    if (error.stdout) {
      console.log(`Output: ${error.stdout}`)
    }
    if (error.stderr) {
      console.log(`Error details: ${error.stderr}`)
    }
    return null
  }
}

function checkYandexCLI() {
  console.log('🔍 Checking Yandex Cloud CLI installation...')
  try {
    const version = execSync('yc version', { encoding: 'utf8' })
    console.log(`✅ Yandex Cloud CLI is installed: ${version.trim()}`)
    return true
  } catch (error) {
    console.log('❌ Yandex Cloud CLI is not installed or not in PATH')
    console.log(
      '📝 To install: https://cloud.yandex.com/en/docs/cli/quickstart'
    )
    return false
  }
}

function checkAuthentication() {
  console.log('\n🔐 Checking authentication status...')
  const profile = runCommand('yc config list', 'Getting current configuration')
  if (!profile) {
    console.log('❌ You are not authenticated with Yandex Cloud')
    console.log('📝 Run: yc init')
    return false
  }
  return true
}

function generateIAMToken() {
  console.log('\n🎫 Generating new IAM token...')
  const token = runCommand('yc iam create-token', 'Creating IAM token')
  if (token) {
    console.log('\n🔑 Your new IAM token:')
    console.log(`YANDEX_API_KEY=${token}`)

    // Save to .env file if it exists
    const envPath = path.join(process.cwd(), '.env')
    if (fs.existsSync(envPath)) {
      try {
        let envContent = fs.readFileSync(envPath, 'utf8')

        // Update or add YANDEX_API_KEY
        if (envContent.includes('YANDEX_API_KEY=')) {
          envContent = envContent.replace(
            /YANDEX_API_KEY=.*/g,
            `YANDEX_API_KEY=${token}`
          )
        } else {
          envContent += `\nYANDEX_API_KEY=${token}`
        }

        fs.writeFileSync(envPath, envContent)
        console.log('✅ Updated .env file with new token')
      } catch (error) {
        console.log(`⚠️ Could not update .env file: ${error.message}`)
      }
    }

    console.log('\n⚠️ Note: IAM tokens expire after 12 hours')
    return token
  }
  return null
}

function listServiceAccounts() {
  console.log('\n👤 Listing service accounts...')
  runCommand('yc iam service-account list', 'Getting service accounts')
}

function listFolders() {
  console.log('\n📁 Listing accessible folders...')
  runCommand('yc resource-manager folder list', 'Getting folders')
}

function checkSearchAPIAccess(folderId) {
  if (!folderId) {
    console.log('\n⚠️ No folder ID provided, skipping Search API access check')
    return
  }

  console.log(`\n🔍 Testing Search API access for folder: ${folderId}...`)

  // This would require the IAM token to test, but we're just providing guidance
  console.log('📝 To test Search API access manually:')
  console.log('curl -H "Authorization: Bearer $YANDEX_API_KEY" \\')
  console.log('     -H "Content-Type: application/json" \\')
  console.log(
    '     -d \'{"query":{"searchType":"SEARCH_TYPE_RU","queryText":"test"},"folderId":"' +
      folderId +
      '"}\' \\'
  )
  console.log('     https://searchapi.api.cloud.yandex.net/v2/web/search')
}

function main() {
  // Check if Yandex Cloud CLI is installed
  if (!checkYandexCLI()) {
    process.exit(1)
  }

  // Check authentication
  if (!checkAuthentication()) {
    process.exit(1)
  }

  // Generate new IAM token
  const token = generateIAMToken()

  // List service accounts
  listServiceAccounts()

  // List folders
  listFolders()

  // Get folder ID from environment or command line
  const folderId = process.env.YANDEX_USER_KEY || process.argv[2]
  checkSearchAPIAccess(folderId)

  console.log('\n🎉 Done! Your IAM token has been generated.')
  console.log('📝 Next steps:')
  console.log('1. Update your .env file with the new YANDEX_API_KEY')
  console.log('2. Ensure your YANDEX_USER_KEY is set to a valid folder ID')
  console.log('3. Verify your service account has the "search-api.user" role')
  console.log('4. Test the search functionality')
}

if (require.main === module) {
  main()
}
