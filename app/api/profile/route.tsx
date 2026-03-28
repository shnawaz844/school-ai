import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const user = await currentUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { studentClass, subjects } = await req.json();

        const result = await db.update(usersTable)
            .set({ 
                studentClass: studentClass,
                subjects: subjects
            })
            //@ts-ignore
            .where(eq(usersTable.email, user.primaryEmailAddress?.emailAddress ?? ''))
            .returning();

        return NextResponse.json(result[0]);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }
}
