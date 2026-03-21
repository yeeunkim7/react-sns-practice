import supabase from "@/lib/supabase";
import { QUERY_KEYS } from "@/lib/constants";
import { type Post, type UseMutationCallback } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface ToggleLikeArgs {
  postId: number;
  userId: string;
}

export default function useTogglePostLike(callbacks?: UseMutationCallback) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, userId }: ToggleLikeArgs) => {
      const { data, error } = await supabase.rpc("toggle_post_like", {
        p_post_id: postId,
        p_user_id: userId,
      });
      if (error) throw error;
      return data;
    },
    onMutate: async ({ postId }) => {
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.post.byId(postId),
      });

      const prevPost = queryClient.getQueryData<Post>(
        QUERY_KEYS.post.byId(postId),
      );

      queryClient.setQueryData<Post>(QUERY_KEYS.post.byId(postId), (post) => {
        if (!post) throw new Error("포스트가 존재하지 않습니다.");
        return {
          ...post,
          isLiked: !post.isLiked,
          like_count: post.isLiked ? post.like_count - 1 : post.like_count + 1,
        };
      });

      return {
        prevPost,
      };
    },
    onSuccess: () => {
      if (callbacks?.onSuccess) callbacks.onSuccess();
    },
    onError: (error, _, context) => {
      if (context && context.prevPost) {
        queryClient.setQueryData(
          QUERY_KEYS.post.byId(context.prevPost.id),
          context.prevPost,
        );
      }
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}