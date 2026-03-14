import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api";
import MessagePanel from "../components/MessagePanel";

export default function MessagesPage() {
  const [searchParams] = useSearchParams();
  const preselectedUser = searchParams.get("user");

  const [conversations, setConversations] = useState([]);
  const [activeUserId, setActiveUserId] = useState(preselectedUser || "");
  const [messages, setMessages] = useState([]);

  async function loadConversations() {
    const res = await api.get("/messages/conversations");
    setConversations(res.data);

    if (!activeUserId && res.data.length > 0) {
      setActiveUserId(res.data[0].user.id);
    }
  }

  async function loadMessages(userId) {
    if (!userId) return;
    const res = await api.get(`/messages/${userId}`);
    setMessages(res.data);
  }

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (activeUserId) {
      loadMessages(activeUserId);
    }
  }, [activeUserId]);

  async function handleSend(content) {
    await api.post("/messages", {
      receiverId: activeUserId,
      content
    });
    await loadMessages(activeUserId);
    await loadConversations();
  }

  return (
    <main className="page">
      <div className="container">
        <div className="messages-layout">
          <div className="card">
            <h3>Inbox</h3>
            <div className="conversation-list">
              {conversations.length === 0 ? (
                <p className="muted">No conversations yet.</p>
              ) : (
                conversations.map((item) => (
                  <button
                    key={item.user.id}
                    className={`conversation-item ${activeUserId === item.user.id ? "active" : ""}`}
                    onClick={() => setActiveUserId(item.user.id)}
                  >
                    <strong>{item.user.firstName} {item.user.lastName}</strong>
                    <span>{item.lastMessage.content.slice(0, 40)}</span>
                  </button>
                ))
              )}
            </div>
          </div>

          <MessagePanel messages={messages} onSend={handleSend} />
        </div>
      </div>
    </main>
  );
}