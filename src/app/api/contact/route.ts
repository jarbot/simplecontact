import { NextRequest, NextResponse } from 'next/server';
import { sendContactNotification } from '@/lib/email';
import { verifyRecaptcha } from '@/lib/recaptcha';
import { getConfig } from '@/lib/config';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/ratelimit';

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                      request.headers.get('x-real-ip') ||
                      'unknown';

    // Check rate limit
    const rateLimitResult = checkRateLimit(ipAddress);
    const rateLimitHeaders = getRateLimitHeaders(rateLimitResult);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Too many submissions. Please try again later.' },
        { status: 429, headers: rateLimitHeaders }
      );
    }

    const config = getConfig();
    const body = await request.json();
    const { name, email, recaptchaToken } = body;

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Verify reCAPTCHA if enabled
    if (config.contactForm.recaptcha.enabled) {
      if (!recaptchaToken) {
        return NextResponse.json(
          { error: 'reCAPTCHA verification required' },
          { status: 400 }
        );
      }

      const isValidCaptcha = await verifyRecaptcha(recaptchaToken);
      if (!isValidCaptcha) {
        return NextResponse.json(
          { error: 'reCAPTCHA verification failed. Please try again.' },
          { status: 400 }
        );
      }
    }

    // Get client info
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Send email notification
    const result = await sendContactNotification({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      ipAddress,
      userAgent,
    });

    if (!result.success) {
      console.error('Failed to send notification:', result.error);
      return NextResponse.json(
        { error: 'Failed to process submission. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Message sent successfully',
      },
      { status: 201, headers: rateLimitHeaders }
    );
  } catch (error) {
    console.error('Contact submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
