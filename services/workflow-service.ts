import { db } from "@/db";
import {
  historique,
  infoMedical,
  patient,
  workflow,
  workflowPatient,
} from "@/db/schema";
import { ApiError } from "@/lib/api-error";
import { auth } from "@/lib/auth";
import { deleteCache, withCache } from "@/lib/cache";
import { headers } from "next/headers";
import { and, asc, desc, eq, ilike, inArray, like, or, sql } from "drizzle-orm";
import { CreateWorkflowInput, WorkflowQueryParams } from "@/schemas/workflow";
import { v4 as uuidv4 } from "uuid";
import { formatDate } from "@/lib/utils";

export class WorkflowService {
  static async getWorkflows(params?: WorkflowQueryParams) {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = "title",
      sortOrder = "asc",
    } = params || {};

    const offset = (page - 1) * limit;
    const cacheKey = `workflows:${JSON.stringify(params)}`;

    return withCache(cacheKey, async () => {
      // Build the where clause based on filters
      let whereClause = undefined;
      const filters = [];

      if (search) {
        filters.push(
          or(
            ilike(workflow.title, `%${search}%`),
            ilike(workflow.description, `%${search}%`)
          )
        );
      }

      if (filters.length > 0) {
        whereClause = and(...filters);
      }

      // Build the order by clause
      const orderBy = (() => {
        const direction = sortOrder === "asc" ? asc : desc;

        switch (sortBy) {
          case "title":
            return [direction(workflow.title)];
          default:
            return [direction(workflow.createdAt)];
        }
      })();

      // Execute the query
      const workflows = await db
        .select({
          id: workflow.id,
          title: workflow.title,
          description: workflow.description,
          createdAt: workflow.createdAt,
          lastUpdated: workflow.updatedAt,
        })
        .from(workflow)
        .where(whereClause)
        .orderBy(...orderBy)
        .limit(limit)
        .offset(offset);

      const newWorkflows = await Promise.all(
        workflows.map(async (workflow) => {
          const [{ patients }] = await db
            .select({ patients: sql<number>`count(*)` })
            .from(workflowPatient)
            .where(eq(workflowPatient.workflowId, workflow.id));

            const [{ alerts }] = await db
                .select({ alerts: sql<number>`count(*)` })
                .from(workflowPatient)
                .innerJoin(historique, eq(historique.patientId, workflowPatient.patientId))
                .where(
                    and(
                        eq(historique.type, "alert"),
                        eq(workflowPatient.workflowId, workflow.id)
                    )
                );
        
            return {
            ...workflow,
            patients,
            alerts,
            lastUpdated: formatDate(workflow.lastUpdated),
          };
        })
      );

      console.log(newWorkflows);

      //   workflows.map(async (workflow) => {
      //     const [{ patients }] = await db
      //       .select({ patients: sql<number>`count(*)` })
      //       .from(workflowPatient)
      //       .where(eq(workflowPatient.workflowId, workflow.id));

      //     const [{ alerts }] = await db
      //       .select({ alerts: sql<number>`count(*)` })
      //       .from(historique)
      //       .where(
      //         and(
      //           eq(historique.type, "alert")
      //           // eq(historique.)
      //         )
      //       );
      //   });

      // Get total count for pagination
      const [{ count }] = await db
        .select({ count: sql<number>`count(*)` })
        .from(workflow)
        .where(whereClause);

      return {
        data: newWorkflows,
        pagination: {
          page,
          limit,
          totalItems: Number(count),
          totalPages: Math.ceil(Number(count) / limit),
        },
      };
    });
  }

  static async getWorkflowById(id: string) {
    const cacheKey = `workflows:${id}`;

    return withCache(cacheKey, async () => {
      const [result] = await db
        .select()
        .from(workflow)
        .where(eq(workflow.id, id));

      if (!result) {
        throw ApiError.notFound(`Workflow with ID ${id} not found`);
      }

      return result;
    });
  }

  static async createWorkflow(data: CreateWorkflowInput) {
    const { title, description } = data;

    try {
      const medecin = await auth.api.getSession({
        headers: await headers(),
      });

      if (!medecin || !medecin.user) {
        throw ApiError.unauthorized(
          "Vous devez être connecté pour créer un workflow"
        );
      }

      const tx = await db.transaction(async (trx) => {
        const [insertedWorkflow] = await trx
          .insert(workflow)
          .values({
            id: uuidv4(),
            title,
            description,
          })
          .returning();

        return insertedWorkflow;
      });

      return this.getWorkflowById(tx.id);
    } catch (error) {
      console.log(error);
      if (error instanceof ApiError) {
        throw error;
      }

      throw ApiError.internalServer("Erreur lors de la création du workflow");
    }

    // const workflow = await db.workflow.create(data);
    // return workflow;
  }
}
