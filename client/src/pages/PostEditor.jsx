import { useState } from "react";
import { useForm } from "react-hook-form";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Extension } from "@tiptap/core";
import Heading from "@tiptap/extension-heading";
import OrderedList from "@tiptap/extension-ordered-list";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import CodeBlock from "@tiptap/extension-code-block";
import Blockquote from "@tiptap/extension-blockquote";
import { usePosts } from "../store/postStore";
import { useUploads } from "../store/uploadStore";
import { toast } from "react-toastify";
import {
  HiOutlineTrash,
  HiOutlineArrowsExpand,
  HiOutlineX,
} from "react-icons/hi";
import {
  fetchAllCategories,
  fetchAllTags,
  suggestCategoriesFromContent,
  suggestTagsFromContent,
} from "../services/metaService";
import SmartChipsInput from "../components/Forms/SmartChipsInput";
import TiptapMenu from "../components/Posts/TiptapMenu";
import Navbar from "../components/Common/Navbar";

const PostEditor = ({ initialData = {}, onSubmitSuccess, isEditMode }) => {
  const [fullscreen, setFullscreen] = useState(false);
  const [categories, setCategories] = useState(() => {
    if (Array.isArray(initialData.categories)) {
      return initialData.categories.map((cat) =>
        typeof cat === "string" ? cat : cat.name
      );
    }
    return [];
  });

  const [tags, setTags] = useState(
    Array.isArray(initialData.tags) ? initialData.tags : []
  );

  const {
    createPost,
    updatePost,
    loading: postLoading,
    error: postError,
  } = usePosts();
  const {
    uploadPostCover,
    uploadPostImages,
    uploading: coverUploading,
  } = useUploads();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: initialData.title || "",
      excerpt: initialData.excerpt || "",
      tags: initialData.tags ? initialData.tags.join(", ") : "",
      coverImage: initialData.coverImage || "",
    },
  });

  const [editorValue, setEditorValue] = useState(initialData.content || "");
  const coverImage = watch("coverImage");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
        codeBlock: false,
        blockquote: false,
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
      BulletList,
      OrderedList,
      ListItem,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-teal-400 underline",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full",
        },
      }),
      CodeBlock.configure({
        HTMLAttributes: {
          class: "bg-black text-green-400 p-4 rounded-lg font-mono text-sm",
        },
      }),
      Blockquote.configure({
        HTMLAttributes: {
          class: "border-l-4 border-teal-400 pl-4 italic text-gray-300",
        },
      }),
    ],
    content: editorValue,
    onUpdate: ({ editor }) => setEditorValue(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "min-h-[320px] bg-neutral-950 text-white px-3 py-3 rounded-b-xl outline-none text-base transition prose prose-invert max-w-none editor-content",
      },
    },
    uploadImage: async (file) => {
      const imgs = await uploadPostImages([file]);
      return imgs?.[0]?.url;
    },
  });

  const handleCoverChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadPostCover(file);
      setValue("coverImage", url, { shouldDirty: true });
      toast.success("Cover image uploaded!");
    } catch (error) {
      toast.error("Failed to upload cover image.");
    }
  };

  // Custom component for editor placeholder
  const EditorPlaceholder = ({ isEmpty }) =>
    isEmpty ? (
      <div
        className="pointer-events-none select-none font-medium z-10"
        style={{
          position: "absolute",
          left: "0",
          top: "50px",
          width: "100%",
          paddingLeft: "0.7rem",
          color: "rgba(34,211,238,0.7)",
          fontSize: "1.07rem",
        }}
      ></div>
    ) : null;

  const removeCoverImage = () => {
    setValue("coverImage", "");
    toast.info("Cover image removed");
  };

  const onSubmit = async (formData) => {
    if (categories.length < 1) {
      toast.error("Add at least one category.");
      return;
    }
    if (tags.some((t) => t.length < 2 || t.length > 40)) {
      toast.error("Each tag must be 2-40 characters.");
      return;
    }

    // Fetch all categories to map names to IDs
    const allCategories = await fetchAllCategories();
    const categoryIds = categories
      .map((catName) => {
        const foundCat = allCategories.find(
          (cat) => (typeof cat === "string" ? cat : cat.name) === catName
        );
        return typeof foundCat === "string" ? foundCat : foundCat?._id;
      })
      .filter(Boolean);

    const payload = {
      ...formData,
      content: editor?.getHTML?.() || "",
      status: "published",
      categories: categoryIds,
      tags,
    };

    try {
      let updatedOrCreated;

      if (isEditMode && initialData && initialData._id) {
        updatedOrCreated = await updatePost(initialData._id, payload);
        toast.success("✅ Post updated!");
      } else {
        updatedOrCreated = await createPost(payload);
        toast.success("🎉 Post published successfully!");
        reset();
        setEditorValue("");
        editor?.commands.clearContent();
        setCategories([]);
        setTags([]);
      }
      if (onSubmitSuccess) onSubmitSuccess(updatedOrCreated);
    } catch (error) {
      toast.error("Failed to save post. Please try again.");
    }
  };

  const excerptValue = watch("excerpt") || "";

  return (
    <>
      <Navbar />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`mt-20 mb-7 relative transition-all duration-200 overflow-y-auto border
    ${
      fullscreen
        ? "fixed z-50 inset-0 bg-black/95 flex justify-center items-center !p-0"
        : "max-w-3xl lg:max-w-4xl mx-auto p-4 md:p-8"
    }
    bg-[#171a1e]/95 rounded-2xl shadow-2xl border-neutral-800
  `}
        style={fullscreen ? { minHeight: "100vh", width: "100vw" } : {}}
      >
        {/* Fullscreen Toggle */}
        <button
          type="button"
          onClick={() => setFullscreen(!fullscreen)}
          className="absolute top-4 right-4 text-white bg-black/60 hover:bg-neutral-800 hover:text-white p-2 rounded-full shadow-lg transition-all z-30 ring-2 ring-cyan-700 focus:ring-4"
          title="Toggle fullscreen"
        >
          {fullscreen ? (
            <HiOutlineX className="text-xl" />
          ) : (
            <HiOutlineArrowsExpand className="text-xl" />
          )}
        </button>

        <div className="w-full flex flex-col gap-6">
          <div className="text-center md:text-left mb-3">
            <h2 className="text-3xl font-extrabold mb-2 tracking-tight ">
              Write Your Blog
            </h2>
            <p className="text-neutral-400 font-medium">
              Share your thoughts with the world
            </p>
          </div>

          {/* Title Input */}
          <div className="space-y-2">
            <label className="block text-neutral-200 font-bold">
              Blog Title <span className="text-pink-400">*</span>
            </label>
            <input
              {...register("title", {
                required: "Title is required",
                minLength: {
                  value: 4,
                  message: "Title must be at least 4 characters",
                },
              })}
              className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 focus:border-teal-400 text-white placeholder:text-neutral-500 text-xl font-medium transition"
              placeholder="Enter an engaging blog title..."
            />
            {errors.title && (
              <p className="text-pink-400 text-sm font-medium mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Cover Image */}
          <div className="space-y-2">
            <label className="block text-neutral-200 font-semibold">
              Cover Image
            </label>
            <div className="space-y-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
                disabled={coverUploading}
                className="block w-full text-sm text-neutral-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-teal-600 file:text-white hover:file:bg-cyan-600 transition"
              />
              {coverUploading && (
                <div className="flex items-center gap-2 text-teal-400 text-sm">
                  <div className="w-4 h-4 border-2 border-teal-400/30 border-t-teal-400 rounded-full animate-spin"></div>
                  Uploading cover image...
                </div>
              )}
              {coverImage && (
                <div className="relative inline-block">
                  <img
                    src={coverImage}
                    className="rounded-lg shadow-xl border border-neutral-800 w-full max-w-md max-h-56 object-cover transition hover:scale-[1.02]"
                    alt="Cover preview"
                  />
                  <button
                    type="button"
                    onClick={removeCoverImage}
                    className="absolute top-2 right-2 bg-pink-600/90 hover:bg-pink-500 p-2 rounded-full shadow-lg"
                    title="Remove Cover"
                  >
                    <HiOutlineTrash className="text-white text-sm" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Content Editor */}
          <div className="space-y-2">
            <label className="block text-neutral-200 font-semibold">
              Content <span className="text-pink-400">*</span>
            </label>
            <div className="relative mt-1">
              <div
                className="
        bg-neutral-950 rounded-xl min-h-[320px] border border-neutral-800
        focus-within:border-white shadow-inner transition-all duration-150
        relative backdrop-blur-sm overflow-hidden
      "
              >
                <TiptapMenu editor={editor} />
                <EditorPlaceholder isEmpty={editor && editor.isEmpty} />
                <div className="px-3 pb-2 pt-1 relative z-20 custom-scrollbar">
                  <EditorContent editor={editor} />
                </div>
              </div>
            </div>
          </div>

          {/* Excerpt + SEO Preview */}
          <div className="space-y-2">
            <label className="block text-neutral-200 font-semibold">
              Excerpt
            </label>
            <div className="relative">
              <input
                {...register("excerpt")}
                className="w-full px-4 py-3 rounded-lg font-medium bg-neutral-900 border border-neutral-800 focus:border-teal-400 text-white placeholder:text-neutral-500 text-base transition pr-16"
                placeholder="Short excerpt (optional, shows up in preview)"
                maxLength={300}
              />
              <span
                className={`
        absolute right-4 top-1/2 transform -translate-y-1/2 text-xs font-semibold
        ${excerptValue.length > 290 ? "text-pink-400" : "text-neutral-500"}
      `}
              >
                {excerptValue.length}/300
              </span>
            </div>
            <p className="text-neutral-500 text-xs mt-1">
              A brief summary that appears in blog previews
            </p>
          </div>

          {/* Categories & Tags Suggestion Section */}
          <div className="w-full space-y-4">
            <div className="flex gap-3 justify-end mb-2">
              <button
                type="button"
                onClick={async () => {
                  const title = (watch("title") || "").trim();
                  const content = (editor?.getText?.() || "").trim();

                  if (!title && !content) {
                    toast.error("Add a title or some post content first!");
                    return;
                  }

                  const [suggestedTags, suggestedCategories] =
                    await Promise.all([
                      suggestTagsFromContent({ title, content, max: 8 }),
                      suggestCategoriesFromContent({ title, content, max: 4 }),
                    ]);

                  setTags(
                    Array.from(
                      new Set([
                        ...tags,
                        ...suggestedTags.map((t) => t.trim().toLowerCase()),
                      ])
                    ).slice(0, 8)
                  );

                  // Ensure categories are strings (names) not objects
                  const categoryNames = suggestedCategories.map((cat) =>
                    typeof cat === "string" ? cat : cat.name
                  );

                  setCategories(
                    Array.from(
                      new Set([...categories, ...categoryNames])
                    ).slice(0, 4)
                  );

                  toast.success("Tags & categories suggested from content!");
                }}
                className="text-sm px-4 py-2 rounded-full bg-neutral-800 text-white border border-teal-600 hover:bg-teal-700/80 font-semibold shadow-sm transition"
              >
                Suggest tags & categories from content
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SmartChipsInput
                label="Categories"
                value={categories}
                onChange={setCategories}
                fetchOptions={fetchAllCategories}
                maxItems={4}
                itemMin={2}
                itemMax={40}
                placeholder="e.g. development, design"
                helper="Choose up to 4 broad topics."
              />
              <SmartChipsInput
                label="Tags"
                value={tags}
                onChange={setTags}
                fetchOptions={fetchAllTags}
                maxItems={8}
                itemMin={2}
                itemMax={40}
                placeholder="e.g. react, mongodb, ux"
                helper="Add up to 8 specific tags."
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={postLoading || coverUploading}
            className="w-full py-4 text-lg bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-black rounded-lg font-bold shadow-lg transition-all duration-200 active:scale-98 disabled:opacity-60"
          >
            {postLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                {isEditMode ? "Updating Post..." : "Publishing Blog..."}
              </span>
            ) : isEditMode ? (
              "Update Post"
            ) : (
              "🚀 Publish Blog"
            )}
          </button>

          {postError && <div className="text-pink-400 mt-2">{postError}</div>}
        </div>

        <style>{`
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #0af0e2 #171a1e;
  }
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(120deg, #23e7f1 60%, #171a1e 100%);
    border-radius: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #171a1e;
  }
`}</style>
      </form>
    </>
  );
};

export default PostEditor;
