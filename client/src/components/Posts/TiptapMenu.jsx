import { HiOutlinePhotograph } from "react-icons/hi";
import { toast } from "react-toastify";

const base =
  "min-w-[36px] h-9 px-2 flex items-center justify-center rounded-md font-medium text-base border transition duration-150 outline-none focus:ring-2 focus:ring-teal-400";
const active =
  "bg-neutral-800 border-teal-400 text-teal-300 shadow-[0_0_6px_0_rgba(34,211,238,0.18)] scale-105 z-10";
const inactive =
  "bg-neutral-900 border-neutral-700 text-neutral-300 hover:border-teal-500 hover:text-teal-300 hover:bg-black/70";

const ToolbarButton = ({
  isActive,
  onClick,
  children,
  ariaLabel,
  className = "",
}) => (
  <button
    type="button"
    aria-label={ariaLabel}
    className={`${base} ${isActive ? active : inactive} ${className}`}
    onClick={onClick}
    tabIndex={0}
  >
    {children}
  </button>
);

const TiptapMenu = ({ editor }) => {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 px-2 py-3 bg-neutral-950/90 rounded-t-xl border-b border-neutral-800 shadow focus-within:ring-1 ring-teal-800">
      {/* Text styles */}
      <div className="flex gap-0.5" aria-label="Formatting">
        <ToolbarButton
          isActive={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          ariaLabel="Bold"
        >
          <span className="font-bold">B</span>
        </ToolbarButton>
        <ToolbarButton
          isActive={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          ariaLabel="Italic"
        >
          <span className="italic">I</span>
        </ToolbarButton>
        <ToolbarButton
          isActive={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          ariaLabel="Underline"
        >
          <span className="underline">U</span>
        </ToolbarButton>
      </div>

      {/* Headings */}
      <div className="flex gap-0.5 pl-2" aria-label="Headings">
        {[1, 2, 3].map((lvl) => (
          <ToolbarButton
            key={lvl}
            isActive={editor.isActive("heading", { level: lvl })}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: lvl }).run()
            }
            ariaLabel={`Heading ${lvl}`}
          >
            <span style={{ fontWeight: 700, fontSize: 15 }}>H{lvl}</span>
          </ToolbarButton>
        ))}
      </div>

      {/* Lists */}
      <div className="flex gap-0.5 pl-2" aria-label="Lists">
        <ToolbarButton
          isActive={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          ariaLabel="Numbered List"
        >
          <span className="tracking-wide font-bold">1.</span>
        </ToolbarButton>
        <ToolbarButton
          isActive={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          ariaLabel="Bullet List"
        >
          <span className="text-2xl pb-1 font-bold">•</span>
        </ToolbarButton>
      </div>

      {/* Quote, code */}
      <div className="flex gap-0.5 pl-2" aria-label="Block Quote/Code">
        <ToolbarButton
          isActive={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          ariaLabel="Quote"
        >
          <span className="text-lg">“</span>
        </ToolbarButton>
        <ToolbarButton
          isActive={editor.isActive("codeBlock")}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          ariaLabel="Code Block"
        >
          <span className="text-sm">{`</>`}</span>
        </ToolbarButton>
      </div>

      {/* Link and Image */}
      <div className="flex gap-0.5 pl-2" aria-label="Media">
        <ToolbarButton
          isActive={editor.isActive("link")}
          onClick={() => {
            const prev = editor.getAttributes("link").href || "";
            const url = prompt("Enter link URL:", prev);
            if (url) {
              editor
                .chain()
                .focus()
                .extendMarkRange("link")
                .setLink({ href: url })
                .run();
            } else if (url === "") {
              editor.chain().focus().unsetLink().run();
            }
          }}
          ariaLabel="Add Link"
        >
          <span className="text-base">🔗</span>
        </ToolbarButton>
        <label className={`${base} ${inactive} cursor-pointer`}>
          <HiOutlinePhotograph className="text-lg" />
          <input
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={async (e) => {
              const files = Array.from(e.target.files || []);
              if (!files.length) return;
              try {
                const urls = await Promise.all(
                  files.map((file) => editor.options.uploadImage(file))
                );
                urls.forEach((url) => {
                  if (url) editor.chain().focus().setImage({ src: url }).run();
                });
              } catch (error) {
                toast.error("Failed to upload images. Please try again.");
              }
            }}
          />
        </label>
      </div>
    </div>
  );
};

export default TiptapMenu;
