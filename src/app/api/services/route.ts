import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { guest_name, guest_contact, service_type, description, user_id } = body;

    if (!guest_name || !guest_contact || !service_type || !description) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const serviceRequest = await prisma.serviceRequest.create({
      data: {
        guest_name,
        guest_contact,
        service_type,
        description,
        user_id: user_id || null,
        status: 'NEW',
      },
    });

    return NextResponse.json({ success: true, serviceRequest });
  } catch (error) {
    console.error('API service request error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create service request' },
      { status: 500 }
    );
  }
}
