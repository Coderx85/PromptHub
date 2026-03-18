import type { NextConfig } from 'next'

export function withCustomConfig(config: NextConfig): NextConfig {
  return {
    ...config,
    // Add your custom configuration here
    // For example, you can enable React Strict Mode:
    reactStrictMode: true,
  }
}