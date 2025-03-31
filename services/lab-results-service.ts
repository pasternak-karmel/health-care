import { db } from "@/db";
import { labResults, patient } from "@/db/schema";
import { ApiError } from "@/lib/api-error";
import { deleteCache, deleteCacheByPattern, withCache } from "@/lib/cache";
import { and, asc, desc, eq, gte, lte, type SQL, sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export interface LabResultFilters {
  startDate?: string;
  endDate?: string;
  abnormalOnly?: boolean;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface LabTestResult {
  name: string;
  value: number;
  unit: string;
  referenceMin?: number;
  referenceMax?: number;
  isAbnormal: boolean;
}

export interface CreateLabResultInput {
  patientId: string;
  date: string;
  results: LabTestResult[];
  labName?: string;
  notes?: string;
}

export class LabResultsService {
  /**
   * Get lab results for a patient with pagination and filtering
   */
  static async getLabResults(
    patientId: string,
    filters: LabResultFilters = {}
  ) {
    const {
      startDate,
      endDate,
      abnormalOnly = false,
      sortOrder = "desc",
      page = 1,
      limit = 10,
    } = filters;

    const offset = (page - 1) * limit;

    // Build the cache key based on query parameters
    const cacheKey = `patients:${patientId}:labs:${page}:${limit}:${
      startDate || ""
    }:${endDate || ""}:${abnormalOnly}:${sortOrder}`;

    return withCache(cacheKey, async () => {
      // Check if patient exists
      const [patientExists] = await db
        .select({ id: patient.id })
        .from(patient)
        .where(eq(patient.id, patientId));

      if (!patientExists) {
        throw ApiError.notFound(`Patient with ID ${patientId} not found`);
      }

      // Build the where clause based on filters
      let whereClause = eq(labResults.patientId, patientId);
      const filterConditions = [whereClause];

      if (startDate) {
        filterConditions.push(gte(labResults.date, new Date(startDate)));
      }

      if (endDate) {
        filterConditions.push(lte(labResults.date, new Date(endDate)));
      }

      if (abnormalOnly) {
        filterConditions.push(
          sql`${labResults.results}::jsonb @> '[{"isAbnormal": true}]'`
        );
      }

      whereClause = and(...filterConditions) as SQL<unknown>;

      // Build the order by clause
      const orderBy =
        sortOrder === "asc" ? asc(labResults.date) : desc(labResults.date);

      // Execute the query
      const results = await db
        .select()
        .from(labResults)
        .where(whereClause)
        .orderBy(orderBy)
        .limit(limit)
        .offset(offset);

      // Get total count for pagination
      const [{ count }] = await db
        .select({ count: sql<number>`count(*)` })
        .from(labResults)
        .where(whereClause);

      return {
        data: results,
        pagination: {
          page,
          limit,
          totalItems: Number(count),
          totalPages: Math.ceil(Number(count) / limit),
        },
      };
    });
  }

  /**
   * Get a lab result by ID
   */
  static async getLabResultById(id: string) {
    const cacheKey = `lab-results:${id}`;

    return withCache(cacheKey, async () => {
      const [result] = await db
        .select()
        .from(labResults)
        .where(eq(labResults.id, id));

      if (!result) {
        throw ApiError.notFound(`Lab result with ID ${id} not found`);
      }

      return result;
    });
  }

  /**
   * Create a new lab result
   */
  static async createLabResult(data: CreateLabResultInput) {
    const { patientId, date, results, labName, notes } = data;
    const id = uuidv4();
    const now = new Date();

    try {
      // Check if patient exists
      const [patientExists] = await db
        .select({ id: patient.id })
        .from(patient)
        .where(eq(patient.id, patientId));

      if (!patientExists) {
        throw ApiError.notFound(`Patient with ID ${patientId} not found`);
      }

      // Insert lab result
      await db.insert(labResults).values({
        id,
        patientId,
        date: new Date(date),
        results: JSON.stringify(results),
        labName: labName || null,
        notes: notes || null,
        createdAt: now,
        updatedAt: now,
      });

      // Invalidate cache
      await deleteCacheByPattern(`patients:${patientId}:labs:*`);

      // Get the created record
      return this.getLabResultById(id);
    } catch (error) {
      console.error("Error creating lab result:", error);

      if (error instanceof ApiError) {
        throw error;
      }

      throw ApiError.internalServer("Failed to create lab result");
    }
  }

  /**
   * Update a lab result
   */
  static async updateLabResult(
    id: string,
    data: Partial<{
      date: string;
      results: LabTestResult[];
      labName?: string;
      notes?: string;
    }>
  ) {
    const now = new Date();

    try {
      // Check if record exists
      const existingResult = await this.getLabResultById(id);

      // Prepare update fields
      const updateFields: any = {
        updatedAt: now,
      };

      if (data.date) updateFields.date = new Date(data.date);
      if (data.results) updateFields.results = JSON.stringify(data.results);
      if (data.labName !== undefined)
        updateFields.labName = data.labName || null;
      if (data.notes !== undefined) updateFields.notes = data.notes || null;

      // Update record
      await db
        .update(labResults)
        .set(updateFields)
        .where(eq(labResults.id, id));

      // Invalidate cache
      await deleteCache(`lab-results:${id}`);
      await deleteCacheByPattern(`patients:${existingResult.patientId}:labs:*`);

      // Get the updated record
      return this.getLabResultById(id);
    } catch (error) {
      console.error("Error updating lab result:", error);

      if (error instanceof ApiError) {
        throw error;
      }

      throw ApiError.internalServer("Failed to update lab result");
    }
  }

  /**
   * Delete a lab result
   */
  static async deleteLabResult(id: string) {
    try {
      // Check if record exists
      const existingResult = await this.getLabResultById(id);

      // Delete record
      await db.delete(labResults).where(eq(labResults.id, id));

      // Invalidate cache
      await deleteCache(`lab-results:${id}`);
      await deleteCacheByPattern(`patients:${existingResult.patientId}:labs:*`);

      return { success: true, message: "Lab result deleted successfully" };
    } catch (error) {
      console.error("Error deleting lab result:", error);

      if (error instanceof ApiError) {
        throw error;
      }

      throw ApiError.internalServer("Failed to delete lab result");
    }
  }

  /**
   * Get lab result trends for a specific test
   */
  static async getLabResultTrends(patientId: string, testName: string) {
    const cacheKey = `patients:${patientId}:labs:trends:${testName}`;

    return withCache(
      cacheKey,
      async () => {
        // Check if patient exists
        const [patientExists] = await db
          .select({ id: patient.id })
          .from(patient)
          .where(eq(patient.id, patientId));

        if (!patientExists) {
          throw ApiError.notFound(`Patient with ID ${patientId} not found`);
        }

        // Get all lab results for this patient
        const results = await db
          .select({
            id: labResults.id,
            date: labResults.date,
            results: labResults.results,
          })
          .from(labResults)
          .where(eq(labResults.patientId, patientId))
          .orderBy(asc(labResults.date));

        // Extract the specific test values from each result
        const trends = results
          .map((result) => {
            const parsedResults = JSON.parse(result.results);
            const testResult = parsedResults.find(
              (r: LabTestResult) =>
                r.name.toLowerCase() === testName.toLowerCase()
            );

            return {
              date: result.date,
              value: testResult?.value || null,
              unit: testResult?.unit || null,
              isAbnormal: testResult?.isAbnormal || false,
              referenceMin: testResult?.referenceMin,
              referenceMax: testResult?.referenceMax,
            };
          })
          .filter((item) => item.value !== null);

        return trends;
      },
      300
    ); // Cache for 5 minutes
  }

  /**
   * Get all available test names for a patient
   */
  static async getAvailableTestNames(patientId: string) {
    const cacheKey = `patients:${patientId}:labs:test-names`;

    return withCache(
      cacheKey,
      async () => {
        // Check if patient exists
        const [patientExists] = await db
          .select({ id: patient.id })
          .from(patient)
          .where(eq(patient.id, patientId));

        if (!patientExists) {
          throw ApiError.notFound(`Patient with ID ${patientId} not found`);
        }

        // Get all lab results for this patient
        const results = await db
          .select({
            results: labResults.results,
          })
          .from(labResults)
          .where(eq(labResults.patientId, patientId));

        // Extract all unique test names
        const testNames = new Set<string>();

        results.forEach((result) => {
          const parsedResults = JSON.parse(result.results);
          parsedResults.forEach((r: LabTestResult) => {
            testNames.add(r.name);
          });
        });

        return Array.from(testNames).sort();
      },
      300
    ); // Cache for 5 minutes
  }
}
