import { db } from "@/db";
import { calculations } from "@/db/schema";
import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET all calculations
export async function GET() {
  try {
    const allCalculations = await db
      .select()
      .from(calculations)
      .orderBy(desc(calculations.createdAt));

    return NextResponse.json({ success: true, data: allCalculations });
  } catch (error) {
    console.error("Failed to fetch calculations:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch calculations" },
      { status: 500 }
    );
  }
}

// POST new calculation
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, principal, interestRate, startDate, endDate, finalAmount, totalInterest, years, months, days, breakdown } = body;

    if (!name || !principal || !interestRate || !startDate || !endDate) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const inserted = await db
      .insert(calculations)
      .values({
        name,
        principal: String(principal),
        interestRate: String(interestRate),
        startDate,
        endDate,
        finalAmount: String(finalAmount),
        totalInterest: String(totalInterest),
        years: years ?? 0,
        months: months ?? 0,
        days: days ?? 0,
        breakdown: breakdown ?? [],
      })
      .returning();

    return NextResponse.json({ success: true, data: inserted[0] }, { status: 201 });
  } catch (error) {
    console.error("Failed to save calculation:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save calculation" },
      { status: 500 }
    );
  }
}
