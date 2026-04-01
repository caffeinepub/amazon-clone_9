import { RouterProvider } from "@tanstack/react-router";
import { useEffect } from "react";
import { useActor } from "./hooks/useActor";
import { router } from "./router";

export function SeedInitializer() {
  const { actor, isFetching } = useActor();

  useEffect(() => {
    if (!actor || isFetching) return;
    if (!localStorage.getItem("seeded")) {
      actor
        .seed()
        .then(() => {
          localStorage.setItem("seeded", "true");
        })
        .catch(() => {
          // seed may fail if already seeded; ignore
        });
    }
  }, [actor, isFetching]);

  return null;
}

export default function App() {
  return <RouterProvider router={router} />;
}
