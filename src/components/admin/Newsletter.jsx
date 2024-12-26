import { useState, useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Link } from "@tiptap/extension-link";
import { Image } from "@tiptap/extension-image";
import Heading from "@tiptap/extension-heading";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase";
import { toast } from "react-toastify";
import axios from "axios";

const CreateNewsletter = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(false);
  const [showNewsletterForm, setShowNewsletterForm] = useState(false);
  const [newsletters, setNewsletters] = useState([]);
  const [body, setBody] = useState(""); // Initial empty string, not undefined or null

  // Set up Tiptap editor with extensions
  const editor = useEditor({
    extensions: [
      StarterKit, // Includes basic formatting like bold, italic, etc.
      Link, // Enables hyperlinking
      Image, // Enables image insertion
    ],
    content: "",
  });

  useEffect(() => {
    if (editor) {
      const htmlContent = editor.getHTML();
      setBody(htmlContent); // Update body state with the editor's HTML
      console.log("Editor Content:", htmlContent); // Debugging the content
    }
  }, [editor?.state?.doc]);

  useEffect(() => {
    const fetchNewsletters = async () => {
      try {
        const newslettersCollection = collection(db, "newsletters");
        const newsletterSnapshot = await getDocs(newslettersCollection);
        const newslettersList = newsletterSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNewsletters(newslettersList);
      } catch (error) {
        console.error("Error fetching newsletters:", error);
      }
    };
    fetchNewsletters();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, "newsletters"), {
        title,
        author,
        body, // Get the content of the editor as HTML
        date: new Date().getTime(),
      });

      toast.success("Newsletter created successfully!");
      setTitle("");
      setAuthor("");
      editor.commands.clearContent();
      setShowNewsletterForm(false);

      const newslettersCollection = collection(db, "newsletters");
      const newsletterSnapshot = await getDocs(newslettersCollection);
      const newslettersList = newsletterSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNewsletters(newslettersList);

      const usersCollection = collection(db, "users");
      const q = query(usersCollection, where("isSubscribed", "==", true));
      const usersSnapshot = await getDocs(q);
      const emails = usersSnapshot.docs.map((userDoc) => userDoc.data().email);

      console.log("Editor Content:", body);

      await axios.post("/api/sendNewsletter", {
        emails,
        body: editor.getHTML(),
        subject: title,
      });
    } catch (error) {
      toast.error("Error creating newsletter.");
      console.error("Error:", error);
    }
    setLoading(false);
  };

  // Toolbar buttons for bold, italic, link, and image
  const handleBold = () => editor.chain().focus().toggleBold().run();
  const handleItalic = () => editor.chain().focus().toggleItalic().run();
  const handleLink = () => {
    const href = prompt("Enter the link URL:");
    editor.chain().focus().setLink({ href }).run();
  };
  const handleImage = () => {
    const src = prompt("Enter the image URL:");
    editor.chain().focus().setImage({ src }).run();
  };

  return (
    <div>
      {showNewsletterForm ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />

          {/* Toolbar for rich text formatting */}
          <div className="toolbar flex flex-row my-2 gap-2">
            <button
              className="bg-white p-2 rounded"
              type="button"
              onClick={handleBold}
            >
              Bold
            </button>
            <button
              className="bg-white p-2 rounded"
              type="button"
              onClick={handleItalic}
            >
              Italic
            </button>
            <button
              className="bg-white p-2 rounded"
              type="button"
              onClick={handleLink}
            >
              Link
            </button>
            <button
              className="bg-white p-2 rounded"
              type="button"
              onClick={handleImage}
            >
              Image
            </button>
          </div>

          {/* The actual rich text editor */}
          <div
            className="editor-container bg-white text-black"
            style={{
              minHeight: "200px", // Set minimum height for the editor container
              lineHeight: "1.5", // Set line height to ensure enough space for text
              padding: "10px",
              border: "1px solid #ccc", // Optional: Add a border to distinguish the editor area
            }}
          >
            <EditorContent editor={editor} />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Create Newsletter"}
          </button>
        </form>
      ) : (
        <button onClick={() => setShowNewsletterForm(true)}>
          Create Newsletter
        </button>
      )}

      {/* Display created newsletters */}
      <div>
        {newsletters.map((newsletter) => (
          <div key={newsletter.id}>
            <h3>{newsletter.title}</h3>
            <div dangerouslySetInnerHTML={{ __html: newsletter.body }} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreateNewsletter;
