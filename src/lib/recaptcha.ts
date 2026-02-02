interface RecaptchaV3VerifyResponse {
  success: boolean;
  score?: number; // 0.0 - 1.0 (1.0 is very likely human) - only present on success
  action?: string; // only present on success
  challenge_ts?: string;
  hostname?: string;
  'error-codes'?: string[];
}

// Minimum score threshold (0.5 is Google's recommended default)
const MIN_SCORE = 0.5;

export async function verifyRecaptcha(
  token: string,
  expectedAction: string = 'contact_submit'
): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    console.error('RECAPTCHA_SECRET_KEY environment variable is not set');
    return false;
  }

  if (!token) {
    console.error('No reCAPTCHA token provided');
    return false;
  }

  try {
    const formData = new URLSearchParams();
    formData.append('secret', secretKey);
    formData.append('response', token);

    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      console.error('reCAPTCHA API request failed:', response.status, response.statusText);
      return false;
    }

    const data: RecaptchaV3VerifyResponse = await response.json();

    if (!data.success) {
      console.error('reCAPTCHA verification failed:', data['error-codes']);
      return false;
    }

    // For v3, score and action are only present on successful verification
    if (typeof data.score !== 'number') {
      console.error('reCAPTCHA v3 response missing score - check if you are using a v3 key');
      return false;
    }

    // Verify the action matches what we expect
    if (data.action && data.action !== expectedAction) {
      console.error(`reCAPTCHA action mismatch: expected ${expectedAction}, got ${data.action}`);
      return false;
    }

    // Check the score (1.0 = likely human, 0.0 = likely bot)
    if (data.score < MIN_SCORE) {
      console.log(`reCAPTCHA score too low: ${data.score} < ${MIN_SCORE}`);
      return false;
    }

    console.log(`reCAPTCHA passed with score: ${data.score}`);
    return true;
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return false;
  }
}
