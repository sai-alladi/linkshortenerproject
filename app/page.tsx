'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SignInModal } from '@/components/auth/sign-in-modal';
import { SignUpModal } from '@/components/auth/sign-up-modal';
import {
  Link as LinkIcon,
  Zap,
  BarChart3,
  Share2,
  QrCode,
  Shield,
  Smartphone,
  ArrowRight,
} from 'lucide-react';

const features = [
  {
    icon: LinkIcon,
    title: 'Shorten URLs',
    description: 'Convert long, unwieldy URLs into short, shareable links instantly',
  },
  {
    icon: BarChart3,
    title: 'Track Analytics',
    description: 'Monitor clicks, geographic data, and traffic patterns in real-time',
  },
  {
    icon: QrCode,
    title: 'Generate QR Codes',
    description: 'Automatically generate QR codes for every shortened link',
  },
  {
    icon: Share2,
    title: 'Easy Sharing',
    description: 'Share your shortened links across social media and messaging apps',
  },
  {
    icon: Smartphone,
    title: 'Mobile Friendly',
    description: 'Works seamlessly on all devices with a responsive design',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'All your links are encrypted and secured with enterprise-grade protection',
  },
];

export default function Home() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace('/dashboard');
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (isSignedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-black dark:to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LinkIcon className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-slate-900 dark:text-white">LinkShortener</span>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowSignIn(true)}
            >
              Sign In
            </Button>
            <Button
              onClick={() => setShowSignUp(true)}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="text-center space-y-8">
          <Badge className="mx-auto" variant="secondary">
            🚀 Fast, Simple, Powerful
          </Badge>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white">
            Shorten Your Links,
            <span className="block text-blue-600 dark:text-blue-400">Amplify Your Reach</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-600 dark:text-slate-300">
            Create short, memorable links and track their performance in real-time. Perfect for
            marketing campaigns, social media, and sharing with friends.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white dark:bg-slate-950 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Everything you need to manage and track your links
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle className="text-slate-900 dark:text-white">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-slate-600 dark:text-slate-400">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">1M+</div>
            <p className="text-slate-600 dark:text-slate-400 mt-2">Links Created</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">50M+</div>
            <p className="text-slate-600 dark:text-slate-400 mt-2">Total Clicks</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">99.9%</div>
            <p className="text-slate-600 dark:text-slate-400 mt-2">Uptime Guaranteed</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-900 dark:to-blue-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-blue-50 mb-8">
            Join thousands of users who are already shortening and tracking their links
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => router.push('/sign-up')}
          >
            Create Your Free Account
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 sm:mb-0">
              <LinkIcon className="w-6 h-6 text-blue-600" />
              <span className="font-semibold text-slate-900 dark:text-white">LinkShortener</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              © 2026 LinkShortener. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Auth Modals */}
      {showSignIn && <SignInModal />}
      {showSignUp && <SignUpModal />}
    </div>
  );
}
