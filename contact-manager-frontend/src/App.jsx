import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

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

  return (
    <div>
      <h1>Contact Manager</h1>

      {/* Add Contact Form */}
      <form onSubmit={addContact}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="tel"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <button type="submit">Add Contact</button>
      </form>

      {/* Contact List */}
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            {contact.name} - {contact.email} - {contact.phone}
            <button onClick={() => deleteContact(contact.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
