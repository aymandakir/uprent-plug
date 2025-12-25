#!/usr/bin/env tsx
/**
 * Development Environment Verification Script
 * 
 * Checks:
 * - Environment variables are present
 * - Supabase connection works
 * - OpenAI API key is valid
 * - Ports are available
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables
config({ path: join(process.cwd(), 'apps/web/.env.local') });
config({ path: join(process.cwd(), 'apps/scraper/.env') });

interface CheckResult {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
}

const results: CheckResult[] = [];

function addResult(name: string, status: 'pass' | 'fail' | 'warning', message: string) {
  results.push({ name, status, message });
  const icon = status === 'pass' ? '✅' : status === 'fail' ? '❌' : '⚠️';
  console.log(`${icon} ${name}: ${message}`);
}

async function checkEnvVars() {
  console.log('\n📋 Checking Environment Variables...\n');

  // Web app env vars
  const webEnvVars = {
    'NEXT_PUBLIC_SUPABASE_URL': process.env.NEXT_PUBLIC_SUPABASE_URL,
    'NEXT_PUBLIC_SUPABASE_ANON_KEY': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    'SUPABASE_SERVICE_ROLE_KEY': process.env.SUPABASE_SERVICE_ROLE_KEY,
    'OPENAI_API_KEY': process.env.OPENAI_API_KEY,
    'NEXT_PUBLIC_APP_URL': process.env.NEXT_PUBLIC_APP_URL,
  };

  for (const [key, value] of Object.entries(webEnvVars)) {
    if (value) {
      addResult(`Web: ${key}`, 'pass', 'Present');
    } else {
      addResult(`Web: ${key}`, 'fail', 'Missing');
    }
  }

  // Scraper env vars
  const scraperEnvVars = {
    'SUPABASE_URL': process.env.SUPABASE_URL,
    'SUPABASE_SERVICE_ROLE_KEY': process.env.SUPABASE_SERVICE_ROLE_KEY,
  };

  for (const [key, value] of Object.entries(scraperEnvVars)) {
    if (value) {
      addResult(`Scraper: ${key}`, 'pass', 'Present');
    } else {
      addResult(`Scraper: ${key}`, 'warning', 'Missing (optional for local dev)');
    }
  }
}

async function checkSupabaseConnection() {
  console.log('\n🗄️  Testing Supabase Connection...\n');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    addResult('Supabase Connection', 'fail', 'Missing URL or key');
    return;
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test connection by querying a table
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .limit(1);

    if (error) {
      // If table doesn't exist, that's okay - connection works
      if (error.code === '42P01' || error.message.includes('does not exist')) {
        addResult('Supabase Connection', 'warning', 'Connected but tables may not be migrated yet');
      } else {
        addResult('Supabase Connection', 'fail', `Error: ${error.message}`);
      }
    } else {
      addResult('Supabase Connection', 'pass', 'Connected successfully');
    }
  } catch (error: any) {
    addResult('Supabase Connection', 'fail', `Connection failed: ${error.message}`);
  }
}

async function checkOpenAIKey() {
  console.log('\n🤖 Testing OpenAI API Key...\n');

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    addResult('OpenAI API Key', 'fail', 'Missing');
    return;
  }

  // Basic validation - check format
  if (apiKey.startsWith('sk-') || apiKey.startsWith('sk-proj-')) {
    addResult('OpenAI API Key', 'pass', 'Format looks valid');
  } else {
    addResult('OpenAI API Key', 'warning', 'Format may be invalid');
  }

  // Try a simple API call to verify
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    if (response.ok) {
      addResult('OpenAI API Key', 'pass', 'Valid and working');
    } else if (response.status === 401) {
      addResult('OpenAI API Key', 'fail', 'Invalid or expired');
    } else {
      addResult('OpenAI API Key', 'warning', `API returned status ${response.status}`);
    }
  } catch (error: any) {
    addResult('OpenAI API Key', 'warning', `Could not verify: ${error.message}`);
  }
}

async function checkPorts() {
  console.log('\n🔌 Checking Port Availability...\n');

  const ports = [3000, 3001, 6379]; // Next.js dev, alternative, Redis

  for (const port of ports) {
    try {
      const net = await import('net');
      const server = net.createServer();
      
      await new Promise<void>((resolve, reject) => {
        server.listen(port, () => {
          server.close(() => resolve());
        });
        server.on('error', (err: any) => {
          if (err.code === 'EADDRINUSE') {
            reject(new Error('Port in use'));
          } else {
            reject(err);
          }
        });
      });

      addResult(`Port ${port}`, 'pass', 'Available');
    } catch (error: any) {
      if (error.message === 'Port in use') {
        addResult(`Port ${port}`, 'warning', 'In use (may be your dev server)');
      } else {
        addResult(`Port ${port}`, 'fail', `Error: ${error.message}`);
      }
    }
  }
}

async function checkDependencies() {
  console.log('\n📦 Checking Dependencies...\n');

  try {
    const packageJson = JSON.parse(
      readFileSync(join(process.cwd(), 'package.json'), 'utf-8')
    );

    // Check if node_modules exists
    const fs = await import('fs');
    const nodeModulesExists = fs.existsSync(join(process.cwd(), 'node_modules'));

    if (nodeModulesExists) {
      addResult('Dependencies', 'pass', 'node_modules exists');
    } else {
      addResult('Dependencies', 'fail', 'node_modules missing - run pnpm install');
    }
  } catch (error: any) {
    addResult('Dependencies', 'warning', `Could not verify: ${error.message}`);
  }
}

async function checkAuthRoutes() {
  console.log('\n🔐 Checking Auth Routes...\n');

  const fs = await import('fs');
  const authRoutes = [
    'apps/web/app/(auth)/login/page.tsx',
    'apps/web/app/(auth)/register/page.tsx',
  ];

  for (const route of authRoutes) {
    const path = join(process.cwd(), route);
    if (fs.existsSync(path)) {
      try {
        const content = fs.readFileSync(path, 'utf-8');
        // Check if it's a valid React component
        if (content.includes('export default') && content.includes('function')) {
          addResult(`Auth Route: ${route.split('/').pop()}`, 'pass', 'Valid React component');
        } else {
          addResult(`Auth Route: ${route.split('/').pop()}`, 'warning', 'May not be a valid component');
        }
      } catch (error: any) {
        addResult(`Auth Route: ${route.split('/').pop()}`, 'fail', `Error reading file: ${error.message}`);
      }
    } else {
      addResult(`Auth Route: ${route.split('/').pop()}`, 'fail', 'File not found');
    }
  }
}

async function main() {
  console.log('🚀 Uprent Plus - Development Environment Verification\n');
  console.log('=' .repeat(60));

  await checkEnvVars();
  await checkDependencies();
  await checkSupabaseConnection();
  await checkOpenAIKey();
  await checkPorts();
  await checkAuthRoutes();

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 Summary\n');

  const passed = results.filter(r => r.status === 'pass').length;
  const failed = results.filter(r => r.status === 'fail').length;
  const warnings = results.filter(r => r.status === 'warning').length;

  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⚠️  Warnings: ${warnings}`);

  const allCriticalPassed = failed === 0;
  
  if (allCriticalPassed) {
    console.log('\n🎉 All critical checks passed! Ready to run `pnpm dev`');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some checks failed. Please fix the issues above.');
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

