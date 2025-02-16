import { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/contacts")
      .then((response) => setContacts(response.data))
      .catch((error) => console.error("Error fetching contacts:", error));
  }, []);

  const addContact = (e) => {
    e.preventDefault();
    const newContact = { name, email, phone };

    axios
      .post("http://localhost:5000/contacts", newContact)
      .then((response) => {
        setContacts([...contacts, response.data]);
        setName("");
        setEmail("");
        setPhone("");
      })
      .catch((error) => console.error("Error adding contact:", error));
  };

  const deleteContact = (id) => {
    axios
      .delete(`http://localhost:5000/contacts/${id}`)
      .then(() => {
        setContacts(contacts.filter((contact) => contact.id !== id));
      })
      .catch((error) => console.error("Error deleting contact:", error));
  };

  const startEditing = (contact) => {
    setEditingId(contact.id);
    setName(contact.name);
    setEmail(contact.email);
    setPhone(contact.phone);
  };

  const updateContact = (e) => {
    e.preventDefault();
    const updatedContact = { name, email, phone };

    axios
      .put(`http://localhost:5000/contacts/${editingId}`, updatedContact)
      .then((response) => {
        setContacts(
          contacts.map((c) => (c.id === editingId ? response.data : c))
        );
        setEditingId(null);
        setName("");
        setEmail("");
        setPhone("");
      })
      .catch((error) => console.error("Error updating contact:", error));
  };

  // Filter contacts based on search input
  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.includes(searchTerm)
  );

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">📞 Contact Manager</h1>

      {/* Search Input */}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search contacts..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Add/Edit Contact Form */}
      <form onSubmit={editingId ? updateContact : addContact} className="mb-4">
        <div className="input-group mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="input-group mb-2">
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group mb-2">
          <input
            type="tel"
            className="form-control"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {editingId ? "Update Contact" : "Add Contact"}
        </button>
        {editingId && (
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={() => setEditingId(null)}
          >
            Cancel
          </button>
        )}
      </form>

      {/* Contact List */}
      <ul className="list-group">
        {filteredContacts.length === 0 ? (
          <li className="list-group-item text-center">No contacts found.</li>
        ) : (
          filteredContacts.map((contact) => (
            <li
              key={contact.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span>
                <strong>{contact.name}</strong> - {contact.email} -{" "}
                {contact.phone}
              </span>
              <div>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => startEditing(contact)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteContact(contact.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default App;
