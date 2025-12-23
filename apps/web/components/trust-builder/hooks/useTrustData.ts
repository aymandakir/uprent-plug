"use client";

import { trpc } from "../../../lib/trpc/client";
import { useMemo } from "react";

export function useLiveActivity(limit = 20) {
  const query = trpc.activity.list.useQuery({ limit }, { staleTime: 15_000 });
  const events = useMemo(() => query.data ?? [], [query.data]);
  return { events, query };
}

export function useTrustCounters() {
  const query = trpc.properties.counters.useQuery(undefined, { staleTime: 10_000 });
  return query;
}

