import { db } from "@/db";
import { calculations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// DELETE a calculation by id
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const calcId = parseInt(id, 10);

    if (isNaN(calcId)) {
      return NextResponse.json(
        { success: false, error: "Invalid ID" },
        { status: 400 }
      );
    }

    await db.delete(calculations).where(eq(calculations.id, calcId));

    return NextResponse.json({ success: true, message: "Calculation deleted" });
  } catch (error) {
    console.error("Failed to delete calculation:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete calculation" },
      { status: 500 }
    );
  }
}
