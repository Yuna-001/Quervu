import { GitHubLoginButton } from '@/components/auth/github-login-button';
import { GoogleLoginButton } from '@/components/auth/google-login-button';

export default function LoginPage() {
  return (
    <>
      <GoogleLoginButton />
      <GitHubLoginButton />
    </>
  );
}
