// src/components/ClientManagement.jsx
"use client"
import { useState , useEffect } from "react";
const ClientManagement = () => {
    const [clients, setClients] = useState([]);
  
    useEffect(() => {
      fetch('/data.json')
        .then(response => response.json())
        .then(data => setClients(data.clients));
    }, []);
  
    return (
      <div className="client-management">
        <h3>إدارة العملاء</h3>
        <table>
          <thead>
            <tr>
              <th>اسم العميل</th>
              <th>معلومات التواصل</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(client => (
              <tr key={client.id}>
                <td>{client.name}</td>
                <td>{client.contact}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  export default ClientManagement;