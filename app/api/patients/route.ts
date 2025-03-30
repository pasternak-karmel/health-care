import { handleApiError } from "@/lib/api-error";
import { getAuthenticatedUser } from "@/lib/auth-utils";
import { rateLimit } from "@/lib/rate-limit";
import { createPatientSchema, patientQuerySchema } from "@/schemas/patient";
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

    const searchParams = req.nextUrl.searchParams;
    const queryParams = {
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
      search: searchParams.get("search"),
      stage: searchParams.get("stage"),
      status: searchParams.get("status"),
      sortBy: searchParams.get("sortBy"),
      sortOrder: searchParams.get("sortOrder"),
    };

    const validatedParams = patientQuerySchema.parse({
      page: queryParams.page ? Number.parseInt(queryParams.page) : undefined,
      limit: queryParams.limit ? Number.parseInt(queryParams.limit) : undefined,
      search: queryParams.search || undefined,
      stage: queryParams.stage ? Number.parseInt(queryParams.stage) : undefined,
      status: queryParams.status || undefined,
      sortBy: queryParams.sortBy || undefined,
      sortOrder: queryParams.sortOrder || undefined,
    });

    const result = await PatientService.getPatients(validatedParams);

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
