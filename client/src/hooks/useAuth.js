import { useAuth } from "../store/authStore";

export const useAuthCheck = () => {
  const { isAuthenticated, user, loading } = useAuth();

  return { isAuthenticated, user, loading };
};

export const usePostPermissions = (post) => {
  const { user, canEditPost, canDeletePost, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user || !post) {
    return { canEdit: false, canDelete: false, isAuthor: false };
  }

  const isAuthor = post.author?._id === user._id || post.author === user._id;
  const canEdit = canEditPost(post);
  const canDelete = canDeletePost(post);

  return { canEdit, canDelete, isAuthor };
};
