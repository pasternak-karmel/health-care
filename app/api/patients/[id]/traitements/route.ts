import { handleApiError } from "@/lib/api-error";
import { getAuthenticatedUser } from "@/lib/auth-utils";
import { rateLimit } from "@/lib/rate-limit";
import { PatientService } from "@/services/patient-service";
import type { NextRequest } from "next/server";

type Params = Promise<{ id: string }>;

export async function GET(req: NextRequest, segmentData: { params: Params }) {
  try {
    const rateLimitResult = await rateLimit(req, {
      limit: 100,
      window: 60,
    });

    if (rateLimitResult) return rateLimitResult;

    await getAuthenticatedUser(req);

    const params = await segmentData.params;

    
    const result = await PatientService.getPatientTraitements(params.id);

    return Response.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest, segmentData: { params: Params }) {
  try {
    const rateLimitResult = await rateLimit(req, {
      limit: 50,
      window: 60,
    });

    if (rateLimitResult) return rateLimitResult;

    const user = await getAuthenticatedUser(req);
    const params = await segmentData.params;

    const body = await req.json();

    const result = await PatientService.createPatientTraitement(
      user.id,
      params.id,
      body
    );

    return Response.json(result, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
