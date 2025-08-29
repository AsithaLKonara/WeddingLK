'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AlertCircle, CheckCircle, Loader2, ExternalLink } from 'lucide-react';

interface SocialLoginButtonsProps {
  onSuccess?: (provider: string) => void;
  onError?: (error: string) => void;
  showDescription?: boolean;
  className?: string;
}

interface OAuthProvider {
  name: string;
  provider: string;
  color: string;
  icon: string;
  description: string;
  authUrl: string;
  isEnabled: boolean;
}

const oauthProviders: OAuthProvider[] = [
  {
    name: 'Google',
    provider: 'google',
    color: 'bg-red-600 hover:bg-red-700',
    icon: '🔍',
    description: 'Sign in with your Google account',
    authUrl: '/api/auth/oauth/google',
    isEnabled: true,
  },
  {
    name: 'Facebook',
    provider: 'facebook',
    color: 'bg-blue-600 hover:bg-blue-700',
    icon: '📘',
    description: 'Sign in with your Facebook account',
    authUrl: '/api/auth/oauth/facebook',
    isEnabled: true,
  },
  {
    name: 'Instagram',
    provider: 'instagram',
    color:
      'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
    icon: '📷',
    description: 'Sign in with your Instagram account',
    authUrl: '/api/auth/oauth/instagram',
    isEnabled: true,
  },
  {
    name: 'LinkedIn',
    provider: 'linkedin',
    color: 'bg-blue-700 hover:bg-blue-800',
    icon: '💼',
    description: 'Sign in with your LinkedIn account',
    authUrl: '/api/auth/oauth/linkedin',
    isEnabled: true,
  },
];

export function SocialLoginButtons({
  onSuccess,
  onError,
  showDescription = true,
  className = '',
}: SocialLoginButtonsProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSocialLogin = async (provider: OAuthProvider) => {
    if (!provider.isEnabled) {
      onError?.('This provider is temporarily unavailable');
      return;
    }

    setLoading(provider.provider);
    setErrors(prev => ({ ...prev, [provider.provider]: '' }));

    try {
      // Redirect to OAuth provider
      const authUrl = new URL(provider.authUrl, window.location.origin);
      authUrl.searchParams.set(
        'client_id',
        process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID || ''
      );
      authUrl.searchParams.set(
        'redirect_uri',
        window.location.origin + '/dashboard'
      );
      authUrl.searchParams.set('scope', 'openid profile email');
      authUrl.searchParams.set('response_type', 'code');
      authUrl.searchParams.set(
        'state',
        btoa(
          JSON.stringify({
            provider: provider.provider,
            timestamp: Date.now(),
          })
        )
      );

      // Store provider info in sessionStorage for callback handling
      sessionStorage.setItem('oauth_provider', provider.provider);
      sessionStorage.setItem('oauth_timestamp', Date.now().toString());

      // Redirect to OAuth provider
      window.location.href = authUrl.toString();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Authentication failed';
      setErrors(prev => ({ ...prev, [provider.provider]: errorMessage }));
      onError?.(errorMessage);
      setLoading(null);
    }
  };

  const getProviderStatus = (provider: OAuthProvider) => {
    if (!provider.isEnabled) {
      return {
        status: 'disabled',
        text: 'Unavailable',
        color: 'text-gray-400',
      };
    }

    if (loading === provider.provider) {
      return {
        status: 'loading',
        text: 'Connecting...',
        color: 'text-blue-600',
      };
    }

    if (errors[provider.provider]) {
      return { status: 'error', text: 'Failed', color: 'text-red-600' };
    }

    return { status: 'ready', text: 'Ready', color: 'text-green-600' };
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {showDescription && (
        <div className='text-center'>
          <h3 className='text-lg font-semibold text-gray-900 mb-2'>
            Sign in with Social Media
          </h3>
          <p className='text-sm text-gray-600'>
            Choose your preferred social media platform to sign in
          </p>
        </div>
      )}

      <div className='grid gap-3'>
        {oauthProviders.map(provider => {
          const status = getProviderStatus(provider);

          return (
            <Card key={provider.provider} className='overflow-hidden'>
              <CardContent className='p-0'>
                <Button
                  variant='ghost'
                  className={`w-full h-16 ${provider.color} text-white hover:opacity-90 transition-all duration-200 ${
                    !provider.isEnabled ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={() => handleSocialLogin(provider)}
                  disabled={
                    !provider.isEnabled || loading === provider.provider
                  }
                >
                  <div className='flex items-center justify-between w-full px-4'>
                    <div className='flex items-center gap-3'>
                      <span className='text-2xl'>{provider.icon}</span>
                      <div className='text-left'>
                        <div className='font-semibold'>{provider.name}</div>
                        {showDescription && (
                          <div className='text-xs opacity-90'>
                            {provider.description}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className='flex items-center gap-2'>
                      {status.status === 'loading' && (
                        <Loader2 className='w-4 h-4 animate-spin' />
                      )}

                      {status.status === 'error' && (
                        <AlertCircle className='w-4 h-4' />
                      )}

                      {status.status === 'ready' && (
                        <CheckCircle className='w-4 h-4' />
                      )}

                      <Badge
                        variant='outline'
                        className={`text-xs ${status.color} border-current`}
                      >
                        {status.text}
                      </Badge>

                      <ExternalLink className='w-4 h-4 opacity-70' />
                    </div>
                  </div>
                </Button>
              </CardContent>

              {errors[provider.provider] && (
                <div className='px-4 py-2 bg-red-50 border-t border-red-200'>
                  <p className='text-xs text-red-600'>
                    {errors[provider.provider]}
                  </p>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* OAuth Status Information */}
      <div className='text-center text-xs text-gray-500 space-y-1'>
        <p>All social logins are secure and encrypted</p>
        <p>We only access basic profile information</p>
        <p>You can unlink accounts anytime in your profile settings</p>
      </div>

      {/* Troubleshooting */}
      {Object.keys(errors).length > 0 && (
        <Card className='border-orange-200 bg-orange-50'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm text-orange-800'>
              Having trouble?
            </CardTitle>
          </CardHeader>
          <CardContent className='pt-0'>
            <ul className='text-xs text-orange-700 space-y-1'>
              <li>• Make sure you're logged into your social media account</li>
              <li>• Check if pop-up blockers are enabled</li>
              <li>• Try refreshing the page and try again</li>
              <li>• Contact support if the issue persists</li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
