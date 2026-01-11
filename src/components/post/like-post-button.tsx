import { useState } from "react";
import useTogglePostLike from "@/hooks/mutations/post/use-toggle-post-like";
import { useSession } from "@/store/session";
import { HeartIcon } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function LikePostButton({
  id,
  likeCount,
  isLiked,
}: {
  id: number;
  likeCount: number;
  isLiked: boolean;
}) {
  const session = useSession();
  const queryClient = useQueryClient();

  // 🔥 UI 즉시 업데이트를 위한 로컬 상태
  const [liked, setLiked] = useState(isLiked);
  const [count, setCount] = useState(likeCount);

  const { mutate: togglePostLike } = useTogglePostLike({
    onSuccess: () => {
  // 서버 데이터 새로고침
  queryClient.invalidateQueries({ queryKey: ["post", id] });
  queryClient.invalidateQueries({ queryKey: ["postList"] });
},

    onError: () => {
      toast.error("좋아요 요청에 실패했습니다", {
        position: "top-center",
      });
    },
  });

  const handleLikeClick = () => {
    // UI 즉시 반영
    setLiked((prev) => !prev);
    setCount((prev) => prev + (liked ? -1 : 1));

    // 서버 반영
    togglePostLike({
      postId: id,
      userId: session!.user.id,
    });
  };

  return (
    <div
      onClick={handleLikeClick}
      className="hover:bg-muted flex cursor-pointer items-center gap-2 rounded-xl border-1 p-2 px-4 text-sm"
    >
      <HeartIcon
        className={`h-4 w-4 transition ${
          liked ? "fill-red-500 stroke-red-500" : "fill-none stroke-current"
        }`}
      />
      <span>{count}</span>
    </div>
  );
}
