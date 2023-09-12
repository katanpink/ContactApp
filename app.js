const fs = require('fs')
const express = require("express")
const bodyParser = require("body-parser")
const data = require("./data/contacts.json")
const app = express();
const port = 3000;
const contacts = JSON.parse(fs.readFileSync('./data/contacts.json', 'utf8'))

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('./public/style.css'));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.render('index', {contacts} );
}); 

app.get('/add', (req, res) => {
    res.render('add', {data} );
}); 


app.post('/add', (req, res) => {
    const newContact = req.body;
    contacts.push(newContact)
    fs.writeFileSync('./data/contacts.json', JSON.stringify(contacts))
    res.redirect('/');
}) 

app.get('/edit/:id', (req, res) => {
    let contentId = req.params.id;
    const contact = contacts[contentId];
    res.render('edit', {contentId, contact});
});

app.post('/edit/:id', (req, res) => {
    let contentId = req.params.id;
    contacts[contentId] = req.body;
    fs.writeFileSync('./data/contacts.json', JSON.stringify(contacts));
    res.redirect('/');
});

app.get('/view/:id', (req, res) => {
    let contentId = req.params.id;
    const contact = contacts[contentId];
    res.render('view', {contentId, contact});
});


app.get('/delete/:id', (req, res) => {
    let contentId = parseInt(req.params.id);
    const contact = data.find(contact => contact.id !== contentId);
    delete contacts[contentId]
    res.redirect('/');
})

app.listen(port, () => {
    console.log('Server/App is running at ', port);
});