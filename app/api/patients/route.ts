import { handleApiError } from "@/lib/api-error";
import { getAuthenticatedUser } from "@/lib/auth-utils";
import { rateLimit } from "@/lib/rate-limit";
import { createPatientSchema } from "@/schemas/patient";
import { PatientService } from "@/services/patient-service";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const rateLimitResult = await rateLimit(req, {
      limit: 100,
      window: 60,
    });

    if (rateLimitResult) return rateLimitResult;

    await getAuthenticatedUser(req);

    const result = await PatientService.getPatients();

    return Response.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const rateLimitResult = await rateLimit(req, {
      limit: 20,
      window: 60,
    });

    if (rateLimitResult) return rateLimitResult;

    await getAuthenticatedUser(req);

    const body = await req.json();
    const validatedData = createPatientSchema.parse(body);

    const result = await PatientService.createPatient(validatedData);

    return Response.json(result, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
