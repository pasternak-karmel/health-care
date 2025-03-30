import { createId } from "@paralleldrive/cuid2";
import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const patient = pgTable("patient", {
  id: uuid("id").defaultRandom().primaryKey().$defaultFn(createId),
  firstname: text("firstname").notNull(),
  lastname: text("lastname").notNull(),
  birthdate: text("birthdate").notNull(),
  email: text("email").notNull(),
  sex: text("sex").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const infoMedical = pgTable("information_medical", {
  id: uuid("id").defaultRandom().primaryKey().$defaultFn(createId),
  patientId: uuid("patient_id")
    .notNull()
    .references(() => patient.id, { onDelete: "cascade" }),
  stade: integer("stade").notNull().default(1),
  status: text("status").notNull().default("stable"),
  medecin: text("medecin").notNull(),
  dfg: integer("dfg").notNull().default(0),
  previousDfg: integer("previous_dfg").notNull().default(0),
  proteinurie: integer("proteinurie").notNull().default(0),
  previousProteinurie: integer("previous_proteinurie").notNull().default(0),
  lastvisite: timestamp("last_visit", { withTimezone: true }).notNull(),
  nextvisite: timestamp("next_visit", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const historique = pgTable("historique", {
  id: uuid("id").defaultRandom().primaryKey().$defaultFn(createId),
  patientId: uuid("patient_id")
    .notNull()
    .references(() => patient.id, { onDelete: "cascade" }),
  date: timestamp("date", { withTimezone: true }).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(),
  medecin: text("medecin")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
