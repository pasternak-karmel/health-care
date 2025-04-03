"use client";

import TaskForm from "@/components/tasks/task-form";
import { useEffect, useState } from "react";

export default function NewTaskPage() {
    const [patientId, setPatientId] = useState<string | null>(null);
    const [redirectTo, setRedirectTo] = useState<string | null>(null);

    useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get("patientId");
      const redirectTo = urlParams.get("redirectTo");
      if (redirectTo) setRedirectTo(redirectTo);
      if (id) {
        setPatientId(id);
      }
    }, []);

  return <TaskForm patientId={patientId as string} redirectTo={redirectTo || "/workflows" as string} />;
}
