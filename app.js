const express = require('express')
const path = require('path')
const {v4} = require('uuid')
const app = express()

let Contacts = [
    {id: v4(), name: 'Ivan', value: '9834343434', marked: false}
]

app.use(express.json())

app.get('/api/contacts', (req, res) => {
    setTimeout(() => {
        res.status(200).json(Contacts)
    }, 1000)
})

app.post('/api/contacts', (req, res) => {
    const contact = {...req.body, id: v4(), marked: false}
    Contacts.push(contact)
    res.status(201).json(contact)
})

app.delete('/api/contacts/:id', (req, res) => {
    Contacts = Contacts.filter(c => c.id !== req.params.id)
    res.status(200).json({message: 'Contact deleted'})
})

app.put('/api/contacts/:id', (req, res) => {
    const idx = Contacts.findIndex(c => c.id === req.params.id)
    Contacts[idx] = req.body
    res.json(Contacts[idx])
})

app.use(express.static(path.resolve(__dirname, 'client')))
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'index.html'))
})
app.listen(8080, () => console.log('http://localhost:'+8080))