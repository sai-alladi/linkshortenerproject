import { redirect } from 'next/navigation';
import { getLinkByShortCode } from '@/data/links';
import type { NextRequest } from 'next/server';

interface RouteParams {
  params: Promise<{
    shortcode: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { shortcode } = await params;

  if (!shortcode) {
    return new Response('Short code not found', { status: 404 });
  }

  try {
    const link = await getLinkByShortCode(shortcode);

    if (!link) {
      return new Response('Link not found', { status: 404 });
    }

    // Redirect to the original URL
    redirect(link.originalUrl);
  } catch (error) {
    console.error('Error retrieving link:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
