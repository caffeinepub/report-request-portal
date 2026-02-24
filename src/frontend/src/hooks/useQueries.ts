import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ReportRequest, ReportRequestInput, ReviewInput } from '../backend';
import { Principal } from '@dfinity/principal';

export function useGetRequests() {
  const { actor, isFetching } = useActor();

  return useQuery<ReportRequest[]>({
    queryKey: ['requests'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRequests();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ReportRequestInput) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.submitRequest(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    },
  });
}

export function useReviewRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ user, input }: { user: Principal; input: ReviewInput }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.reviewRequest(user, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    },
  });
}
