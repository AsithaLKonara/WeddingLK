interface GoogleAuthConfig {
  _clientId: string;
  _clientSecret: string;
  _redirectUri: string;
}

interface GoogleUserInfo {
  _id: string;
  _email: string;
  _verified_email: boolean;
  _name: string;
  _given_name: string;
  _family_name: string;
  _picture: string;
  _locale: string;
}

interface GoogleTokenResponse {
  _access_token: string;
  refresh_token?: string;
  _expires_in: number;
  _token_type: string;
  _scope: string;
}

export const googleAuthHandler = {
  async getAuthUrl(config: GoogleAuthConfig) {
    const params = new URLSearchParams({
      clientid: config.clientId,
      redirect_uri: config.redirectUri,
      scope: 'openid email profile',
      response_type: 'code',
      access_type: 'offline',
      prompt: 'consent',
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  },

  async exchangeCodeForToken(
    _code: string,
    config: GoogleAuthConfig
  ): Promise<GoogleTokenResponse> {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        clientid: config.clientId,
        client_secret: config.clientSecret,
        redirect_uri: config.redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to exchange code for token');
    }

    return response.json();
  },

  async getUserInfo(_accessToken: string): Promise<GoogleUserInfo> {
    const response = await fetch(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch user info');
    }

    return response.json();
  },

  async refreshToken(
    _refreshToken: string,
    config: GoogleAuthConfig
  ): Promise<GoogleTokenResponse> {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        refresh_token: refreshToken,
        clientid: config.clientId,
        client_secret: config.clientSecret,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    return response.json();
  },

  async validateToken(_accessToken: string): Promise<boolean> {
    try {
      const response = await fetch(
        'https://www.googleapis.com/oauth2/v2/userinfo',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.ok;
    } catch {
      return false;
    }
  },
};

export const createGoogleAuthConfig = (): GoogleAuthConfig => ({
  clientId: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  redirectUri: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/callback/google`,
});
