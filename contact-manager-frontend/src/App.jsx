import { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const contactsPerPage = 5;

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
        toast.success("Contact added successfully!");
      })
      .catch((error) => toast.error("Error adding contact!"));
  };

  const deleteContact = (id) => {
    axios
      .delete(`http://localhost:5000/contacts/${id}`)
      .then(() => {
        setContacts(contacts.filter((contact) => contact.id !== id));
        toast.success("Contact deleted successfully!");
      })
      .catch((error) => toast.error("Error deleting contact!"));
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
        toast.success("Contact updated successfully!");
      })
      .catch((error) => toast.error("Error updating contact!"));
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.includes(searchTerm)
  );

  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = filteredContacts.slice(
    indexOfFirstContact,
    indexOfLastContact
  );
  const totalPages = Math.ceil(filteredContacts.length / contactsPerPage);

  return (
    <div className="min-vh-100 p-4">
      <div className="container" style={{ maxWidth: "600px" }}>
        <ToastContainer />
        <div className="d-flex align-items-center mb-4">
          <span className="h1 mb-0">📞</span>
          <h1 className="mb-0 ms-2">Contact Manager</h1>
        </div>

        {/* Search Input */}
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Add/Edit Contact Form */}
        <form
          onSubmit={editingId ? updateContact : addContact}
          className="mb-4"
        >
          <div className="mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-2">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-2">
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
          {currentContacts.length === 0 ? (
            <li className="list-group-item">No contacts found.</li>
          ) : (
            currentContacts.map((contact) => (
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

        {/* Pagination */}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <button
            className="btn btn-secondary"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="btn btn-secondary"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
