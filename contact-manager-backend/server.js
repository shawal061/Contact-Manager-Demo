const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 5000;
const FILE_PATH = "contacts.json";

app.use(cors());
app.use(express.json());

// Load contacts from file
const loadContacts = () => {
    try {
        const data = fs.readFileSync(FILE_PATH, "utf8");
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

// Save contacts to file
const saveContacts = (contacts) => {
    fs.writeFileSync(FILE_PATH, JSON.stringify(contacts, null, 2), "utf8");
};

let contacts = loadContacts(); // Load initial data

// GET: Fetch all contacts
app.get("/contacts", (req, res) => {
    res.json(contacts);
});

// POST: Add a new contact
app.post("/contacts", (req, res) => {
    const newContact = {
        id: contacts.length + 1,
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
    };
    contacts.push(newContact);
    saveContacts(contacts);
    res.json(newContact);
});

// PUT: Update a contact (Replace the entire object)
app.put("/contacts/:id", (req, res) => {
    const { id } = req.params;
    const updatedContact = { id: Number(id), ...req.body };

    contacts = contacts.map((c) => (c.id == id ? updatedContact : c));
    saveContacts(contacts);
    res.json(updatedContact);
});

// PATCH: Update specific fields of a contact
app.patch("/contacts/:id", (req, res) => {
    const { id } = req.params;
    contacts = contacts.map((c) =>
        c.id == id ? { ...c, ...req.body } : c
    );
    saveContacts(contacts);
    res.json(contacts.find((c) => c.id == id));
});

// DELETE: Remove a contact
app.delete("/contacts/:id", (req, res) => {
    const { id } = req.params;
    contacts = contacts.filter((c) => c.id != id);
    saveContacts(contacts);
    res.json({ message: "Contact deleted" });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
