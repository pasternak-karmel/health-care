import { db } from "@/db";
import { infoMedical, patient } from "@/db/schema";
import { ApiError } from "@/lib/api-error";
import { deleteCache, deleteCacheByPattern, withCache } from "@/lib/cache";
import type {
  CreatePatientInput,
  PatientQueryParams,
  UpdatePatientInput,
} from "@/schemas/patient";
import { and, asc, desc, eq, sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export class PatientService {
  /**
   * Get all patients with pagination and filtering
   */
  static async getPatients(params: PatientQueryParams) {
    const { page, limit, search, stage, status, sortBy, sortOrder } = params;
    const offset = (page - 1) * limit;

    // Build the cache key based on query parameters
    const cacheKey = `patients:list:${page}:${limit}:${search || ""}:${
      stage || ""
    }:${status || ""}:${sortBy}:${sortOrder}`;

    return withCache(cacheKey, async () => {
      // Build the where clause based on filters
      let whereClause = undefined;
      const filters = [];

      if (search) {
        filters.push(
          sql`(${patient.firstname} || ' ' || ${
            patient.lastname
          }) ILIKE ${`%${search}%`}`
        );
      }

      if (stage) {
        filters.push(eq(infoMedical.stade, stage));
      }

      if (status) {
        filters.push(eq(infoMedical.status, status));
      }

      if (filters.length > 0) {
        whereClause = and(...filters);
      }

      // Build the order by clause
      const orderBy = (() => {
        const direction = sortOrder === "asc" ? asc : desc;

        switch (sortBy) {
          case "name":
            return [direction(patient.lastname), direction(patient.firstname)];
          case "stage":
            return [direction(infoMedical.stade)];
          case "dfg":
            return [direction(infoMedical.dfg)];
          case "lastVisit":
            return [direction(infoMedical.lastvisite)];
          default:
            return [direction(patient.lastname), direction(patient.firstname)];
        }
      })();

      // Execute the query with a join to get medical info
      const patients = await db
        .select({
          id: patient.id,
          firstname: patient.firstname,
          lastname: patient.lastname,
          birthdate: patient.birthdate,
          email: patient.email,
          sex: patient.sex,
          phone: patient.phone,
          address: patient.address,
          createdAt: patient.createdAt,
          updatedAt: patient.updatedAt,
          medicalInfo: {
            id: infoMedical.id,
            stade: infoMedical.stade,
            status: infoMedical.status,
            medecin: infoMedical.medecin,
            dfg: infoMedical.dfg,
            proteinurie: infoMedical.proteinurie,
            lastvisite: infoMedical.lastvisite,
            nextvisite: infoMedical.nextvisite,
          },
        })
        .from(patient)
        .leftJoin(infoMedical, eq(patient.id, infoMedical.patientId))
        .where(whereClause)
        .orderBy(...orderBy)
        .limit(limit)
        .offset(offset);

      // Get total count for pagination
      const [{ count }] = await db
        .select({ count: sql<number>`count(*)` })
        .from(patient)
        .leftJoin(infoMedical, eq(patient.id, infoMedical.patientId))
        .where(whereClause);

      return {
        data: patients,
        pagination: {
          page,
          limit,
          totalItems: count,
          totalPages: Math.ceil(count / limit),
        },
      };
    });
  }

  /**
   * Get a patient by ID
   */
  static async getPatientById(id: string) {
    const cacheKey = `patients:${id}`;

    return withCache(cacheKey, async () => {
      const [result] = await db
        .select({
          id: patient.id,
          firstname: patient.firstname,
          lastname: patient.lastname,
          birthdate: patient.birthdate,
          email: patient.email,
          sex: patient.sex,
          phone: patient.phone,
          address: patient.address,
          createdAt: patient.createdAt,
          updatedAt: patient.updatedAt,
          medicalInfo: {
            id: infoMedical.id,
            stade: infoMedical.stade,
            status: infoMedical.status,
            medecin: infoMedical.medecin,
            dfg: infoMedical.dfg,
            proteinurie: infoMedical.proteinurie,
            lastvisite: infoMedical.lastvisite,
            nextvisite: infoMedical.nextvisite,
          },
        })
        .from(patient)
        .leftJoin(infoMedical, eq(patient.id, infoMedical.patientId))
        .where(eq(patient.id, id));

      if (!result) {
        throw ApiError.notFound(`Patient with ID ${id} not found`);
      }

      return result;
    });
  }

  /**
   * Create a new patient
   */
  static async createPatient(data: CreatePatientInput) {
    const {
      firstname,
      lastname,
      birthdate,
      sex,
      email,
      phone,
      address,
      medicalInfo,
    } = data;
    const patientId = uuidv4();
    const now = new Date();

    try {
      await db.transaction(async (tx) => {
        await tx.insert(patient).values({
          id: patientId,
          firstname,
          lastname,
          birthdate,
          sex,
          email,
          phone,
          address,
        });

        await tx.insert(infoMedical).values({
          id: uuidv4(),
          patientId,
          stade: medicalInfo.stage,
          status: medicalInfo.status,
          medecin: medicalInfo.medecin,
          dfg: medicalInfo.dfg,
          previousDfg: medicalInfo.dfg,
          proteinurie: medicalInfo.proteinurie,
          previousProteinurie: medicalInfo.proteinurie,
          lastvisite: now,
          nextvisite: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        });
      });

      await deleteCacheByPattern("patients:list:*");

      return this.getPatientById(patientId);
    } catch (error) {
      console.error("Error creating patient:", error);

      if (error instanceof ApiError) {
        throw error;
      }

      throw ApiError.internalServer("Failed to create patient");
    }
  }

  /**
   * Update a patient
   */
  static async updatePatient(id: string, data: UpdatePatientInput) {
    const now = new Date();

    try {
      // Check if patient exists
      const existingPatient = await this.getPatientById(id);

      // Use a transaction to update both patient and medical info
      await db.transaction(async (tx) => {
        // Update patient if there are patient fields to update
        const patientFields = {
          firstname: data.firstname,
          lastname: data.lastname,
          birthdate: data.birthdate,
          sex: data.sex,
          email: data.email,
          phone: data.phone,
          address: data.address,
          updatedAt: now,
        };

        const hasPatientUpdates = Object.values(patientFields).some(
          (value) => value !== undefined
        );

        if (hasPatientUpdates) {
          await tx.update(patient).set(patientFields).where(eq(patient.id, id));
        }

        if (data.medicalInfo) {
          const { stage, status, medecin, dfg, proteinurie } = data.medicalInfo;

          const medicalFields: any = {
            updatedAt: now,
          };

          if (stage !== undefined) medicalFields.stade = stage;
          if (status !== undefined) medicalFields.status = status;
          if (medecin !== undefined) medicalFields.medecin = medecin;

          if (dfg !== undefined) {
            medicalFields.previousDfg = existingPatient.medicalInfo.dfg;
            medicalFields.dfg = dfg;
          }

          if (proteinurie !== undefined) {
            medicalFields.previousProteinurie =
              existingPatient.medicalInfo.proteinurie;
            medicalFields.proteinurie = proteinurie;
          }

          await tx
            .update(infoMedical)
            .set(medicalFields)
            .where(eq(infoMedical.patientId, id));
        }
      });

      // Invalidate cache
      await deleteCache(`patients:${id}`);
      await deleteCacheByPattern("patients:list:*");

      // Get the updated patient
      return this.getPatientById(id);
    } catch (error) {
      console.error("Error updating patient:", error);

      if (error instanceof ApiError) {
        throw error;
      }

      throw ApiError.internalServer("Failed to update patient");
    }
  }

  /**
   * Delete a patient
   */
  static async deletePatient(id: string) {
    try {
      // Check if patient exists
      await this.getPatientById(id);

      // Delete patient (cascade will delete related records)
      await db.delete(patient).where(eq(patient.id, id));

      // Invalidate cache
      await deleteCache(`patients:${id}`);
      await deleteCacheByPattern("patients:list:*");

      return { success: true };
    } catch (error) {
      console.error("Error deleting patient:", error);

      if (error instanceof ApiError) {
        throw error;
      }

      throw ApiError.internalServer("Failed to delete patient");
    }
  }

  /**
   * Get dashboard statistics
   */
  static async getDashboardStats() {
    const cacheKey = "dashboard:stats";

    return withCache(
      cacheKey,
      async () => {
        // Get total patient count
        const [{ count: totalPatients }] = await db
          .select({ count: sql<number>`count(*)` })
          .from(patient);

        // Get patients by stage
        const stageDistribution = await db
          .select({
            stage: infoMedical.stade,
            count: sql<number>`count(*)`,
          })
          .from(infoMedical)
          .groupBy(infoMedical.stade)
          .orderBy(asc(infoMedical.stade));

        // Get patients by status
        const statusDistribution = await db
          .select({
            status: infoMedical.status,
            count: sql<number>`count(*)`,
          })
          .from(infoMedical)
          .groupBy(infoMedical.status);

        // Get critical patients count
        const [{ count: criticalPatients }] = await db
          .select({ count: sql<number>`count(*)` })
          .from(infoMedical)
          .where(eq(infoMedical.status, "critical"));

        // Get upcoming appointments (next 7 days)
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);

        const upcomingAppointments = await db
          .select({
            id: patient.id,
            firstname: patient.firstname,
            lastname: patient.lastname,
            appointmentDate: infoMedical.nextvisite,
          })
          .from(patient)
          .innerJoin(infoMedical, eq(patient.id, infoMedical.patientId))
          .where(
            and(
              sql`${infoMedical.nextvisite} >= CURRENT_DATE`,
              sql`${infoMedical.nextvisite} <= ${nextWeek}`
            )
          )
          .orderBy(asc(infoMedical.nextvisite))
          .limit(5);

        return {
          totalPatients,
          stageDistribution,
          statusDistribution,
          criticalPatients,
          upcomingAppointments,
        };
      },
      300
    );
  }
}
