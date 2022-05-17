import React, { useContext, useEffect, useState } from 'react'
import NavbarAdmin from '../components/navbar/NavbarAdmin'

import { Col, Container, Row } from 'react-bootstrap';
import Contact from '../components/complain/Contact'
import Chat from '../components/complain/Chat'

import { io } from 'socket.io-client'
import { UserContext } from '../context/userContext'

let socket
const AdminComplain = () => {
    const [theme, setTheme] = useState("dark");
    const toggleTheme = () => {
        setTheme((current) => (current === "dark" ? "light" : "dark"));
    };

    const [contact, setContact] = useState(null)
    const [contacts, setContacts] = useState([])
    const [messages, setMessages] = useState([])
    const [state, dispatch] = useContext(UserContext)

    const title = "Complain Admin"
    document.title = 'DumbMerch | ' + title

    useEffect(() => {
        socket = io('https://dumbmerch-justian.herokuapp.com', {
            auth: {
                token: localStorage.getItem('token')
            },
            // code here
            query: {
                id: state.user.id
            }
        })

        // code here
        socket.on("new message", () => {
            console.log("contact", contact)
            console.log("triggered", contact?.id)
            socket.emit("load messages", contact?.id)
        })


        loadContacts()
        loadMessages()

        // listen error sent from server
        socket.on("connect_error", (err) => {
            console.error(err.message); // not authorized
        });

        return () => {
            socket.disconnect()
        }
    }, [messages])

    const loadContacts = () => {
        socket.emit("load customer contacts")
        socket.on("customer contacts", (data) => {
            console.log("cek data customer contact:", data);
            // filter just customers which have sent a message
            let dataContacts = data.filter((item) => (item.status !== 'admin') && (item.recipientMessage.length > 0 || item.senderMessage.length > 0))

            // manipulate customers to add message property with the newest message
            dataContacts = dataContacts.map((item) => ({
                ...item,
                // message: item.senderMessage.length > 0 ? item.senderMessagge[item.senderMessage.length -1].message : "Click here to start message" 
            }))
            setContacts(dataContacts)
        })
    }

    // used for active style when click contact
    const onClickContact = (data) => {
        setContact(data)
        // code here
        socket.emit("load messages", data.id)
    }

    // code here
    const loadMessages = (value) => {

        socket.on("messages", (data) => {
            if (data.length > 0) {
                const dataMessages = data.map((item) => ({
                    idSender: item.sender.id,
                    message: item.message
                }))
                console.log(dataMessages);
                setMessages(dataMessages)
            }
            loadContacts()
            const chatMessages = document.getElementById("chat-messages")
            chatMessages.scrollTop = chatMessages?.scrollHeight
        })
    }

    const onSendMessage = (e) => {
        if (e.key === 'Enter') {
            const data = {
                idRecipient: contact.id,
                message: e.target.value
            }

            socket.emit("send messages", data)
            e.target.value = ""
        }
    }

    return (
        <>
            <div
                style={{
                    position: 'fixed',
                    zIndex: '100',
                    left: '10',
                    top: '10',
                }}>
                <div class="form-check form-switch">
                    <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" onChange={toggleTheme} checked={theme === "light"} />
                    <label className="form-check-label" for="flexSwitchCheckDefault">{theme === "dark" ? "Dark Mode" : "Light Mode"}</label>
                </div>
            </div>
            <div className={`${theme}-bg-color`}>
                <NavbarAdmin title={title} />
                <Container fluid style={{ height: '89.5vh' }}>
                    <Row>
                        <Col md={3} style={{ height: '89.5vh' }} className="px-3 border-end border-dark overflow-auto">
                            <Contact dataContact={contacts} clickContact={onClickContact} contact={contact} />
                        </Col>
                        <Col md={9}>
                            <Chat contact={contact} messages={messages} user={state.user} sendMessage={onSendMessage} />

                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    )
}

export default AdminComplain