import { createComment } from "@/api/comment";
import type { UseMutationCallback } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/constants";

export function useCreateComment(callbacks?: UseMutationCallback) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      content,
    }: {
      postId: number;
      content: string;
    }) => {
      if (!Number.isFinite(postId)) {
        throw new Error("Invalid postId in createComment");
      }

      return createComment({ postId, content });
    },

    onSuccess: (_data, variables) => {
      const { postId } = variables;

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.comment.post(postId),
      });

      callbacks?.onSuccess?.();
    },

    onError: (error) => {
      callbacks?.onError?.(error);
    },
  });
}
