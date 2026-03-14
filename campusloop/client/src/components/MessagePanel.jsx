import { useState } from "react";

export default function MessagePanel({ messages, onSend }) {
  const [content, setContent] = useState("");

  async function submit(e) {
    e.preventDefault();
    if (!content.trim()) return;
    await onSend(content.trim());
    setContent("");
  }

  return (
    <div className="card">
      <h3>Conversation</h3>

      <div className="message-list">
        {messages.length === 0 ? (
          <p className="muted">No messages yet.</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="message-bubble">
              <div>{msg.content}</div>
              <small>{new Date(msg.createdAt).toLocaleString()}</small>
            </div>
          ))
        )}
      </div>

      <form onSubmit={submit} className="message-form">
        <textarea
          rows="3"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a message..."
        />
        <button className="btn" type="submit">Send</button>
      </form>
    </div>
  );
}