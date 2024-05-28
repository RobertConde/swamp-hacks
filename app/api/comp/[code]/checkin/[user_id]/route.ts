import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Pool } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
/*
@params: id - string (required) - The user ID to search for (part of dynamic route)
@return: 
    - user - object - The user object (Status 200)
    - message - string - The error message (Status 404)
    - status - number - The status code of the request (All responses)

This route is used to find a user by their ID.

@example:
const response = await fetch('http://localhost:3000/api/user/shhewubuvduh32');
*/

export const POST = async (
  req: NextRequest,
  { params }: { params: { code: string; user_id: string } }
) => {
  const code = params.code;
  const user_id = params.user_id;

  const neon = new Pool({ connectionString: process.env.POSTGRES_PRISMA_URL });
  const adapter = new PrismaNeon(neon);
  const prisma = new PrismaClient({ adapter });

  try {
    const response = await prisma.attendees.create({
      data: {
        user: {
          connect: {
            id: user_id,
          },
        },
        competition: {
          connect: {
            code: code,
          },
        },
        points: 0,
      },
    });

    return NextResponse.json({ attendee: response, status: 200 });
  } catch (e) {
    return NextResponse.json({ message: e, status: 500 });
  }
};
