"use client";

// TODO: Set up tRPC client
// import { trpc } from "../../../lib/trpc/client";
import { useMemo } from "react";

export function useLiveActivity(_limit = 20) {
  // TODO: Replace with tRPC query
  const query = { data: [], isLoading: false, error: null };
  const events = useMemo(() => query.data ?? [], [query.data]);
  return { events, query };
}

export function useTrustCounters() {
  // TODO: Replace with tRPC query
  const query = { data: null, isLoading: false, error: null };
  return query;
}

