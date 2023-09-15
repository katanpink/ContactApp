const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const contactsFilePath = './data/contacts.json';

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('./public'));
app.use(bodyParser.urlencoded({ extended: true }));

async function readContactsFile() {
    const data = await fs.promises.readFile(contactsFilePath, 'utf8');
    return JSON.parse(data);
}

async function writeContactsFile(data) {
    await fs.promises.writeFile(contactsFilePath, JSON.stringify(data, null, 2));
}

app.get('/', async (req, res) => {
    try {
        const contacts = await readContactsFile();
        res.render('index', { contacts });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/add', async (req, res) => {
    res.render('add');
});

app.post('/add', async (req, res) => {
    try {
        const newContact = req.body;
        const contacts = await readContactsFile();
        contacts.push(newContact);
        await writeContactsFile(contacts);
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/edit/:id', async (req, res) => {
    try{
        const id = req.params.id
        const contacts = await readContactsFile()
        const contact = contacts[id]
        res.render('edit', {id, contact})
    } catch (error) {
        console.error(error)
        res.status(500).send('Internal Server Error')
    }
})

app.post('/edit/:id', async (req, res) => {
    try{
        const id = req.params.id
        const updatedContact = req.body
        const contacts = await readContactsFile()
        contacts[id] = updatedContact
        await writeContactsFile(contacts);
        res.redirect('/')
    } catch (error) {
        console.error(error)
        res.status(500).send('Internal Server Error')
    }
})


app.get('/view/:id', async (req, res) => {
    try{
        const id = req.params.id
        const contacts = await readContactsFile()
        const contact = contacts[id]
        res.render('view', { contact })
    } catch (error) {
        console.error(error)
        res.status(500).send('Internal Server Error')
    }
})

app.get('/delete/:id', async (req, res) => {
    try{
        const id = req.params.id
        const contacts = await readContactsFile()
        contacts.splice(id, 1)
        await writeContactsFile(contacts);
        res.redirect('/')
    } catch (error) {
        console.error(error)
        res.status(500).send('Internal Server Error')
    }
})
// Modify other route handlers in a similar way

app.listen(port, () => {
    console.log('Server/App is running at', port);
});


